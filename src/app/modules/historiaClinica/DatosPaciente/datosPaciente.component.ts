import { Component, OnInit, ViewChild, TemplateRef, Input } from "@angular/core";
import { TableService } from "../../core/services/table.service";
import { ColumnaService } from "../../core/services/columna.service";
import { TipoCampoService } from "../../tipo-campo/tipo-campo.service";
import { DatosPacienteService } from "./datosPaciente.service";
import { OdontologosService } from "../../core/services/odontologos.service";

@Component({
  selector: "app-datosPaciente",
  templateUrl: "./datosPaciente.component.html",
  styleUrls: ["./datosPaciente.component.scss"],
})
export class DatosPacienteComponent implements OnInit {
  @Input() Paciente: any;
  
  public IsWaiting: boolean;
  public showListado: boolean = true;
  public showContent: boolean = true;
  public showForm: boolean = false;
  public mascaras = [];
  public etiquetaListado = "Listado de Mascaras";
  public etiquetaNombreModulo = "Campos";

  constructor() {}

  ngOnInit() {
    console.log("parametros de entrada!!!");
    console.log(this.Paciente);
  }
}
