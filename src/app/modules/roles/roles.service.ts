import { Injectable } from "@angular/core";
import * as Globals from "../core/globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ToolsService } from "../core/services/tools.service";
import { stringify } from 'querystring';
import { HttpService } from "../core/services/HttpService";

@Injectable({
  providedIn: 'root'
})
export class RolService {
  serverUrl: string;

  constructor(private http: HttpClient, private httpService: HttpService) {
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
    return this.httpService.callApi(body);
     
     
  }

  permisosByRolId(rolName: number): Observable<any> {
    let body = {
      query: `{rolById(id: ${rolName}){
                id nombre } }`
    }
    return this.httpService.callApi(body);
     
     
  }

  permisosByRolName(rolName: any): Observable<any> {
    let body = {
      query: `{rolByNombre(nombre: "${rolName.nombre}")
        { nombre
          permisos{
            id
            nombre } } }`
    }
    return this.httpService.callApi(body);
     
     
  }

  getPermisos(objeTosend: any): Observable<any> {

    let body = {
      query: `{ permisos(rol_id: ${objeTosend}) { id nombre } }`
    }

    return this.httpService.callApi(body);
     
     
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
    return this.httpService.callApi(body);
     
     
  }
}
