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
                title: "${objeTosend.title}",
                start: "${objeTosend.start}",
                end:"${objeTosend.end}",
                odontologoId:${objeTosend.odontologoId},
                horaIngreso:"${objeTosend.horaIngreso}",
                horaSalida:"${objeTosend.horaSalida}",
                status:${objeTosend.status},
                pacienteId: ${objeTosend.pacienteId},
                servicioId: ${objeTosend.servicioId},
                observaciones: "${objeTosend.observaciones}",
            }) {     
                title
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
                title: "${objeTosend.title}",
                start: "${objeTosend.start}",
                end:"${objeTosend.end}",
                odontologoId:${objeTosend.odontologoId},
                horaIngreso:"${objeTosend.horaIngreso}",
                horaSalida:"${objeTosend.horaSalida}",
                status:${objeTosend.status},
                pacienteId: ${objeTosend.pacienteId},
                servicioId: ${objeTosend.servicioId},
                observaciones: "${objeTosend.observaciones}",
            }) {     
                title
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
              title
              start
              end
              odontologoId
              horaIngreso
              horaSalida
              status
              pacienteId
              servicioId
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
