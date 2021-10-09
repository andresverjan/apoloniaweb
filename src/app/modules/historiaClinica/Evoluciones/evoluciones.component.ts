import { Component, OnInit, ViewChild, TemplateRef, Input, OnChanges, SimpleChanges } from "@angular/core";
import { TableService } from "../../core/services/table.service";
import { ColumnaService } from "../../core/services/columna.service";
import { TipoCampoService } from "../../tipo-campo/tipo-campo.service";
import { EvolucionesService } from "./evoluciones.service";
import { PacienteService } from "../../core/services/paciente.service";
import { FormGroup } from "@angular/forms";
import Swal from "sweetalert2";


@Component({
  selector: "app-evoluciones",
  templateUrl: "./evoluciones.component.html",
  styleUrls: ["./evoluciones.component.scss"],
})
export class EvolucionesComponent implements OnChanges {//OnInit,
  public IsWaiting: boolean;
  public showListado: boolean = true;
  public showContent: boolean = true;
  public showBtnActualizar: Boolean = false;
  public showBtnEliminar: Boolean = false;
  public showForm: boolean = false;
  public mascaras = [];
  public evolucionesLista: any = [];
  public evolucion: any;

  public evolucionForm: FormGroup;

  public remisionAdd: any = [];
  public eventosAdversosAdd: any = [];
  public laboratoriosAdd: any = [];
  public esterilizacionAdd: any = [];
  public recetarioAdd: any = [];
  public detalle = {
    observaciones: ""
  };

  @Input() Cedula: string;
  constructor(//public _pacienteService: PacienteService,
    public _evolucionesService: EvolucionesService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.fetchEvoluciones(this.Cedula);
  }

  actionAdicionar() {
    this.showListado = false;
    this.showForm = true;
  }

  guardar() {
    console.log("presiono guardar.....");
    console.log(this.esterilizacionAdd);
    console.log("IMPRIMO eventosAdversosAdd");
    console.log(this.eventosAdversosAdd);

    console.log("IMPRIMO REMIsION");
    console.log(this.remisionAdd);

    console.log("IMPRIMO detalleAdd");
    console.log(this.detalle);

    console.log("IMPRIMO LABORATORIOS");
    console.log(this.laboratoriosAdd);


    console.log("IMPRIMO RECETARIO");
    console.log(this.recetarioAdd);


    this.showForm = false;
    this.showListado = true;

  }

  cancelar() {
    this.showForm = false;
    this.showListado = true;
  }

  fetchEvoluciones = (obj: any) => {
    console.log("****NG***PACIENTE*******", obj)
    this._evolucionesService.getAll(obj).subscribe((res) => {
      console.log(res.data.getCitasHC)
      this.evolucionesLista = res.data.getCitasHC;
    });
  };

  actualizar(evolucion: any) {
    this.showListado = false;
    this.showContent = false;
    this.showForm = true;
    this.showBtnActualizar = true;
    this.showBtnEliminar = true;
    this.evolucion = evolucion;
    this.Cedula    = evolucion.Cedula;
    /*this.evolucionForm.controls["Fecha"].setValue(evolucion.Fecha);
    this.evolucionForm.controls["IdOdontologo"].setValue(evolucion.IdOdontologo);
    this.evolucionForm.controls["Paciente"].setValue(evolucion.Paciente);*/
  }
}
