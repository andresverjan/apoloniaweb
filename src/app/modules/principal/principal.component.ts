import { Component, OnInit } from '@angular/core';
import { ToolsService } from '../core/services/tools.service';
import { EsterilizacionesService } from '../esterilizaciones/esterilizaciones.service';
import { ChartOptions, ChartOptionsPieDonut } from '../core/components/piechart/piechart.type';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit {

  public chartOptions: Partial<ChartOptions> = {
    chart: {
      height: 250,
      type: "bar"
    },
    series: [
      {
        name: "My-series",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
      }
    ],
    labels: ['Apple', 'Mango', 'Orange', 'Watermelon'],
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
    },
    title: {
      text: "Aplonia Chart"
    },
    colors: [
      '#E91E63',
      '#F44336',
      '#9C27B0',
      '#00FF00',
      '#29b6f6',
      '#388e3c',
      '#ffeb3b',
      '#e65100',
      '#bdbdbd',
      '#1a237e',
      '#f50057',
    ]
  };

  public chartOptions1: Partial<ChartOptionsPieDonut> = {
    chart: {
      height: 250,
      type: "donut"
    },
    series: [10, 41, 35, 51, 49, 62, 69, 91, 148],
    labels: ['Apple', 'Mango', 'Orange', 'Watermelon'],
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
    },
    title: {
      text: "Aplonia Chart"
    },
    colors: [
      '#E91E63',
      '#F44336',
      '#9C27B0',
      '#00FF00',
      '#29b6f6',
      '#388e3c',
      '#ffeb3b',
      '#e65100',
      '#bdbdbd',
      '#1a237e',
      '#f50057',
    ]
  };

  public chartOptions2: Partial<ChartOptionsPieDonut> ;


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
    this.pacientesBySex();

    
  }

  pacientesBySex(){
    this.chartOptions2 = {
      chart: {
        height: 250,
        type: "pie"
      },
      series: [11, 42],
      labels: ['Hombre', 'Mujer'],
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
      },
      title: {
        text: "Aplonia Chart"
      },
      colors: [
        '#090979',
        '#800080',
        '#e65100',
        '#bdbdbd',
        '#1a237e',
        '#f50057',
      ]
    };
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
