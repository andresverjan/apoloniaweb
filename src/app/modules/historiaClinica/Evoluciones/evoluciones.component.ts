import { Component, OnInit, ViewChild, TemplateRef, Input, OnChanges, SimpleChanges } from "@angular/core";
import { TableService } from "../../core/services/table.service";
import { ColumnaService } from "../../core/services/columna.service";
import { TipoCampoService } from "../../tipo-campo/tipo-campo.service";
import { EvolucionesService } from "./evoluciones.service";
import { PacienteService } from "../../core/services/paciente.service";
import { FormGroup } from "@angular/forms";
import Swal from "sweetalert2";
import { ToolsService } from "../../core/services/tools.service";

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
  public USUARIO: any = {};
  public detalle = {
    Observacion: ""
  };

  @Input() Cedula: string;
  @Input() Paciente: any;
  constructor(//public _pacienteService: PacienteService,
    public _evolucionesService: EvolucionesService,
    public toolsService: ToolsService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.fetchEvoluciones(this.Cedula);
  }

  ngOnInit() {
    this.USUARIO = this.toolsService.getUserFromLocalStorage();
    console.log(this.USUARIO);
    console.log("INGRESO A EVOLUCIONES!!!");
    console.log(this.Paciente);
  }

  actionAdicionar() {
    this.showListado = false;
    this.showForm = true;

    this.detalle.Observacion = "";
    
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

    console.log("*****************");
    console.log(this.Cedula);
    console.log("*****************");

    let evolucion = {
      Cedula: this.Cedula,
      Observaciones: this.detalle.Observacion,
      IdUsuario: this.USUARIO.USUARIO_LOGIN,
      Paciente: this.Paciente.Nombre + " " + this.Paciente.Apellidos,
      Nombres: this.Paciente.Nombre,
      Apellidos: this.Paciente.Apellidos
    };
    console.log(evolucion);
    console.log("*****************");

    this._evolucionesService.save(evolucion).subscribe((reponse) => {
      Swal.fire('Evoluciones', 'Agregado correctamente.', 'success');
    });

  }

  cancelar() {
    this.showForm = false;
    this.showListado = true;
  }

  fetchEvoluciones = (obj: any) => {
    this._evolucionesService.getAll(obj).subscribe((res) => {
      this.evolucionesLista = res.data.getCitasHC;
    });
  };

  actualizar(evolucion: any) {
    console.log(evolucion);
    this.showListado = false;
    this.showContent = false;
    this.showForm = true;
    this.showBtnActualizar = true;
    this.showBtnEliminar = true;
    this.evolucion = evolucion;
    this.Cedula = evolucion.Cedula;
    this.detalle.Observacion = evolucion.Observacion;
    console.log(this.detalle);
  }

  update() {
    console.log(this.evolucion);
    this.evolucion.Observacion = this.detalle.Observacion;
    this.evolucion.IdUsuario = this.USUARIO.USUARIO_LOGIN;
    this.evolucion.Paciente = this.Paciente.Nombre + " " + this.Paciente.Apellidos;
    this.evolucion.Nombres = this.Paciente.Nombre;
    this.evolucion.Apellidos = this.Paciente.Apellidos;

    this._evolucionesService.update(this.evolucion).subscribe((reponse) => {
      Swal.fire('Evoluciones', 'Actualizado correctamente.', 'success');
      this.showForm = false;
      this.showListado = true;
      this.detalle.Observacion = "";
    });
  }


}
