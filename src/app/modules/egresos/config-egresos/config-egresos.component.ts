import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
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
import { GenericService } from "../../generic/generic.service";

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
  public parametrosContaConfig;
  public parametrosContaConfigEmpresa: Array<any>;
  public tieneImpuestos: boolean = true;
  public objForGenericService: any = {
    applicationId: 41,
    campos: [],
    limit: {
      pagina: 1,
      limite: 1000,
    },
  };
  public tiposEgresos;

  constructor(
    public dialog: MatDialog,
    public _egresosService: EgresosService,
    public configParametrosService: ConfigParametrosService,
    public formasPagosService: FormasPagosService,
    public proveedoresService: ProveedoresService,
    private toolService: ToolsService,
    public genericService: GenericService
  ) {
    this.egresoForm = new FormGroup({
      T17Factura: new FormControl("", [Validators.required]),
      T17Proveedor: new FormControl("", [Validators.required]),
      T17Soporte: new FormControl("", [Validators.required]),
      T17Valor: new FormControl(0, [Validators.required]),
      T17Dctos: new FormControl(0, [
        Validators.required,
        Validators.max(100),
        Validators.min(0),
      ]),
      T17IVA: new FormControl(0),
      T17Fecha: new FormControl("", [Validators.required]),
      T17ICA: new FormControl(0),
      T17Total: new FormControl(""),
      T17FormaPago: new FormControl("", [Validators.required]),
      T17RF: new FormControl(0),
      T17Observacion: new FormControl("", [Validators.required]),
      T17Clasificacion: new FormControl("", [Validators.required]),
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
    this.fetchParamsByGroupContaConfig();
    this.fetchParamsByGroupContaConfigEmpresa();
    this.fetchFormasPagos();
    this.fetchProveedores();
    this.fetchTiposEgresos();
  }
  onPorveedorSelected(selected) {
    this.IsWaiting = true;
    this.egresoForm.controls["T17Proveedor"].setValue(selected);
    this.IsWaiting = false;
  }
  onTipoEgresoSelected(selected) {
    this.IsWaiting = true;
    this.egresoForm.controls["T17Clasificacion"].setValue(selected);
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
    const proveedor = this.proveedores.filter(
      (p) => p.Nit === this.egresoForm.controls["T17Proveedor"].value.Nit
    )[0];
    this.egresoForm.controls["T17Proveedor"].setValue(proveedor.Nit);
    const formaPago = this.formasPagos.filter(
      (fp) => fp.nombre === this.egresoForm.controls["T17FormaPago"].value
    )[0];
    this.egresoForm.controls["T17FormaPago"].setValue(formaPago.nombre);

    const tipoEgreso = this.tiposEgresos.filter(
      (te) =>
        te.id ===
        parseInt(this.egresoForm.controls["T17Clasificacion"].value.id)
    )[0];
    this.egresoForm.controls["T17Clasificacion"].setValue(tipoEgreso?.id);
    this._egresosService
      .updateEgresosProgramados(this.egresoForm.value)
      .subscribe(() => {
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
  onChangeTieneImpuestos(checked: boolean) {
    this.tieneImpuestos = checked;
    if (!this.tieneImpuestos) {
      this.egresoForm.controls["T17IVA"].setValue(0);
      this.egresoForm.controls["T17ICA"].setValue(0);
      this.egresoForm.controls["T17RF"].setValue(0);
    } else {
      this.patchParametrosForm();
    }
    this.calculateTotal();
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

    this.egresoForm.controls["T17Total"].setValue(isNaN(total) ? 0 : total);
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
      (p) => p.Nit === input["T17Proveedor"]
    )[0];
    this.egresoForm.patchValue(input);
    this.egresoForm.controls["T17Proveedor"].setValue(proveedor);
    const formaPago = this.formasPagos.filter(
      (fp) => fp.nombre === input["T17FormaPago"]
    )[0];
    this.egresoForm.controls["T17FormaPago"].setValue(formaPago?.nombre);

    const tipoEgreso = this.tiposEgresos.filter(
      (te) => te.id === parseInt(input["T17Clasificacion"])
    )[0];

    this.egresoForm.controls["T17Clasificacion"].setValue(tipoEgreso);

    this.patchParametrosForm();
  }
  eliminar() {
    Swal.fire({
      title: "¿Seguro que desea eliminar este egreso?",
      showDenyButton: true,
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        const egreso = this.egresoForm.value;
        const factura = egreso["T17Factura"];
        this.IsWaiting = true;
        this._egresosService
          .deleteEgresosProgramados(factura)
          .subscribe((response) => {
            this.egresoForm.reset();
            this.patchParametrosForm();
            this.showListado = true;
            Swal.fire("Eliminado", "Egreso eliminado exitosamente", "success");
          });
        this.findBy();
      }
    });
  }

  cancelar() {
    const proveedor = this.egresoForm.controls["T17Proveedor"].value;
    this.egresoForm.controls["T17Proveedor"].setValue(proveedor?.Nit);
    const formaPago = this.egresoForm.controls["T17FormaPago"].value;
    this.egresoForm.controls["T17FormaPago"].setValue(formaPago?.nombre);
    const tipoEgreso = this.egresoForm.controls["T17Clasificacion"].value;
    this.egresoForm.controls["T17Clasificacion"].setValue(tipoEgreso?.id);
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
    const proveedor = this.proveedores.filter(
      (p) => p.Nit === this.egresoForm.controls["T17Proveedor"].value.Nit
    )[0];
    this.egresoForm.controls["T17Proveedor"].setValue(proveedor.Nit);
    const tipoEgreso = this.tiposEgresos.filter(
      (te) =>
        te.id ===
        parseInt(this.egresoForm.controls["T17Clasificacion"].value.id)
    )[0];
    this.egresoForm.controls["T17Clasificacion"].setValue(tipoEgreso?.id);

    const egreso = this.egresoForm.value;

    this._egresosService.createEgresosProgramados(egreso).subscribe(() => {
      this.IsWaiting = false;
      Swal.fire("Guardado", "Egreso guardado exitosamente", "success");
      this.egresoForm.reset();
      this.patchParametrosForm();
      this.showListado = true;
      this.showPanelDatos = false;
      this.tieneImpuestos = true;
      this.findBy();
    });
  }
  pagar() {
    Swal.fire({
      title: "Confirmar el valor total del egreso",
      text: this.formatCurrency(this.egresoForm.controls["T17Total"].value),
      showDenyButton: true,
      confirmButtonText: "Pagar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
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
        const proveedor = this.proveedores.filter(
          (p) => p.Nit === this.egresoForm.controls["T17Proveedor"].value.Nit
        )[0];
        this.egresoForm.controls["T17Proveedor"].setValue(proveedor.Nit);
        this.egresoForm.controls["T17Factura"].setValue(
          `${this.egresoForm.controls["T17Factura"].value} PAGADO ${this.parametrosContaConfigEmpresa[0].Valor}${this.parametrosContaConfigEmpresa[1].Valor} `
        );
        const tipoEgreso = this.tiposEgresos.filter(
          (te) =>
            te.id ===
            parseInt(this.egresoForm.controls["T17Clasificacion"].value.id)
        )[0];
        this.egresoForm.controls["T17Clasificacion"].setValue(tipoEgreso?.id);

        const egreso = this.egresoForm.value;
        this._egresosService.createEgresos(egreso).subscribe(() => {
          this.IsWaiting = false;
          Swal.fire("Pagado", "Egreso pagado exitosamente", "success");
          this.egresoForm.reset();
          this.patchParametrosForm();
          this.showListado = true;
          this.showPanelDatos = false;
          this.findBy();
          this.tieneImpuestos = true;
        });

        const configParam = this.parametrosContaConfigEmpresa.filter(
          (cp) => cp.id === 10
        )[0];
        this.configParametrosService
          .incrementCountConfigParamOnPayment(configParam)
          .subscribe(() => {
            this.fetchParamsByGroupContaConfigEmpresa();
          });
      }
    });
  }
  fetchParamsByGroupContaConfig() {
    this.configParametrosService
      .configByParamGroup("CONTA_CONFIG")
      .subscribe((response) => {
        this.parametrosContaConfig = response.data.configByParamGroup;
      });
  }
  fetchParamsByGroupContaConfigEmpresa() {
    this.configParametrosService
      .configByParamGroup("CONTA_CONFIG_EMPRESA")
      .subscribe((response) => {
        this.parametrosContaConfigEmpresa = response.data.configByParamGroup;
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
      const { egresosProgramados, totalRegistros } =
        res.data.egresosProgramados;
      this.egresos = egresosProgramados;
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
    if (this.filter["T17FechaFin"] != '' && this.filter["T17FechaIni"] != '') {
      this.findBy();
    }
  }
  onDateChangeFinal(event: MatDatepickerInputEvent<Date>) {
    const dateValue = moment(new Date(event.value)).format("YYYY-MM-DD");
    this.filter["T17FechaFin"] = dateValue;
    if (this.filter["T17FechaFin"] != '' && this.filter["T17FechaIni"] != '') {
      this.findBy();
    }
  }
  onDateChangeFechaDocumento(event: MatDatepickerInputEvent<Date>) {
    const dateValue = moment(new Date(event.value)).format("YYYY-MM-DD");
    this.egresoForm.controls["T17Fecha"].setValue(dateValue);
    this.findBy();
  }
  formatCurrency(number: number): string {
    return this.toolService.formatCurrency(number);
  }
  fetchTiposEgresos() {
    let obj = {
      applicationId: 41,
      campos: [],
      limit: {
        pagina: 1,
        limite: 10000,
      },
    };
    this.genericService.getAll(obj).subscribe((res) => {
      let genericList = res.data.genericList[0];
      let listado = genericList.campos.map((val) => {
        return JSON.parse(val);
      });

      this.tiposEgresos = listado.map((val) => {
        return { id: val.id, T17Nombre: val.T17Nombre };
      });

      this.IsWaiting = false;
    });
  }
}
