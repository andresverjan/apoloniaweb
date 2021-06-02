import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
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
export class EvolucionesComponent implements OnInit {
  public IsWaiting: boolean;
  public showListado: boolean = true;
  public showForm: boolean = false;
  public mascaras = [];
  public evolucionesLista: any = [];

  constructor(public _pacienteService: PacienteService, public _evolucionesService: EvolucionesService) {
    this.fetchEvoluciones();
    console.log(this.evolucionesLista);
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

  fetchEvoluciones = () => {
    this._evolucionesService.getAll().subscribe((res) => {
      console.log(res.data.getCitasHC)
      this.evolucionesLista = res.data.getCitasHC;
    });
  };

  ngOnInit() { }
}
