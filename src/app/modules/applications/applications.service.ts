import { Injectable } from "@angular/core";
import * as Globals from "../core/globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Campo } from "../core/interfaces/campoTable.interace";

@Injectable({
  providedIn: "root",
})
export class ApplicationService {
  serverUrl: string;

  constructor(private http: HttpClient) {
    this.serverUrl = Globals.SERVER;
  }

  saveApplication(obj: any): Observable<any> {
    const { application, campos } = obj;
    const params = `
    (application: {application: {
      nombre: "${application.nombre}",
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

    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  updateApplication(obj: any): Observable<any> {
    const { application, campos } = obj;
    const params = `
    (application: {application: {
      id: ${application.id},
      nombre: "${application.nombre}",
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

    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  deleteApplication(applicationId: number) {
    let body = {
      query: `mutation{
        deleteAppField(applicationId: ${applicationId})
      }`,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  getAll(): Observable<any> {
    let body = {
      query: `{
        applications{
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
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
}
