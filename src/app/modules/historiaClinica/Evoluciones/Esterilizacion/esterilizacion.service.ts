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

  getAll(objeTosend?: any): Observable<any> {
    let params = "";
    let ordenamiento = "";
    let filter = "";
    //si trae filtro
    if (objeTosend) {
      filter = `(filter: {
        CedulaPaciente: "${objeTosend}"
      })`;
    }
    console.log("****CedulaPaciente*******", objeTosend + "***FILTER***" + filter);
    params = this.toolService.getParams(filter, ordenamiento);

    let body = {
      query: `{
        esterilizaciones ${filter}{
          T27Consecutivo
          T27Campo9
        }
      }
      `,
    };

    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
}
