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
    let pagination = `
    pagination: {
      pagina: ${objeTosend.pagina}
      limite: ${objeTosend.limite}
    }`;
    let filter = `${pagination}, \n`;

    if (objeTosend.filter) {
      if ((objeTosend.filter.fechini != undefined && objeTosend.filter.fechini != null &&
            objeTosend.filter.fechend != undefined && objeTosend.filter.fechend != null)) {
        if(objeTosend.filter.disponible) {
          filter +=   `filter: {disponible: "${objeTosend.filter.disponible}",`;
          filter += ` fechini: "${objeTosend.filter.fechini}", fechend: "${objeTosend.filter.fechend}"}`;
        }
        else{
          filter += `filter: { fechini: "${objeTosend.filter.fechini}", fechend: "${objeTosend.filter.fechend}"}`;
        }
      }
      else if(objeTosend.filter.disponible) {
        filter +=   `filter: { disponible: "${objeTosend.filter.disponible}"}`;
      }
    }
    console.log("FILTER-->>:", filter)
    params = this.toolService.getParams(filter, ordenamiento);
    console.log("params:", params)
    let body = {
      query: `{
        esterilizaciones ${params}{
          totalRegistros
          list{ id
                disponible
          		  T27Fecha
                sede
                motivo
                tipo
                esporas
                timeMin
                temper
                presion
                observ
          }

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
          sede: ${steril.sede.replace(/'/g, '')},
          motivo: ${steril.motivo.replace(/'/g, '')},
          tipo: ${steril.tipo.replace(/'/g, '')},
          esporas: "${steril.esporas.replace(/'/g, '')}",
          dispMed: ${steril.dispMed.replace(/'/g, '')},
          tipEmp: ${steril.tipEmp.replace(/'/g, '')},
          timeMin: ${steril.timeMin},
          temper: ${steril.temper},
          presion: ${steril.presion},
          observ: "${steril.observ}",
          cantidad: ${steril.cant}
        }){
            id
          }
        }`,
    };

    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(environment.apiUrl, body, { headers: headers });
  }

  updateEsteriliz(obj: any): Observable<any> {
    const { steril } = obj;
    let body = {
      query: `mutation {
        updateSterilizations (esterilizacion: {
          id:       ${steril.id},
          T27Fecha: "${steril.T27Fecha}",
          sede: ${steril.sede.replace(/'/g, '')},
          motivo: ${steril.motivo.replace(/'/g, '')},
          tipo: ${steril.tipo.replace(/'/g, '')},
          esporas:"${steril.esporas.replace(/'/g, '')}",
          dispMed:${steril.dispMed.replace(/'/g, '')},
          tipEmp:${steril.tipEmp.replace(/'/g, '')},
          timeMin:${steril.timeMin},
          temper:${steril.temper},
          presion:${steril.presion},
          observ:"${steril.observ}",
          cantidad:${steril.cant}
        }){
          id
        }
      }`,
    };

    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(environment.apiUrl, body, { headers: headers });
  }

  getDispAvails(objeTosend: any): Observable<any> {
    let body = {
      query: `{ dispositivos(esterilizacionId: ${objeTosend}) { id nombre } }`
    }

    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(environment.apiUrl, body, { headers: headers })
  }

  getAssignedDevices(objeTosend: any): Observable<any> {
    let body = {
      query: `{ devicesByEsterilizationId(id: ${objeTosend}) { id nombre } }`
    }

    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(environment.apiUrl, body, { headers: headers })
  }
}
