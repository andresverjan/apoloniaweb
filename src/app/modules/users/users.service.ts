import { Injectable } from "@angular/core";
import * as Globals from "../core/globals";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  serverUrl: string;
  SERVER_RECURSO_LOGIN_ADMIN = "";

  constructor(private http: HttpClient) {
    this.serverUrl = Globals.SERVER;
  }

  listUsers(objeTosend?): Observable<any> {
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
}
