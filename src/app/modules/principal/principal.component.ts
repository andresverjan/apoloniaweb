import { Component, OnInit } from '@angular/core';
import { ToolsService } from '../core/services/tools.service';
import { EsterilizacionesService } from '../esterilizaciones/esterilizaciones.service';
import { ChartOptions, ChartOptionsPieDonut } from '../core/components/piechart/piechart.type';
import { ElementRef } from '@angular/core';
import { MascarasService } from '../mascaras/mascaras.service';
import { PacienteService } from '../core/services/paciente.service';
import { CitaService } from '../citas/citas.service';
import { ConfigDashBoardService } from '../core/services/ConfigDashBoardService.service';

import * as moment from 'moment';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { AbstractControl, FormControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';
import { BrowserStack } from 'protractor/built/driverProviders';

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

  public BigCompomentList = [];

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

  public ListComponentesTipo1: [];
  public ListComponentesTipo2: [];

  public happyBirthdayList: [];
  public chartOptionsCitasMes: Partial<ChartOptions>;
  public chartOptionsPacientesSexo: Partial<ChartOptionsPieDonut>;

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
  listCitasConfirmadasTitulos = [];
  listCitasCanceladasTitulos = [];
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
    private configDashBoardService: ConfigDashBoardService,
    private elementRef: ElementRef) {

    this.fetchListadoComponentesTipo1();
    this.fetchListadoComponentesTipo2();

    this.getNumPacBySex();
    this.getNumCitasAtendidasbyMonthThisYear();

  }

  fetchListadoComponentesTipo1() {
    let componenteTipoId = 1;
    this.configDashBoardService.getDashBoardItemsByTipo(componenteTipoId).subscribe((res) => {
      this.ListComponentesTipo1 = res.data.getDashBoardItemsByTipo;

      let _$this  = this;
      this.ListComponentesTipo1.forEach(function (element: any) {
        console.log(element);
        console.log(element.codigo);
        switch (element.codigo) {
          case "NUM_PACIENTES": {
            console.log("NUMERO:.. PACIENTES PS:...");
            console.log(_$this);
            _$this.totalPacientes(element);
            break;
          }
          case "NUM_CITAS": {
            _$this.citasDelDia(element);
            break;
          }
          case "NUM_CITAS_CONFIRMADAS": {
            _$this.citasDelDiaConfirmadas(element);
            break;
          }
          case "NUM_CITAS_CANCELADAS": {
            _$this.citasCanceladas(element);
            break;
          }
          case "NUM_CITAS_ATENDIDAS": {
            _$this.citasAtendidas(element);
            break;
          }
        }
      });
    });
  }

  fetchListadoComponentesTipo2() {
    let componenteTipoId = 2;
    this.configDashBoardService.getDashBoardItemsByTipo(componenteTipoId).subscribe((res) => {
      this.ListComponentesTipo2 = res.data.getDashBoardItemsByTipo;


      this.fetchPacientesCumpleaños();
      this.fetchListCitasCanceladas();
      this.fetchListCitasConfirmadas();
    });
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
  totalPacientes(elementInput: any) {
    console.log("******TRAER TOTAL PACIENTES!!!*****");
    this.pacienteService.getNumPacientes().subscribe((res) => {
      const list = res.data.getNumPacientes;
      console.log(elementInput);
      elementInput.data=[];
      elementInput.data = list.count;
      this.totalPacientesClinica = list.count;
    });
  }

  /*
   ** Listar Las citas Que han sido confirmadas, Status = 2
   */
  fetchListCitasConfirmadas() {
    let statusCita = 2;
    this.citaService.citasByToday(statusCita).subscribe((res) => {
      console.log(res.data.citasByToday);
      this.listCitasConfirmadas = res.data.citasByToday;
      if (this.listCitasConfirmadas.length > 0) {
        Object.keys(this.listCitasConfirmadas[0]).map((key) => {
          if (key == 'start') {
            this.listCitasConfirmadasTitulos.push('Hora Inicio');
          } else if (key == 'end') {
            this.listCitasConfirmadasTitulos.push('Hora Fin');
          } else {
            this.listCitasConfirmadasTitulos.push(key);
          }
        });
      }
      console.log(this.listCitasConfirmadas);
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
      if (this.listCitasCanceladas.length > 0) {
        Object.keys(this.listCitasCanceladas[0]).map((key) => {
          if (key == 'start') {
            this.listCitasCanceladasTitulos.push('Hora Inicio');
          } else if (key == 'end') {
            this.listCitasCanceladasTitulos.push('Hora Fin');
          } else {
            this.listCitasCanceladasTitulos.push(key);
          }
        });
      }
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

      this.chartOptionsCitasMes = {
        chart: {
          height: 250,
          type: "bar"
        },
        series: [
          {
            name: "Pacientes",
            data: obj.data
          }
        ],
        labels: obj.categories,
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

      console.log(obj);
    });
  }

  citasDelDia(elementInput:any) {
    this.totalCitasDelDia = 13;
    let statusCita = 99;
    this.citaService.citasByTodayCount(statusCita).subscribe((res) => {
      let list = res.data.citasByToday;
      console.log("Total De citas del dia" + list.length);
      console.log(list);
      this.totalCitasDelDia = list.length;
      elementInput.data = this.totalCitasDelDia;
    });
  }
  citasDelDiaConfirmadas(elementInput:any) {
    let statusCita = 2;
    this.citaService.citasByTodayCount(statusCita).subscribe((res) => {
      let list = res.data.citasByToday;
      console.log("Total De citas Confirmadas" + list.length);
      console.log(list);
      this.totalCitasConfirmadas = list.length;
      elementInput.data = this.totalCitasConfirmadas;
    });
  }
  citasAtendidas(elementInput:any) {
    this.totalCitasAtendidas = 3;
    let statusCita = 3;
    this.citaService.citasByTodayCount(statusCita).subscribe((res) => {
      let list = res.data.citasByToday;
      console.log("Citas Atendidas Today COUNT " + list.length);
      console.log(list);
      this.totalCitasAtendidas = list.length;
      elementInput.data = this.totalCitasAtendidas;
    });
  }
  citasCanceladas(elementInput:any) {
    let statusCita = 6;
    this.citaService.citasByTodayCount(statusCita).subscribe((res) => {
      let list = res.data.citasByToday;
      console.log("Citas CANCELADAS COUNT " + list.length);
      console.log(list);
      this.totalCitasCanceladas = list.length;
      elementInput.data = this.totalCitasCanceladas;
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
