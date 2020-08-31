import { Injectable } from '@angular/core';
import * as Globals from '../../modules/core/globals';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ViajesTuristasService {
  serverUrl: string;
  SERVER_RECURSO_VIAJES_PENDIENTES = "Solicitud/listarmisviajes";
  //SERVER_RECURSO_VIAJES_CANCELADOS = "Viajes/actualizar";
  //SERVER_RECURSO_VIAJES_FINALIZADOS = "Viajes/guardar";
    SERVER_RECURSO_VIAJES_PENDIENTES_CANCELAR = "Solicitud/cancelarSolicitud";
    SERVER_RECURSO_VIAJES_PENDIENTES_ACEPTAR = "Solicitud/aceptarSolicitud";

  constructor(private http:HttpClient) {
    this.serverUrl = Globals.SERVER;

   }

   cargarViajesPendientes(filtro?) : Observable<any>{
    const params = new HttpParams({
      fromObject: filtro
    });
    return this.http.get<any>(this.serverUrl + this.SERVER_RECURSO_VIAJES_PENDIENTES, {params});
  }

  cancelarViajePendiente(filtro?) : Observable<any>{
    const params = new HttpParams({
      fromObject: filtro
    });
    return this.http.get<any>(this.serverUrl + this.SERVER_RECURSO_VIAJES_PENDIENTES_CANCELAR, {params});
  }
  aceptarViajePendiente(filtro?) : Observable<any>{
    const params = new HttpParams({
      fromObject: filtro
    });
    return this.http.get<any>(this.serverUrl + this.SERVER_RECURSO_VIAJES_PENDIENTES_ACEPTAR, {params});
  }

  getWebRootUrl():string{
    return this.serverUrl + Globals.SERVER_FOLDER_WEBROOT;
   }

   generarReporteSolicitudes(filtro?) : Observable<any>{
    const params = new HttpParams({
      fromObject: filtro
    });
    return this.http.get<any>(this.serverUrl + this.SERVER_RECURSO_VIAJES_PENDIENTES_ACEPTAR, {params});
  }
}
