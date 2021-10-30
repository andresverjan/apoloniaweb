import { Injectable } from "@angular/core";
import * as Globals from "../core/globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ToolsService } from "../core/services/tools.service";
import { HttpService } from "../core/services/HttpService";
import * as moment from "moment";

@Injectable({
  providedIn: "root",
})
export class EgresosService {
  serverUrl: string;

  constructor(private httpService: HttpService, private toolService: ToolsService) {
    this.serverUrl = Globals.SERVER;
  }

  getAll(egreso?: any): Observable<any> {
    let params = "";
    let ordenamiento = "";
    let pagination = `
    pagination: {
      pagina: ${egreso.pagina}
      limite: ${egreso.limite}
    }`;
    let filtro = `${pagination}, \n`;

    if (
      (egreso.filter["T17Factura"] != undefined &&
        egreso.filter["T17Factura"] != null) ||
      (egreso.filter["T17FechaIni"] != undefined &&
        egreso.filter["T17FechaIni"] != null &&
        egreso.filter["T17FechaFin"] != undefined &&
        egreso.filter["T17FechaFin"] != null)
    ) {
      filtro =
        filtro +
        `filter: {
         ${Object.keys(egreso.filter).map((prop) => {
          if (
            typeof egreso.filter[prop] === "string" ||
            egreso.filter[prop] instanceof String
          ) {
            return `${prop} : "${egreso.filter[prop]}"`;
          } else {
            return `${prop} : ${egreso.filter[prop]}`;
          }
        })}
        },
        `;
    }

    params = this.toolService.getParams(filtro, ordenamiento);

    let body = {
      query: `{
        egresosProgramados ${params}{
          egresosProgramados {
            nombre
            T17Factura
            T17RF
            T17Fecha
            T17Valor
            T17Soporte
            T17FormaPago
            T17Total
            T17Dctos
            T17Proveedor
            T17Observacion
            T17Clasificacion
          }
          totalRegistros
        }
      }`,
    };

    return this.httpService.callApi(body);
  }
  getAllEgresosPagados(egreso?: any): Observable<any> {
    let params = "";
    let ordenamiento = "";
    let defaultFechaI="";
    let defaultFechaF="";

    let startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
    let endOfMonth   = moment().endOf('month').format('YYYY-MM-DD');

    let pagination = `    
    pagination: {
      pagina: ${egreso.pagina}
      limite: ${egreso.limite}
    }`;
    let filtro = `${pagination}, \n`;

    if (
      (egreso.filter["T17Factura"] != undefined &&
        egreso.filter["T17Factura"] != null) ||
      (egreso.filter["T17FechaIni"] != undefined &&
        egreso.filter["T17FechaIni"] != null &&
        egreso.filter["T17FechaFin"] != undefined &&
        egreso.filter["T17FechaFin"] != null)
    ) {
      filtro =
        filtro +
        `filter: {
         ${Object.keys(egreso?.filter).map((prop) => {
          if (
            typeof egreso.filter[prop] === "string" ||
            egreso.filter[prop] instanceof String
          ) {
            return `${prop} : "${egreso.filter[prop]}"`;
          } else {
            return `${prop} : ${egreso.filter[prop]}`;
          }
        })}
        },
        `;
    }else{
      console.log("los datos de fechas son vacios... ");
      filtro =
        filtro +
        `filter: {
          T17FechaIni : "${startOfMonth}",
          T17FechaFin : "${endOfMonth}"
        },
        `;
    }

    params = this.toolService.getParams(filtro, ordenamiento);

    let body = {
      query: `{
        egresos ${params}{
          egresos {
            T17Factura
            T17RF
            T17Fecha
            T17Valor
            T17Soporte
            T17FormaPago
            T17Total
            T17Dctos
            T17Proveedor
            T17Observacion
            T17Clasificacion
          }
          totalRegistros
        }
      }`,
    };

    return this.httpService.callApi(body);
  }

  createEgresos(egreso): Observable<any> {
    let body = {
      query: `
      mutation {
        createEgresos (egreso: {          
          T17Factura: "${egreso.T17Factura}",
          T17Fecha: "${egreso.T17Fecha}",
          T17Valor: ${egreso.T17Valor},
          T17Soporte: "${egreso.T17Soporte}",
          T17FormaPago: "${egreso.T17FormaPago}",
          T17Total: ${egreso.T17Total},
          T17Dctos: ${egreso.T17Dctos},
          T17Proveedor: "${egreso.T17Proveedor}",
          T17Observacion: "${egreso.T17Observacion}",
          T17Clasificacion: "${egreso.T17Clasificacion}",
          T17IVA:${egreso.T17IVA},
          T17ICA:${egreso.T17ICA},
          T17RF: ${egreso.T17RF},
        })
      }
      `,
    };
    return this.httpService.callApi(body);
  }

  createEgresosProgramados(egreso): Observable<any> {
    let body = {
      query: `
      mutation {
        createEgresosProgramados (egresoProgramado: {
          nombre: "${egreso.nombre}",
          T17Factura: "${egreso.T17Factura}",
          T17Fecha: "${egreso.T17Fecha}",
          T17Valor: ${egreso.T17Valor},
          T17Soporte: "${egreso.T17Soporte}",
          T17FormaPago: "${egreso.T17FormaPago}",
          T17Total: ${egreso.T17Total},
          T17Dctos: ${egreso.T17Dctos},
          T17Proveedor: "${egreso.T17Proveedor}",
          T17Observacion: "${egreso.T17Observacion}",
          T17Clasificacion: "${egreso.T17Clasificacion}",
          T17IVA:${egreso.T17IVA},
          T17ICA:${egreso.T17ICA},
          T17RF: ${egreso.T17RF},
        })
      }
      `,
    };

    return this.httpService.callApi(body);
  }

  updateEgresosProgramados(egreso): Observable<any> {
    let body = {
      query: `
      mutation {
        updateEgresosProgramados (egresoProgramado: {
          nombre: "${egreso.nombre}",
          T17Factura: "${egreso.T17Factura}",
          T17Fecha: "${egreso.T17Fecha}",
          T17Valor: ${egreso.T17Valor},
          T17Soporte: "${egreso.T17Soporte}",
          T17FormaPago: "${egreso.T17FormaPago}",
          T17Total: ${egreso.T17Total},
          T17Dctos: ${egreso.T17Dctos},
          T17Proveedor: "${egreso.T17Proveedor}",
          T17Observacion: "${egreso.T17Observacion}",
          T17Clasificacion: "${egreso.T17Clasificacion}",
          T17IVA:${egreso.T17IVA},
          T17ICA:${egreso.T17ICA},
          T17RF:${egreso.T17RF}
        })
      }
      `,
    };
    return this.httpService.callApi(body);
  }

  deleteEgresosProgramados(factura): Observable<any> {
    let body = {
      query: `
        mutation {
          deleteEgresosProgramados (egresoProgramado: {T17Factura: "${factura}"})
        }
        `,
    };
    return this.httpService.callApi(body);
  }
}
