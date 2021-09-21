import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EsterilizacionesService } from './esterilizaciones.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-esterilizaciones',
  templateUrl: './esterilizaciones.component.html',
  styleUrls: ['./esterilizaciones.component.scss']
})
export class EsterilizacionesComponent implements OnInit {
  @Input() dateValue: string = null;
  @Output() valor = new EventEmitter<string>();

  public esterilForm: FormGroup;
  public mascaras = [];

  public showContent: boolean = true;
  public showListado: boolean = true;
  public showForm: boolean = false;

  public IsWaiting: Boolean = false;

  public showBtnActualizar: Boolean = false;
  public showBtnEliminar: Boolean = false;
  public dialogRef: any;
  public lShowPanelDatos: Boolean = false;
  public lShowPanelListado: Boolean = true;

  public etiquetaNombreModulo = "Esterilizaciones";
  public etiquetaListado = "Listado de Esterilizaciones";
  public filter: any = {};
  public sterilizations: any = [];
  public sterilization: any;

  mockedItems: SelItem[] = [
    {'value' : 'id1', 'nombre': 'KANVAS'},
    {'value' : 'id2', 'nombre': 'BYRENA'},
    {'value' : 'id3', 'nombre': 'Opion 3'},
    {'value' : 'id4', 'nombre': 'TESALIA'},
    {'value' : 'id5', 'nombre': 'Opion 5'},
    {'value' : 'id6', 'nombre': 'ORION'},
    {'value' : 'id7', 'nombre': 'PRAGA'}
  ];

  sedes: SelItem[] = [
    {'value' : 'id1', 'nombre': 'PUNE'},
    {'value' : 'id2', 'nombre': 'IBIZA'},
    {'value' : 'id3', 'nombre': 'BARANQUILLA'},
    {'value' : 'id4', 'nombre': 'DENVER'},
    {'value' : 'id5', 'nombre': 'BERNA'},
    {'value' : 'id6', 'nombre': 'OKINAWA'},
    {'value' : 'id7', 'nombre': 'BRUJAS'}
  ];

  public acts: SelItem[] = this.mockedItems;

  constructor(
    private esterilizacionesService: EsterilizacionesService) {
      this.esterilForm = new FormGroup({
        T27Fecha: new FormControl("", [
          Validators.maxLength(50),
          Validators.required
        ]),

        sede: new FormControl("", [
          Validators.required,
          Validators.maxLength(50),
        ]),

        motivo: new FormControl("", [
          Validators.maxLength(50),
          Validators.required,
        ]),

        tipo: new FormControl("", [
          Validators.required,
          Validators.maxLength(50),
        ]),

        esporas: new FormControl("", [
          Validators.maxLength(50),
          Validators.required,
        ]),

        dispMed: new FormControl("", [
          Validators.required,
          Validators.maxLength(50),
        ]),

        tipEmp: new FormControl("", [
          Validators.maxLength(50),
          Validators.required,
        ]),

        timeMin: new FormControl("", [
          Validators.maxLength(5),
          Validators.required,
        ]),

        temper: new FormControl("", [
          Validators.maxLength(5),
          Validators.required,
        ]),

        presion: new FormControl("", [
          Validators.maxLength(5),
          Validators.required,
        ]),

        cant: new FormControl("", [
          Validators.maxLength(5),
          Validators.required,
        ]),

        observ: new FormControl("", [
          Validators.maxLength(255),
          Validators.required,
        ])
      });
    }

  adicionar() {
    this.showContent = false;
    this.showListado = false;
    this.showForm = true;
  }

  cancelar() {
    this.showForm = false;
    this.showListado = true;
  }

  guardar() {
    if (this.esterilForm.valid) {
      const obj = {
        steril: {
          T27Fecha: this.esterilForm.controls["T27Fecha"].value,
          sede:     this.esterilForm.controls["sede"].value,
          motivo:   this.esterilForm.controls["motivo"].value,
          tipo:     this.esterilForm.controls["tipo"].value,
          esporas:  this.esterilForm.controls["esporas"].value,
          dispMed:  this.esterilForm.controls["dispMed"].value,
          tipEmp:   this.esterilForm.controls["tipEmp"].value,
          timeMin:  this.esterilForm.controls["timeMin"].value,
          temper:   this.esterilForm.controls["temper"].value,
          presion:  this.esterilForm.controls["presion"].value,
          cant:     this.esterilForm.controls["cant"].value,
          observ:   this.esterilForm.controls["observ"].value
        }
      };

      this.esterilizacionesService.saveSterilizations(obj).subscribe((res) => res);
      this.showForm = false;
      this.esterilForm.reset();

      Swal.fire(
        "Operación exitosa",
        "Aplicación guardada correctamente!.",
        "success"
      );

      this.fetchSterilizations();
      this.showListado = true;
      this.showContent = true;
    } else {
      Swal.fire("Error", "Todos los campos deben ser requeridos.", "error");
    }
  }

  actualizar(esterilizacion: any) {
    this.showListado = false;
    this.showContent = false;
    this.showForm = true;
    this.showBtnActualizar = true;
    this.showBtnEliminar = true;
    this.sterilization = esterilizacion;

    this.esterilForm.controls["T27Fecha"].setValue(esterilizacion.T27Fecha);
    this.esterilForm.controls["sede"].setValue(esterilizacion.sede);
    this.esterilForm.controls["motivo"].setValue(esterilizacion.motivo);
    this.esterilForm.controls["tipo"].setValue(esterilizacion.tipo);
    this.esterilForm.controls["esporas"].setValue(esterilizacion.esporas);
    this.esterilForm.controls["dispMed"].setValue(esterilizacion.dispMed);
    this.esterilForm.controls["tipEmp"].setValue(esterilizacion.tipEmp);
    this.esterilForm.controls["timeMin"].setValue(esterilizacion.timeMin);
    this.esterilForm.controls["temper"].setValue(esterilizacion.temper);
    this.esterilForm.controls["presion"].setValue(esterilizacion.presion);
    this.esterilForm.controls["cant"].setValue(esterilizacion.cant);
    this.esterilForm.controls["observ"].setValue(esterilizacion.observ);
  }

  ngOnInit(): void {
    this.fetchSterilizations();
  }

  findBy() {
    if (this.filter.disponible || this.filter.cedulaPaciente) {
      this.fetchSterilizations(this.filter);
    } else {
      this.fetchSterilizations();
    }
    this.IsWaiting = true;
  }

  fetchSterilizations = (obj?: any) => {
    this.IsWaiting = true;
    this.esterilizacionesService.getAll(obj).subscribe((res) => {
      this.sterilizations = res.data.esterilizaciones;
      this.IsWaiting = false;
    });
  };

  selectField(rolSelected: any, campo: any){
    this.esterilForm.controls[campo].setValue(rolSelected.value);
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    if ( new Date() >= new Date(moment(event.value).format())) {
      this.dateValue = moment(new Date(moment(event.value).format())
        .setDate( new Date(moment(event.value).format()).getDate() + 1 )).format();
    }else {
      this.dateValue = moment(event.value).format();
    }
    this.valor.emit(this.dateValue);
  }
}

interface SelItem {
  value: string;
  nombre: string;
}
