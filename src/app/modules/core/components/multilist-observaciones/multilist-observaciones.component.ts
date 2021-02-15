import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatMenuTrigger } from "@angular/material/menu";

@Component({
  selector: "app-multilist-observaciones",
  templateUrl: "./multilist-observaciones.component.html",
  styleUrls: ["./multilist-observaciones.component.scss"],
})
export class MultilistObservacionesComponent implements OnInit {
  @Input() sel1: Item[] = [];
  @Input() nonSelectedItemsTitle: String = "Elementos para seleccionar";
  @Input() selectedItemsTitle: String = "Elementos seleccionados";
  @Input() materialIconName: String = "category";
  @Input() sel2: Item[] = [];
  @Output() emitter = new EventEmitter<Item[]>();

  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger: MatMenuTrigger;
  @ViewChild("observacionesDialog") myDialog: TemplateRef<any>;
  public sel1Filter = "";
  public sel2Filter = "";
  public dialogRef: any;
  public selected: Item;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(templateRef, {});

    this.dialogRef.afterClosed().subscribe((result) => result);
  }
  closeDialog() {
    this.dialogRef.close();
  }
  save() {
    this.dialogRef.close();

    this.sel1 = this.sel1.filter((opt) => this.selected.id != opt.id);

    if (this.sel2.indexOf(this.selected) < 0) {
      this.sel2.push(this.selected);
    }
  }

  getSel1Options() {
    return this.sel1
      .filter((s1) => !this.sel2Contains(s1.id))
      .filter((s1) =>
        this.sel1Filter
          ? s1.name.toUpperCase().includes(this.sel1Filter.toUpperCase())
          : true
      );
  }

  getSel2Options() {
    return this.sel2.filter((s2) =>
      this.sel2Filter
        ? s2.name.toUpperCase().includes(this.sel2Filter.toUpperCase())
        : true
    );
  }

  sel2Contains(id: string) {
    return this.sel2.some((s2) => s2.id === id);
  }

  actionAddOnClick(element: Item) {
    element.observaciones &&
    element.observaciones.length > 0 &&
    element.observaciones !== ""
      ? element.observaciones
      : (element.observaciones = "");

    this.selected = element;
    this.openDialogWithTemplateRef(this.myDialog);
  }

  actionRemoveOnClick(element: Item) {
    this.sel2 = this.sel2.filter((opt) => element.id != opt.id);

    if (this.sel1.indexOf(element) < 0) {
      this.sel1.push(element);
    }
  }
}

//TODO: Definir modelo de medicamentos
interface Item {
  id: string;
  name: string;
  observaciones: string;
}
