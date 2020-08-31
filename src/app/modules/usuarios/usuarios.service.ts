import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';
import * as Globals from '../../modules/core/globals';
import { Usuarios } from '../../modules/core/interfaces/usuarios.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  serverUrl: string;
  SERVER_RECURSO_CARGAR_USUARIOS = "WsUsers/listarUsuarios";
  SERVER_RECURSO_ELIMINAR_USUARIOS = "WsUsers/eliminar";
  SERVER_RECURSO_ACTUALIZAR_USUARIOS = "WsUsers/actualizar";
  SERVER_RECURSO_CREAR_USUARIOS = "WsUsers/guardarusuario";

  constructor(private http: HttpClient) {
    this.serverUrl = Globals.SERVER;
  }

  cargarUsuarios(objeTosend?): Observable<Usuarios> {
    const params = new HttpParams({
      fromObject: objeTosend
    });
    return this.http.get<Usuarios>(this.serverUrl + this.SERVER_RECURSO_CARGAR_USUARIOS, { params });
  };

  eliminarUsuario(objeTosend?): Observable<any> {
    const params = new HttpParams({
      fromObject: objeTosend
    });
    return this.http.get<any>(this.serverUrl + this.SERVER_RECURSO_ELIMINAR_USUARIOS, { params });
  };
  actualizarUsuario(objeTosend?): Observable<any> {
    const params = new HttpParams({
      fromObject: objeTosend
    });
    return this.http.get<any>(this.serverUrl + this.SERVER_RECURSO_ACTUALIZAR_USUARIOS, { params });
  };

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