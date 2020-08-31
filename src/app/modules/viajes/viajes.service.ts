import { Injectable } from '@angular/core';
import * as Globals from '../../modules/core/globals';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';
import {Embarcacion} from '../core/interfaces/embarcacion.interface';
import { Viajes } from '../core/interfaces/viajes.interface';
import { ResponseViajes } from '../core/interfaces/viaje.response';


@Injectable({
  providedIn: 'root'
})
export class ViajesService {
  serverUrl: string;
  SERVER_RECURSO_CARGAR_VIAJES = "Viajes/listarViajeses";
  SERVER_RECURSO_ELIMINAR_VIAJE = "Viajes/eliminar";
  SERVER_RECURSO_ACTUALIZAR_VIAJE = "Viajes/actualizar";
  SERVER_RECURSO_CREAR_VIAJE = "Viajes/guardar";
  SERVER_RECURSO_BUSQUEDA_AUTOCOMPLETAR = "Viajes/listarViajesesAutocompletar";
  SERVER_RECURSO_BUSQUEDA = "Viajes/listarViajeses";

  constructor(private http: HttpClient) {
    this.serverUrl = Globals.SERVER;
  }

  cargarViajes(filtro?) : Observable<ResponseViajes>{
    const params = new HttpParams({
      fromObject: filtro
    });
    return this.http.get<ResponseViajes>(this.serverUrl + this.SERVER_RECURSO_CARGAR_VIAJES, {params});
  }

  cargarSegundaListaViajes(filtro?) : Observable<ResponseViajes>{
    const params = new HttpParams({
      fromObject: filtro
    });
    return this.http.get<ResponseViajes>(this.serverUrl + this.SERVER_RECURSO_CARGAR_VIAJES, {params});
  }


  crearViaje(request:any): Observable<any>{
    const params = new HttpParams({
      fromObject: request
    });
    return this.http.get<any>(this.serverUrl + this.SERVER_RECURSO_CREAR_VIAJE, { params });
  }

  actualizarViaje(request:any): Observable<any>{
    const params = new HttpParams({
      fromObject: request
    });
    return this.http.get<any>(this.serverUrl + this.SERVER_RECURSO_ACTUALIZAR_VIAJE, { params });
  }

  eliminarViaje(request:any): Observable<any>{
    const params = new HttpParams({
      fromObject: request
    });
    return this.http.get<any>(this.serverUrl + this.SERVER_RECURSO_ELIMINAR_VIAJE, { params });
  }

  getWebRootUrl():string{
   return this.serverUrl + Globals.SERVER_FOLDER_WEBROOT;
  }
  cargarResultadosBusqueda(filtro?) : Observable<any>{
    const params = new HttpParams({
      fromObject: filtro
    });
    return this.http.get<any>(this.serverUrl + this.SERVER_RECURSO_BUSQUEDA_AUTOCOMPLETAR, {params});
  }

  listarViajesBuscador(filtro?) : Observable<any>{
    const params = new HttpParams({
      fromObject: filtro
    });
    return this.http.get<any>(this.serverUrl + this.SERVER_RECURSO_BUSQUEDA, {params});
  }

  

}
