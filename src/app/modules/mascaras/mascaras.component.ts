import { Component, OnInit } from "@angular/core";
import { TableService } from '../core/services/table.service';
import { ColumnaService } from '../core/services/columna.service';
import { TipoCampoService } from "../tipo-campo/tipo-campo.service";
import { MascarasService } from "./mascaras.service";
@Component({
  selector: "app-mascaras",
  templateUrl: "./mascaras.component.html",
  styleUrls: ["./mascaras.component.scss"],
})
export class MascarasComponent implements OnInit {
  public IsWaiting: boolean;
  public showListado: boolean = true;
  public mascaras = [];
  public etiquetaListado = "Listado de Mascaras";
  public selectedMascara: any;
  public mascara: any;
  public tipoCampo: any;

  constructor(
    public _mascarasService: MascarasService,
    public _tipoCampoService: TipoCampoService,
    public _tableService: TableService,
    public _columnaService: ColumnaService,
  ) {
    this.get();
  }

  public columnas = {
    id: "Identificador",
    nombre: "Nombre",
    description: "Descripción"
 };
 
  public objCol = {
     TABLE_NAME: "Nombre Tabla"     
  };

  ngOnInit() {
    //Creo valores por defecto o iniciales para cada componente.
    // de esta forma debe el backend devolver cada valor, como un objeto.
    this.mascara = {
      id : 1,
      nombre : "prueba"
    }
    this.tipoCampo = {
      id : 1,
      nombre : "pruebaTipoCampo"
    }
  }
  get = (filter?) => {
    this.IsWaiting = true;
    this._mascarasService.getAll(filter).subscribe((res) => {
      this.mascaras = res.data.mascaras;
      this.IsWaiting = false;
    });
  };
}
