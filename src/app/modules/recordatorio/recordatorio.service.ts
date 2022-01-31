import { Injectable } from "@angular/core";
import * as Globals from "../core/globals";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { HttpService } from "../core/services/HttpService";

@Injectable({
  providedIn: "root",
})
export class RecordatorioService {
  serverUrl: string;
  SERVER_RECURSO_LOGIN_ADMIN = "";

  constructor(private http: HttpClient, private httpService: HttpService) {
    this.serverUrl = Globals.SERVER;
  }
  //List
  list(objeTosend?): Observable<any> {
    let params = "";
    let pagination = `
    pagination: {
      pagina: ${objeTosend?.pagina != "" && objeTosend?.pagina != undefined ? `${objeTosend?.pagina}` : 1}
      limite:  ${objeTosend?.limite != "" && objeTosend?.limite != undefined ? `${objeTosend?.limite}` : 5}
    }`;
    let filter = "";
    if (objeTosend?.filter != null) {
      filter = `,filter: {`;
      filter += objeTosend.filter.NOMBRE != "" ? `NOMBRE: "${objeTosend.filter.NOMBRE}"` : "";
      filter += `}`;
    }
    params = `(${pagination} ${filter} )`;
    

    let body = {
      query: `{
        recordatorios ${params} {    
          lista {
            id
            NOMBRE
            NOTA
            DESCRIPCION
            FECHAHORARECORDAR
            ACTIVO
            REPETIRDIARIO
            REPETIRMENSUAL
            EMPRESA_ID
            createdAt
            updatedAt
          }
         }
     }
     `
    }
    return this.httpService.callApi(body);
  }

  getAll(objeTosend: any): Observable<any> {
    let filter = "";
    if (objeTosend != null) {
      filter = `( filter: {`;
      filter += objeTosend.name != "" ? `name: "${objeTosend.name}` : "";
      filter += objeTosend.rol_id != "" ? `rol_id: "${objeTosend.rol_id}"` : "";
      filter +=
        objeTosend.lastName != "" ? `lastName: "${objeTosend.lastName}"` : "";
      filter += `} )`;
    }

    let body = {
      query: `{users ${filter} {_id,name,lastName,urlPhoto,email,phoneNumber,rol_id}}`,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  createUsers(objeTosend): Observable<any> {
    let body = {
      query: `
      mutation {
        saveRecordatorios(recordatorio: {
          NOTA: "${objeTosend.NOTA}", 
          NOMBRE: "${objeTosend.NOMBRE}", 
          DESCRIPCION: "${objeTosend.DESCRIPCION}", 
          FECHAHORARECORDAR: "${objeTosend.FECHAHORARECORDAR}", 
          ACTIVO: "${objeTosend.ACTIVO}",
          REPETIRDIARIO: "${objeTosend.REPETIRDIARIO}", 
          REPETIRMENSUAL: "${objeTosend.REPETIRMENSUAL}", 
          EMPRESA_ID: ${objeTosend.EMPRESA_ID}}) {
          id
          NOTA
        }
      }
      `,
    };
    return this.httpService.callApi(body);
  }

  updateUsers(objeTosend): Observable<any> {
    console.log(objeTosend);
    let body = {
      query: `
      mutation {
        updateRecordatorios(recordatorio: {
          id: ${objeTosend.id}, 
          NOTA: "${objeTosend.NOTA}", 
          NOMBRE: "${objeTosend.NOMBRE}", 
          DESCRIPCION: "${objeTosend.DESCRIPCION}", 
          FECHAHORARECORDAR: "${objeTosend.FECHAHORARECORDAR}", 
          ACTIVO: "${objeTosend.ACTIVO}",
          REPETIRDIARIO: "${objeTosend.REPETIRDIARIO}", 
          REPETIRMENSUAL: "${objeTosend.REPETIRMENSUAL}", 
          EMPRESA_ID: ${objeTosend.EMPRESA_ID}}) {
          id
          NOTA
        }
      }
      `,
    };
    return this.httpService.callApi(body);
  }
  
  deleteUsers(id): Observable<any> {
    let body = {
      query: `
      mutation {
        deleteRecordatorios(recordatorio: {id: ${id}}) 
      }`,
    };
    console.log(body);
    return this.httpService.callApi(body);
  }
}