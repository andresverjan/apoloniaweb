import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { Campo } from "../core/interfaces/campoTable.interace";
import { ColumnaService } from "../core/services/columna.service";
import { GenericService } from "./generic.service";

@Component({
  selector: "app-generic",
  templateUrl: "./generic.component.html",
  styleUrls: ["./generic.component.scss"],
})
export class GenericComponent implements OnInit {
  constructor(
    private genericService: GenericService,
    private columnasService: ColumnaService
  ) { }

  public showBtnActualizar: boolean = false;
  public showBtnEliminar: boolean = false;
  public isWaiting: boolean = true;
  public etiquetaListado = "Generic";
  public etiquetaNombreModulo = "Generic";
  public showContent: boolean = true;
  public showListado: boolean = true;
  public showForm: boolean = false;
  public appColumnas = [];
  public genericForm: FormGroup;
  public item: any;
  public testVar;
  public application: Application = {
    id: 0,
    nombre: "",
    nombreTabla: "",
  };

  cancelar() {
    this.showListado = true;
    this.showContent = true;
    this.showForm = false;
    this.genericForm.reset();
    this.genericForm = new FormGroup({});
  }
  public campos = [];

  ngOnInit(): void {
    this.fetchItems();
  }

  adicionar() {
    this.genericForm = new FormGroup({});
    this.showContent = false;
    this.showListado = false;
    this.showForm = true;

    this.isWaiting = true;
    this.columnasService
      .getFields(this.application.id)
      .subscribe(({ data }) => {
        this.appColumnas = data.getFieldsByAppId;
        //INICIALIZAR TIPOS DEL FORM
        let formGroup = {};

        this.appColumnas.forEach((field: Campo) => {
          let constraints = [];
          if (field.requerido) {
            constraints.push(Validators.required);
          }
          if (field.maxLength && field.maxLength != 0) {
            constraints.push(Validators.maxLength(field.maxLength));
          }
          if (field.minLength && field.minLength != 0) {
            constraints.push(Validators.minLength(field.minLength));
          }
          formGroup[field.nombre] = new FormControl("", constraints);
        });
        this.genericForm = new FormGroup(formGroup);
        this.isWaiting = false;
      });
  }
  detalle(item) {
    this.item = item;
    // 1: 3
    // createdAt: "2020-11-14T02:17:42.000Z"
    // id: 3
    // nombre: "PRUEBA JSON STRING"

    this.showListado = false;
    this.showContent = false;
    this.columnasService
      .getFields(this.application.id)
      .subscribe(({ data }) => {
        this.appColumnas = data.getFieldsByAppId;
        //INICIALIZAR TIPOS DEL FORM
        let formGroup = {};

        this.appColumnas.forEach((field: Campo) => {
          let constraints = [];

          if (field.requerido) {
            constraints.push(Validators.required);
          }
          if (field.maxLength && field.maxLength != 0) {
            constraints.push(Validators.maxLength(field.maxLength));
          }
          if (field.minLength && field.minLength != 0) {
            constraints.push(Validators.minLength(field.minLength));
          }

          formGroup[field.nombre] = new FormControl(
            this.item[field.nombre],
            constraints
          );
        });

        this.genericForm = new FormGroup(formGroup);
        this.showForm = true;
        this.showBtnActualizar = true;
        this.showBtnEliminar = true;
        this.isWaiting = false;
      });
  }

  actualizar() {
    if (this.genericForm.valid) {
      //crear el objeto a enviar
      const obj: any = {
        id: this.item.id,
        application: { ...this.application },
        campos: [
          ...this.appColumnas.map((item) => ({
            tipoCampoId: item.tipoCampoId,
            id: item.id,
            nombre: item.nombre,
            valor: this.genericForm.controls[item.nombre].value,
          })),
        ],
      };
      this.genericService.updateGeneric(obj).subscribe((res) => res);

      this.showForm = false;

      this.genericForm.reset();
      this.genericForm = new FormGroup({});

      Swal.fire("Operación exitosa", "Aplicación agragada!.", "success");
      this.fetchItems();

      this.showListado = true;
      this.showContent = true;
      this.showBtnActualizar = false;
      this.showBtnEliminar = false;
    } else {
      Swal.fire(
        "Error",
        "Todos los campos deben respetar la configuración de la aplicación",
        "error"
      );
    }
  }
  eliminar() {
    Swal.fire({
      title: "Realmente quieres eliminar la Applicación seleccionada?",
      showCancelButton: true,
      confirmButtonText: `Aceptar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        const obj: any = {
          id: this.item.id,
          application: { ...this.application },
        };
        this.genericService.deleteGeneric(obj).subscribe((res) => {
          this.showForm = false;
          this.genericForm.reset();
          Swal.fire(
            "Operación exitosa",
            "Item Eliminado Correctamente!.",
            "success"
          );
          this.fetchItems();
          this.showListado = true;
          this.showContent = true;
        });
      } else if (result.isDenied) {
      }
    });
  }

  guardar() {
    if (this.genericForm.valid) {
      //crear el objeto a enviar
      const obj: Generic = {
        application: { ...this.application },
        campos: [
          ...this.appColumnas.map((item) => ({
            id: item.id,
            nombre: item.nombre,
            valor: this.genericForm.controls[item.nombre].value,
          })),
        ],
      };

      this.genericService.saveGeneric(obj).subscribe((res) => res);

      this.showForm = false;

      this.genericForm.reset();

      Swal.fire("Operación exitosa", "Aplicación agragada!.", "success");
      this.fetchItems();

      this.showListado = true;
      this.showContent = true;
    } else {
      Swal.fire(
        "Error",
        "Todos los campos deben respetar la configuración de la aplicación",
        "error"
      );
    }
  }

  fetchItems() {
    this.isWaiting = true;
    this.genericService.getAll().subscribe(({ data }) => {
      const { application, campos } = data.genericList[0];
      this.application = application;

      this.campos = campos.map((campo) => {
        return JSON.parse(campo);
      });
      this.isWaiting = false;
    });
  }
}

interface Application {
  id: number;
  nombre: string;
  nombreTabla: string;
}
export interface Generic {
  application: Application;
  campos: Array<any>;
}
