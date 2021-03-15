import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { TableService } from "../../../core/services/table.service";
import { ColumnaService } from "../../../core/services/columna.service";
import { TipoCampoService } from "../../../tipo-campo/tipo-campo.service";
import { EventosAdversosService } from "./eventosAdversos.service";
import { OdontologosService } from "../../../core/services/odontologos.service";
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-eventosAdversos',
  templateUrl: './eventosAdversos.component.html',
  styleUrls: ['./eventosAdversos.component.scss']
})
export class EventosAdversosComponent implements OnInit {
  public IsWaiting: boolean;
  public showListado: boolean = true;
  public showForm: boolean = false;
  public dialogRef: any;
  public etiquetaListado = " Listado de Mascaras";
  public etiquetaNombreModulo = "Campos";
  public odontologo : any;
  public eventos: Array<any> =[];
  
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
    public _odontologosService: OdontologosService,
    public eventosAdversosService: EventosAdversosService,

    ) { 
      this.odontologo ={
        Nombres: "seleccionar especialista",
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
    this.eventos.push();
  }


actualizar(item){

}
  cancelar() {
    this.showForm = false;
    this.showListado = true;
  }
  closeDialog() {

    this.dialogRef.close();
  }

  oneSelection(e){
    console.log(e);

  }
  openDialogWithTemplateRef(templateRef: TemplateRef<any>,) {
    this.dialogRef = this.dialog.open(templateRef, {
      height:"810px",
      width:"650px",
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe((a) => { });
  }

  openModal() {
    this.openDialogWithTemplateRef(this.myDialog);
  }

  
  onOdontologoSelected(selected) {
    this.IsWaiting = true;
    this.odontologo = selected;
    this.IsWaiting = false;
  }
  fetch(){
    this.IsWaiting = true;
    this.eventosAdversosService.getAll().subscribe(({data}) => {
      this.eventos = data.mascaras;
      this.IsWaiting= false;

  });
}
}
