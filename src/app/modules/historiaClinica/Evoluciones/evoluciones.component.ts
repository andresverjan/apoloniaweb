import { Component, OnInit, ViewChild, TemplateRef, Input, OnChanges, SimpleChanges } from "@angular/core";
import { TableService } from "../../core/services/table.service";
import { ColumnaService } from "../../core/services/columna.service";
import { TipoCampoService } from "../../tipo-campo/tipo-campo.service";
import { EvolucionesService } from "./evoluciones.service";
import { PacienteService } from "../../core/services/paciente.service";

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
