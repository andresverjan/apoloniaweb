import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import Swal from "sweetalert2";

import { EgresosService } from "../egresos.service";

@Component({
  selector: "app-config-egresos",
  templateUrl: "./config-egresos.component.html",
  styleUrls: ["./config-egresos.component.scss"],
})
export class ConfigEgresosComponent implements OnInit {
  public IsWaiting: boolean;
  public showListado: boolean = true;
  public isUpdating: boolean;
  public dialogRef: any;
  public egresos: any = [];
  public egresoForm: FormGroup;

  constructor(
    public dialog: MatDialog,
    public _egresosService: EgresosService
  ) {}

  ngOnInit(): void {
    // TODO: PARCHEAR EL VALOR DE LOS PARÁMETROS CON LOS QUE SE TRAEN DE BD (IVA, ICA, RF...)
    this.egresoForm = new FormGroup({
      _id: new FormControl(""),
      proveedores: new FormControl(""),
      numeroSoporte: new FormControl(0),
      tipo: new FormControl(""),
      soporte: new FormControl(""),
      valor: new FormControl(0),
      descuento: new FormControl(0),
      iva: new FormControl(0),
      fechaDocumento: new FormControl(""),
      ica: new FormControl(""),
      total: new FormControl(0),
      fechaPago: new FormControl(""),
      rf: new FormControl(""),
      observaciones: new FormControl(""),
    });
    this.fetchEgresosProgramados();
  }

  actualizar() {
    // TODO: LLAMADA AL SERVICIO DE ACTUALIZAR
    this.egresoForm.reset();
    Swal.fire("Actualizado", "Egreso actualizado exitosamente", "success");
    this.showListado = true;
  }

  verDetalle(input) {
    //TODO: LLENAR FORMS CON OBJETO ENVIADO
    this.isUpdating = true;
    // this.egresoForm.patchValue(input);
    this.showListado = false;
  }
  eliminar() {
    // TODO: LLAMADA AL SERVICIO DE ELIMINAR
    this.showListado = true;
    Swal.fire("Eliminado", "Egreso eliminado exitosamente", "success");
    this.egresoForm.reset();
  }

  cancelar() {
    this.showListado = true;
  }

  guardar() {
    // TODO: LLAMADA AL SERVICIO DE GUARDAR
    this.egresoForm.reset();
    Swal.fire("Guardado", "Egreso guardado exitosamente", "success");
    this.showListado = true;
  }
  onClickAdicionar() {
    this.egresoForm.reset();
    this.showListado = false;
  }

  fetchEgresosProgramados = () => {
    this._egresosService.getAll().subscribe((res) => {
      this.egresos = res.data.mascaras;
    });
  };
}
