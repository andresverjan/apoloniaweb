import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { TableService } from "../core/services/table.service";
import { ColumnaService } from "../core/services/columna.service";
import { TipoCampoService } from "../tipo-campo/tipo-campo.service";
import { HistoriaClinicaService } from "./historiaClinica.service";
import { OdontologosService } from "../core/services/odontologos.service";

@Component({
  selector: "app-historia",
  templateUrl: "./historiaClinica.component.html",
  styleUrls: ["./historiaClinica.component.scss"],
})
export class HistoriaClinicaComponent implements OnInit {
  public IsWaiting: boolean;
  public showListado: boolean = true;
  public showContent: boolean = true;
  public showForm: boolean = false;
  public mascaras = [];
  public etiquetaListado = "Listado de Mascaras";
  public etiquetaNombreModulo = "Campos";

  constructor() {}

  ngOnInit() {}
}
