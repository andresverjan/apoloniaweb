import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ToolsService } from "../../core/services/tools.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class EvolucionesService {

  constructor(private http: HttpClient, private toolService: ToolsService) {}

  getAll(objeTosend?: any): Observable<any> {
    let params = "";
    let ordenamiento = "";
    let filter = "";
    //si trae filtro
    if (objeTosend) {
      filter = `(filter: {
        Cedula: "${objeTosend}"
      })`;
    }

    params = this.toolService.getParams(filter, ordenamiento);

    let body = {
      query: `{
        getCitasHC ${filter}{
          Paciente
          Cedula
          IdOdontologo
          Fecha
        }
      }
      `,
    };

    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(environment.apiUrl, body, { headers: headers });
  }
}
