import { Injectable } from "@angular/core";
import * as Globals from "../globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { HttpService } from "./HttpService";

@Injectable({
  providedIn: "root",
})
export class OdontologosService {
  serverUrl: string;
  constructor(private http: HttpClient, private httpService: HttpService) {
    this.serverUrl = Globals.SERVER;
  }

  getAll(): Observable<any> {
    let body = {
      query: `query{
            odontologos{
              id
              Nombres
              Apellidos
              Especialidad
              Titulo
              Registro
              PorcentajePago
              Usuario
              PorcentajePagoEsp
              Unidad
              PorcentajeLab
              FecNac
            }
          }`,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
}
