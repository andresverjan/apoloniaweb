import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';
import * as Globals from '../../modules/core/globals';
import { Idiomas } from '../../modules/core/interfaces/idiomas.interface';

@Injectable({
  providedIn: 'root'
})
export class IdiomasService {

  serverUrl: string;
  urlImages: string;
  urlImagesBanderas: string;

  SERVER_RECURSO_CARGAR = "Idiomas/listar";
 // SERVER_RECURSO_ELIMINAR = "Paises/eliminar";
  SERVER_RECURSO_ACTUALIZAR = "Idiomas/actualizar";
  SERVER_RECURSO_CREAR = "Idiomas/guardar";
  SERVER_RECURSO_LISTAR_ETIQUETAS_IDIOMA = "Etiquetas/listarByIdiomaNewArray";
  SERVER_RECURSO_ACTUALIZAR_ETIQUETAS = "Etiquetas/actualizarEtiqueta";

  

  constructor(private http: HttpClient) {
    this.serverUrl = Globals.SERVER;
    this.urlImages = Globals.SERVER_FOLDER_IMAGENES;
    this.urlImagesBanderas = Globals.SERVER_FOLDER_IMAGENES_BANDERAS;
  }

  cargarIdiomas(objeTosend?): Observable<Idiomas> {
    const params = new HttpParams({
      fromObject: objeTosend
    });
    return this.http.get<Idiomas>(this.serverUrl + this.SERVER_RECURSO_CARGAR, { params });
  };


  listarEtiquetasByIdioma(objeTosend?): Observable<Idiomas> {
    const params = new HttpParams({
      fromObject: objeTosend
    });
    return this.http.get<Idiomas>(this.serverUrl + this.SERVER_RECURSO_LISTAR_ETIQUETAS_IDIOMA, { params });
  };


  actualizarEtiqueta(objeTosend?): Observable<any> {
    const params = new HttpParams({
      fromObject: objeTosend
    });
    return this.http.get<any>(this.serverUrl + this.SERVER_RECURSO_ACTUALIZAR_ETIQUETAS, { params });
  };

  


  /*eliminarPais(objeTosend?): Observable<any> {
    const params = new HttpParams({
      fromObject: objeTosend
    });
    return this.http.get<any>(this.serverUrl + this.SERVER_RECURSO_ELIMINAR, { params });
  };*/
  actualizarIdiomas(objeTosend?): Observable<any> {
    const params = new HttpParams({
      fromObject: objeTosend
    });
    return this.http.get<any>(this.serverUrl + this.SERVER_RECURSO_ACTUALIZAR, { params });
  };

  adicionarIdiomas(objeTosend?): Observable<any> {
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