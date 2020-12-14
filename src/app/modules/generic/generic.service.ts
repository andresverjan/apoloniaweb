import { Injectable } from "@angular/core";
import * as Globals from "../core/globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Generic } from "./generic.component";
import { HttpService } from "../core/services/HttpService";

@Injectable({
  providedIn: "root",
})
export class GenericService {
  serverUrl: string;

  constructor(private http: HttpClient, private httpService: HttpService) {
    this.serverUrl = Globals.SERVER;
  }

  getAll(obj): Observable<any> {
    const { campos, applicationId, limit } = obj;

    let body = {
      query: `query{ 
        genericList(filter:{
           id:${applicationId}
           campos : [
            ${campos.map((item) => {
              return `{
                id: ${item.id}
                nombre: "${item.campo}"
                valor: "${item.valor}"
                }`;
            })}
          ]
        }
        limit:{
          pagina: ${limit.pagina}
          limite: ${limit.limite}
        }) {
          application {
             id
             nombre
             icono
             nombreTabla
          }
          campos
          totalRegistros
        }
      }`,
    };
    return this.httpService.callApi(body);
  }

  updateGeneric(generic: any) {
    const { id, application, campos } = generic;
    let body = {
      query: `
      mutation{
        genericUpdate(
            application: {
              id: ${id}
              application:{
                id: ${application.id}
                nombre: "${application.nombre}"
                nombreTabla: "${application.nombreTabla}"
              }
              campos : [
                ${campos.map((item) => {
                  return `{
                    tipoCampoId: ${item.tipoCampoId}
                    nombre: "${item.nombre}"
                    id: ${item.id}
                    valor: "${item.valor}"
                    }`;
                })}
              ]
            }
        ){
          success
          message
          internalMessage
        }
      }`,
    };
    return this.httpService.callApi(body);
  }

  deleteGeneric(generic: any): Observable<any> {
    const { id, application } = generic;
    let body = {
      query: `mutation{
        genericDelete(
            application: {
              id: ${id}
              application:{
                id: ${application.id}
                nombre: "${application.nombre}"
                nombreTabla: "${application.nombreTabla}"
              }
            }
        ){
          success
          message
          internalMessage
        }
      }`,
    };

    return this.httpService.callApi(body);
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
            tipoCampoId: ${item.tipoCampoId}
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
    return this.httpService.callApi(body);
  }
}
