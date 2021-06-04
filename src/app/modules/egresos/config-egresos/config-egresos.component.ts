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
  public egreso:any;

  public parametrosContaConfig = [];

  constructor(
    public dialog: MatDialog,
    public _egresosService: EgresosService,
    public configParametros: ConfigParametrosService
  ) {}

  ngOnInit() {
    this.egresoForm = new FormGroup({
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
    this.fetchEgresosProgramados();
    this.fetchParamsByGroup("CONTA_CONFIG");
  }

  actualizar() {
    this.IsWaiting = true;
    this.egresoForm.controls["T17Valor"].setValue(
      parseInt(this.egresoForm.controls["T17Valor"].value)
    );
    this._egresosService.updateEgreso(this.egresoForm.value).subscribe(() => {
      this.IsWaiting = false;
      this.patchParametrosForm();
      Swal.fire("Actualizado", "Egreso actualizado exitosamente", "success");
      this.egresoForm.reset();
      this.showListado = true;
      this.showBtnAdicionar = false;
      this.showBtnActualizar = true;
      this.showBtnEliminar = true;
      this.showPanelDatos = false;
      this.fetchEgresosProgramados();
    });
  }

  calculateTotal() {
    let iva = parseFloat(this.egresoForm.controls["T17IVA"].value) / 100;
    let ica = parseFloat(this.egresoForm.controls["T17ICA"].value) / 100;
    let retefuente = parseFloat(this.egresoForm.controls["T17RF"].value) / 100;
    const descuento =
      parseFloat(this.egresoForm.controls["T17Dctos"].value) / 100;
    const valorEgreso = parseFloat(this.egresoForm.controls["T17Valor"].value);

    let total = valorEgreso - valorEgreso * descuento;
    iva = total * iva;
    ica = total * ica;
    retefuente = total * retefuente;

    total = total + (iva + ica + retefuente);

    this.egresoForm.controls["T17Total"].setValue(total);
  }

  verDetalle(input: any) {
    console.log(input);
    this.isUpdating = true;
    this.showListado = false;
    this.showPanelDatos = true;
    this.showBtnActualizar = true;
    this.showBtnAdicionar = false;
    this.showBtnEliminar = true;
    this.egresoForm.reset();
    this.egresoForm.patchValue(input);
    this.patchParametrosForm();
  }
  eliminar() {
    let egreso = this.egresoForm.value;
    let factura = egreso["T17Factura"];
    this.IsWaiting = true;
    this._egresosService.deleteEgreso(factura).subscribe((response) => {
      this.egresoForm.reset();
      this.patchParametrosForm();
      this.showListado = true;
      Swal.fire("Eliminado", "Egreso eliminado exitosamente", "success");
    });
    this.fetchEgresosProgramados();
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
    this.IsWaiting = true;
    this.egresoForm.controls["T17ICA"].setValue(
      parseFloat(this.egresoForm.controls["T17ICA"].value)
    );
    this.egresoForm.controls["T17IVA"].setValue(
      parseFloat(this.egresoForm.controls["T17IVA"].value)
    );
    this.egresoForm.controls["T17RF"].setValue(
      parseFloat(this.egresoForm.controls["T17RF"].value)
    );
    this.egresoForm.controls["T17Valor"].setValue(
      parseFloat(this.egresoForm.controls["T17Valor"].value)
    );

    this._egresosService.createEgreso(this.egresoForm.value).subscribe(() => {
      this.IsWaiting = false;
      Swal.fire("Guardado", "Egreso guardado exitosamente", "success");
      this.egresoForm.reset();
      this.patchParametrosForm();
      this.showListado = true;
      this.showPanelDatos = false;
      this.fetchEgresosProgramados();
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
    this.showPanelDatos = true;
    this.showListado = false;
    this.showBtnActualizar = false;
    this.showBtnAdicionar = true;
    this.showBtnEliminar = false;
    this.isUpdating = false;

    this.patchParametrosForm();
  }

  findBy() {
    if (
      this.filter.T17Factura ||
      this.filter.T17FechaIni ||
      this.filter.T17FechaFin
    ) {
      this.fetchEgresosProgramados(this.filter);
    } else {
      this.fetchEgresosProgramados();
    }
    this.IsWaiting = true;
  }
  fetchEgresosProgramados = (obj?) => {
    this.IsWaiting = true;
    this._egresosService.getAll(obj && obj).subscribe((res) => {
      this.egresos = res.data.egresos;
      this.IsWaiting = false;
    });
  };
 
  setDate(value: any, item: any) {
    this.egresoForm.controls[item.T17FechaIni].setValue(value);
    this.egresoForm.controls[item.T17FechaFin].setValue(value);

  }
}
