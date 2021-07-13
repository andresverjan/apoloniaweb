import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EsterilizacionesService } from './esterilizaciones.service';

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

  constructor(
    private esterilizacionesService: EsterilizacionesService
  ) {
    this.esterilForm = new FormGroup({
      fecha: new FormControl("", [Validators.maxLength(10),
        Validators.required
      ]),

      usuario: new FormControl("", [
        Validators.maxLength(50),
        Validators.required,
      ])
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
        application: {
          nombre: this.esterilForm.controls["nombre"].value,
          nombreTabla: this.esterilForm.controls["nombreTabla"].value,
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

    this.esterilForm.controls["usuario"].setValue(esterilizacion.usuario);
    this.esterilForm.controls["fecha"].setValue(esterilizacion.fecha);
//    this.fetchCamposValues(application.id);
  }

  ngOnInit(): void {
    this.fetchSterilizations();
  }

  findBy() {
    if (this.filter.T27Campo9) {
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

}
