import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { TableService } from "../core/services/table.service";
import { ColumnaService } from "../core/services/columna.service";
import { TipoCampoService } from "../tipo-campo/tipo-campo.service";
import { MascarasService } from "./mascaras.service";
import { OdontologosService } from "../core/services/odontologos.service";

@Component({
  selector: "app-mascaras",
  templateUrl: "./mascaras.component.html",
  styleUrls: ["./mascaras.component.scss"],
})
export class MascarasComponent implements OnInit {
  public IsWaiting: boolean;
  public showListado: boolean = true;
  public showContent: boolean = true;
  public showForm: boolean = false;
  public mascaras = [];
  public etiquetaListado = "Listado de Mascaras";
  public etiquetaNombreModulo = "Campos";

  constructor(
    public _mascarasService: MascarasService,
    public _tipoCampoService: TipoCampoService,
    public _tableService: TableService,
    public _columnaService: ColumnaService,
    public _odontologosService: OdontologosService
  ) {}

  odontologo: any;

  onOdontologoSelected(selected) {
    console.log(selected);
    this.odontologo = selected;
  }

  ngOnInit() {
    this.odontologo = {
      nombre: "Seleccionar Especialista",
    };
  }
}
