import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { TableService } from "../core/services/table.service";
import { ColumnaService } from "../core/services/columna.service";
import { TipoCampoService } from "../tipo-campo/tipo-campo.service";
import { HistoriaClinicaService } from "./historiaClinica.service";
import { PacienteService } from "../core/services/paciente.service";

@Component({
  selector: "app-historia",
  templateUrl: "./historiaClinica.component.html",
  styleUrls: ["./historiaClinica.component.scss"],
})
export class HistoriaClinicaComponent implements OnInit {
  public IsWaiting: boolean;
  public IsWaitings: boolean=false;
  public paciente: any;
  public etiquetaListado = "Listado de Mascaras";
  public etiquetaNombreModulo = "Campos";

  constructor(public _pacienteService: PacienteService) {}

  ngOnInit() {}

  onPatientSelected(selected) {
    this.paciente = selected;
    this.IsWaitings = true;
  }
}
