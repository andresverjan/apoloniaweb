import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EsterilizacionesService } from './esterilizaciones.service';
import { Campo } from "../core/interfaces/campoTable.interace";

@Component({
  selector: 'app-esterilizaciones',
  templateUrl: './esterilizaciones.component.html',
  styleUrls: ['./esterilizaciones.component.scss']
})
export class EsterilizacionesComponent implements OnInit {
  public esterilForm: FormGroup;
  public mascaras = [];
//  public campos: Campo[] = [];

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

  public acts: SelItem[] = this.mockedItems;
  public dateField: Campo[] = [{'nombre': 'createdAt', 'nombreUi': 'Hora Inicial',
    'tipoDato': 'datetime', 'tipoCampoId': 2, 'requerido': true, 'visible': true,
    'orden': 3, 'mascaraId': 1, 'minLength': 1, 'maxLength': 255, 'buscador': true,
    'verList': true}];

  constructor(
    private esterilizacionesService: EsterilizacionesService) {
      this.esterilForm = new FormGroup({
        createdAt: new FormControl("", [Validators.maxLength(10),
          Validators.required
        ]),

        act_id: new FormControl("", [
          Validators.required,
          Validators.maxLength(50),
        ])/*,

        usuario: new FormControl("", [
          Validators.maxLength(50),
          Validators.required,
        ])*/
      });
    }

  adicionar() {
    this.showContent = false;
    this.showListado = false;
    this.showForm = true;
  }

  aceptar() {
    if (this.esterilForm.valid) {
      const obj = {
        steril: {
          createdAt: this.esterilForm.controls["createdAt"].value,
          act_id: this.esterilForm.controls["act_id"].value,
        }/*,
        campos: [...this.campos],*/
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

    this.esterilForm.controls["act_id"].setValue(esterilizacion.act_id);
    this.esterilForm.controls["createdAt"].setValue(esterilizacion.createdAt);
//    this.fetchCamposValues(application.id);
  }

  ngOnInit(): void {
    this.fetchSterilizations();
  }

  findBy() {
    if (this.filter.nombre || this.filter.CedulaPaciente) {
      this.fetchSterilizations(this.filter);
    } else {
      this.fetchSterilizations();
    }
    this.IsWaiting = true;
  }

  fetchSterilizations = (obj?) => {
    this.IsWaiting = true;
    this.esterilizacionesService.getAll(obj).subscribe((res) => {
      this.sterilizations = res.data.sterilizations;
      this.IsWaiting = false;
    });
  };

  procesarRolAdd(rolSelected: any ){
    this.esterilForm.controls['act_id'].setValue(rolSelected.value);
  }

  setDate(value: any, item: any) {
    this.esterilForm.controls['createdAt'].setValue(value);
  }
}

interface SelItem {
  value: string;
  nombre: string;
}
