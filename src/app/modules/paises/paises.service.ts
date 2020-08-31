import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';
import * as Globals from '../../modules/core/globals';
import { Paises } from '../../modules/core/interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  serverUrl: string;
  urlImages: string;
  urlImagesBanderas: string;

  SERVER_RECURSO_CARGAR = "Paises/listar";
  SERVER_RECURSO_ELIMINAR = "Paises/eliminar";
  SERVER_RECURSO_ACTUALIZAR = "Paises/actualizar";
  SERVER_RECURSO_CREAR = "Paises/guardar";

  constructor(private http: HttpClient) {
    this.serverUrl = Globals.SERVER;
    this.urlImages = Globals.SERVER_FOLDER_IMAGENES;
    this.urlImagesBanderas = Globals.SERVER_FOLDER_IMAGENES_BANDERAS;
  }

  cargarPaises(objeTosend?): Observable<Paises> {
    const params = new HttpParams({
      fromObject: objeTosend
    });
    return this.http.get<Paises>(this.serverUrl + this.SERVER_RECURSO_CARGAR, { params });
  };

  eliminarPais(objeTosend?): Observable<any> {
    const params = new HttpParams({
      fromObject: objeTosend
    });
    return this.http.get<any>(this.serverUrl + this.SERVER_RECURSO_ELIMINAR, { params });
  };
  actualizarPais(objeTosend?): Observable<any> {
    const params = new HttpParams({
      fromObject: objeTosend
    });
    return this.http.get<any>(this.serverUrl + this.SERVER_RECURSO_ACTUALIZAR, { params });
  };

  adicionarPais(objeTosend?): Observable<any> {
    const params = new HttpParams({
      fromObject: objeTosend
    });
    return this.http.get<any>(this.serverUrl + this.SERVER_RECURSO_CREAR, { params });
  };
  getServerUrl():string {
    return this.serverUrl;
  }
  getFolderImages():string{
    return this.urlImages;
  }
  getPathImagenesBanderas():string{
    return this.serverUrl+this.urlImagesBanderas;
  }
  
}