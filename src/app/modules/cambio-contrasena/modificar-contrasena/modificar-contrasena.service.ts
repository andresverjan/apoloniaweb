import { Injectable } from '@angular/core';
import * as Globals from '../../core/globals';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ModificarContrasenaService {
  serverUrl: string;

    SERVER_RECURSO_CHANGE_PASSWORD= "WsUsuarios/changepassword";

  constructor(private http:HttpClient) {
    this.serverUrl = Globals.SERVER;

   }

  changePassword(filtro?) : Observable<any>{
    const params = new HttpParams({
      fromObject: filtro
    });
    return this.http.get<any>(this.serverUrl + this.SERVER_RECURSO_CHANGE_PASSWORD, {params});
  }

  getWebRootUrl():string{
    return this.serverUrl + Globals.SERVER_FOLDER_WEBROOT;
   }
}
