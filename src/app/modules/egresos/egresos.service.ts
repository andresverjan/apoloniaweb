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

  getAll(objeTosend?: any): Observable<any> {
    let filtro = "";
    let params = "";
    let ordenamiento = "";

    if (objeTosend != null && objeTosend != undefined && objeTosend) {
      filtro = `filter: {
         ${Object.keys(objeTosend).map((prop) => {
           if (
             typeof objeTosend[prop] === "string" ||
             objeTosend[prop] instanceof String
           ) {
             return `${prop} : "${objeTosend[prop]}"`;
           } else {
             return `${prop} : ${objeTosend[prop]}`;
           }
         })}
        }`;
    }

    params = this.toolService.getParams(filtro, ordenamiento);

    let body = {
      query: `{
        egresos ${params}{
          T17Fecha
          T17Factura
          T17Proveedor
          T17Valor
          T17Observacion

        }
      }`,
    };

    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  createEgreso(objeTosend): Observable<any> {
    let body = {
      query: `
      mutation {
        createEgresos (egreso: {
          T17Factura: "${objeTosend.T17Factura}",
          T17RF: "${objeTosend.T17RF}",
          T17Fecha: "${objeTosend.T17Fecha}",
          T17Valor: "${objeTosend.T17Valor}",       
          T17Observacion: "${objeTosend.T17Observacion}",

        })
      }
      `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  updateEgreso(objeTosend): Observable<any> {
    let body = {
      query: `
      mutation {
        updateEgresos (egreso: {
          T17Factura: "${objeTosend.T17Factura}",
           T17RF: "${objeTosend.T17RF}",
           T17Fecha: "${objeTosend.T17Fecha}",
           T17Valor: "${objeTosend.T17Valor}",
           T17Observacion: "${objeTosend.T17Observacion}", 
           T17Nivel1: "${objeTosend.T17Nivel1}", 
        }) 
      }
      `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  deleteEgreso(id): Observable<any> {
    let body = {
      query: `
        mutation {
          deleteEgresos (egreso: {T17Factura: "${id}"}) {
            T17Factura
          }
        }
        `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
}
