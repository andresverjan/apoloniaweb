import { Component, OnInit } from "@angular/core";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { PageEvent } from "@angular/material/paginator";
import * as moment from "moment";
import { ToolsService } from "../../core/services/tools.service";
import { EgresosService } from "../egresos.service";

import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";

const DATE_FORMATS = {
  parse: {
    dateInput: ["YYYY-MM-DD"],
  },
  display: {
    dateInput: "YYYY-MM-DD",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};

@Component({
  selector: "app-egresos-pagados",
  templateUrl: "./egresos-pagados.component.html",
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
  ],
})
export class EgresosPagadosComponent implements OnInit {
  public egresos: any = [];
  public totalRegistros: number = 0;
  public pageSize = 10;
  public pageNumber: number = 1;
  public pageSizeOptions = [5, 10, 20, 30];
  public queryOptions = {};
  public filter: any = {};

  handlePageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.findBy();
  }
  ngOnInit() {
    this.findBy();
  }

  findBy() {
    console.log(this.filter);
    this.queryOptions = {
      filter: this.filter,
      pagina: this.pageNumber,
      limite: this.pageSize,
    };
    this.fecthEgresosPagados(this.queryOptions);
  }

  constructor(
    public egresosService: EgresosService,
    public toolService: ToolsService
  ) { }

  fecthEgresosPagados(queryOptions) {
    this.egresosService
      .getAllEgresosPagados(queryOptions)
      .subscribe(({ data }) => {
        const { egresos } = data;
        this.egresos = egresos.egresos;
        this.totalRegistros = egresos.totalRegistros;
      });
  }
  formatCurrency(number: number): string {
    return this.toolService.formatCurrency(number);
  }


  onDateChangeInicial(event: MatDatepickerInputEvent<Date>) {
    const dateValue = moment(new Date(event.value)).format("YYYY-MM-DD");
    this.filter["T17FechaIni"] = dateValue;
    console.log(this.filter["T17FechaIni"]);
    console.log(this.filter["T17FechaFin"]);
    if (this.filter["T17FechaFin"] != undefined &&
      this.filter["T17FechaFin"] != '' &&
      this.filter["T17FechaIni"] != undefined &&
      this.filter["T17FechaIni"] != ''
    ) {
      this.findBy();
    }
  }

  onDateChangeFinal(event: MatDatepickerInputEvent<Date>) {
    console.log("event.value: " + event.value);
    this.filter["T17FechaFin"] = moment(new Date(event.value)).utc().format("YYYY-MM-DD");
    console.log(this.filter["T17FechaFin"]);

    if (this.filter["T17FechaFin"] != undefined &&
      this.filter["T17FechaFin"] != '' &&
      this.filter["T17FechaIni"] != undefined &&
      this.filter["T17FechaIni"] != ''
    ) {
      this.findBy();
    }
  }

}
