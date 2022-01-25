import { Component, OnInit, Input } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import * as moment from 'moment';

@Component({
  selector: "app-datosPaciente",
  templateUrl: "./datosPaciente.component.html",
  styleUrls: ["./datosPaciente.component.scss"],
})
export class DatosPacienteComponent implements OnInit {
  @Input() Paciente: any;
  
  public pacienteForm: FormGroup;  
  public IsWaiting: boolean;
  public showListado: boolean = true;
  public showContent: boolean = true;
  public showForm: boolean = false;
  public mascaras = [];
  public etiquetaListado = "Datos del Paciente";
  public etiquetaNombreModulo = "Campos";
  public isWaiting: Boolean = false;

  constructor() {

    this.pacienteForm = new FormGroup({
      Nombres: new FormControl(""),
      Cedula: new FormControl(""),
      Apellidos: new FormControl(""),
      Direccion:new FormControl(""),
      Mail: new FormControl(""),
      EPS: new FormControl(""),
      Nacionaliad: new FormControl(""),
      Ocupacion: new FormControl(""),
      TipoDoc: new FormControl(""),
      TelCasa: new FormControl(""),
      TelOficina: new FormControl(""),
      FechaNacimiento: new FormControl(""),
      FechaIngreso: new FormControl(""),
    });
  }

  ngOnInit() {
    console.log("parametros de entrada!!!");
    console.log(this.Paciente);
    this.Paciente.FechaNacimiento = moment(new Date(this.Paciente.FechaNacimiento)).format('YYYY-MM-DD').toString();
    this.pacienteForm.patchValue(this.Paciente);
  }
  update(){
    console.log('Update...');
  }
}
