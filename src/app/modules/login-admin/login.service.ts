import { Injectable } from '@angular/core';
import * as Globals from '../../modules/core/globals';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  serverUrl: string;
  SERVER_RECURSO_LOGIN_ADMIN = "";

  constructor(private http: HttpClient) { 
    this.serverUrl = Globals.SERVER;
  }

  loginWeb(objeTosend): Observable<any> {
    let body = {
      query: `
      mutation {
        loginWeb(login: {
            username: "${objeTosend.usuario}",
            password: "${objeTosend.password}",
        }){
          _id
          name
          lastName
          email
          phoneNumber
          createdAt
          latlng
          jwt
          urlPhoto
          comercioId
          online
          rol_id
          username
  } 
      }
      `,
    };
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.serverUrl, body, { headers: headers })
    }

}
