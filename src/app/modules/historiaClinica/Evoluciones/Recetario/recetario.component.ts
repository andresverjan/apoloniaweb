import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { OdontologosService } from "src/app/modules/core/services/odontologos.service";

@Component({
  selector: "app-recetario",
  templateUrl: "./recetario.component.html",
  styleUrls: ["./recetario.component.sass"],
})
export class RecetarioComponent implements OnInit {
  public IsWaiting: boolean;
  public showListado: boolean = true;
  public showForm: boolean = false;
  public dialogRef: any;
  public etiquetaListado = "Listado de Mascaras";
  public etiquetaNombreModulo = "Campos";
  public odontologo: any;

  SEL1 = [
    { id: 6, name: "Salir" },
    { id: 7, name: "Mascaras" },
    { id: 8, name: "Permisos" },
    { id: 9, name: "Usuarios" },
    { id: 10, name: "Proveedores" },
    { id: 11, name: "Empleados" },
    { id: 12, name: "Rol Permiso" },
    { id: 37, name: "Especialistas" },
    { id: 38, name: "Configuración" },
    { id: 39, name: "Pacientes" },
    { id: 40, name: "Citas" },
    { id: 41, name: "Historia Clinica" },
  ];
  SEL2 = [
    { id: 1, name: "Aplicaciones" },
    { id: 2, name: "Generic" },
    { id: 3, name: "Perfil" },
    { id: 4, name: "Rol" },
    { id: 5, name: "Idiomas" },
  ];
  @ViewChild("myDialog") myDialog: TemplateRef<any>;

  constructor(
    public dialog: MatDialog,
    public _odontologosService: OdontologosService
  ) {
    this.odontologo = {
      Nombres: "Seleccionar Especialista",
    };
  }

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
  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(templateRef, {
      height: "810px",
      width: "650px",
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe(() => {});
  }

  openModal() {
    this.openDialogWithTemplateRef(this.myDialog);
  }
  ngOnInit() {}

  onOdontologoSelected(selected) {
    this.odontologo = selected;
    this.IsWaiting = true;
  }
}
