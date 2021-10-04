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
    if (objeTosend) {
      filter = `(filter: {
        CedulaPaciente: "${objeTosend}"
      })`;
    }
    params = this.toolService.getParams(filter, ordenamiento);

    let body = {
      query: `{
        evolucionesEsterilizacion(filter: {evolucionId: "2", pacienteId: "1"}) {
          id
          evolucionId
          pacienteId
          itemIdEsterilizacion
          observaciones
          createdAt
        }
      }
      `,
    };

    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
}
