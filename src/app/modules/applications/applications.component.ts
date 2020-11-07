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
  public campos: [Campo];

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
  public lShowBtnActualizar: Boolean = true;
  public lShowBtnEliminar: Boolean = true;
  public dialogRef: any;
  public lShowPanelDatos: Boolean = false;
  public lShowPanelListado: Boolean = true;

  public etiquetaNombreModulo = "Aplicaciones";
  public etiquetaListado = "Listado de Aplicaciones";
  public filter: any = {};
  public applications: any = [];

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

  procesarValSelect2(comSelect: any) {
    this.filter.active = comSelect.value;
    this.findBy();
  }

  guardar() {
    this.IsWaiting = true;

    this.applicationService
      //TODO:
      .getAll()
      .subscribe((reponse) => {
        this.IsWaiting = false;
        Swal.fire("Comercios", "Agregado correctamente.", "success");
        this.lShowPanelDatos = false;
        this.lShowPanelListado = true;
        this.fetchApplications();
      });
  }
  onTableSelected(selected) {
    this.tabla = selected;
    this.fetchCamposByTabla(this.tabla);
    this.aplicacionForm.controls["nombre"].setValue(selected.TABLE_NAME);
  }

  cancelar() {
    this.showForm = false;
    this.showListado = true;
    this.showContent = true;
  }

  public showContent: boolean = true;
  public showListado: boolean = true;
  public showForm: boolean = false;

  eliminar() {
    //TODO: SERVICIO ELIMINAR
  }

  findBy() {
    if (this.filter.nombre || this.filter.active || this.filter.nombreTabla) {
      this.fetchApplications();
    } else {
      this.fetchApplications();
    }
    this.IsWaiting = true;
  }

  actualizar() {
    this.IsWaiting = true;

    this.applicationService.getAll().subscribe((res) => {
      this.IsWaiting = false;
      Swal.fire("Aplicaciones", "Actualizado correctamente.", "success");
      this.fetchApplications();
      this.lShowPanelDatos = false;
      this.lShowPanelListado = true;
    });
  }

  fetchApplications = () => {
    this.IsWaiting = true;
    this.applicationService.getAll().subscribe((res) => {
      this.applications = res.data.applications;
      this.IsWaiting = false;
    });
  };

  fetchMascaras() {
    this.IsWaiting = true;
    this._mascarasService.getAll().subscribe((res) => {
      this.mascaras = res.data.mascaras;
      this.IsWaiting = false;
    });
  }
  fetchTipoCampos() {
    this.IsWaiting = true;
    this._tipoCampoService.getAll().subscribe((res) => {
      this.tipoCampos = res.data.tipocampos;
      this.IsWaiting = false;
    });
  }
  fetchCamposByTabla(obj) {
    this.IsWaiting = true;
    this._columnaService.getAll(obj).subscribe((res) => {
      this.campos = res.data.listaCamposTable;
      console.log(this.campos);
      this.IsWaiting = false;
    });
  }
  setMascaras(campo: Campo, value) {
    campo.mascaraId = Number.parseInt(value.id);
    console.log(campo);
  }
  setTipoCampoId(campo: Campo, value) {
    campo.tipoCampoId = Number.parseInt(value.id);
    console.log(campo);
  }

  aceptar() {
    if (this.aplicacionForm.valid) {
      //crear el objeto a enviar
      const obj = {
        application: {
          nombre: this.aplicacionForm.controls["nombre"].value,
          nombreTabla: this.aplicacionForm.controls["nombreTabla"].value,
        },
        campos: [...this.campos],
      };
      console.log(obj);
      // llamar al servicio para enviar
      this.applicationService
        .saveApplication(obj)
        .subscribe((res) => console.log(res));

      this.showForm = false;

      this.aplicacionForm.reset();
      Swal.fire("Operación exitosa", "Aplicación agragada!.", "success");

      this.fetchApplications();

      this.showListado = true;
      this.showContent = true;
    } else {
      Swal.fire("Error", "Todos los campos deben ser requeridos.", "error");
    }
  }
}
