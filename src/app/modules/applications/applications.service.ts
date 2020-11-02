import { Injectable } from '@angular/core';
import * as Globals from '../core/globals';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  serverUrl: string;

  constructor(private http: HttpClient) {
    this.serverUrl = Globals.SERVER;
  }

  listarApplications(objeTosend: any): Observable<any> {
    let filter = ``;
    if (objeTosend) {//
      filter = `(filter: {`;

      if(objeTosend.nombre) {
        filter +=   `nombre: "${objeTosend.nombre}"`;
      }

      if(objeTosend.nombreTabla) {
        filter +=   `${objeTosend.nombre? "," : ""} nombreTabla: "${objeTosend.nombreTabla}"`;
      }

      /*if(objeTosend.name) {
        filter +=   `${objeTosend.comercioId? "," : ""} ${objeTosend.productoId? "," : ""}  name: "${objeTosend.name}"`;
      }*/

      filter += '})';
    }

    console.log('applications service json: ', filter);
    let body = {
      query: `{ applications ${filter} {
        id
        nombre
        nombreTabla
        active
        createdBy
        createdAt
        updatedAt } }`
    }
    console.log("a ver que SALIó en BODYYY", body);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.serverUrl, body, { headers: headers })
  }

}
