import { Injectable } from "@angular/core";
import * as Globals from "../core/globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CitaService {
  serverUrl: string;
  constructor(private http: HttpClient) {
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
                usuarioId: ${objeTosend.usuarioId}
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
                usuarioId: ${objeTosend.usuarioId}
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
              usuarioId
            }
          }
            `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
  getCita(id): Observable<any> {
    let body = {
      query: `
          query {
            getCita(cita:{id:${id}}){
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
              usuarioId
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
  getStatusSCitas(): Observable<any> {
    let body = {
      query: `
          {
            statusCitas{
              id
              nombre
              color
              textColor
              borderColor
            }
          }
            `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
  sendReminder(objeTosend): Observable<any> {
    let body = {
      query: `
      mutation{
        sendReminder(email:{
          USUARIO_CORREO: "anfeldim7@gmail.com"
          cita: {
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
            usuarioId: ${objeTosend.usuarioId}
          }
        })
      }
            `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");

    return this.http.post(this.serverUrl, body, { headers: headers });
  }
}
