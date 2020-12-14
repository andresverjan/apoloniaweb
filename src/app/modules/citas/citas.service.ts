import { Injectable } from "@angular/core";
import * as Globals from "../core/globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Campo } from "../core/interfaces/campoTable.interace";
import { HttpService } from "../core/services/HttpService";

@Injectable({
  providedIn: "root",
})
export class CitaService {
  serverUrl: string;
  constructor(private http: HttpClient, private httpService: HttpService) {
    this.serverUrl = Globals.SERVER;
  }

  createCita(objeTosend): Observable<any> {
    let body = {
      query: `
          mutation {
            createCita (cita: {
                TITLE: "${objeTosend.title}",
                START: "${objeTosend.start}",
                END:"${objeTosend.end}",
                odontologoId:${objeTosend.odontologoId},
                horaIngreso:"${objeTosend.horaIngreso}",
                horaSalida:"${objeTosend.horaSalida}",
                asistencia:${objeTosend.asistencia},
                cancelado: ${objeTosend.cancelado},
                observaciones: "${objeTosend.observaciones}",
            }) {     
                TITLE
            }  
          }
          `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  updateCita(objeTosend): Observable<any> {
    let body = {
      query: `
          mutation {
            updateCita (cita: {
                id: ${objeTosend.id},
                TITLE: "${objeTosend.title}",
                START: "${objeTosend.start}",
                END:"${objeTosend.end}",
                horaIngreso:"${objeTosend.horaIngreso}",
                horaSalida:"${objeTosend.horaSalida}",
                asistencia:${objeTosend.asistencia},
                cancelado: ${objeTosend.cancelado},
                observaciones: "${objeTosend.observaciones}",
            }) {     
                TITLE
            }  
          }
          `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
  getCitasByOdontologoId(id): Observable<any> {
    let body = {
      query: `
          query {
            getCitasByOdontologoId(odontologoId:${id}){
              id
              TITLE
              START
              END
              odontologoId
              horaIngreso
              horaSalida
              asistencia
              cancelado
              observaciones
            }
          }
            `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  deleteCita(id): Observable<any> {
    let body = {
      query: `
            mutation {
                deleteCita(cita: {id: ${id}}) 
            }
            `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
}
