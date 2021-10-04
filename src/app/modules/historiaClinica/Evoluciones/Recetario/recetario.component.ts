import { Component, Input, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { OdontologosService } from "src/app/modules/core/services/odontologos.service";
import { RecetarioService } from "./recetario.service";

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
  public recetario: Array<any> = [];
  @Input() listadoAdd: Array<any> = [];

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
      height: "602px",
      width: "572px",
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
    this.recetarioService.getAll().subscribe(({ data }) => {
      this.recetario = data.evolucionesRecetario;
      console.log("RECETARIO:::");
      console.log(this.recetario);
      this.IsWaiting = false;
    });
  }


}
