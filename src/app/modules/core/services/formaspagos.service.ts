import { Injectable } from "@angular/core";
import * as Globals from "../globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ToolsService } from "./tools.service";
import { HttpService } from "./HttpService";

@Injectable({
  providedIn: "root",
})
export class FormasPagosService {
  serverUrl: string;
  constructor(private http: HttpClient, private toolService: ToolsService, private httpService: HttpService) {
    this.serverUrl = Globals.SERVER;
  }

  getAll(objeTosend?: any): Observable<any> {
    let filtro = "";
    let params = "";
    let ordenamiento = `order: {
          id: "ASC"
        }`;

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
         active:"S"
        }`;
    }

    params = this.toolService.getParams(filtro, ordenamiento);

    let body = {
      query: `{
        tipospagos ${params}  { 
          id, 
          nombre
        } 
      }
      `,
    };
    return this.httpService.callApi(body);
    //let headers = new HttpHeaders().set("Content-Type", "application/json");
    //return this.http.post(this.serverUrl, body, { headers: headers });
  }
}
