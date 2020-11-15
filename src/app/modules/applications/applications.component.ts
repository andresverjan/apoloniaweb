import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { ApplicationService } from "./applications.service";
import { MascarasService } from "../mascaras/mascaras.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { TipoCampoService } from "../tipo-campo/tipo-campo.service";
import { TableService } from "../core/services/table.service";
import { ColumnaService } from "../core/services/columna.service";
import { Campo } from "../core/interfaces/campoTable.interace";

@Component({
  selector: "app-applications",
  templateUrl: "./applications.component.html",
  styleUrls: ["./applications.component.scss"],
})
export class ApplicationsComponent implements OnInit {
  public tabla: any;
  public aplicacionForm: FormGroup;

  public mascaras = [];
  public campos: Campo[] = [];

  constructor(
    private applicationService: ApplicationService,
    public _mascarasService: MascarasService,
    public _tipoCampoService: TipoCampoService,
    public _tableService: TableService,
    public _columnaService: ColumnaService
  ) {
    this.aplicacionForm = new FormGroup({
      nombre: new FormControl("", [Validators.maxLength(50)]),
      nombreTabla: new FormControl("", [
        Validators.maxLength(50),
        Validators.required,
      ]),
    });
  }

  public IsWaiting: Boolean = false;
  public showBtnActualizar: Boolean = false;
  public showBtnEliminar: Boolean = false;
  public dialogRef: any;
  public lShowPanelDatos: Boolean = false;
  public lShowPanelListado: Boolean = true;

  public etiquetaNombreModulo = "Aplicaciones";
  public etiquetaListado = "Listado de Aplicaciones";
  public filter: any = {};
  public applications: any = [];
  public application: any;

  public tipoCampos = [];

  ngOnInit() {
    this.fetchApplications();
    this.fetchMascaras();
    this.fetchTipoCampos();
    this.tabla = {
      TABLE_NAME: "Seleccione Tabla",
    };
  }
  adicionar() {
    this.showContent = false;
    this.showListado = false;
    this.showForm = true;
  }

  actualizar(application: any) {
    this.showListado = false;
    this.showContent = false;
    this.showForm = true;
    this.showBtnActualizar = true;
    this.showBtnEliminar = true;
    this.application = application;

    this.tabla = {
      TABLE_NAME: application.nombreTabla,
    };

    this.aplicacionForm.controls["nombreTabla"].setValue(this.tabla);
    this.aplicacionForm.controls["nombre"].setValue(application.nombre);

    this.fetchCamposValues(application.id);
  }
  actionActualizar() {
    const obj = {
      application: {
        id: this.application.id,
        nombre: this.aplicacionForm.controls["nombre"].value,
      },
      campos: [...this.campos],
    };

    this.applicationService.updateApplication(obj).subscribe((res) => res);

    this.showForm = false;

    this.aplicacionForm.reset();
    Swal.fire("Operación exitosa", "Aplicación agragada!.", "success");

    this.fetchApplications();

    this.showBtnActualizar = false;
    this.showBtnEliminar = false;
    this.showListado = true;
    this.showContent = true;
  }

  procesarValSelect2(comSelect: any) {
    this.filter.active = comSelect.value;
    this.findBy();
  }

  onTableSelected(selected) {
    this.tabla = selected;
    this.fetchCamposByTabla(this.tabla);
    this.aplicacionForm.controls["nombreTabla"].setValue(selected.TABLE_NAME);
  }

  cancelar() {
    this.showForm = false;
    this.showListado = true;
    this.showContent = true;
    this.showBtnActualizar = false;
    this.showBtnEliminar = false;
    this.tabla = {
      TABLE_NAME: "Seleccione Tabla",
    };

    this.campos = new Array<Campo>();

    this.aplicacionForm.reset();
  }

  public showContent: boolean = true;
  public showListado: boolean = true;
  public showForm: boolean = false;

  eliminar() {
    Swal.fire({
      title: "Realmente quieres eliminar la Applicación seleccionada?",
      showCancelButton: true,
      confirmButtonText: `Aceptar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.applicationService
          .deleteApplication(this.application.id)
          .subscribe((res) => {
            this.showForm = false;
            this.aplicacionForm.reset();
            Swal.fire(
              "Operación exitosa",
              "Aplicación Eliminada Correctamente!.",
              "success"
            );
            this.fetchApplications();
            this.showListado = true;
            this.showContent = true;
          });
      } else if (result.isDenied) {
      }
    });
  }

  findBy() {
    if (this.filter.nombre || this.filter.active || this.filter.nombreTabla) {
      this.fetchApplications(this.filter);
    } else {
      this.fetchApplications();
    }
    this.IsWaiting = true;
  }

  fetchApplications = (obj?) => {
    this.IsWaiting = true;
    this.applicationService.getAll(obj).subscribe((res) => {
      this.applications = res.data.applications;
      this.IsWaiting = false;
    });
  };

  fetchMascaras() {
    this.IsWaiting = true;
    this._mascarasService.getAll().subscribe((res) => {
      res.data.mascaras.forEach((mascara) => {
        this.mascaras.push({ value: mascara.id, nombre: mascara.nombre });
      });
      this.IsWaiting = false;
    });
  }
  fetchTipoCampos() {
    this.IsWaiting = true;
    this._tipoCampoService.getAll().subscribe((res) => {
      res.data.tipocampos.forEach((item) => {
        this.tipoCampos.push({ value: item.id, nombre: item.nombre });
      });
      this.IsWaiting = false;
    });
  }

  fetchCamposByTabla(obj) {
    this.IsWaiting = true;
    this._columnaService.getAll(obj).subscribe((res) => {
      this.campos = res.data.listaCamposTable;
      this.IsWaiting = false;
    });
  }

  fetchCamposValues(obj: number) {
    this.IsWaiting = true;
    this._columnaService.getFields(obj).subscribe((res) => {
      this.campos = res.data.getFieldsByAppId;
      this.IsWaiting = false;
    });
  }
  setMascaras(campo: Campo, value) {
    campo.mascaraId = Number.parseInt(value.value);
  }
  setTipoCampoId(campo: Campo, value) {
    campo.tipoCampoId = Number.parseInt(value.value);
  }

  aceptar() {
    if (this.aplicacionForm.valid) {
      const obj = {
        application: {
          nombre: this.aplicacionForm.controls["nombre"].value,
          nombreTabla: this.aplicacionForm.controls["nombreTabla"].value,
        },
        campos: [...this.campos],
      };

      this.applicationService.saveApplication(obj).subscribe((res) => res);

      this.showForm = false;

      this.tabla = {
        TABLE_NAME: "Seleccione Tabla",
      };
      this.aplicacionForm.reset();
      this.campos = new Array<Campo>();
      Swal.fire("Operación exitosa", "Aplicación agragada!.", "success");

      this.fetchApplications();

      this.showListado = true;
      this.showContent = true;
    } else {
      Swal.fire("Error", "Todos los campos deben ser requeridos.", "error");
    }
  }
}
