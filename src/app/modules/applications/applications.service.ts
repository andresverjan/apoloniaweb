import { Injectable } from "@angular/core";
import * as Globals from "../core/globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Campo } from "../core/interfaces/campoTable.interace";
import { HttpService } from "../core/services/HttpService";

@Injectable({
  providedIn: "root",
})
export class ApplicationService {

  constructor(private http: HttpClient, private httpService: HttpService) {
  }

  saveApplication(obj: any): Observable<any> {
    const { application, campos } = obj;
    const params = `
    (application: {application: {
      nombre: "${application.nombre}",
      icono: "${application.icono}",
      nombreTabla: "${application.nombreTabla}"}

      campos: [
        ${[
          campos.map((val: Campo) => {
            return `{nombre: "${val.nombre}",
                      tipoDato: "${val.tipoDato}",
                      nombreUi:"${val.nombreUi}",
                      requerido:${val.requerido},
                      tipoCampoId: ${val.tipoCampoId},
                      visible:${val.visible},
                      orden: ${val.orden},
                      mascaraId:${val.mascaraId},
                      minLength: ${val.minLength},
                      maxLength: ${val.maxLength},
                      buscador: ${val.buscador},
                      verList:${val.verList}
                      }`;
          }),
        ]}
      ]})
    `;

    let body = {
      query: `mutation{
        saveAppFields ${params}
        {
          id
          nombre
          nombreTabla
          active
          createdBy
          createdAt
          updatedAt
        }
      }`,
    };
    return this.httpService.callApi(body);
  }

  updateApplication(obj: any): Observable<any> {
    const { application, campos } = obj;
    const params = `
    (application: {application: {
      id: ${application.id},
      nombre: "${application.nombre}",
      icono: "${application.icono}",
    }

      campos: [
        ${[
          campos.map((val: Campo) => {
            return `{nombre: "${val.nombre}",
                      tipoDato: "${val.tipoDato}",
                      nombreUi:"${val.nombreUi}",
                      requerido:${val.requerido ? val.requerido : false},
                      tipoCampoId: ${val.tipoCampoId},
                      visible:${val.visible ? val.visible : false},
                      orden: ${val.orden},
                      mascaraId:${val.mascaraId},
                      minLength: ${val.minLength},
                      maxLength: ${val.maxLength},
                      buscador: ${val.buscador ? val.buscador : false},
                      verList:${val.verList ? val.verList : false}
                      }`;
          }),
        ]}
      ]})
    `;

    let body = {
      query: `mutation{
        updateAppField ${params}
        {
          id
          nombre
          nombreTabla
          active
          createdBy
          createdAt
          updatedAt
        }
      }`,
    };
    return this.httpService.callApi(body);
  }

  deleteApplication(applicationId: number) {
    let body = {
      query: `mutation{
        deleteAppField(applicationId: ${applicationId})
      }`,
    };
    return this.httpService.callApi(body);
  }

  getAll(objeTosend?: any): Observable<any> {
    let filter = ``;
    if (objeTosend) {
      filter = `(filter: {`;
      if(objeTosend.nombre) {
        filter +=   `nombre: "${objeTosend.nombre}"`;
      }
      if(objeTosend.nombreTabla) {
        filter +=   `${objeTosend.nombre? "," : ""} nombreTabla: "${objeTosend.nombreTabla}"`;
      }
      filter += '})';
    }
    let body = {
      query: `{
        applications ${filter} {
          id
          nombre
          icono
          nombreTabla
          active
          createdBy
          createdAt
          updatedAt
        }
      }`,
    };
    return this.httpService.callApi(body);
  }
}
