import { Injectable } from "@angular/core";
import * as Globals from "../../modules/core/globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ToolsService } from "../core/services/tools.service";
import { HttpService } from "../core/services/HttpService";

@Injectable({
  providedIn: "root",
})
export class MascarasService {

  constructor(private http: HttpClient, private toolService: ToolsService , private httpService: HttpService) {
  }

  getMascaras():  Observable<any> {
    let body = {
      query: `{
        mascaras {
          id
          nombre
          descripcion
          active
          createdBy
        }
      }
      `,
    };
    return this.httpService.callApi(body);
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
        mascaras ${params}{
          id
          nombre
          descripcion
          active
          createdBy
        }
      }
      `,
    };
    return this.httpService.callApi(body);
     
     
  }
}
