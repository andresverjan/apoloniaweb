//import { ProductosService } from './../productos/productos.service';
import { Component, OnInit } from '@angular/core';
import Swal from "sweetalert2";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ApplicationService } from './applications.service';
//import { ComerciosService } from './../comercios/comercios.service';


@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})

export class ApplicationsComponent implements OnInit {
  constructor(private applicationService: ApplicationService /*,
    private productosService: ProductosService,
    private comerciosService: ComerciosService*/
  ) {}

  public IsWaiting: Boolean = false;
  public lShowBtnActualizar: Boolean = true;
  public lShowBtnAdicionar: Boolean = true;
  public lShowBtnEliminar: Boolean = true;
  public dialogRef: any;
  public lShowPanelDatos: Boolean = false;
  public lShowPanelListado: Boolean = true;

  public etiquetaNombreModulo = "Aplicaciones";
  public etiquetaListado = "Listado de Aplicaciones";
  public form: FormGroup;

  public applications: any = [];
  public productos: any = [];
  public comercios: any = [];

  public paramsFetchInfoProd = {
    // filter: {},
    order: { name: "asc" },
    properties: `id nombre nombreTabla active createdBy createdAt updatedAt`,
  };

  public paramsFetchInfoCom = {
    // filter: {},
    order: { id: "asc" },
    properties: "_id id name location description lat lng ",
  };

  ngOnInit() {

    this.getSubProducts();
/*    this.listProductos(this.paramsFetchInfoProd);
    this.listComercios(this.paramsFetchInfoCom);*/

    this.form = new FormGroup({
      id: new FormControl("", [Validators.maxLength(50)]),
      nombre: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      nombreTabla: new FormControl("", [
        Validators.required,
        Validators.maxLength(255),
      ]),
      active: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      createdBy: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),

//      img: new FormControl("", [Validators.required]),
    });
  }

  public filter: any = {};

  /*listProductos(obj?) {
  this.productosService.fetchProductos(obj).subscribe(res =>{
    res.data.listarProductos.forEach(prod => {
      this.productos.push({value: prod.id, nombre: prod.nombre});
    });
    });
  }

  listComercios(obj?) {
    this.comerciosService.ListComercios(obj).subscribe(res =>{
      res.data.comercios.forEach(c => {
        let comercioName = c.location + " - " + c.name;
        this.comercios.push({value: c.id, nombre: comercioName});
      });
      });
  }

  procesarValSelect(prodSelect: any) {
    this.filter.productoId = prodSelect.value;
    this.findBy();
  }*/

  procesarValSelect2(comSelect: any) {
    this.filter.active = comSelect.value;
    this.findBy();
  }

  verDetalle(dataInput: any) {
    this.lShowPanelListado = false;
    this.lShowPanelDatos = true;
    this.lShowBtnActualizar = true;
    this.lShowBtnEliminar = true;
    this.lShowBtnAdicionar = false;
    this.form.patchValue(dataInput);
  }

  cancelar() {
    this.lShowPanelDatos = false;
    this.lShowPanelListado = true;
    this.form.reset();
  }

  adicionar() {
    this.lShowPanelListado = false;
    this.lShowPanelDatos = true;
    this.form.reset();
    this.lShowBtnActualizar = false;
    this.lShowBtnEliminar = false;
    this.lShowBtnAdicionar = true;
  }

  findBy() {
    if (this.filter.nombre || this.filter.active ||
        this.filter.nombreTabla) {
      this.getSubProducts(this.filter);
    } else {
      this.getSubProducts();
    }
    this.IsWaiting = true;
  }

  actualizar() {
    this.IsWaiting = true;

    this.applicationService
      .listarApplications(this.form.value)
      .subscribe((res) => {
        this.IsWaiting = false;
        Swal.fire("Aplicaciones", "Actualizado correctamente.", "success");
        this.getSubProducts();
        this.form.reset();
        this.lShowPanelDatos = false;
        this.lShowPanelListado = true;
      });
  }

 /* eliminar() {
    let producto = this.form.value;
    let _id = producto._id;

    this.IsWaiting = true;

    this.applicationService.deleteSubproducto(_id).subscribe((reponse) => {
      this.IsWaiting = false;
      Swal.fire("Subproducto", "Eliminado correctamente.", "success");
      this.getSubProducts();
      this.form.reset();
      this.lShowPanelDatos = false;
      this.lShowPanelListado = true;
    });
    this.IsWaiting = false;
  }*/

  /*guardar() {
    this.IsWaiting = true;

    this.subproductosService
      .createSubproducto(this.form.value)
      .subscribe((reponse) => {
        this.IsWaiting = false;
        Swal.fire("Subproducto", "Agregado correctamente.", "success");
        this.getSubProducts();
        this.form.reset();
        this.lShowPanelDatos = false;
        this.lShowPanelListado = true;
      });
  }*/

  getSubProducts = (obj?) => {
    this.IsWaiting = true;
    this.applicationService.listarApplications(obj).subscribe((res) => {
      this.applications = res.data.applications;
      console.log("LLAMADO DESDE COMPOENENTe", this.applications);
      this.IsWaiting = false;
    });
  };

  /*procesarComercioAdd(rolSelected: any ){
    this.form.controls['comercioId'].setValue(rolSelected.value);
  }

  procesarProductoAdd(rolSelected: any ){
    this.form.controls['productoId'].setValue(rolSelected.value);
  }*/

}
