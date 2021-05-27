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
        }
      }`,
    };

    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  createEgresos(objeTosend): Observable<any> {
    let body = {
      query: `
      mutation {
        createEgreso (egreso: {
          T17RF: "${objeTosend.T17RF}",
          T17Fecha: "${objeTosend.T17Fecha}",
          T17Valor: "${objeTosend.T17Valor}",       
        }) {     
           T17Fecha
        }  
      }
      `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  updateEgresos(objeTosend): Observable<any> {
    let body = {
      query: `
      mutation {
        updateEgreso (egreso: {
           T17RF: "${objeTosend.T17RF}",
           T17Fecha: "${objeTosend.T17Fecha}",
           T17Valor: "${objeTosend.T17Valor}",
           
        }) {     
           T17Fecha
        }  
      }
      `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  deleteEgresos(id): Observable<any> {
    let body = {
      query: `
        mutation {
          deleteEgreso (egreso: {id: "${id}"}) {
            id
          }
        }
        `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
}
