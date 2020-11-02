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
  constructor(private applicationService: ApplicationService) {}

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

  getSubProducts = (obj?) => {
    this.IsWaiting = true;
    this.applicationService.listarApplications(obj).subscribe((res) => {
      this.applications = res.data.applications;
      this.IsWaiting = false;
    });
  };

}
