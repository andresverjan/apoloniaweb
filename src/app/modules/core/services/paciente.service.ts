import { Injectable } from "@angular/core";
import * as Globals from "../globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { HttpService } from "./HttpService";
import { ToolbarInput } from "@fullcalendar/angular";
import { ToolsService } from "./tools.service";

@Injectable({
  providedIn: "root",
})
export class PacienteService {
  constructor(
    private http: HttpClient,
    private httpService: HttpService,
    private toolService: ToolsService
  ) { }

  getAll(objeTosend: any): Observable<any> {
    let filtro = "";
    let params = "";
    let ordenamiento = "";

    if (objeTosend != null && objeTosend != undefined && objeTosend) {
      filtro = `filter: {
         ${Object.keys(objeTosend).map((prop) => {
           if (
             typeof objeTosend[prop] === "string" ||
             objeTosend[prop] instanceof String
           ) {
             return `${prop} : "${objeTosend[prop]}"`;
           } else {
             return `${prop} : ${objeTosend[prop]}`;
           }
         })}
        }`;
    }

    params = this.toolService.getParams(filtro, ordenamiento);

    let body = {
      query: `query{
            pacientes ${params}{
              id
              Cedula
              TipoDoc
              Apellidos1
              Apellidos2
              Nombres1
              Nombres2
              Apellidos
              Nombres
              FechaNacimiento
              TelCasa
              TelOficina
              Direccion
              Ciudad
              Municipio
              FechaIngreso
              Sexo
              RemitidoPor
              Ocupacion
              Mail
              Contacto
              EstadoCivil
              Nacionaliad
              EPS
              EMPRESA_ID
            }
          }`,
    };
    return this.httpService.callApi(body);
  }
  getPacienteById(objeTosend: any): Observable<any> {
    let filter = "";
    if (objeTosend) {
      filter = `(id: ${objeTosend})`;
    }

    let body = {
      query: `
      {
        pacienteById${filter}{
          id
          Cedula
          Apellidos1
          Nombres1
          TelCasa
          TelOficina
          Contacto
          Ciudad
          Direccion
          Mail
          Apellidos
          Nombres
        }
      }`,
    };
    return this.httpService.callApi(body);
  }

  getNumPacientes(): Observable<any> {
    let body = {
      query: `
      {
        getNumPacientes {
          count
        }
      }`,
    };
    return this.httpService.callApi(body);
  }
  getHappyBirthdayList(): Observable<any> {
    let body = {
      query: `
      {
        getHappyBirthdayList {
          Nombres
          Apellidos
          FechaNacimiento
        }
      }`,
    };
    return this.httpService.callApi(body);
  }

  getPacienteSexo(): Observable<any> {
    let body = {
      query: `
      {
        getPacienteSexo {
          Sexo
          consult
        }
      }`,
    };
    return this.httpService.callApi(body);
  }

  


}
