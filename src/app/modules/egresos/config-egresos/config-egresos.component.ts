import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import Swal from "sweetalert2";

import { EgresosService } from "../egresos.service";
import { ConfigParametrosService } from "../../core/services/ConfigParametrosService.service";

@Component({
  selector: "app-config-egresos",
  templateUrl: "./config-egresos.component.html",
  styleUrls: ["./config-egresos.component.scss"],
})
export class ConfigEgresosComponent implements OnInit {
  public IsWaiting: boolean;
  public etiquetaNombreModulo = "Egresos";
  public etiquetaListado = "Listado de Egresos";
  public IsWait: Boolean = false;
  public showListado: boolean = true;
  public showPanelDatos: Boolean = false;
  public showBtnAdicionar: Boolean = true;
  public showBtnActualizar: Boolean = true;
  public showBtnEliminar: Boolean = true;
  public isUpdating: boolean;
  public dialogRef: any;
  public egresos: any = [];
  public egresoForm: FormGroup;
  public filter: any = {};

  public parametrosContaConfig = [];

  constructor(
    public dialog: MatDialog,
    public _egresosService: EgresosService,
    public configParametros: ConfigParametrosService
  ) {}

  ngOnInit() {
    // TODO: PARCHEAR EL VALOR DE LOS PARÁMETROS CON LOS QUE SE TRAEN DE BD (IVA, ICA, RF...)

    this.egresoForm = new FormGroup({
      T17Factura: new FormControl(""),
      T17Proveedor: new FormControl(""),
      T17Soporte: new FormControl(""),
      T17Banco: new FormControl(""),
      T17Valor: new FormControl("0"),
      T17Dctos: new FormControl(0),
      T17IVA: new FormControl(0),
      T17Fecha: new FormControl(""),
      T17ICA: new FormControl(0),
      T17Total: new FormControl(""),
      T17FormaPago: new FormControl(""),
      T17RF: new FormControl(0),
      T17Observacion: new FormControl(""),
    });
    this.fetchEgresosProgramados();
    this.fetchParamsByGroup("CONTA_CONFIG");
  }

  actualizar() {
    // TODO: LLAMADA AL SERVICIO DE ACTUALIZAR
    this._egresosService
      .updateEgresos(this.egresoForm.value)
      .subscribe((response) => {
        this.IsWait = false;

        this.egresoForm.reset();
        Swal.fire("Actualizado", "Egreso actualizado exitosamente", "success");
        this.showListado = true;
      });
  }

  verDetalle(input: any) {
    //TODO: LLENAR FORMS CON OBJETO ENVIADO
    this.isUpdating = true;
    this.showListado = false;
    this.egresoForm.reset();
    this.egresoForm.patchValue(input);
    this.patchParametrosForm();
  }
  eliminar() {
    // TODO: LLAMADA AL SERVICIO DE ELIMINAR
    let egreso = this.egresoForm.value;
    let id = egreso.id;
    this.IsWait = true;
    this._egresosService.deleteEgresos(id).subscribe((response) => {
      this.showListado = true;
      Swal.fire("Eliminado", "Egreso eliminado exitosamente", "success");
      this.egresoForm.reset();
    });
  }

  cancelar() {
    this.showListado = true;
    this.egresoForm.reset();
  }

  patchParametrosForm() {
    this.egresoForm.controls["T17IVA"].setValue(
      this.parametrosContaConfig[0].Valor
    );
    this.egresoForm.controls["T17RF"].setValue(
      this.parametrosContaConfig[1].Valor
    );
    this.egresoForm.controls["T17ICA"].setValue(
      this.parametrosContaConfig[2].Valor
    );
  }

  guardar() {
    // TODO: LLAMADA AL SERVICIO DE GUARDAR
    this._egresosService
      .createEgresos(this.egresoForm.value)
      .subscribe((response) => {
        this.IsWait = false;
        this.egresoForm.reset();
        Swal.fire("Guardado", "Egreso guardado exitosamente", "success");
        this.showListado = true;
      });
  }
  fetchParamsByGroup(nombreParametro) {
    this.configParametros
      .configByParamGroup(nombreParametro)
      .subscribe((response) => {
        this.parametrosContaConfig = response.data.configByParamGroup;
      });
  }
  onClickAdicionar() {
    this.showListado = false;
    this.patchParametrosForm();
  }

  findBy() {
    if (
      this.filter.T17Factura ||
      this.filter.T17Observacion ||
      this.filter.T17Fecha
    ) {
      this.fetchEgresosProgramados(this.filter);
    } else {
      this.fetchEgresosProgramados();
    }
    this.IsWait = true;
  }
  fetchEgresosProgramados = (obj?) => {
    this._egresosService.getAll(obj && obj).subscribe((res) => {
      this.egresos = res.data.egresos;
    });
  };
}
