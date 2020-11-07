import { Component, OnInit } from "@angular/core";
import { TableService } from "../core/services/table.service";
import { ColumnaService } from "../core/services/columna.service";
import { TipoCampoService } from "../tipo-campo/tipo-campo.service";
import { MascarasService } from "./mascaras.service";
import { Campo } from "../core/interfaces/campoTable.interace";
import { FormControl, FormGroup, Validators } from "@angular/forms";

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

  public selectedMascara: any;
  public tablas: any;
  public mascara: any;

  public tipoCampo: any;

  constructor(
    public _mascarasService: MascarasService,
    public _tipoCampoService: TipoCampoService,
    public _tableService: TableService,
    public _columnaService: ColumnaService
  ) {
    this.fetchMascaras();
  }

  ngOnInit() {
    //Creo valores por defecto o iniciales para cada componente.
    // de esta forma debe el backend devolver cada valor, como un objeto.
    this.mascara = {
      id: 1,
      nombre: "prueba",
    };

    this.tipoCampo = {
      id: 1,
      nombre: "pruebaTipoCampo",
    };
    this.tablas = {
      TABLE_NAME: "Default Table Name",
    };
  }

  fetchMascaras = (filter?) => {
    this.IsWaiting = true;
    this._mascarasService.getAll(filter).subscribe((res) => {
      this.mascaras = res.data.mascaras;
      this.IsWaiting = false;
    });
  };
}
