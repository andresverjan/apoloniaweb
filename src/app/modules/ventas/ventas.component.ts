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
import { ProductService } from '../core/services/product.service';
import { FormasPagosService } from "../core/services/formaspagos.service";

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.sass']
})
export class VentasComponent implements OnInit {
  @ViewChild("myDialog") myDialog: TemplateRef<any>;

  public dateValue: string = null;
  public dateValus: string = null;
  public idProd: number;
  public codigo: string;
  public productsAdd: Array<Product> = [];
  public prodExcl: Array<number> = [];
  public prodSave: Array<any> = [];

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
  public puntosVenta: any = [];
  public tiposVenta: any = [];
  public tiposPago: any = [];
  public formasPagos = [];
  public ciudades: any = [];
  public product: Product;//any
//  public dispMedics: any = [];
//  public prod_avails: Array<Multilist> = [];
  public tipEmpac: any = [];

  public totalRegistros = 0;
  public pageSize = 10;
  public pageSizeOptions = [5, 10, 20, 30];
  public pageNumber: number = 1;
  public queryOptions = {};
  public USUARIO: any = {};

  public statusOptions:
    SelItem[] = [
      { 'value': '1', nombre: "Disponible" },
      { 'value': '0', nombre: "No Disponile" }
    ];

  /*espora: SelItem[] = [
    { 'value': '1', 'nombre': 'SI' },
    { 'value': '0', 'nombre': 'NO' }
  ];*/

  constructor(public dialog: MatDialog,
    private genericService: GenericService,
    private ventaService: VentasService,
    public productService: ProductService,
    public toolsService: ToolsService,
    public formasPagosService: FormasPagosService) {

    }

  onEstadoSelected(lSelected: any) {
    this.filter.estado = lSelected.value;
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
//    await this.fetchProductsDisp(0);
  }

  cancelar() {
    this.showContent = true;
    this.ventaForm.reset();
    this.showForm = false;
    this.showListado = true;
  }

  guardar() {
      this.prodSave = [];
      let typePago = false;

      if (this.ventaForm.controls["forma_pago"].value) {
        typePago = true;
      }

      if (!typePago) {
        Swal.fire("Error", "La forma de pago es requerida.", "error");
        return;
      }

      this.productsAdd.forEach((res) => {
        let prd = {
          id: res.id,
          cantidad: res.cantidad,
          sub_total: res.valor * res.cantidad
        }
        this.prodSave.push(prd);
      });

      const obj = {
        sale: {
          fecha_venta: moment(new Date()).format().toString(),
          forma_pago: this.ventaForm.controls["forma_pago"].value,
          usuarioId: this.USUARIO.id,
          punto_id: 1,
          ciudad_id: 1,
          empresa_id: 1,
          valor_total_venta: this.ventaForm.controls["total"].value,
        },
        products: this.prodSave
      };

      this.ventaService.saveVentas(obj).subscribe((res) => res);
      this.showForm = false;
      this.lShowPanelDatos = false;
      this.ventaForm.reset();
      this.productsAdd = [];

      Swal.fire(
        "Operación exitosa",
        "Venta registrada correctamente!.",
        "success"
      );
  }

  async actualizar(venta: any) {
    this.showListado = false;
    this.showContent = false;
    this.showForm = true;
    this.showBtnActualizar = true;
    this.showBtnAdicionar = false;
    this.showBtnEliminar = true;
    this.sale = venta;
    this.ventaForm.controls["forma_pago"].setValue("'" + venta.forma_pago + "'");
    this.ventaForm.controls["ciudad_id"].setValue("'" + venta.ciudad_id + "'");
    this.ventaForm.controls["punto_id"].setValue("'" + venta.punto_id + "'");
  }

  actionActualizar() {
    let cantidadValid = false;
    let total = 0;
    this.productsAdd.forEach((res) => {
      res.cantidad = res.cantidad ? res.cantidad : 0;
      if (res.cantidad) {
        cantidadValid = true;
      }

      total = res.valor * res.iva;

    });

    const obj = {
      sale: {
        id: parseInt(this.sale.id),
        forma_pago: this.ventaForm.controls["forma_pago"].value,
        ciudad_id: this.ventaForm.controls["ciudad_id"].value,
        punto_id: this.ventaForm.controls["punto_id"].value,
        usuarioId: this.USUARIO.USUARIO_LOGIN,
        estado: '0',
        valor_total_venta: total
      },
      products: this.productsAdd
    };
    this.ventaService.updateVenta(obj).subscribe((res) => res);
    this.findBy();
    Swal.fire("Actualización exitosa",
      "Venta actualizada correctamente!.",
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
    this.product = {
      id: 0,
      codigo: "Código",
      nombre: "Seleccione Producto",
      cantidad: 0,
      iva: 0,
      valor: 0
    };
    this.idProd = 0;
    this.USUARIO = this.toolsService.getUserFromLocalStorage();

    this.getCiudades();
    this.fechPuntosVenta();
    this.fetchFormasPagos();
//    this.fetchProductsByVenta(this.idProd);

    this.ventaForm = new FormGroup({
      id: new FormControl("", [
        Validators.required,
        Validators.maxLength(10),
      ]),

      codigo: new FormControl("", [
        Validators.required,
        Validators.maxLength(10),
      ]),

      ciudad_id: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),

      punto_id: new FormControl("", [
        Validators.maxLength(50),
        Validators.required,
      ]),

      forma_pago: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),

      nombre: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),

      valor: new FormControl("", [
        Validators.maxLength(50),
        Validators.required,
      ]),

      iva: new FormControl("", [
        Validators.maxLength(5),
        Validators.required,
      ]),

      subTotPdt: new FormControl("", [
        Validators.maxLength(5),
        Validators.required,
      ]),

      cantidad: new FormControl("", [
        Validators.maxLength(5),
        Validators.required,
      ]),

      total: new FormControl("", [
        Validators.maxLength(5),
        Validators.required,
      ])
    });
  }

  findBy() {
    if (this.filter.estado || this.filter.fechini || this.filter.fechend) {
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
    this.fetchVentas(this.queryOptions);
    this.IsWaiting = true;
  }

  fetchVentas = (obj?: any) => {
    this.IsWaiting = true;
    this.ventaService.getAll(obj).subscribe((res) => {
      const { totalRegistros, list } = res.data.ventas;
      this.sales = list;
      this.totalRegistros = totalRegistros;
      this.IsWaiting = false;
    });
  };

  getCiudades() {
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
      this.ciudades = listado.map((val) => {
        return {
          value: "'" + val.id + "'",
          nombre: val.nombre
        }
      });
      this.IsWaiting = false;
    });
  }

  fechPuntosVenta() {
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
      this.puntosVenta = listado.map((val) => {
        return {
          value: "'" + val.id + "'",
          nombre: val.nombre
        }
      });
      this.IsWaiting = false;
    });
  }

  fetchFormasPagos() {
    this.formasPagosService.getAll().subscribe((res) => {
      this.formasPagos = res.data.tipospagos.map((tp) => {
        const obj = { value: "'" + tp.id + "'", nombre: tp.nombre };
        return obj;
      });
    });
  }

  selectField(rolSelected: any, campo: any) {
    this.ventaForm.controls[campo].setValue(rolSelected.value);
  }

  setAttribute(selected: any) {
    this.filter.estado = selected;
  }

  async openModal() {
    this.openDialogWithTemplateRef(this.myDialog);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(templateRef, {
      height: "536px",
      width: "572px",
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe((a) => { });
  }

  onProductSelected(selected: any) {
    this.product = selected;
    this.ventaForm.controls["id"].setValue(selected.id);
    this.ventaForm.controls["codigo"].setValue(selected.codigo);
    this.ventaForm.controls["valor"].setValue(selected.valor);
    this.ventaForm.controls["iva"].setValue(selected.iva);
    this.ventaForm.controls["nombre"].setValue(selected.nombre);
    this.idProd = selected.id;
    this.IsWaiting = true;
    this.showForm = true;
  }

  removeProduct(dev: any){
    let total = 0;
    this.prodExcl = [];
    this.productsAdd = this.productsAdd.filter((opt) => dev.id != opt.id);

    this.productsAdd.map((val) => {
      total = total + val.valor * val.cantidad;
      this.prodExcl.push(val.id);
    });

    this.ventaForm.controls["total"].setValue(isNaN(total) ? 0 : total);
  }

  calculateTotal() {
    let total = 0;
    this.prodExcl = [];
    let cant = parseInt(this.ventaForm.controls["cantidad"].value) > 0 ? parseInt(this.ventaForm.controls["cantidad"].value) : 1
    let obj = {
      id: this.ventaForm.controls["id"].value,
      codigo: this.ventaForm.controls["codigo"].value,
      nombre: this.ventaForm.controls["nombre"].value,
      cantidad: cant,
      iva: 0,
      valor: parseInt(this.ventaForm.controls["valor"].value)
    }
    this.productsAdd.push(obj);
    this.productsAdd.map((val) => {
      total = total + val.valor * val.cantidad;
      this.prodExcl.push(val.id);
    });

    this.ventaForm.controls["total"].setValue(isNaN(total) ? 0 : total);
    this.ventaForm.controls["valor"].setValue(0);
    this.ventaForm.controls["cantidad"].setValue(0);
    this.ventaForm.controls["nombre"].setValue("");
    this.ventaForm.controls["subTotPdt"].setValue(0);
  }

  getSubTotalByUnits(selected: any){
    const iva = parseFloat(this.ventaForm.controls["iva"].value);
    const subTotal = parseInt(this.ventaForm.controls["valor"].value) * selected;
    this.ventaForm.controls["subTotPdt"].setValue(isNaN(subTotal) ? 0 : subTotal);
  }

}

interface SelItem {
  value: string;
  nombre: string;
}

interface Product {
  id: number;
  codigo: string;
  nombre: string;
  cantidad: number;
  iva: number;
  valor: number;
}
