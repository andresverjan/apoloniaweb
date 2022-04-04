import Swal from "sweetalert2";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { RecordatorioService } from "./recordatorio.service";
import { RolService } from "../roles/roles.service";
import { PageEvent } from "@angular/material/paginator";

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

})

export class RecordatorioComponent implements OnInit {
  listado = [];
  public radioButtonFlag = false;
  public endsOn = false;
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

  public minDate = new Date();
  public filter = {
    nombre: ""
  };

  // @Output() valDate = new EventEmitter<string>();

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
      repetir: new FormControl(""),
      observaciones: new FormControl("", [
        Validators.required,
        Validators.maxLength(100)
      ]),
      active: new FormControl(true, [
        Validators.required
      ]),
      fechaRecordatorio: new FormControl("", [
        Validators.required
      ]),
      repetirCadaTimes: new FormControl(""),
      repetirCada: new FormControl(""),
      endsNever: new FormControl(""),
      endsOn: new FormControl(""),
      endsAfter: new FormControl(""),
      EMPRESA_ID: new FormControl(""),
      chooseEnd: new FormControl(""),
    });

  }
  onClickRadioButton(event) {
    this.lForm.controls['endsNever'].setValue(false);
    this.lForm.controls['endsOn'].setValue(new Date().toString());
    this.lForm.controls['endsAfter'].setValue(0);

    switch (this.lForm.controls['chooseEnd'].value) {
      case 'endsNever': {
        this.lForm.controls['endsNever'].setValue(true);
        this.endsOn = false;
        this.radioButtonFlag = false;
      } break;
      case 'endsOn': {
        this.lForm.controls['endsOn'].setValue(new Date().toString());
        this.radioButtonFlag = false;
        this.endsOn = true;
      } break;
      case 'endsAfter': {
        this.lForm.controls['endsAfter'].setValue(1);
        this.endsOn = false;
        this.radioButtonFlag = true;
      } break;
    }
  }

  obtenerDatos(obj?) {
    this.IsWait = true;
    this.lService.list(obj).subscribe((response) => {
      const { totalRegistros, lista } = response.data.recordatorios;
      this.totalRecordatorios = totalRegistros;
      this.listado = lista;
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
    this.lForm.controls['endsOn'].setValue(new Date(dataInput.endsOn));

    if (this.lForm.controls['endsNever'].value == true) {
      this.lForm.controls['chooseEnd'].setValue('endsNever');
    }
    else if (this.lForm.controls['endsAfter'].value >= 1) {
      this.lForm.controls['chooseEnd'].setValue('endsAfter');
      this.radioButtonFlag = true;
    } else {
      this.lForm.controls['chooseEnd'].setValue('endsOn');
      this.endsOn = true;
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

  OnDate(valor) {
    this.lForm.controls['fechaRecordatorio'].setValue(valor);
  }

  endsOnDate(valor) {
    this.lForm.controls['endsOn'].setValue(valor.value);
  }
  onDisponibleSelected(lSelected: any) {
    this.lForm.controls['repetirCadaTimes'].setValue(lSelected.value);
  }

  onDisponibleSelected2(valor: any) {
    this.lForm.controls['repetirCada'].setValue(valor.value);
  }
}