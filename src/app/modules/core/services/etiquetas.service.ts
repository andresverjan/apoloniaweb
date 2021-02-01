import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import * as Globals from "../globals";

@Injectable({
  providedIn: "root",
})
export class EtiquetasService {
  serverUrl: string;

  constructor(private http: HttpClient) {
    this.serverUrl = Globals.SERVER;
  }

  getAll(): Observable<any> {
    let body = {
      query: `
        {
          etiquetas{
            id
            NOMBRE
            DESCRIPCION
            LABEL
            IDIOMA_ID
          }
        }
          `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  createCita(data: any): Observable<any> {
    const { NOMBRE, DESCRIPCION, LABEL, IDIOMA_ID } = data;

    let body = {
      query: `mutation {
        createEtiqueta(etiqueta: {
          NOMBRE: "${NOMBRE}"
          DESCRIPCION:"${DESCRIPCION}"
          LABEL:"${LABEL}"
          IDIOMA_ID:"${IDIOMA_ID}"
        }) {
          id
        }
      }`,
    };

    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  loadEtiquetas(objeTosend): Observable<any> {
    const params = new HttpParams({
      fromObject: objeTosend,
    });
    return this.http.get(this.serverUrl + "Etiquetas/listarByIdiomaNew", {
      params,
    });
  }
}
