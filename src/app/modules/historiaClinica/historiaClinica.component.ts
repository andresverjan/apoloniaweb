import { Component, OnInit } from "@angular/core";
import { PacienteService } from "../core/services/paciente.service";
import { EvolucionesService } from "./Evoluciones/evoluciones.service";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-historia",
  templateUrl: "./historiaClinica.component.html",
  styleUrls: ["./historiaClinica.component.scss"],
})
export class HistoriaClinicaComponent implements OnInit {

  public HCForm: FormGroup;
  public IsWaiting: boolean;
  public IsWaitings: boolean=false;
  public paciente: any;
  public etiquetaListado = "Listado de Mascaras";
  public etiquetaNombreModulo = "Campos";
  public evolucionesLista: any = [];

  Cedula: string;

  constructor(public _pacienteService: PacienteService) {
    this.HCForm = new FormGroup({
      Apellidos: new FormControl("", [
        /*Validators.maxLength(50),
        Validators.required,*/
      ])
    });
  }

  ngOnInit() {
    this.paciente = {
      Cedula: "Documento",
      Nombres: "",
      Apellidos: "Seleccione Paciente"
    };
  }

  onPatientSelected(selected: any) {
    this.paciente = {
      Cedula: selected.Cedula,
      Nombres: selected.Nombres,
      Apellidos: selected.Apellidos
    };
    this.HCForm.controls["Apellidos"].setValue(selected.Apellidos);
    this.Cedula = selected.Cedula;
    this.IsWaitings = true;
  }
}

