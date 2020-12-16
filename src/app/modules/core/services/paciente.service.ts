import { Injectable } from "@angular/core";
import * as Globals from "../globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { HttpService } from "./HttpService";

@Injectable({
  providedIn: "root",
})
export class PacienteService {
  serverUrl: string;
  constructor(private http: HttpClient, private httpService: HttpService) {
    this.serverUrl = Globals.SERVER;
  }

  getAll(objeTosend: any): Observable<any> {
    let filter = "";
    console.log("!!!!!!!! objeTosend.Nombres1", objeTosend)
    //si trae filtro , Apellidos1: "${objeTosend.nombre}"
    if (objeTosend) {
      filter = `(filter: {
        Nombres1: "${objeTosend.nombre}"
      })`;
    }

    let body = {
      query: `query{
            pacientes ${filter}{
              id
              Cedula
              TipoDoc
              Apellidos1
              Apellidos2
              Nombres1
              Nombres2
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
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
}
