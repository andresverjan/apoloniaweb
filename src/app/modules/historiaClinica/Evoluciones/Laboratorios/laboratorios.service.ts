import { Injectable } from "@angular/core";
import * as Globals from "../../../core/globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { from, Observable } from "rxjs";
import { ToolsService } from "../../../core/services/tools.service";
import { HttpService }  from "../../../core/services/HttpService";

@Injectable({
  providedIn: "root",
})
export class LaboratoriosService {
  serverUrl: string;

  constructor(private http: HttpClient, private toolService: ToolsService, private httpService: HttpService) {
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
      //TODO: Add Params PacienteId and EvolucionId
      query: `{
        evolucionesLaboratorios(filter: {evolucionId: "1", pacienteId: "1"}) {
          id
          evolucionId
          pacienteId
          especialistaId
          observaciones
          createdAt
        }
      }
      `,
    };
    return this.httpService.callApi(body);
     
     
  }
  
}
