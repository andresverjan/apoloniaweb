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

  sel1 = [
    { id: 1, nombre: "Aplicaciones" },
    { id: 2, nombre: "Generic" },
    { id: 3, nombre: "Perfil" },
    { id: 4, nombre: "Rol" },
    { id: 5, nombre: "Idiomas" },
    { id: 6, nombre: "Salir" },
    { id: 7, nombre: "Mascaras" },
    { id: 8, nombre: "Permisos" },
    { id: 9, nombre: "Usuarios" },
    { id: 10, nombre: "Proveedores" },
    { id: 11, nombre: "Empleados" },
    { id: 12, nombre: "Rol Permiso" },
    { id: 37, nombre: "Especialistas" },
    { id: 38, nombre: "Configuración" },
    { id: 39, nombre: "Pacientes" },
    { id: 40, nombre: "Citas" },
    { id: 41, nombre: "Historia Clinica" },
  ];
  sel2 = [
    { id: 1, nombre: "Aplicaciones" },
    { id: 2, nombre: "Generic" },
    { id: 3, nombre: "Perfil" },
    { id: 4, nombre: "Rol" },
    { id: 5, nombre: "Idiomas" },
    { id: 6, nombre: "Salir" },
    { id: 7, nombre: "Mascaras" },
    { id: 8, nombre: "Permisos" },
    { id: 9, nombre: "Usuarios" },
    { id: 10, nombre: "Proveedores" },
    { id: 11, nombre: "Empleados" },
    { id: 12, nombre: "Rol Permiso" },
    { id: 37, nombre: "Especialistas" },
    { id: 38, nombre: "Configuración" },
    { id: 39, nombre: "Pacientes" },
    { id: 40, nombre: "Citas" },
    { id: 41, nombre: "Historia Clinica" },
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
