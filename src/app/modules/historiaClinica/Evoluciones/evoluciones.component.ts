import { Component, OnInit, ViewChild, TemplateRef, Input, OnChanges, SimpleChanges } from "@angular/core";
import { TableService } from "../../core/services/table.service";
import { ColumnaService } from "../../core/services/columna.service";
import { TipoCampoService } from "../../tipo-campo/tipo-campo.service";
import { EvolucionesService } from "./evoluciones.service";
import { PacienteService } from "../../core/services/paciente.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-evoluciones",
  templateUrl: "./evoluciones.component.html",
  styleUrls: ["./evoluciones.component.scss"],
})
export class EvolucionesComponent implements OnChanges {//OnInit,
  public IsWaiting: boolean;
  public showListado: boolean = true;
  public showForm: boolean = false;
  public mascaras = [];
  public evolucionesLista: any = [];

  public remisionAdd: any = [];
  public eventosAdversosAdd: any = [];
  public laboratoriosAdd: any = [];
  public esterilizacionAdd: any = [1, 2, 3, 4];
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

  /*ngOnInit() {
    this.fetchEvoluciones(this.Cedula);
  }*/
}
