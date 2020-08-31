import { Injectable } from '@angular/core';
import * as Globals from '../../modules/core/globals';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';
import {Embarcacion} from '../core/interfaces/embarcacion.interface';


@Injectable({
  providedIn: 'root'
})
export class EmbarcacionesService {
  serverUrl: string;

  SERVER_RECURSO_CARGAR_EMBARCACIONES = "Embarcaciones/listar";   //Trae listado de embarcaciones con datos relacionados, capitan. 
  SERVER_RECURSO_FILTRAR_EMBARCACIONES = "Embarcaciones/filtrarEmbarcaciones";  //Trae listado de embarcaciones solo de la tabla embarcaciones.
  SERVER_RECURSO_ELIMINAR_EMBARCACIONES = "Embarcaciones/eliminar";
  SERVER_RECURSO_ACTUALIZAR_EMBARCACIONES = "Embarcaciones/actualizar";
  SERVER_RECURSO_CREAR_EMBARCACIONES = "Embarcaciones/guardar";

  constructor(private http: HttpClient) {
    this.serverUrl = Globals.SERVER;
  }

  cargarEmbarcaciones(filtro?) : Observable<Array<Embarcacion>>{
    const params = new HttpParams({
      fromObject: filtro
    });
    return this.http.get<Array<Embarcacion>>(this.serverUrl + this.SERVER_RECURSO_CARGAR_EMBARCACIONES, {params});
  }

  filtrarEmbarcaciones(filtro?) : Observable<any>{
    const params = new HttpParams({
      fromObject: filtro
    });
    return this.http.get<Array<Embarcacion>>(this.serverUrl + this.SERVER_RECURSO_FILTRAR_EMBARCACIONES, {params});
  }

  cargarSegundaListaEmbarcaciones(filtro?) : Observable<Array<Embarcacion>>{
    const params = new HttpParams({
      fromObject: filtro
    });
    return this.http.get<Array<Embarcacion>>(this.serverUrl + this.SERVER_RECURSO_CARGAR_EMBARCACIONES, {params});
  }

  crearEmbarcacion(request:any): Observable<any>{
    const params = new HttpParams({
      fromObject: request
    });
    return this.http.get<any>(this.serverUrl + this.SERVER_RECURSO_CREAR_EMBARCACIONES, { params });
  }

  actualizarEmbarcacion(request:any): Observable<any>{
    const params = new HttpParams({
      fromObject: request
    });
    return this.http.get<any>(this.serverUrl + this.SERVER_RECURSO_ACTUALIZAR_EMBARCACIONES, { params });
  }

  eliminarEmbarcacion(request:any): Observable<any>{
    const params = new HttpParams({
      fromObject: request
    });
    return this.http.get<any>(this.serverUrl + this.SERVER_RECURSO_ELIMINAR_EMBARCACIONES, { params });
  }

  getWebRootUrl():string{
   return this.serverUrl + Globals.SERVER_FOLDER_WEBROOT;
  }
}
