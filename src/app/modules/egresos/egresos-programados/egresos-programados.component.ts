import { Component, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { ToolsService } from "../../core/services/tools.service";
import { EgresosService } from "../egresos.service";

@Component({
  selector: "app-egresos-programados",
  templateUrl: "./egresos-programados.component.html",
})
export class EgresosProgramadosComponent implements OnInit {
  public egresos: any = [];
  public totalRegistros: number = 0;
  public pageSize = 10;
  public pageNumber: number = 1;
  public pageSizeOptions = [5, 10, 20, 30];
  public queryOptions = {};

  handlePageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.findBy();
  }
  ngOnInit() {
    this.findBy();
  }

  findBy() {
    this.queryOptions = {
      filter: {},
      pagina: this.pageNumber,
      limite: this.pageSize,
    };
    this.fecthEgresosPagados(this.queryOptions);
  }

  constructor(
    public egresosService: EgresosService,
    public toolService: ToolsService
  ) {}

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
}
