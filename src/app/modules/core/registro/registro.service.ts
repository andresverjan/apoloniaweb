import { Injectable } from '@angular/core';
import * as Globals from '../globals';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  serverUrl: string;
  SERVER_RECURSO_GET_PROFILE = "WsUsers/getMyProfile";
  //SERVER_RECURSO_CREAR_USUARIOS = "WsUsuarios/userSignUp";//Solo para capitanes, Version movil
  SERVER_RECURSO_CREAR_USUARIOS = "WsUsuarios/userSignUpTuristas";
  SERVER_RECURSO_ACTUALIZAR_PROFILE_FOTO = "WsUsers/actualizarProfileFoto";

  constructor(private http: HttpClient) {
    this.serverUrl = Globals.SERVER;

  }

  getMyProfile(objeTosend): Observable<any> {
    const params = new HttpParams({
    fromObject: objeTosend
    });
    return this.http.get(this.serverUrl + this.SERVER_RECURSO_GET_PROFILE, { params });
    }

    adicionarUsuario(objeTosend?): Observable<any> {
      const params = new HttpParams({
        fromObject: objeTosend
      });
      return this.http.get<any>(this.serverUrl + this.SERVER_RECURSO_CREAR_USUARIOS, { params });
    };

    getWebRootUrl():string{
      return this.serverUrl + Globals.SERVER_FOLDER_WEBROOT;
     }
}
