import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { OdontologosService } from "src/app/modules/core/services/odontologos.service";
import { PacienteService } from "src/app/modules/core/services/paciente.service";
import { LaboratoriosService } from "./laboratorios.service";

@Component({
  selector: "app-laboratorios",
  templateUrl: "./laboratorios.component.html",
  styleUrls: ["./laboratorios.component.scss"],
})
export class LaboratoriosComponent implements OnInit {
  public IsWaiting: boolean;
  public showListado: boolean = true;
  public showForm: boolean = false;
  public dialogRef: any;
  public etiquetaListado = "Listado de Mascaras";
  public etiquetaNombreModulo = "Campos";
  public odontologo: any;
  public paciente: any;
  public laboratorio: Array<any>;

  @ViewChild("myDialog") myDialog: TemplateRef<any>;

  constructor(
    public dialog: MatDialog,
    public _odontologosService: OdontologosService,
    public _pacienteService: PacienteService,
    public _laboratorioService: LaboratoriosService
  ) {
    this.odontologo = {
      Nombres: "Seleccionar Especialista",
    };
    this.paciente = {
      Nombres1: "Seleccionar Paciente",
      Apellidos1: "",
    };
  }
  ngOnInit() {
    this.fetch();
  }
  actualizar(item) {}
  actionAdicionar() {
    this.showListado = false;
    this.showForm = true;
  }
  guardar() {
    this.showForm = false;
    this.showListado = true;
    //TODO: crear objeto a guardar (FORM)
    this.laboratorio.push(); //TODO: push object to global array
  }
  onPatientSelected(selected) {
    this.paciente = selected;
    this.IsWaiting = true;
  }
  cancelar() {
    this.showForm = false;
    this.showListado = true;
  }
  closeDialog() {
    this.dialogRef.close();
  }
  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(templateRef, {
      width: "650px",
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe(() => {});
  }
  openModal() {
    this.openDialogWithTemplateRef(this.myDialog);
  }
  onOdontologoSelected(selected) {
    this.odontologo = selected;
    this.IsWaiting = true;
  }
  fetch() {
    this.IsWaiting = true;
    this._laboratorioService.getAll().subscribe(({ data }) => {
      this.laboratorio = data.mascaras; //TODO: actualizar
      this.IsWaiting = false;
    });
  }
}
