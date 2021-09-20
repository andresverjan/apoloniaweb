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

    if (objeTosend) {
      filter = `(filter: {`;
      if(objeTosend.nombre) {
        filter +=   `nombre: "${objeTosend.nombre}"`;
      }
      if(objeTosend.CedulaPaciente) {
        filter +=   `${objeTosend.nombre? "," : ""} CedulaPaciente: "${objeTosend.CedulaPaciente}"`;
      }
      filter += '})';
    }

    params = this.toolService.getParams(filter, ordenamiento);
    let body = {
      query: `{
        esterilizaciones ${filter}{
          id: T27Consecutivo
          CedulaPaciente
          nombre: T27Campo9
          T27Fecha
        }
      }
      `,
    };

    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(environment.apiUrl, body, { headers: headers });
  }

  saveSterilizations(obj: any): Observable<any> {
    const { steril } = obj;
    let body = {
      query: `mutation{
        saveSterilizations(esteriliz: {
          T27Fecha: "${steril.T27Fecha}",
          sede: "${steril.sede}",
          motivo: "${steril.motivo}",
          tipo:"${steril.tipo}",
          esporas:"${steril.esporas}",
          dispmed:"${steril.dispMed}",
          tipEmp:"${steril.tipEmp}",
          timeMin:${steril.timeMin},
          temper:${steril.temper},
          presion:${steril.presion},
          observ:"${steril.observ}",
          cant:${steril.cant}
        })
          {
            id
          }
        }`,
    };

    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(environment.apiUrl, body, { headers: headers });
  }
}
