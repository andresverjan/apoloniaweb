import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { TableService } from "../../../core/services/table.service";
import { ColumnaService } from "../../../core/services/columna.service";
import { TipoCampoService } from "../../../tipo-campo/tipo-campo.service";
import { RemisionService } from "./remision.service";
import { OdontologosService } from "../../../core/services/odontologos.service";

@Component({
  selector: "app-remision",
  templateUrl: "./remision.component.html",
  styleUrls: ["./remision.component.scss"],
})
export class RemisionComponent implements OnInit {
  public IsWaiting: boolean;
  public showListado: boolean = true;
  public showForm: boolean = false;
  public dialogRef: any;
  public odontologo: any;
  public etiquetaNombreModulo = "Campos";
  public remision: Array<any> = [];
  @ViewChild("myDialog") myDialog: TemplateRef<any>;

  constructor(public dialog: MatDialog,public _odontologoService: OdontologosService, public remisionService: RemisionService) {}

  actionAdicionar() {
    this.showListado = false;
    this.showForm = true;
  }
  guardar() {
    this.showForm = false;
    this.showListado = true;
  }

  cancelar() {
    this.showForm = false;
    this.showListado = true;
  }
  closeDialog() {
    
    this.dialogRef.close();
  }
  openDialogWithTemplateRef(
    templateRef: TemplateRef<any>,
  ) {
    
    this.dialogRef = this.dialog.open(templateRef, {
      height: "495px",
      width: "572px",
      disableClose: true,
    });

    this.dialogRef.afterClosed().subscribe(() => {});
  }

  openModal(){
    this.openDialogWithTemplateRef(this.myDialog);
  }
  onOdontologoSelected(selected) {
    this.odontologo = selected;
  }

  ngOnInit() {
    this.fetch();
  }

  fetch() {
    this.IsWaiting = true;
    this.remisionService.getAll().subscribe(({ data }) => {
      this.remision = data.evolucionesRemision;
      this.IsWaiting = false;
    });
  }

  

}
