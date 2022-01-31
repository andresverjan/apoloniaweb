import Swal from "sweetalert2";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { RecordatorioService } from "./recordatorio.service";
import { RolService } from "../roles/roles.service";
import { PageEvent } from "@angular/material/paginator";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import * as moment from "moment";

const DATE_FORMATS = {
  parse: {
    dateInput: ["YYYY-MM-DD"],
  },
  display: {
    dateInput: "YYYY-MM-DD",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};
@Component({
  selector: "app-recordatorio",
  templateUrl: "./recordatorio.component.html",
  styleUrls: ["./recordatorio.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
  ]
})
export class RecordatorioComponent implements OnInit {
  listado = [];
  public queryOptions: any = {};
  public pageNumber: number = 1;
  public pageSizeOptions = [5, 10, 20, 30];
  public pageSize = 10;
  public lForm: FormGroup;
  public etiquetaNombreModulo = "Usuarios";
  public etiquetaListado = "Configuración de Recordatorios";
  public IsWait: Boolean = false;
  public lShowPanelListado: Boolean = true;
  public lShowPanelDatos: Boolean = false;
  public lShowBtnAdicionar: Boolean = true;
  public lShowBtnActualizar: Boolean = true;
  public lShowBtnEliminar: Boolean = true;

  public roles: any = [];

  public filter = {
    NOMBRE: ""
  };

  constructor(private lService: RecordatorioService, private rolService: RolService) { }

  ngOnInit() {
    this.findBy();

    this.lForm = new FormGroup({
      _id: new FormControl("", [Validators.maxLength(50)]),
      id: new FormControl("", [
        Validators.required, 
        Validators.maxLength(50)
       ]),
      NOMBRE: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      NOTA: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      DESCRIPCION: new FormControl("",[
        Validators.required,
        Validators.maxLength(50)
      ]),
      FECHAHORARECORDAR: new FormControl("",[
        Validators.required,
        Validators.maxLength(50)
      ]),
      ACTIVO: new FormControl("", [
        Validators.required,
        Validators.maxLength(50)
      ]),
      REPETIRDIARIO: new FormControl("",[
      Validators.required,
      Validators.maxLength(50)
      ]),
      REPETIRMENSUAL: new FormControl("", [
        Validators.required,
        Validators.maxLength(50)
      ]),
      EMPRESA_ID: new FormControl("", [
        Validators.required,
        Validators.maxLength(50)
      ]),
    });

  }



  procesarAdd(rolSelected: any) {
    this.lForm.controls['rol_id'].setValue(rolSelected.value);
  }

  procesarRol(rolSelected: any) {
    this.lForm.controls['rol_id'].setValue(rolSelected.value);
    // this.filter.rol_id = rolSelected.value;
    this.obtenerDatos(this.filter);
  }

  obtenerDatos(obj?) {
    this.IsWait = true;
    this.lService.list(obj).subscribe((response) => {
      this.listado = response.data.recordatorios.lista;
      this.IsWait = false;
    });
  }

  cancelar() {
    this.lShowPanelListado = true;
    this.lShowPanelDatos = false;
    this.lForm.reset();
  }

  guardar() {
    this.IsWait = true;

    this.lService.createUsers(this.lForm.value).subscribe((reponse) => {
      this.IsWait = false;
      Swal.fire('Usuario', 'Agregado correctamente.', 'success');
      this.findBy();
      this.lForm.reset();
      this.lShowPanelDatos = false;
      this.lShowPanelListado = true;
    });
  }

  adicionar() {
    this.lShowPanelListado = false;
    this.lShowPanelDatos = true;
    this.lForm.reset();
    this.lShowBtnActualizar = false;
    this.lShowBtnEliminar = false;
    this.lShowBtnAdicionar = true;
  }

  actualizar() {
    this.IsWait = true;

    this.lService.updateUsers(this.lForm.value).subscribe(() => {
      this.IsWait = false;
      Swal.fire('Usuarios', 'Actualizado correctamente.', 'success');
      this.lForm.reset();
      this.lShowPanelDatos = false;
      this.lShowPanelListado = true;
      this.findBy();
    });
  }

  verDetalle(dataInput: any) {
    this.lShowPanelListado = false;
    this.lShowPanelDatos = true;
    this.lShowBtnActualizar = true;
    this.lShowBtnEliminar = true;
    this.lShowBtnAdicionar = false;
    this.lForm.patchValue(dataInput);
  }

  eliminar() {
    let item = this.lForm.value;
    this.IsWait = true;
    this.lService.deleteUsers(item.id).subscribe((reponse) => {
      this.IsWait = false;
      Swal.fire('Recordatorio', 'Eliminado correctamente.', 'success');
      this.obtenerDatos();
      this.lForm.reset();
      this.lShowPanelDatos = false;
      this.lShowPanelListado = true;
    });
  }
  handlePageChange(e: PageEvent) {
    this.pageNumber = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.findBy();
  }

  findBy() {
    this.queryOptions = {
      pagina: this.pageNumber,
      limite: this.pageSize

    }
    if (this.filter.NOMBRE.length > 0) {
      this.queryOptions = { ...this.queryOptions, filter: this.filter }
    }
    this.obtenerDatos(this.queryOptions);
    this.IsWait = true;
  }

  onDateChangeRecordatorio(event: MatDatepickerInputEvent<Date>) {
    const dateValue = moment(new Date(event.value)).format("YYYY-MM-DD");
    this.lForm.controls["FECHAHORARECORDAR"].setValue(dateValue);
     this.findBy();
  }
}
