import { Component, OnInit } from "@angular/core";
import { PacienteService } from "../core/services/paciente.service";

@Component({
  selector: "app-historia",
  templateUrl: "./historiaClinica.component.html",
  styleUrls: ["./historiaClinica.component.scss"],
})
export class HistoriaClinicaComponent implements OnInit {
  public IsWaiting: boolean = false;
  public paciente: any;
  public etiquetaListado = "Listado de Mascaras";
  public etiquetaNombreModulo = "Campos";

  constructor(public _pacienteService: PacienteService) {}

  ngOnInit() {}

  onPatientSelected(selected) {
    this.paciente = selected;
    this.IsWaiting = true;
  }
}
