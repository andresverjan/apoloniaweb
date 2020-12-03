import { Injectable } from "@angular/core";
import * as Globals from "../core/globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ToolsService } from "../core/services/tools.service";
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  serverUrl: string;

  constructor(private http: HttpClient) {
    this.serverUrl = Globals.SERVER;
  }

  getAll(objeTosend: any): Observable<any> {
    let filter = "";

    //si trae filtro
    if (objeTosend) {
      filter = `(filter: {
        nombre: "${objeTosend.nombre}",
      })`;
    }

    let body = {
      query: `{ roles ${filter}{
        id nombre } }`
    }
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.serverUrl, body, { headers: headers })
  }

  permisosByRolId(rolName: number): Observable<any> {
    let body = {
      query: `{rolById(id: ${rolName})
        { nombre
          permisos{
            id
            nombre } } }`
    }
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.serverUrl, body, { headers: headers })
  }

  permisosByRolName(rolName: any): Observable<any> {
    let body = {
      query: `{rolByNombre(nombre: "${rolName.nombre}")
        { nombre
          permisos{
            id
            nombre } } }`
    }
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.serverUrl, body, { headers: headers })
  }

  getPermisos(objeTosend: any): Observable<any> {

    let body = {
      query: `{ permisos { id nombre } }`
    }

    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.serverUrl, body, { headers: headers })
  }

  update(obj: any): Observable<any> {
    const { id, permisos } = obj;

    let body = {
      query: `mutation {
        updateRol(rol: {
            id: ${id}
            permisos : [
              ${permisos.map((item) => {
                return `{
                  id: ${item.id}
                  }`;
              })}
            ]
          }
        ) {
            id
          }
      }`,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
}
