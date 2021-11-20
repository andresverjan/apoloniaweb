import { Component, OnInit } from '@angular/core';
import { ToolsService } from '../core/services/tools.service';
import { EsterilizacionesService } from '../esterilizaciones/esterilizaciones.service';
import { ChartOptions, ChartOptionsPieDonut } from '../core/components/piechart/piechart.type';
import { ElementRef } from '@angular/core';
import { MascarasService } from '../mascaras/mascaras.service';
import { PacienteService } from '../core/services/paciente.service';
import { CitaService } from '../citas/citas.service';

import * as moment from 'moment';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { AbstractControl, FormControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit {

  public disabled = false;
  public color: ThemePalette = 'primary';
  public touchUi = false;
  public test = "";

  colorCtr: AbstractControl = new FormControl(null);

  public options = [
    { value: true, label: 'True' },
    { value: false, label: 'False' },
  ];

  public listColors = ['primary', 'accent', 'warn'];


  public dateValue;
  public primaryColor: string;
  public secondaryColor: string;
  public accentColor: string;
  public warnColor: string;

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];


  public dataSource: PeriodicElement[] = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
    { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
    { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
    { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  ];

  public happyBirthdayList: [];
  public chartOptions: Partial<ChartOptions> = {
    chart: {
      height: 250,
      type: "bar"
    },
    series: [
      {
        name: "My-series",
        data: []
      }
    ],
    //labels: ['Apple', 'Mango', 'Orange', 'Watermelon'],
    xaxis: {
      categories: []
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

  public chartOptionsPacientesSexo: Partial<ChartOptionsPieDonut> = {
    chart: {
      height: 250,
      type: "pie"
    },
    series: [],
    labels: [],
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

  public USUARIO: any = {};
  public totalEsterilizaciones: number = 0;
  public totalCitasDelDia: number = 0;
  public totalCitasAtendidas: number = 0;
  public totalCitasCanceladas: number = 0;
  public totalPacientesClinica: number = 0;

  public listCitasConfirmadas: Array<any> = [];
  public listCitasCanceladas: Array<any> = [];
  public listCitasTerminadas: Array<any> = [];

  public getNumPacientesBySexo = {
    series: [],
    labels: []
  };

  titulos = ['Nombre', 'Apellido', 'HoraCita', 't'];
  titulos2 = ['Nombre', 'Apellido', 'SEXO', 'EDAD'];
  titulosCumple = ['Nombres', 'Apellidos', 'Fecha'];

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
      hhcita: "3:30 pm",
    },
    {
      nombre: "sara",
      apellido: "gallego",
      hcita: "3:30 pm",
      hhcita: "3:30 pm",
    },
    {
      nombre: "juliana",
      apellido: "hernandez",
      hcita: "3:30 pm",
      hhcita: "3:30 pm",
    },
    {
      nombre: "paola",
      apellido: "pabon",
      hcita: "3:30 pm",
      hhcita: "3:30 pm",
    },
    {
      nombre: "johanna",
      apellido: "pabon",
      hcita: "3:70 pm",
      hhcita: "3:30 pm",
    },
  ];
  totalCitasConfirmadas: any;



  constructor(public esterilizacionesService: EsterilizacionesService, public toolsService: ToolsService,
    public pacienteService: PacienteService,
    private mascarasService: MascarasService,
    private citaService: CitaService,
    private elementRef: ElementRef) {

    this.citasDelDia();
    this.citasDelDiaConfirmadas();
    this.citasAtendidas();
    this.citasCanceladas();    
    this.totalPacientes();
    this.fetchPacientesCumpleaños();
    this.fetchListCitasCanceladas();
    this.getNumPacBySex();
    this.getNumCitasAtendidasbyMonthThisYear();

  }


  fetchPacientesCumpleaños() {
    this.pacienteService.getHappyBirthdayList().subscribe((res) => {
      const list = res.data.getHappyBirthdayList;
      this.happyBirthdayList = list.map((res) => {
        if (res.FechaNacimiento) {
          res.FechaNacimiento = moment(new Date(res.FechaNacimiento)).format("YYYY-MM-DD");
        }
        return res;
      })
      console.log(this.happyBirthdayList);
    });

  }

  getNumPacBySex() {
    this.pacienteService.getPacienteSexo().subscribe((res) => {
      const list = res.data.getPacienteSexo;
      list.map((res) => {
        switch (res.Sexo) {
          case "Masculino": {
            this.getNumPacientesBySexo.labels.push(res.Sexo + ": " + res.consult);
            this.getNumPacientesBySexo.series.push(res.consult);
            break;
          }
          case "Femenino": {
            this.getNumPacientesBySexo.labels.push(res.Sexo + ": " + res.consult);
            this.getNumPacientesBySexo.series.push(res.consult);
            break;
          }
          default: {
            this.getNumPacientesBySexo.labels.push("Indefinido: " + res.consult);
            this.getNumPacientesBySexo.series.push(res.consult);
          }
        }
        return res;
      });

      this.chartOptionsPacientesSexo = {
        chart: {
          height: 250,
          type: "pie"
        },
        series: this.getNumPacientesBySexo.series,
        labels: this.getNumPacientesBySexo.labels,
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

    });
  }

  /*
  ** cantidad total de pacientes del sistema
  */
  totalPacientes() {
    this.pacienteService.getNumPacientes().subscribe((res) => {
      const list = res.data.getNumPacientes;
      this.totalPacientesClinica = list.count;
    });
  }

  /*
   ** Listar Las citas Que han sido confirmadas, Status = 1
   */
  fetchListCitasConfirmadas() {
    let statusCita = 1;
    this.citaService.citasByToday(statusCita).subscribe((res) => {
      console.log(res.data.citasByToday);
      this.listCitasConfirmadas = res.data.citasByToday;
    });
  }

  /*
     ** Listar Las citas Que han sido Canceldas, Status = 6
     */
  fetchListCitasCanceladas() {
    let statusCita = 6;
    this.citaService.citasByToday(statusCita).subscribe((res) => {
      console.log(res.data.citasByToday);
      this.listCitasCanceladas = res.data.citasByToday;
    });
  }

  /*
   ** Listar Las citas Que han sido Termiandas, Status = 3
   */
  fetchListCitasTerminadas() {
    let statusCita = 3;
    this.citaService.citasByToday(statusCita).subscribe((res) => {
      console.log(res.data.citasByToday);
      this.listCitasTerminadas = res.data.citasByToday;
    });
  }

  /*
  ** Cantidad de citas Atentidas por mes durante el año.
  */
  getNumCitasAtendidasbyMonthThisYear() {
    this.citaService.getNumCitasAtendidasbyMonthThisYear().subscribe((res) => {
      console.log(res.data.getNumCitasAtendidasbyMonthThisYear);
      let list = res.data.getNumCitasAtendidasbyMonthThisYear;
      let monthNum = 9;
      var shortName = moment.monthsShort(monthNum - 1);
      console.log(shortName);

      let obj = {
        data: [],
        categories: []
      };
      list.map((res) => {
        console.log(res);
        let monthNum = res.MONTH;
        let shortName = moment.monthsShort(monthNum - 1);
        obj.data.push(res.count);
        obj.categories.push(shortName);
      });

      this.chartOptions.series = [{
        name: "Pacientes",
        data: obj.data
      }
      ];
      this.chartOptions.labels = obj.categories
      //this.chartOptions.xaxis.categories = obj.categories;
      console.log(obj);
    });
  }


  citasDelDia() {
    this.totalCitasDelDia = 13;
    let statusCita = 99;
    this.citaService.citasByTodayCount(statusCita).subscribe((res) => {      
      let list = res.data.citasByToday;
      console.log("Total De citas del dia" + list.length);
      console.log(list);
      this.totalCitasDelDia = list.length;
    });
  }
  citasDelDiaConfirmadas() {
    let statusCita = 2;
    this.citaService.citasByTodayCount(statusCita).subscribe((res) => {      
      let list = res.data.citasByToday;
      console.log("Total De citas Confirmadas" + list.length);
      console.log(list);
      this.totalCitasConfirmadas = list.length;
    });
  }  
  citasAtendidas() {
    this.totalCitasAtendidas = 3;        
    let statusCita = 3;    
    this.citaService.citasByTodayCount(statusCita).subscribe((res) => {      
      let list = res.data.citasByToday;
      console.log("Citas Atendidas Today COUNT " + list.length);
      console.log(list);
      this.totalCitasAtendidas = list.length;
    });
  }
  citasCanceladas() {
    let statusCita = 6;    
    this.citaService.citasByTodayCount(statusCita).subscribe((res) => {      
      let list = res.data.citasByToday;
      console.log("Citas CANCELADAS COUNT " + list.length);
      console.log(list);
      this.totalCitasCanceladas = list.length;
    });
  }


  runOnClick = (args: any): void => {
    console.log("imprimo desddf eel componente Hijo ");
    console.log(args);
  }

  ngOnInit() {
    this.USUARIO = this.toolsService.getUserFromLocalStorage();
    console.log(this.USUARIO);
  }

  setDate(newFecha) {
    console.log(newFecha);
  }

  changeTheme() {
    console.log("change");
    console.log(this.primaryColor);
    //this.openPDF('htmlData3');
    this.toolsService.exportHtmlToPdf("htmlPDF", "fileName.pdf");
    document.documentElement.style.setProperty('--primaryColor', this.primaryColor);
    document.documentElement.style.setProperty('--secondaryColor', this.secondaryColor);
    document.documentElement.style.setProperty('--accentColor', this.accentColor);
    document.documentElement.style.setProperty('--warnColor', this.warnColor);
  }

}
