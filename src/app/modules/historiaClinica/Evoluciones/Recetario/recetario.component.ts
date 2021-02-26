import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { OdontologosService } from "src/app/modules/core/services/odontologos.service";
import { RecetarioService } from "./recetario.service";

@Component({
  selector: "app-recetario",
  templateUrl: "./recetario.component.html",
  styleUrls: ["./recetario.component.scss"],
})
export class RecetarioComponent implements OnInit {
  public recetarioForm: FormGroup;
  public isWaiting: boolean = true;
  public showListado: boolean = true;
  public showForm: boolean = false;
  public dialogRef: any;
  public etiquetaListado = "Listado de Mascaras";
  public etiquetaNombreModulo = "Campos";
  public odontologo: any;
  public recetario: Array<any> = [];

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
    public _odontologosService: OdontologosService,
    public recetarioService: RecetarioService
  ) {
    this.odontologo = {
      Nombres: "Seleccionar Especialista",
    };
  }
  ngOnInit() {
    this.fetch();
  }
  actionAdicionar() {
    this.showListado = false;
    this.showForm = true;
  }
  guardar() {
    this.showForm = false;
    this.showListado = true;
    //TODO: Crear el objeto con la info
    this.recetario.push(); //TODO: push new object to global array
  }
  actualizar(item) {}
  cancelar() {
    this.showForm = false;
    this.showListado = true;
  }
  closeDialog() {
    this.dialogRef.close();
  }
  onSelection(e) {
    //TODO: llenar el array cada vez que se seleccione
    console.log(e);
  }
  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(templateRef, {
      height: "810px",
      width: "650px",
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe((a) => {});
  }
  openModal() {
    this.openDialogWithTemplateRef(this.myDialog);
  }
  onOdontologoSelected(selected) {
    this.isWaiting = true;
    this.odontologo = selected;
    this.isWaiting = false;
  }
  fetch() {
    this.isWaiting = true;
    this.recetarioService.getAll().subscribe(({ data }) => {
      this.recetario = data.mascaras; //TODO: mascaras -> recetario
      this.isWaiting = false;
    });
  }
}
