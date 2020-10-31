import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { ProductosService } from "./productos.service";
import { ComerciosService } from "../comercios/comercios.service";

@Component({
  selector: "app-productos",
  templateUrl: "./productos.component.html",
  styleUrls: ["./productos.component.scss"],
})
export class ProductosComponent implements OnInit {
  constructor(
    private productosService: ProductosService,
    private comerciosService: ComerciosService
  ) { }

  public IsWaiting: Boolean = false;
  public lShowBtnActualizar: Boolean = true;
  public lShowBtnAdicionar: Boolean = true;
  public lShowBtnEliminar: Boolean = true;
  public lShowPanelDatos: Boolean = false;
  public lShowPanelListado: Boolean = true;
  public productos: any = [];
  public comercios: any = [];
  public paramsFetchInfo = {
    // filter: {},
    order: { name: "asc" },
    properties: `_id id name comercioId description img`,
  };
  public comercioSelected;
  ngOnInit() {
    this.getProducts(this.paramsFetchInfo);
    this.getComercios({
      // filter: {},
      order: { id: "asc" },
      properties: "id location name",
    });

    this.form = new FormGroup({
      _id: new FormControl("", [Validators.maxLength(50)]),
      id: new FormControl("", [Validators.required, Validators.maxLength(50)]),
      name: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      description: new FormControl("", [
        Validators.required,
        Validators.maxLength(255),
      ]),
      comercioId: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      img: new FormControl("", [Validators.required]),
    });
  }

  public filter = {
    name: "",
    comercioId: "",
  };

  public etiquetaNombreModulo = "Productos";
  public etiquetaListado = "Listado de Productos";
  public form: FormGroup;

  verDetalle(dataInput: any) {
    this.lShowPanelListado = false;
    this.lShowPanelDatos = true;
    this.lShowBtnActualizar = true;
    this.lShowBtnEliminar = true;
    this.lShowBtnAdicionar = false;

    this.form.patchValue(dataInput);
    let comercioId = this.form.get('comercioId').value.toString();
    this.form.controls['comercioId'].setValue(comercioId);
  }

  cancelar() {
    this.lShowPanelDatos = false;
    this.lShowPanelListado = true;
    this.form.reset();
  }

  guardar() {
    this.IsWaiting = true;

    this.productosService
      .createProducto(this.form.value)
      .subscribe((reponse) => {
        this.IsWaiting = false;

        Swal.fire("Producto", "Agregado correctamente.", "success");

        this.getProducts(this.paramsFetchInfo);
        this.form.reset();
        this.lShowPanelDatos = false;
        this.lShowPanelListado = true;
      });
  }

  eliminar() {
    let producto = this.form.value;
    let _id = producto._id;

    this.IsWaiting = true;

    this.productosService.deleteProducto(_id).subscribe((reponse) => {
      this.IsWaiting = false;

      Swal.fire("Producto", "Eliminado correctamente.", "success");

      this.getProducts(this.paramsFetchInfo);
      this.form.reset();
      this.lShowPanelDatos = false;
      this.lShowPanelListado = true;
    });
    this.IsWaiting = false;
  }

  findBy() {
    if (
      (this.filter.name != undefined && this.filter.name.length > 1) ||
      (this.filter.comercioId != undefined &&
        this.filter.comercioId.length >= 1)
    ) {
      this.getProducts({ ...this.paramsFetchInfo, filter: this.filter });
    } else {
      this.getProducts(this.paramsFetchInfo);
    }
    this.IsWaiting = true;
  }

  actualizar() {
    this.IsWaiting = true;

    this.productosService.updateProduct(this.form.value).subscribe((res) => {
      this.IsWaiting = false;
      Swal.fire("Producto", "Actualizado correctamente.", "success");
      this.getProducts(this.paramsFetchInfo);
      this.form.reset();
      this.lShowPanelDatos = false;
      this.lShowPanelListado = true;
    });
  }

  adicionar() {
    this.lShowPanelListado = false;
    this.lShowPanelDatos = true;
    this.form.reset();
    this.lShowBtnActualizar = false;
    this.lShowBtnEliminar = false;
    this.lShowBtnAdicionar = true;
  }

  getProducts = (obj?) => {
    this.IsWaiting = true;
    this.productosService.fetchProductos(obj).subscribe((res) => {
      this.productos = res.data.listarProductos;
      this.IsWaiting = false;
    });
  };

  getComercios = (obj?) => {
    this.IsWaiting = true;
    this.comerciosService.ListComercios(obj).subscribe((res) => {
      res.data.comercios.forEach(comercio => {
        let comercioName = comercio.location + " - " + comercio.name;
        this.comercios.push({value: comercio.id, nombre: comercioName });
      });      
      this.IsWaiting = false;
    });
  };
   
  procesarComercioSelect(rolSelected: any ){
    this.form.controls['comercioId'].setValue(rolSelected.value);
    this.filter.comercioId = rolSelected.value;
    this.findBy();
  }

  
  procesarComercioAdd(rolSelected: any ){
    this.form.controls['comercioId'].setValue(rolSelected.value);
  }

}
