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
    private httpService: HttpService
    ) { }

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
        if (objeTosend.filter.disponible) {
          filter += `filter: {disponible: "${objeTosend.filter.disponible}",`;
          filter += ` fechini: "${objeTosend.filter.fechini}", fechend: "${objeTosend.filter.fechend}"}`;
        }
        else {
          filter += `filter: { fechini: "${objeTosend.filter.fechini}", fechend: "${objeTosend.filter.fechend}"}`;
        }
      }
      else if (objeTosend.filter.disponible) {
        filter += `filter: { disponible: "${objeTosend.filter.disponible}"}`;
      }
    }
    params = this.toolService.getParams(filter, ordenamiento);
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
    return this.httpService.callApi(body);
    //let headers = new HttpHeaders().set("Content-Type", "application/json");
    //return this.http.post(environment.apiUrl, body, { headers: headers });
  }

  saveSterilizations(obj: any): Observable<any> {
    const { sterilization, devices } = obj;

    let body = {
      query: `mutation{
        saveSterilizations(
          esterilizacion :{
            sterilization : {
              T27Fecha: "${sterilization.T27Fecha}",
              sede: ${sterilization.sede.replace(/'/g, '')},
              motivo: ${sterilization.motivo.replace(/'/g, '')},
              tipo: ${sterilization.tipo.replace(/'/g, '')},
              esporas: "${sterilization.esporas.replace(/'/g, '')}",
              timeMin: ${sterilization.timeMin},
              temper: ${sterilization.temper},
              presion: ${sterilization.presion},
              observ: "${sterilization.observ}",
            }
            devices : [
              ${devices.map((item: any) => {
                return `{
                  id: ${item.id}
                  tiposEmpaqueEsterilizacionId: ${item.tiposEmpaqueEsterilizacionId.replace(/'/g, '')}
                    cantidad: ${item.cantidad}
                    }`;
              })}
            ]
          }
        ){
            id
          }
        }`,
    };

    return this.httpService.callApi(body);
    //let headers = new HttpHeaders().set("Content-Type", "application/json");
    //return this.http.post(environment.apiUrl, body, { headers: headers });
  }

  updateEsteriliz(obj: any): Observable<any> {
    const { steril, devices } = obj;
    let body = {
      query: `mutation {
        updateSterilizations(
          esterilizacion: {
            sterilization: {
              id:       ${steril.id},
              T27Fecha: "${steril.T27Fecha}",
              sede: ${steril.sede.replace(/'/g, '')},
              motivo: ${steril.motivo.replace(/'/g, '')},
              tipo: ${steril.tipo.replace(/'/g, '')},
              esporas:"${steril.esporas.replace(/'/g, '')}",
              timeMin:${steril.timeMin},
              temper:${steril.temper},
              presion:${steril.presion},
              observ:"${steril.observ}"
            }
            devices: [
              ${devices.map((item: any) => {
                return `{
                    id: ${Number.parseInt(item.id)}
                    tiposEmpaqueEsterilizacionId: ${item.tiposEmpaqueEsterilizacionId.replace(/'/g, '')}
                    cantidad: ${item.cantidad}
                    }`;
              })}
            ]
          }
        ){
          id
        }
      }`,
    };

    return this.httpService.callApi(body);
  }

  getDispAvails(objeTosend: any): Observable<any> {
    let body = {
      query: `{ dispositivos(esterilizacionId: ${objeTosend}) { id nombre } }`
    }
    return this.httpService.callApi(body);
  }

  getAssignedDevices(objeTosend: any): Observable<any> {
    let body = {
      query: `{ devicesByEsterilizationId(id: ${objeTosend}) {
        id
        nombre
        cantidad
        tiposEmpaqueEsterilizacionId } }`
    }

    return this.httpService.callApi(body);
  }
}
