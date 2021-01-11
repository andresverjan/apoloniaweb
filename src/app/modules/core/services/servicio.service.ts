import { Injectable } from "@angular/core";
import * as Globals from "../globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { HttpService } from "./HttpService";

@Injectable({
  providedIn: "root",
})
export class ServicioService {
  serverUrl: string;
  constructor(private http: HttpClient, private httpService: HttpService) {
    this.serverUrl = Globals.SERVER;
  }

  getAll(objeTosend: any): Observable<any> {
    let filter = "";

    if (objeTosend) {
      filter = `(filter: {
        nombre: "${objeTosend.nombre}"
      })`;
    }

    let body = {
      query: `query{ servicios ${filter}{
                id
                nombre
      					description
      					duracion
                EMPRESA_ID
            }
          }`,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
  getServicioById(objeTosend: any): Observable<any> {
    let filter = "";
    if (objeTosend) {
      filter = `(id:${objeTosend})`;
    }

    let body = {
      query: `
      {
        servicioById ${filter} {
          id
          nombre
          description
          duracion
          EMPRESA_ID
          createdAt
          updatedAt
        }
      }
      `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
}
