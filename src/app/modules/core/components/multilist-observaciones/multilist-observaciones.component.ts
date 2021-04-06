import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatMenuTrigger } from "@angular/material/menu";

@Component({
  selector: "app-multilist-observaciones",
  templateUrl: "./multilist-observaciones.component.html",
  styleUrls: ["./multilist-observaciones.component.scss"],
})
export class MultilistObservacionesComponent implements OnInit {
  @Input() selection1: Item[] | Array<any> = [];
  @Input() selection2: Item[] | Array<any> = [];
  @Input() nonSelectedItemsTitle: String = "Elementos para seleccionar";
  @Input() selectedItemsTitle: String = "Elementos seleccionados";
  @Input() materialIconName: String = "category";
  @Output() finalSelection = new EventEmitter<Item[] | Array<any>>();

  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger: MatMenuTrigger;
  @ViewChild("observacionesDialog") myDialog: TemplateRef<any>;
  public selection1Filter = "";
  public selection2Filter = "";
  public dialogRef: MatDialogRef<any, any>;
  public selected: Item | any;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(templateRef, {});

    this.dialogRef.afterClosed().subscribe(() => {});
  }
  closeDialog() {
    this.dialogRef.close();
  }
  save() {
    this.dialogRef.close();

    this.selection1 = this.selection1.filter(
      (opt) => this.selected.id != opt.id
    );

    if (this.selection2.indexOf(this.selected) < 0) {
      this.selection2.push(this.selected);
    }
    this.finalSelection.emit(this.selection2);
  }

  getSel1Options() {
    return this.selection1
      .filter((item) => !this.sel2Contains(item.id))
      .filter((item) =>
        this.selection1Filter
          ? item.name
              .toUpperCase()
              .includes(this.selection1Filter.toUpperCase())
          : true
      );
  }

  getSel2Options() {
    return this.selection2.filter((item) =>
      this.selection2Filter
        ? item.name.toUpperCase().includes(this.selection2Filter.toUpperCase())
        : true
    );
  }

  sel2Contains(id: string) {
    return this.selection2.some((item) => item.id === id);
  }

  actionAddOnClick(element: Item) {
    element.observaciones &&
    element.observaciones.length > 0 &&
    element.observaciones !== "" &&
    element.observaciones.trim().length > 0
      ? element.observaciones
      : (element.observaciones = "");
    this.selected = element;
    this.openDialogWithTemplateRef(this.myDialog);
  }

  actionRemoveOnClick(element: Item) {
    this.selection2 = this.selection2.filter((opt) => element.id != opt.id);
    element.observaciones = "";
    if (this.selection1.indexOf(element) < 0) {
      this.selection1.push(element);
    }
  }
}

//TODO: Definir modelo de medicamentos
interface Item {
  id: string;
  name: string;
  observaciones: string | undefined;
}
