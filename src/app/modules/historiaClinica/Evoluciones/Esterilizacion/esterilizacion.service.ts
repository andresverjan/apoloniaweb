import { Injectable } from "@angular/core";
import * as Globals from "../../../core/globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ToolsService } from "../../../core/services/tools.service";

@Injectable({
  providedIn: "root",
})
export class EsterilizacionService {
  serverUrl: string;

  constructor(private http: HttpClient, private toolService: ToolsService) {
    this.serverUrl = Globals.SERVER;
  }

  getAll(): Observable<any> {
    // let filtro = "";
    // let params = "";
    // let ordenamiento = "";

    // if (objeTosend != null && objeTosend != undefined && objeTosend) {
    //   filtro = `filter: {
    //      ${Object.keys(objeTosend).map((prop) => {
    //        if (
    //          typeof objeTosend[prop] === "string" ||
    //          objeTosend[prop] instanceof String
    //        ) {
    //          return `${prop} : "${objeTosend[prop]}"`;
    //        } else {
    //          return `${prop} : ${objeTosend[prop]}`;
    //        }
    //      })}
    //     }`;
    // }

    // params = this.toolService.getParams(filtro, ordenamiento);

    let body = {
      query: `{
        esterilizaciones {
          T27Fecha
          T27Campo9
          T27Campo24
          T27Auditoria
          T27Consecutivo
        }
      }
      `,
    };

    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
}
