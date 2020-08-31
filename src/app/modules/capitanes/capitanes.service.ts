import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';
import * as Globals from '../../modules/core/globals';
import { Usuarios } from '../../modules/core/interfaces/usuarios.interface';

@Injectable({
  providedIn: 'root'
})
export class CapitanesService {

  serverUrl: string;
  SERVER_RECURSO_CARGAR = "Capitanes/listarCapitanes";
  SERVER_RECURSO_ELIMINAR = "Capitanes/eliminar";
  SERVER_RECURSO_ACTUALIZAR = "Capitanes/actualizar";
  SERVER_RECURSO_CREAR = "Capitanes/guardarCapitanAdmin";

  constructor(private http: HttpClient) {
    this.serverUrl = Globals.SERVER;
  }

  cargarUsuarios(objeTosend?): Observable<Usuarios> {
    const params = new HttpParams({
      fromObject: objeTosend
    });
    return this.http.get<Usuarios>(this.serverUrl + this.SERVER_RECURSO_CARGAR, { params });
  };

  eliminarUsuario(objeTosend?): Observable<any> {
    const params = new HttpParams({
      fromObject: objeTosend
    });
    return this.http.get<any>(this.serverUrl + this.SERVER_RECURSO_ELIMINAR, { params });
  };
  actualizarUsuario(objeTosend?): Observable<any> {
    const params = new HttpParams({
      fromObject: objeTosend
    });
    return this.http.get<any>(this.serverUrl + this.SERVER_RECURSO_ACTUALIZAR, { params });
  };

  adicionarUsuario(objeTosend?): Observable<any> {
    const params = new HttpParams({
      fromObject: objeTosend
    });
    return this.http.get<any>(this.serverUrl + this.SERVER_RECURSO_CREAR, { params });
  };

  getWebRootUrl():string{
    return this.serverUrl + Globals.SERVER_FOLDER_WEBROOT;
   }
}