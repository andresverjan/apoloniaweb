import { Injectable } from "@angular/core";
import * as Globals from "../core/globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
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
                usuarioId: ${objeTosend.usuarioId}
            }) {     
                title
            }
          }
          `,
    };
    return this.httpService.callApi(body);
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
    return this.httpService.callApi(body);
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
    return this.httpService.callApi(body);
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
    return this.httpService.callApi(body);
  }

  deleteCita(id): Observable<any> {
    let body = {
      query: `
            mutation {
                deleteCita(cita: {id: ${id}}) 
            }
            `,
    };
    return this.httpService.callApi(body);
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
    return this.httpService.callApi(body);
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
    return this.httpService.callApi(body);
  }

  citasByToday(estadoId): Observable<any> {
    let body = {
      query: `{
        citasByToday(filter: {estado: ${estadoId}}) {
          Cedula
          Nombres
          Apellidos
          start
        }
      }`,
    };
    return this.httpService.callApi(body);
  }

  citasByTodayCount(estadoId?): Observable<any> {
    let filter = ``;
    if (estadoId) {
      filter = `(filter: {`;    
        filter +=   `estado: ${estadoId}`;
      filter += '})';
    };

    let body = {
      query: `{
        citasByToday ${filter} {
          Cedula
        }
      }`,
    };
    return this.httpService.callApi(body);
  }

  getNumCitasAtendidasToday(): Observable<any> {
    let body = {
      query: `{
        getNumCitasAtendidasToday {
            count
          }
        }`,
    };
    return this.httpService.callApi(body);
  }

  getNumCitasAtendidasbyMonthThisYear(): Observable<any> {
    let body = {
      query: `{
          getNumCitasAtendidasbyMonthThisYear {
            count
            MONTH
          }
        }`,
    };
    return this.httpService.callApi(body);
  }


  






}
