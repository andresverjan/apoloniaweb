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
    let body = {
      query: `{roles {nombre} }`
    }
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.serverUrl, body, { headers: headers })
  }

  permisosByRolId(rolId: number): Observable<any> {
    let body = {
      query: `{rolById(rol_id: ${rolId})
        { nombre
          permisos{
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
      query: `{permisos
        { id nombre
          permisos{
            id
            nombre } } }`
    }
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.serverUrl, body, { headers: headers })
  }

  /*create(objeTosend) {
    const { name, img, description, value, productoId, comercioId } = objeTosend;
    let body ={
       query: `mutation {
        createRol(rol:
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
  }*/

}
