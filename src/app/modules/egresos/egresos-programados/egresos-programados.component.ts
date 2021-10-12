import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import Swal from "sweetalert2";
import { ConfigParametrosService } from "../../core/services/ConfigParametrosService.service";
import { FormasPagosService } from "../../core/services/formaspagos.service";
import { ProveedoresService } from "../../core/services/proveedores.service";
import { EgresosService } from "../egresos.service";

@Component({
  selector: "app-egresos-programados",
  templateUrl: "./egresos-programados.component.html",
})
export class EgresosProgramadosComponent implements OnInit {
  public IsWaiting: boolean;
  public showListado: boolean = true;
  public egresosProgramadosForm: FormGroup;
  public etiquetaNombreModulo = "Egresos Programados";
  public etiquetaListado = "Listado de Egresos";
  public parametrosContaConfig = [];
  public formasPagos = [];

  constructor(
    public _egresosService: EgresosService,
    public configParametros: ConfigParametrosService,
    public formasPagosService: FormasPagosService,
    public proveedoresService: ProveedoresService
  ) {}

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
    this.fetchParamsByGroup("CONTA_CONFIG");
    this.fetchFormasPagos();
  }

  fetchFormasPagos() {
    this.formasPagosService.getAll().subscribe((res) => {
      this.formasPagos = res.data.tipospagos.map((tp) => {
        const obj = { value: tp.nombre, nombre: tp.nombre };
        return obj;
      });
    });
  }

  onFormaPagoSelected(selected) {
    this.egresosProgramadosForm.controls["T17FormaPago"].setValue(
      selected.nombre
    );
  }

  fetchParamsByGroup(nombreParametro) {
    this.configParametros
      .configByParamGroup(nombreParametro)
      .subscribe((response) => {
        this.parametrosContaConfig = response.data.configByParamGroup;
        this.patchParametrosForm();
      });
  }

  onPorveedorSelected(selected) {
    this.IsWaiting = true;
    this.egresosProgramadosForm.controls["T17Proveedor"].setValue(selected.Nit);
    this.IsWaiting = false;
  }

  calculateTotal() {
    let iva =
      parseFloat(this.egresosProgramadosForm.controls["T17IVA"].value) / 100;
    let ica =
      parseFloat(this.egresosProgramadosForm.controls["T17ICA"].value) / 100;
    let retefuente =
      parseFloat(this.egresosProgramadosForm.controls["T17RF"].value) / 100;
    const descuento =
      parseFloat(this.egresosProgramadosForm.controls["T17Dctos"].value) / 100;
    const valorEgreso = parseFloat(
      this.egresosProgramadosForm.controls["T17Valor"].value
    );

    let total = valorEgreso - valorEgreso * descuento;
    iva = total * iva;
    ica = total * ica;
    retefuente = total * retefuente;

    total = total + (iva + ica + retefuente);

    this.egresosProgramadosForm.controls["T17Total"].setValue(total);
  }

  patchParametrosForm() {
    this.egresosProgramadosForm.controls["T17IVA"].setValue(
      this.parametrosContaConfig[0].Valor
    );
    this.egresosProgramadosForm.controls["T17RF"].setValue(
      this.parametrosContaConfig[1].Valor
    );
    this.egresosProgramadosForm.controls["T17ICA"].setValue(
      this.parametrosContaConfig[2].Valor
    );
  }

  guardar() {
    this.IsWaiting = true;
    this.egresosProgramadosForm.controls["T17ICA"].setValue(
      parseFloat(this.egresosProgramadosForm.controls["T17ICA"].value)
    );
    this.egresosProgramadosForm.controls["T17IVA"].setValue(
      parseFloat(this.egresosProgramadosForm.controls["T17IVA"].value)
    );
    this.egresosProgramadosForm.controls["T17RF"].setValue(
      parseFloat(this.egresosProgramadosForm.controls["T17RF"].value)
    );
    this.egresosProgramadosForm.controls["T17Valor"].setValue(
      parseFloat(this.egresosProgramadosForm.controls["T17Valor"].value)
    );

    const egreso = this.egresosProgramadosForm.value;

    this._egresosService.createEgresos(egreso).subscribe(() => {
      this.IsWaiting = false;
      Swal.fire("Guardado", "Egreso guardado exitosamente", "success");
      this.egresosProgramadosForm.reset();
      this.patchParametrosForm();
    });
  }
}
