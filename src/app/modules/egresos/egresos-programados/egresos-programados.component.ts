import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-egresos-programados",
  templateUrl: "./egresos-programados.component.html",
  styleUrls: ["./egresos-programados.component.scss"],
})
export class EgresosProgramadosComponent implements OnInit {
  public IsWaiting: boolean;
  public showListado: boolean = true;
  public egresosProgramadosForm: FormGroup;
  public etiquetaNombreModulo = "Egresos Programados";
  public etiquetaListado = "Listado de Egresos";

  constructor() {}

  ngOnInit(): void {
    this.egresosProgramadosForm = new FormGroup({
      T17Factura: new FormControl(""),
      T17Proveedor: new FormControl(""),
      T17Soporte: new FormControl(""),
      T17Valor: new FormControl(0),
      T17Dctos: new FormControl(0),
      T17IVA: new FormControl(0),
      T17Fecha: new FormControl(""),
      T17ICA: new FormControl(0),
      T17Total: new FormControl(""),
      T17FormaPago: new FormControl(""),
      T17RF: new FormControl(0),
      T17Observacion: new FormControl(""),
    });
  }
}
