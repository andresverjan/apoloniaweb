import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { EsterilizacionesService } from '../../../esterilizaciones/esterilizaciones.service';
import { ChartComponent } from "ng-apexcharts";
import { ChartOptions } from './piechart.type';

@Component({
  selector: "app-piechart",
  templateUrl: "./piechart.component.html",
  styleUrls: ["./piechart.component.scss"],
})
export class PieChartComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;

  @Input() data: any;
  @Input() label: string;
  @Input() icono: string = "account_balance";
  @Input() bgColor: string;
  @Input() fontColor: string;
  @Input() valor: string;
  @Input() size: string;
  @Input() default: string;
  @Input() chartOptions: Partial<ChartOptions> = {
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
      '#9C27B1',
      '#9C27B9',
      '#9C27B3',
    ]
  };

  @Output() valSelected = new EventEmitter<string>();
  @Input() onClickFunction: (args?: any) => void;

  constructor(public esterilizacionesService: EsterilizacionesService) {
  
  }

  ngOnInit() {
    console.log(this.bgColor);
  }

  runOnChange(valSelect: any) {
    this.valSelected.emit(valSelect);
  }

  onClick() {
    if (typeof (this.onClickFunction) == "function") {
      this.onClickFunction(this.label);
    }
  }
}
