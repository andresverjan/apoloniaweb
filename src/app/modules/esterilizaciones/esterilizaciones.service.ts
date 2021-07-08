import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ToolsService } from '../core/services/tools.service';
import { environment } from "src/environments/environment";
import { HttpService } from '../core/services/HttpService';

@Injectable({
  providedIn: 'root'
})
export class EsterilizacionesService {

  constructor(private http: HttpClient,
              private toolService: ToolsService,
              private httpService: HttpService) { }

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
    params = this.toolService.getParams(filter, ordenamiento);
    let body = {
      query: `{
        esterilizaciones ${filter}{
          T27Consecutivo
          T27Campo9
          T27Fecha
        }
      }
      `,
    };

    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(environment.apiUrl, body, { headers: headers });
  }

  saveSterilizations(obj: any): Observable<any> {
    const { application, campos } = obj;

    let body = {
      query: `mutation{
        saveSterilizations
        {
          id
          nombre
          nombreTabla
          active
          createdBy
          createdAt
          updatedAt
        }
      }`,
    };

    return this.httpService.callApi(body);
  }
}
