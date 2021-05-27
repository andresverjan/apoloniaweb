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
          T17RF
          T17ICA
          T17IVA
          T17Cia
          T17Item
          T17CREE
          T17Fecha
          T17Valor
          T17Banco
        }
      }`,
    };

    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  listEgresos(objeTosend?): Observable<any> {
    let filter = "";
    if (objeTosend != null) {
      filter = `( filter: {`;
      filter += objeTosend.T17RF != "" ? `t17Rf: "${objeTosend.T17RF}` : "";
      filter += objeTosend.T17Fecha != "" ? `t17Fecha: "${objeTosend.T17Fecha}"` : "";
      filter +=
        objeTosend.T17Valor != "" ? `lastName: "${objeTosend.T17Valor}"` : "";
      filter += `} )`;
    }

    let body = {
      query: `{egresos  {T17RF,T17Fecha,T17Valor,T17Banco,T17CREE}}`,
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
