import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http'
import { Observable } from 'rxjs';
import * as Globals from '../../globals';
import { UserSession } from '../../interfaces/usersession.interface';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  serverUrl:string;

  constructor(private http:HttpClient) {
      this.serverUrl= Globals.SERVER;
  }

  login(objeTosend): Observable<UserSession> {
      const params = new HttpParams({
        fromObject: objeTosend
      });
      return this.http.get<UserSession>(this.serverUrl +'WsUsuarios/login', {params});
    };

    recordarPassword(objeTosend): Observable<UserSession> {
      const params = new HttpParams({
        fromObject: objeTosend
      });
      return this.http.get<UserSession>(this.serverUrl +'WsUsuarios/forgotPassword', {params});
    };



}
