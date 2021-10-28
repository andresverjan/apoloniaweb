import { Component, OnInit } from '@angular/core';
import { ToolsService } from '../core/services/tools.service';

import { EsterilizacionesService } from '../esterilizaciones/esterilizaciones.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit {


  public USUARIO: any = {};
  public totalEsterilizaciones: number = 0;
  public totalCitasDelDia: number = 0;
  public totalCitasAtendidas: number = 0;
  public totalCitasCanceladas: number = 0;
  public totalPacientesClinica: number = 0;


  titulos = ['Nombre', 'Apellido', 'HoraCita'];
  titulos2 = ['Nombre', 'Apellido', 'SEXO', 'EDAD'];

  lista2 = [
    {
      Nombre: "marcela",
      Apellido: "quiroga",
      SEXO: "F",
      EDAD: 10
    },
    {
      Nombre: "PEDRO",
      Apellido: "quiroga",
      SEXO: "M",
      EDAD: 10
    },

  ];


  lista = [
    {
      nombre: "marcela",
      apellido: "quiroga",
      hcita: "3:30 pm",
    },
    {
      nombre: "sara",
      apellido: "gallego",
      hcita: "3:30 pm",
    },
    {
      nombre: "juliana",
      apellido: "hernandez",
      hcita: "3:30 pm",
    },
    {
      nombre: "paola",
      apellido: "pabon",
      hcita: "3:30 pm"
    },
    {
      nombre: "johanna",
      apellido: "pabon",
      hcita: "3:70 pm",
    },
  ];


  constructor(public esterilizacionesService: EsterilizacionesService, public toolsService: ToolsService) {

    this.citasAtendidas();
    this.citasDelDia();
    this.citasCanceladas();
    this.totalPacientes();

  }

  fetchDataEstetilizaciones() {

    let filter = {
      disponible: 1
    }

    let queryOptions = {
      filter,
      pagina: 1,
      limite: 1000,
    };
    this.esterilizacionesService.getAll(queryOptions).subscribe((res) => {
      const { totalRegistros, list } = res.data.esterilizaciones;
      this.totalEsterilizaciones = totalRegistros;
    });

  }

  citasDelDia() {
    this.totalCitasDelDia = 13;
  }
  citasAtendidas() {
    this.totalCitasAtendidas = 3;
  }
  citasCanceladas() {
    this.totalCitasCanceladas = 2
  }
  totalPacientes() {
    this.totalPacientesClinica = 205;
  }


  runOnClick = (args: any): void => {
    console.log("imprimo desddf eel componente Hijo ");
    console.log(args);
  }

  ngOnInit() {
    this.USUARIO = this.toolsService.getUserFromLocalStorage();
    console.log(this.USUARIO);
  }



}
