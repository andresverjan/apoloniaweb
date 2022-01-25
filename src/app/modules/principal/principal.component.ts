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
  
  public color: ThemePalette = 'primary';
  colorCtr: AbstractControl = new FormControl(null);  

  public listColors = ['primary', 'accent', 'warn'];
  
  public primaryColor: string;
  public secondaryColor: string;
  public accentColor: string;
  public warnColor: string;

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

  public ListComponentesTipo1: Array<any> = [];
  public ListComponentesTipo2: Array<any> = [];
  public ListComponentesTipo3: Array<any> = [];

  public chartOptionsCitasMes: Partial<ChartOptions>;
  public chartOptionsPacientesSexo: Partial<ChartOptionsPieDonut>;

  public USUARIO: any = {};
  public totalEsterilizaciones: number = 0;
  public totalCitasDelDia: number = 0;
  public totalCitasAtendidas: number = 0;
  public totalCitasCanceladas: number = 0;
  public totalPacientesClinica: number = 0;


  public getNumPacientesBySexo = {
    series: [],
    labels: []
  };


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

      let _$this = this;
      this.ListComponentesTipo1.forEach(function (element: any) {
        switch (element.codigo) {
          case "NUM_PACIENTES": {
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
      let _$this = this;
      this.ListComponentesTipo2.forEach(function (element: any) {
        switch (element.codigo) {
          case "LISTADO_CITAS_CANCELADAS": {
            _$this.fetchListCitasCanceladas(element);
            break;
          }
          case "LISTADO_CITAS_CONFIRMADAS": {
            _$this.fetchListCitasConfirmadas(element);
            break;
          }
          case "LISTADO_CUMPLEAÑOS": {
            _$this.fetchPacientesCumpleaños(element);
            break;
          }
          case "LISTADO_PROXIMAS_CITAS": {
            _$this.fetchPacientesCumpleaños(element);
            break;
          }
        }
      });
    });
  }







  /*
  * ________________________________________
   * Metodos Relacionados con los listado.
   * ________________________________________
  */

  /*
   ** Listar Las citas Que han sido confirmadas, Status = 2
   */
  fetchListCitasConfirmadas(elementInput: any) {
    let statusCita = 2;
    elementInput.hide = true;
    this.citaService.citasByToday(statusCita).subscribe((res) => {
      let listCitasConfirmadas: Array<any> = [];
      let listCitasConfirmadasTitulos: Array<any> = [];
      listCitasConfirmadas = res.data.citasByToday;
      if (listCitasConfirmadas.length > 0) {
        elementInput.hide = false;
        Object.keys(listCitasConfirmadas[0]).map((key) => {
          if (key == 'start') {
            listCitasConfirmadasTitulos.push('Hora Inicio');
          } else if (key == 'end') {
            listCitasConfirmadasTitulos.push('Hora Fin');
          } else {
            listCitasConfirmadasTitulos.push(key);
          }
        });
        elementInput.data = listCitasConfirmadas;
        elementInput.columnas = listCitasConfirmadasTitulos;
      } else {
        console.log("xi no tiene items lo borro CONFIRMADAS!! " + elementInput.codigo);
        this.ListComponentesTipo2 = this.ListComponentesTipo2.filter((opt) => elementInput.codigo != opt.codigo);
        console.log(this.ListComponentesTipo2);
      }
    });
  }

  /*
     ** Listar Las citas Que han sido Canceldas, Status = 6
     */
  fetchListCitasCanceladas(elementInput: any) {
    console.log("list Citas Canceladas....");
    let statusCita = 6;
    elementInput.hide = true;
    this.citaService.citasByToday(statusCita).subscribe((res) => {
      let listCitasCanceladasTitulos: Array<any> = [];
      let listCitasCanceladas: Array<any> = [];
      listCitasCanceladas = res.data.citasByToday;
      if (listCitasCanceladas.length > 0) {
        Object.keys(listCitasCanceladas[0]).map((key) => {
          if (key == 'start') {
            listCitasCanceladasTitulos.push('Hora Inicio');
          } else if (key == 'end') {
            listCitasCanceladasTitulos.push('Hora Fin');
          } else {
            listCitasCanceladasTitulos.push(key);
          }
        });
        elementInput.hide = false;
        elementInput.columnas = listCitasCanceladasTitulos;
        elementInput.data = listCitasCanceladas;
      } else {
        console.log("xi no tiene items lo borro!! " + elementInput.codigo);
        this.ListComponentesTipo2 = this.ListComponentesTipo2.filter((opt) => elementInput.codigo != opt.codigo);
        console.log(this.ListComponentesTipo2);
      }
    });
  }

  fetchPacientesCumpleaños(elementInput: any) {
    elementInput.hide = true;
    this.pacienteService.getHappyBirthdayList().subscribe((res) => {
      const list = res.data.getHappyBirthdayList;
      let titulos: Array<any> = [];
      let happyBirthdayList: Array<any> = [];
      happyBirthdayList = list.map((res) => {
        if (res.FechaNacimiento) {
          res.FechaNacimiento = moment(new Date(res.FechaNacimiento)).format("YYYY-MM-DD");
        }
        return res;
      });
      if (happyBirthdayList.length > 0) {
        elementInput.hide = false;
        Object.keys(happyBirthdayList[0]).map((key) => {
          titulos.push(key);
        });
        elementInput.data = happyBirthdayList;
        elementInput.columnas = titulos;
      } else {
        this.ListComponentesTipo2 = this.ListComponentesTipo2.filter((opt) => elementInput.codigo != opt.codigo);
      }

    });
  }

  /*
   ** Listar Las citas Que han sido Termiandas, Status = 3
   */
  fetchListCitasTerminadas(elementInput: any) {
    let statusCita = 3;
    this.citaService.citasByToday(statusCita).subscribe((res) => {
      //this.listCitasTerminadas = res.data.citasByToday;
    });
  }

  /* ________________________________________
   * FIN Metodos Listado.
   * ________________________________________*/





  /*
  ** Cantidad de citas Atentidas por mes durante el año.
  */
  getNumCitasAtendidasbyMonthThisYear() {
    this.citaService.getNumCitasAtendidasbyMonthThisYear().subscribe((res) => {
      let list = res.data.getNumCitasAtendidasbyMonthThisYear;
      let monthNum = 9;
      var shortName = moment.monthsShort(monthNum - 1);

      let obj = {
        data: [],
        categories: []
      };
      list.map((res) => {
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
  * ________________________________________
   *  Metodos Relacionados con los contadores o Cantidad
   * ________________________________________
  */
   /** cantidad total de pacientes del sistema*/
   totalPacientes(elementInput: any) {
    this.pacienteService.getNumPacientes().subscribe((res) => {
      const list = res.data.getNumPacientes;
      elementInput.data = [];
      elementInput.data = list.count;
      this.totalPacientesClinica = list.count;
    });
  }
  citasDelDia(elementInput: any) {
    this.totalCitasDelDia = 13;
    let statusCita = 99;
    this.citaService.citasByTodayCount(statusCita).subscribe((res) => {
      let list = res.data.citasByToday;
      this.totalCitasDelDia = list.length;
      elementInput.data = this.totalCitasDelDia;
    });
  }
  citasDelDiaConfirmadas(elementInput: any) {
    let statusCita = 2;
    this.citaService.citasByTodayCount(statusCita).subscribe((res) => {
      let list = res.data.citasByToday;
      this.totalCitasConfirmadas = list.length;
      elementInput.data = this.totalCitasConfirmadas;
    });
  }
  citasAtendidas(elementInput: any) {
    this.totalCitasAtendidas = 3;
    let statusCita = 3;
    this.citaService.citasByTodayCount(statusCita).subscribe((res) => {
      let list = res.data.citasByToday;
      this.totalCitasAtendidas = list.length;
      elementInput.data = this.totalCitasAtendidas;
    });
  }
  citasCanceladas(elementInput: any) {
    let statusCita = 6;
    this.citaService.citasByTodayCount(statusCita).subscribe((res) => {
      let list = res.data.citasByToday;
      this.totalCitasCanceladas = list.length;
      elementInput.data = this.totalCitasCanceladas;
    });
  }
  /* ________________________________________
   * FIN Metodos contadores o Cantidad.
   * ________________________________________*/







  runOnClick = (args: any): void => {    
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
