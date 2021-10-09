import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import Swal from "sweetalert2";

import { EgresosService } from "../egresos.service";
import { ConfigParametrosService } from "../../core/services/ConfigParametrosService.service";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import * as moment from "moment";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { PageEvent } from "@angular/material/paginator";
import { FormasPagosService } from "../../core/services/formaspagos.service";
import { ProveedoresService } from "../../core/services/proveedores.service";
import { ToolsService } from "../../core/services/tools.service";

const DATE_FORMATS = {
  parse: {
    dateInput: ["YYYY-MM-DD"],
  },
  display: {
    dateInput: "YYYY-MM-DD",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};
@Component({
  selector: "app-config-egresos",
  templateUrl: "./config-egresos.component.html",
  styleUrls: ["./config-egresos.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
  ],
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
  public egreso: any;
  public totalRegistros = 0;
  public pageSize = 10;
  public pageSizeOptions = [5, 10, 20, 30];
  public pageNumber: number = 1;
  public queryOptions = {};
  public formasPagos = [];
  public proveedores: any = [];

  public parametrosContaConfig = [];

  constructor(
    public dialog: MatDialog,
    public _egresosService: EgresosService,
    public configParametros: ConfigParametrosService,
    public formasPagosService: FormasPagosService,
    public proveedoresService: ProveedoresService,
    private toolService: ToolsService
  ) {
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
  }

  handlePageChange(e: PageEvent) {
    this.pageNumber = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.findBy();
  }
  fetchFormasPagos() {
    this.formasPagosService.getAll().subscribe((res) => {
      this.formasPagos = res.data.tipospagos.map((tp) => {
        const obj = { value: tp.nombre, nombre: tp.nombre };
        return obj;
      });
    });
  }
  ngOnInit() {
    this.findBy();
    this.fetchParamsByGroup("CONTA_CONFIG");
    this.fetchFormasPagos();
    this.fetchProveedores();
  }
  onPorveedorSelected(selected) {
    this.IsWaiting = true;
    this.egresoForm.controls["T17Proveedor"].setValue(selected);
    this.IsWaiting = false;
  }

  onFormaPagoSelected(selected) {
    this.egresoForm.controls["T17FormaPago"].setValue(selected.nombre);
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
      this.findBy();
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
    this.isUpdating = true;
    this.showListado = false;
    this.showPanelDatos = true;
    this.showBtnActualizar = true;
    this.showBtnAdicionar = false;
    this.showBtnEliminar = true;
    this.egresoForm.reset();
    const proveedor = this.proveedores.filter(
      (p) => p.Nit === input.T17Proveedor
    )[0];
    this.egresoForm.patchValue(input);
    this.egresoForm.controls["T17Proveedor"].setValue(proveedor);
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
    this.findBy();
  }

  cancelar() {
    const proveedor = this.egresoForm.controls["T17Proveedor"].value;
    this.egresoForm.controls["T17Proveedor"].setValue(proveedor?.Nit);
    this.egresoForm.reset();
    this.showListado = true;
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

    const egreso = this.egresoForm.value;

    this._egresosService.createEgreso(egreso).subscribe(() => {
      this.IsWaiting = false;
      Swal.fire("Guardado", "Egreso guardado exitosamente", "success");
      this.egresoForm.reset();
      this.patchParametrosForm();
      this.showListado = true;
      this.showPanelDatos = false;
      this.findBy();
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
    this.queryOptions = {
      filter: this.filter,
      pagina: this.pageNumber,
      limite: this.pageSize,
    };
    this.fetchEgresosProgramados(this.queryOptions);
    this.IsWaiting = true;
  }
  fetchEgresosProgramados = (obj?) => {
    this.IsWaiting = true;
    this._egresosService.getAll(obj).subscribe((res) => {
      const { egresos, totalRegistros } = res.data.egresos;
      this.egresos = egresos;
      this.totalRegistros = totalRegistros;
      this.IsWaiting = false;
    });
  };

  fetchProveedores = (obj?) => {
    this.IsWaiting = true;
    this.proveedoresService.getAll(obj).subscribe((res) => {
      const { proveedores } = res.data;
      this.proveedores = proveedores;
      this.IsWaiting = false;
    });
  };

  onDateChangeInicial(event: MatDatepickerInputEvent<Date>) {
    const dateValue = moment(new Date(event.value)).format("YYYY-MM-DD");
    this.filter["T17FechaIni"] = dateValue;
    this.findBy();
  }
  onDateChangeFinal(event: MatDatepickerInputEvent<Date>) {
    const dateValue = moment(new Date(event.value)).format("YYYY-MM-DD");
    this.filter["T17FechaFin"] = dateValue;
    this.findBy();
  }
  formatCurrency(number: number): string {
    return this.toolService.formatCurrency(number);
  }
}
