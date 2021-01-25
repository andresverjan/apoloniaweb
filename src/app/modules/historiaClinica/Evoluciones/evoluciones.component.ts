import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { TableService } from "../../core/services/table.service";
import { ColumnaService } from "../../core/services/columna.service";
import { TipoCampoService } from "../../tipo-campo/tipo-campo.service";
import { EvolucionesService } from "./evoluciones.service";
import { OdontologosService } from "../../core/services/odontologos.service";

@Component({
  selector: "app-evoluciones",
  templateUrl: "./evoluciones.component.html",
  styleUrls: ["./evoluciones.component.scss"],
})
export class EvolucionesComponent implements OnInit {
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
