import { Injectable } from '@angular/core';
import * as Globals from '../core/globals';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  serverUrl: string;

  constructor(private http: HttpClient) {
    this.serverUrl = Globals.SERVER;
  }

  listar(objeTosend: any): Observable<any> {
    let body = {
      query: `{roles { id, name } }`
    }
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.serverUrl, body, { headers: headers })
  }

  create(objeTosend) {
    const { name, img, description, value, productoId, comercioId } = objeTosend;
    let body ={
       query: `mutation {
        createSubproducto(subproducto:
          {
            name: "${name}"
            img: "${img}"
            activo: "true"
            description: "${description}"
            value: "${value}"
            productoId: "${productoId}"
            comercioId: "${comercioId}"
          }
        ) {
          _id
          name
          img
          activo
          description
          productoId
          comercioId
        }
      }
      `
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
 
  deleteRol(id) {
    let body = {
      query: `
      mutation {
        deleteSubproducto(subproducto: {_id: "${id}"}) {
          description
        }
      }
          `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

 
}
