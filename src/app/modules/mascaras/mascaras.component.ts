import { Component, OnInit } from "@angular/core";
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
  public tipoCampos = [];
  public etiquetaListado = "Listado de Mascaras";
  constructor(
    public _mascarasService: MascarasService,
    public _tipoCampoService: TipoCampoService
  ) {
    this.get();
  }

  public mascara: any;
  public tipoCampo: any;

  setCurrent(current: any) {
    this.mascara = current;
  }
  setTipoCampot(tipoCampo) {
    this.tipoCampo = tipoCampo;
  }

  public columnas = ["id", "nombre", "descripcion"];

  ngOnInit() {}

  get = (filter?) => {
    this.IsWaiting = true;
    this._mascarasService.getAll(filter).subscribe((res) => {
      this.mascaras = res.data.mascaras;
      this.IsWaiting = false;
    });
  };
}
