import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { ApplicationService } from "./applications.service";
import { MascarasService } from "../mascaras/mascaras.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { TipoCampoService } from "../tipo-campo/tipo-campo.service";
import { TableService } from "../core/services/table.service";
import { ColumnaService } from "../core/services/columna.service";

@Component({
  selector: "app-applications",
  templateUrl: "./applications.component.html",
  styleUrls: ["./applications.component.scss"],
})
export class ApplicationsComponent implements OnInit {
  public tabla: any;
  public camposForm: FormGroup;

  public mascaras = [];
  public campos = [];

  constructor(
    private applicationService: ApplicationService,
    public _mascarasService: MascarasService,
    public _tipoCampoService: TipoCampoService,
    public _tableService: TableService,
    public _columnaService: ColumnaService
  ) {
    this.camposForm = new FormGroup({
      Id: new FormControl("", [Validators.maxLength(50)]),
      ApplicacionId: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      Nombre: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      NombreUI: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      TipoCampo: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      Requerido: new FormControl(false, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      Visible: new FormControl(false, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      Orden: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      Mascara: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      MinLength: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      MaxLength: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      Buscador: new FormControl(false, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      VerList: new FormControl(false, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      CreatedAt: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      UpdatedAt: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
    });
  }

  public IsWaiting: Boolean = false;
  public lShowBtnActualizar: Boolean = true;
  public lShowBtnAdicionar: Boolean = true;
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

  onTableSelected(selected){
    this.tabla = selected;
    console.log(this.tabla);

    this.fetchCamposByTabla(this.tabla);
    
  }

  cancelar() {
    this.lShowPanelDatos = false;
    this.lShowPanelListado = true;
  }

  public showContent: boolean = true;
  public showListado: boolean = true;
  public showForm: boolean = false;
  adicionar() {
    this.showListado = false;
    this.showContent = false;
    this.showForm = true;
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
      this.mascaras= res.data.mascaras;
      console.log(this.mascaras);
      this.IsWaiting = false;
    });
  }
  fetchTipoCampos() {
    this.IsWaiting = true;
    this._tipoCampoService.getAll().subscribe((res) => {
      this.tipoCampos= res.data.tipocampos;
      console.log(this.tipoCampos);
      this.IsWaiting = false;
    });
  }
  fetchCamposByTabla(obj) {
    this.IsWaiting = true;
    this._columnaService.getAll(obj).subscribe((res) => {
      this.campos= res.data.listaCamposTable;
      console.log(this.campos);
      this.IsWaiting = false;
    });
  }
}
