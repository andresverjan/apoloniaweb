import { Injectable } from "@angular/core";
import * as Globals from "../globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { HttpService } from "./HttpService";
import { ToolsService } from "./tools.service";

@Injectable({
  providedIn: "root",
})
export class OdontologosService {
  constructor(private http: HttpClient, private toolService: ToolsService, private httpService: HttpService) {
  }

  getAll(objectToSend): Observable<any> {
    let filtro = "";
    let params = "";
    let ordenamiento = "";

    if (objectToSend != null && objectToSend != undefined && objectToSend) {
      filtro = `filter: {
         ${Object.keys(objectToSend).map((prop) => {
           if (
             typeof objectToSend[prop] === "string" ||
             objectToSend[prop] instanceof String
           ) {
             return `${prop} : "${objectToSend[prop]}"`;
           } else {
             return `${prop} : ${objectToSend[prop]}`;
           }
         })}
        }`;
    }

    params = this.toolService.getParams(filtro, ordenamiento);

    let body = {
      query: `query{
            odontologos ${params}{
              id
              Nombres
              Apellidos
              Especialidad
              Titulo
              Registro
              PorcentajePago
              Usuario
              PorcentajePagoEsp
              Unidad
              PorcentajeLab
              FecNac
            }
          }`,
    };
    return this.httpService.callApi(body);
     
     
  }
}
