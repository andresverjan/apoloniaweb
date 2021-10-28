import { ApexAxisChartSeries, ApexChart, ApexTitleSubtitle, ApexXAxis, ChartComponent } from "ng-apexcharts";

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    title: ApexTitleSubtitle;
    colors: string[];
    labels: string[];
  };

export type ChartOptionsPieDonut = {
    series: number[];
    chart: ApexChart;
    xaxis: ApexXAxis;
    title: ApexTitleSubtitle;
    colors: string[];
    labels: string[];
  };