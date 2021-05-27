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

  public parametrosContaConfig = [];

  constructor(
    public dialog: MatDialog,
    public _egresosService: EgresosService,
    public configParametros: ConfigParametrosService
  ) {}

  ngOnInit() {
    // TODO: PARCHEAR EL VALOR DE LOS PARÁMETROS CON LOS QUE SE TRAEN DE BD (IVA, ICA, RF...)
    this.egresoForm = new FormGroup({
      id: new FormControl(""),
      proveedores: new FormControl(""),
      numeroSoporte: new FormControl(0),
      tipo: new FormControl(""),
      soporte: new FormControl(""),
      valor: new FormControl(0),
      descuento: new FormControl(0),
      iva: new FormControl(""),
      fechaDocumento: new FormControl(""),
      ica: new FormControl(""),
      total: new FormControl(0),
      fechaPago: new FormControl(""),
      rf: new FormControl(""),
      observaciones: new FormControl(""),
    });
    this.fetchEgresosProgramados();
    this.fetchParamsByGroup("CONTA_CONFIG");
  }

  actualizar() {
    // TODO: LLAMADA AL SERVICIO DE ACTUALIZAR
    this._egresosService
      .updateEgresos(this.egresoForm.value)
      .subscribe((Response) => {
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
    this.egresoForm.patchValue(input);
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
        console.log(this.parametrosContaConfig);
      });
  }
  onClickAdicionar() {
    this.egresoForm.reset();
    this.showListado = false;
  }

  fetchEgresosProgramados = () => {
    this._egresosService.getAll().subscribe((res) => {
      this.egresos = res.data.egresos;
    });
  };
}
