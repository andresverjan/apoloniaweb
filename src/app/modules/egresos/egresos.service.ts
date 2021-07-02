import { Injectable } from "@angular/core";
import * as Globals from "../core/globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ToolsService } from "../core/services/tools.service";

@Injectable({
  providedIn: "root",
})
export class EgresosService {
  serverUrl: string;

  constructor(private http: HttpClient, private toolService: ToolsService) {
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

    // verifica que las propiedades existan para poder filtrar
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
          }
          totalRegistros
        }
      }`,
    };

    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  createEgreso(egreso): Observable<any> {
    let body = {
      query: `
      mutation {
        createEgresos (egreso: {
          T17Factura: "${egreso.T17Factura}",
          T17RF: ${egreso.T17RF},
          T17Fecha: "${egreso.T17Fecha}",
          T17Valor: ${egreso.T17Valor},       
          T17Soporte: "${egreso.T17Soporte}",
          T17FormaPago: "${egreso.T17FormaPago}",
          T17Total: ${egreso.T17Total},
          T17Dctos: ${egreso.T17Dctos},
          T17Proveedor: "${egreso.T17Proveedor}",
          T17Observacion: "${egreso.T17Observacion}",
        })
      }
      `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  updateEgreso(egreso): Observable<any> {
    let body = {
      query: `
      mutation {
        updateEgresos (egreso: {
          T17Factura: "${egreso.T17Factura}",
          T17RF: ${egreso.T17RF},
          T17Fecha: "${egreso.T17Fecha}",
          T17Valor: ${egreso.T17Valor},       
          T17Soporte: "${egreso.T17Soporte}",
          T17FormaPago: "${egreso.T17FormaPago}",
          T17Total: ${egreso.T17Total},
          T17Dctos: ${egreso.T17Dctos},
          T17Proveedor: "${egreso.T17Proveedor}",
          T17Observacion: "${egreso.T17Observacion}",
        }) 
      }
      `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  deleteEgreso(factura): Observable<any> {
    let body = {
      query: `
        mutation {
          deleteEgresos (egreso: {T17Factura: "${factura}"}) 
        }
        `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
}
