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
import { MatSlideToggleChange } from "@angular/material/slide-toggle";

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
interface Select {
  value: number;
  viewValue: string;

}
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
  public etiquetaNombreModulo = "Recordatorios";
  public etiquetaListado = "Configuración de Recordatorios";
  public IsWait: Boolean = false;
  public lShowPanelListado: Boolean = true;
  public lShowPanelDatos: Boolean = false;
  public lShowBtnAdicionar: Boolean = true;
  public lShowBtnActualizar: Boolean = true;
  public lShowBtnEliminar: Boolean = true;
  public totalRecordatorios = 0;
  public repCada: Array<any> = [
    { value: '0', nombre: '1' }, 
    { value: '1', nombre: '5' },
    { value: '2', nombre: '10' }, 
    { value: '3', nombre: '15' }
  ];

  public repCadaTime: Array<any> = [
    { value: '0', nombre: 'Días' },
    { value: '1', nombre: 'Meses' },
    { value: '2', nombre: 'Años' }
  ];

  public roles: any = [];

  public filter = {
    nombre: ""
  };

  constructor(private lService: RecordatorioService, private rolService: RolService) { }

  ngOnInit() {
    this.findBy();

    this.lForm = new FormGroup({
      _id: new FormControl("", [Validators.maxLength(50)]),
      id: new FormControl(""),
      nombre: new FormControl("", [
        Validators.required,
        Validators.maxLength(50)
      ]),
      repetir: new FormControl("", [
        Validators.required,
      ]),
      observaciones: new FormControl("", [
        Validators.required,
        Validators.maxLength(100)
      ]),
      active: new FormControl(true), //True o String
      fechaRecordatorio: new FormControl(""),
      repetirCadaTimes: new FormControl(""),
      repetirCada: new FormControl(""),
      endsNever: new FormControl(""),
      endsOn: new FormControl(""),
      endsAfter: new FormControl(""),
      EMPRESA_ID: new FormControl("", [
        Validators.required,
        Validators.maxLength(50)
      ]),
      chooseEnd: new FormControl(""),
    });

  }
  onClickRadioButton(event) {
    console.log(this.lForm.controls['chooseEnd'].value);
    this.lForm.controls['endsNever'].setValue(false);
    this.lForm.controls['endsOn'].setValue(new Date().toString());
    this.lForm.controls['endsAfter'].setValue(0);
    switch (this.lForm.controls['chooseEnd'].value) {
      case 'endsNever': {
        this.lForm.controls['endsNever'].setValue(true);
      } break;
      case 'endsOn': {
        this.lForm.controls['endsOn'].setValue(new Date().toString());
      } break;
      case 'endsAfter': {
        this.lForm.controls['endsAfter'].setValue(1);
      } break;

    }
    console.log(this.lForm.controls['endsNever'].value)
    console.log(this.lForm.controls['endsOn'].value)
    console.log(this.lForm.controls['endsAfter'].value)
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
    console.log("ENTRO EN GUARDARRRRRRRRRRRRRR")
    console.log("Antes" + this.lForm.value);
    this.lService.createUsers(this.lForm.value).subscribe((reponse) => {
      console.log("Despues" + this.lForm.value);
      console.log(reponse);
      this.IsWait = false;
      Swal.fire('Usuario', 'Agregado correctamente.', 'success');
      this.findBy();
      this.lForm.reset();
      this.lShowPanelDatos = false;
      this.lShowPanelListado = true;
    });
  }

  adicionar() {
    console.log(this.lForm.value)
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
      console.log(this.lForm.value)
      this.IsWait = false;
      Swal.fire('Recordatorio', 'Actualizado correctamente.', 'success');
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
    console.log(dataInput);

    if(this.lForm.controls['endsNever'].value == true){
      this.lForm.controls['chooseEnd'].setValue('endsNever');
    }
     else if(this.lForm.controls['endsAfter'].value >= 1){
      this.lForm.controls['chooseEnd'].setValue('endsAfter');
    }else{
      this.lForm.controls['chooseEnd'].setValue('endsOn');
    }
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
    if (this.filter.nombre.length > 0) {
      this.queryOptions = { ...this.queryOptions, filter: this.filter }
    }
    this.obtenerDatos(this.queryOptions);
    this.IsWait = true;
  }

  onDateChangeRecordatorio(event: MatDatepickerInputEvent<Date>) {
    const dateValue = moment(new Date(event.value)).format("YYYY-MM-DD");
    console.log(dateValue)
    this.lForm.controls["fechaRecordatorio"].setValue(dateValue);
    this.findBy();
  }

  pruebaOnDate(valor) {
    console.log("fecha:" + valor);
    this.lForm.controls['fechaRecordatorio'].setValue(valor);
  }

  endsOnDate(valor){
    console.log("fecha:" + valor);
    this.lForm.controls['endsOn'].setValue(valor.value);
  }
  onDisponibleSelected(lSelected: any) {
    console.log('REPETIR CADATIMES'+lSelected.value);
    this.lForm.controls['repetirCadaTimes'].setValue(lSelected.value);
    console.log(this.lForm.controls['repetirCadaTimes'].value)
  }

  onDisponibleSelected2(valor: any){
    console.log('REPETIR CADA'+valor.value);
    this.lForm.controls['repetirCada'].setValue(valor.value);
    console.log(this.lForm.controls['reptirCada'].value);
  }

  onDisponibleToggle(selected: any) {
    console.log(selected);
    this.lForm.controls['repetir'].setValue(selected.value);
    console.log(this.lForm.controls['repetir'].value)
  }
}

