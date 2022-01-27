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
      pagina: ${objeTosend.pagina}
      limite: ${objeTosend.limite}
    }`;
    let filter = "";
    if (objeTosend.filter != null) {
      filter = `filter: {`;
      filter += objeTosend.filter.NOMBRE != "" ? `NOMBRE: "${objeTosend.filter.NOMBRE}"` : "";
      filter += `}`;
    }
    params = `(${pagination}, ${filter} )`;


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
        createUser (user: {
            name: "${objeTosend.name}"
            lastName: "${objeTosend.lastName}",
            email: "${objeTosend.email}",
            phoneNumber: "${objeTosend.phoneNumber}",
            rol_id: "${objeTosend.rol_id}",
            urlPhoto: "${objeTosend.urlPhoto}",
        }) {
           name
        }
      }
      `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  updateUsers(objeTosend): Observable<any> {
    let body = {
      query: `
      mutation {
        updateUser (user: {
          _id: "${objeTosend._id}",
           name: "${objeTosend.name}",
            lastName: "${objeTosend.lastName}",
            email: "${objeTosend.email}",
            phoneNumber: "${objeTosend.phoneNumber}",
            rol_id: "${objeTosend.rol_id}",
            urlPhoto: "${objeTosend.urlPhoto}",
        }) {
           name
        }
      }
      `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  deleteUsers(id): Observable<any> {
    let body = {
      query: `
        mutation {
          deleteUser(user: {_id: "${id}"}) {
            _id
          }
        }
        `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }



  recordatoriosBack(): Observable<any> {
    let body = {
      query: `{
        recordatorios{    
         id
         NOMBRE
         NOTA    
         EMPRESA_ID    
       }
     }
     `
    }
    return this.httpService.callApi(body);

  }
}
