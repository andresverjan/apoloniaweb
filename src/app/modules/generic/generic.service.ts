import { Injectable } from "@angular/core";
import * as Globals from "../core/globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Generic } from "./generic.component";
import { Campo } from "../core/interfaces/campoTable.interace";

@Injectable({
  providedIn: "root",
})
export class GenericService {
  serverUrl: string;

  constructor(private http: HttpClient) {
    this.serverUrl = Globals.SERVER;
  }

  getAll(): Observable<any> {
    let body = {
      query: `query{ 
        genericList(filter:{
           id:13
        }) {
          application {
             id
             nombre
             nombreTabla
          }
          campos
        }
      }`,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  saveGeneric(generic: Generic): Observable<any> {
    const { application, campos } = generic;

    let params = `(application:{
      application:{
        id: ${application.id}
        nombre: "${application.nombre}"
        nombreTabla: "${application.nombreTabla}"
      }
      campos : [
        ${campos.map((item) => {
          return `{
            nombre: "${item.nombre}"
            id: ${item.id}
            valor: "${item.valor}"
            }`;
        })}
      ]
    })`;

    let body = {
      query: `
      mutation{
        genericSave ${params}{
          success
            message
          internalMessage
        }
      }`,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
}
