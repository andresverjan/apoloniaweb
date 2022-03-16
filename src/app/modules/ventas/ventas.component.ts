import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { GenericService } from '../generic/generic.service';
import { VentasService } from './ventas.service';
import { ToolsService } from "../core/services/tools.service";

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.sass']
})
export class VentasComponent implements OnInit {
  @ViewChild("myDialog") myDialog: TemplateRef<any>;

  public dateValue: string = null;
  public dateValus: string = null;
  public idSterlz: number;
  public productsAdd: Array<Multilist> = [];

  public ventaForm: FormGroup;
  public mascaras = [];
  public showContent: boolean = true;
  public showListado: boolean = true;
  public showForm: boolean = false;
  public IsWaiting: Boolean = false;
  public showBtnActualizar: Boolean = false;
  public showBtnAdicionar: Boolean = true;
  public showBtnEliminar: Boolean = false;
  public dialogRef: any;
  public lShowPanelDatos: Boolean = false;
  public lShowPanelListado: Boolean = true;

  public etiquetaNombreModulo = "Ventas";
  public etiquetaListado = "Listado de Ventas";
  public filter: any = {};
  public sales: any = [];
  public sale: any;
  public motivosVenta: any = [];
  public tiposVenta: any = [];
  public sedes: any = [];
  public dispMedics: any = [];
  public disp_Avails: Array<Multilist> = [];
  public tipEmpac: any = [];

  public totalRegistros = 0;
  public pageSize = 10;
  public pageSizeOptions = [5, 10, 20, 30];
  public pageNumber: number = 1;
  public queryOptions = {};
  public USUARIO: any = {};

  public disponibleOptions:
    SelItem[] = [
      { 'value': '1', nombre: "Disponible" },
      { 'value': '0', nombre: "No Disponile" }
    ];

  espora: SelItem[] = [
    { 'value': '1', 'nombre': 'SI' },
    { 'value': '0', 'nombre': 'NO' }
  ];

  constructor(public dialog: MatDialog,
    private genericService: GenericService,
    private ventaService: VentasService,
    public toolsService: ToolsService) { }

  onDisponibleSelected(lSelected: any) {
    this.filter.disponible = lSelected.value;
    this.findBy();
  }

  handlePageChange(e: PageEvent) {
    this.pageNumber = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.findBy();
  }

  async adicionar() {
    this.showContent = false;
    this.ventaForm.reset();
    this.lShowPanelDatos = true;
    this.showListado = false;
    this.showBtnEliminar = false;
    this.showBtnActualizar = false;
    this.showForm = true;
    this.productsAdd = [];
    await this.fetchProductsDisp(0);
  }

  cancelar() {
    this.showContent = true;
    this.ventaForm.reset();
    this.showForm = false;
    this.showListado = true;
  }

  guardar() {
    if (this.ventaForm.valid) {
      let cantidadValid = false;
      let tipoEmpaqueValid = false;
      let r = this.productsAdd.forEach((res) => {
        res.cantidad = res.cantidad ? res.cantidad : 0;
        if (res.cantidad) {
          cantidadValid = true;
        }
        if(res.tiposEmpaqueVentaId == undefined) {
          tipoEmpaqueValid = false;
        }
        if (res.tiposEmpaqueVentaId) {
          tipoEmpaqueValid = true;
        }
      });

      if (!tipoEmpaqueValid) {
        Swal.fire("Error", "Tipo Empaque es requerido.", "error");
        return;
      }

      if (!cantidadValid) {
        Swal.fire("Error", "Cantidad es requerida.", "error");
        return;
      }

      const obj = {
        venta: {
          T27Fecha: this.ventaForm.controls["T27Fecha"].value,
          sede: this.ventaForm.controls["sede"].value,
          motivo: this.ventaForm.controls["motivo"].value,
          tipo: this.ventaForm.controls["tipo"].value,
          esporas: this.ventaForm.controls["esporas"].value,
          timeMin: this.ventaForm.controls["timeMin"].value,
          temper: this.ventaForm.controls["temper"].value,
          presion: this.ventaForm.controls["presion"].value,
          observ: this.ventaForm.controls["observ"].value
        },
        products: this.productsAdd
      };
      this.ventaService.saveVentas(obj).subscribe((res) => res);
      this.showForm = false;
      this.lShowPanelDatos = false;
      this.ventaForm.reset();

      Swal.fire(
        "Operación exitosa",
        "Aplicación guardada correctamente!.",
        "success"
      );
      this.findBy();
      this.showListado = true;
      this.showContent = true;
    } else {
      Swal.fire("Error", "Todos los campos deben ser requeridos.", "error");
    }
  }

  async actualizar(venta: any) {
    this.showListado = false;
    this.showContent = false;
    this.showForm = true;
    this.showBtnActualizar = true;
    this.showBtnAdicionar = false;
    this.showBtnEliminar = true;
    this.sale = venta;
    this.ventaForm.controls["T27Fecha"].setValue(venta.T27Fecha);
    this.ventaForm.controls["sede"].setValue("'" + venta.sede + "'");
    this.ventaForm.controls["motivo"].setValue("'" + venta.motivo + "'");
    this.ventaForm.controls["tipo"].setValue("'" + venta.tipo + "'");
    this.ventaForm.controls["esporas"].setValue(venta.esporas);
    this.ventaForm.controls["timeMin"].setValue(venta.timeMin);
    this.ventaForm.controls["temper"].setValue(venta.temper);
    this.ventaForm.controls["presion"].setValue(venta.presion);
    this.ventaForm.controls["observ"].setValue(venta.observ);

    await this.fetchProductsDisp(venta.id);
    await this.fetchMedicalDispByVenta(venta.id);
  }

  actionActualizar() {
    let cantidadValid = false;
    let tipoEmpaqueValid = false;
    let r = this.productsAdd.forEach((res) => {
      res.cantidad = res.cantidad ? res.cantidad : 0;
      if (res.cantidad) {
        cantidadValid = true;
      }
      if(res.tiposEmpaqueVentaId == undefined) {
        tipoEmpaqueValid = false;
      }
      if (res.tiposEmpaqueVentaId) {
        tipoEmpaqueValid = true;
      }
    });

    if (!tipoEmpaqueValid) {
      Swal.fire("Error", "Tipo Empaque es requerido.", "error");
      return;
    }

    if (!cantidadValid) {
      Swal.fire("Error", "Cantidad es requerida.", "error");
      return;
    }

    console.log(cantidadValid);

    const obj = {
      venta: {
        id: parseInt(this.sale.id),
        T27Fecha: this.ventaForm.controls["T27Fecha"].value,
        sede: this.ventaForm.controls["sede"].value,
        motivo: this.ventaForm.controls["motivo"].value,
        tipo: this.ventaForm.controls["tipo"].value,
        esporas: this.ventaForm.controls["esporas"].value,
        timeMin: this.ventaForm.controls["timeMin"].value,
        temper: this.ventaForm.controls["temper"].value,
        presion: this.ventaForm.controls["presion"].value,
        observ: this.ventaForm.controls["observ"].value,
        idUsuario: this.USUARIO.USUARIO_LOGIN,
      },
      devices: this.productsAdd
    };
    this.ventaService.updateVenta(obj).subscribe((res) => res);
    this.findBy();
    Swal.fire("Actualización exitosa",
      "Esterilización agregada correctamente!.",
      "success"
    );
    this.ventaForm.reset();
    this.showForm = false;
    this.showBtnActualizar = false;
    this.showBtnEliminar = false;
    this.showListado = true;
    this.showContent = true;
  }

  ngOnInit(): void {
    this.idSterlz = 0;
    this.USUARIO = this.toolsService.getUserFromLocalStorage();

    this.fechMotivosVenta();
    this.fechTiposVenta();
    this.getSedes();
    this.getDispMedics();
    this.getEmpacTip();

    this.fetchProductsDisp(this.idSterlz);
    this.fetchMedicalDispByVenta(this.idSterlz);

    this.ventaForm = new FormGroup({
      T27Fecha: new FormControl("", [
        Validators.maxLength(50),
        Validators.required
      ]),

      sede: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),

      motivo: new FormControl("", [
        Validators.maxLength(50),
        Validators.required,
      ]),

      tipo: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),

      esporas: new FormControl("", [
        Validators.maxLength(50),
        Validators.required,
      ]),

      timeMin: new FormControl("", [
        Validators.maxLength(5),
        Validators.required,
      ]),

      temper: new FormControl("", [
        Validators.maxLength(5),
        Validators.required,
      ]),

      presion: new FormControl("", [
        Validators.maxLength(5),
        Validators.required,
      ]),

      observ: new FormControl("", [
        Validators.maxLength(255),
        Validators.required,
      ])
    });
    this.findBy();
  }

  findBy() {
    if (this.filter.disponible || this.filter.fechini || this.filter.fechend) {
      this.queryOptions = {
        filter: this.filter,
        pagina: this.pageNumber,
        limite: this.pageSize,
      };
    } else {
      this.queryOptions = {
        pagina: this.pageNumber,
        limite: this.pageSize,
      };
    }
    this.fetchSterilizations(this.queryOptions);
    this.IsWaiting = true;
  }

  fetchSterilizations = (obj?: any) => {
    this.IsWaiting = true;
    this.ventaService.getAll(obj).subscribe((res) => {
      const { totalRegistros, list } = res.data.ventaes;
      this.sales = list;
      this.totalRegistros = totalRegistros;
      this.IsWaiting = false;
    });
  };

  fechMotivosVenta() {
    let obj = {
      applicationId: 31,
      campos: [],
      limit: {
        pagina: 1,
        limite: 1000,
      },
    }
    this.genericService.getAll(obj).subscribe((res) => {
      let genericList = res.data.genericList[0];
      let listado = genericList.campos.map((val) => {
        return JSON.parse(val);
      });
      this.motivosVenta = listado.map((val) => {
        return {
          value: "'" + val.id + "'",
          nombre: val.nombre
        }
      });
      this.IsWaiting = false;
    });
  }

  fechTiposVenta() {
    let obj = {
      applicationId: 35,
      campos: [],
      limit: {
        pagina: 1,
        limite: 1000,
      },
    }
    this.genericService.getAll(obj).subscribe((res) => {
      let genericList = res.data.genericList[0];
      let listado = genericList.campos.map((val) => {
        return JSON.parse(val);
      });
      this.tiposVenta = listado.map((val) => {
        return {
          value: "'" + val.id + "'",
          nombre: val.nombre
        }
      });
      this.IsWaiting = false;
    });
  }

  getDispMedics() {
    let obj = {
      applicationId: 38,
      campos: [],
      limit: {
        pagina: 1,
        limite: 1000,
      },
    }
    this.genericService.getAll(obj).subscribe((res) => {
      let genericList = res.data.genericList[0];
      let listado = genericList.campos.map((val) => {
        return JSON.parse(val);
      });
      this.dispMedics = listado.map((val) => {
        return {
          value: "'" + val.id + "'",
          nombre: val.nombre
        }
      });
      this.IsWaiting = false;
    });
  }

  getEmpacTip() {
    let obj = {
      applicationId: 37,
      campos: [],
      limit: {
        pagina: 1,
        limite: 1000,
      },
    }
    this.genericService.getAll(obj).subscribe((res) => {
      let genericList = res.data.genericList[0];
      let listado = genericList.campos.map((val) => {
        return JSON.parse(val);
      });
      this.tipEmpac = listado.map((val) => {
        return {
          value: "'" + val.id + "'",
          nombre: val.nombre
        }
      });
      this.IsWaiting = false;
    });
  }

  getSedes() {
    let obj = {
      applicationId: 30,
      campos: [],
      limit: {
        pagina: 1,
        limite: 1000,
      },
    }
    this.genericService.getAll(obj).subscribe((res) => {
      let genericList = res.data.genericList[0];
      let listado = genericList.campos.map((val) => {
        return JSON.parse(val);
      });
      this.sedes = listado.map((val) => {
        return {
          value: "'" + val.id + "'",
          nombre: val.nombre
        }
      });
      this.IsWaiting = false;
    });
  }

  selectField(rolSelected: any, campo: any) {
    this.ventaForm.controls[campo].setValue(rolSelected.value);
  }

  onDateChange(event: any) {
    console.log(event);
    this.ventaForm.controls["T27Fecha"].setValue(event);
  }

  onDateChangeInicial(event: MatDatepickerInputEvent<Date>) {
    this.dateValue = moment(new Date(event.value)).format().toString();
    this.findBy();
  }
  onDateChangeFinal(event: MatDatepickerInputEvent<Date>) {
    this.dateValus = moment(new Date(event.value)).format();
    this.filter.fechend = moment(new Date(event.value).setDate(new Date(event.value).getDate() + 1)).format();
    this.findBy();
    this.filter.fechend = this.dateValus;
  }

  setAttribute(selected: any) {
    this.filter.disponible = selected;
  }

  async openModal() {
    this.openDialogWithTemplateRef(this.myDialog);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  addDev() {
    this.dialogRef.close();
  }

  selectTipoEmpaque(selectedTipoEmpaque: any, device: any) {
    device.tiposEmpaqueVentaId = selectedTipoEmpaque.value;
  }

  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {
    console.log(this.ventaForm.valid);
    console.log(this.ventaForm);
    this.dialogRef = this.dialog.open(templateRef, {
      height: "536px",
      width: "572px",
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe((a) => { });
  }

  async fetchMedicalDispByVenta(obj: any) {
    this.IsWaiting = true;
    this.ventaService.getAssignedProducts(obj).subscribe((res) => {
      this.productsAdd = res.data.devicesByEsterilizationId;
      this.productsAdd = this.productsAdd.map((val) => {
        val.tiposEmpaqueVentaId = "'" + val.tiposEmpaqueVentaId + "'";
        return val;
      });
      this.IsWaiting = false;
      this.showBtnActualizar = true;
    });
  }

  fetchProductsDisp = (obj?: any) => {
    this.IsWaiting = true;
    this.ventaService.getProductsDisp(obj).subscribe((res) => {
      this.disp_Avails = res.data.dispositivos;
      this.IsWaiting = false;
    });
  };

  multiListChange(data) {
    console.log(data);
    console.log(this.productsAdd);
    this.productsAdd = data;
    this.productsAdd = data.map((val) => {
      val.cantidad = val.cantidad ? val.cantidad : 1;
      return val;
    });
  }

  removeDevice(dev){
    this.productsAdd = this.productsAdd.filter((opt) => dev.id != opt.id);
    this.disp_Avails.push(dev);
  }

}

interface SelItem {
  value: string;
  nombre: string;
}

interface Multilist {
  id: number;
  nombre: string;
  tiposEmpaqueVentaId: any;
  cantidad: number;
}
