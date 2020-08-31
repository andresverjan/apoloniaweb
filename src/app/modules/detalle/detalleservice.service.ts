import { Injectable } from '@angular/core';
import { Detalle } from '../core/interfaces/detalle.interface';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';
import * as Globals from '../../modules/core/globals';

@Injectable({
  providedIn: 'root'
})
export class Detalleservice {

  serverUrl: string;
  SERVER_RECURSO_RESERVAR = 'Solicitud/guardar';
  SERVER_RECURSO_REPORTE = 'Solicitud/reporteSolicitudes';

  private detalleObjeto:Detalle;
  constructor(private http:HttpClient) {
    this.serverUrl = Globals.SERVER;
   }

  setDetalleObjeto(detalleObject:Detalle){
    this.detalleObjeto = detalleObject;
  }

  getDetalleObjeto():Detalle{
    return this.detalleObjeto;
  }

  solicitarReserva(objeTosend?): Observable<any> {
    const params = new HttpParams({
      fromObject: objeTosend
    });
    return this.http.get<any>(this.serverUrl + this.SERVER_RECURSO_RESERVAR, { params });
  };

  reporteSolicitudes(objeTosend?): Observable<any> {
    const params = new HttpParams({
      fromObject: objeTosend
    });
    return this.http.get<any>(this.serverUrl + this.SERVER_RECURSO_REPORTE, { params });
  };





}
