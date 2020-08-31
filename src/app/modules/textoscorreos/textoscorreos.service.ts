import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TextosCorreosService {

  serverUrl: string;

  SERVER_RECURSO_CARGAR = "TextosCorreos/listar";
  SERVER_RECURSO_ACTUALIZAR = "TextosCorreos/actualizar";  

  constructor(private http: HttpClient) {
    this.serverUrl = "http://144.217.242.247/WsBoater/";
  }

  listarCorreos(objeTosend?): Observable<any> {
    const params = new HttpParams({
      fromObject: objeTosend
    });
    return this.http.get<any>(this.serverUrl + this.SERVER_RECURSO_CARGAR, { params });
  };

  getServerUrl():string {
    return this.serverUrl;
  }

  actualizarCorreos(objeTosend?, id? : number, TITULO?: string, TEXTO_BODY?: string): Observable<any> {
    const params = new HttpParams({
      fromObject: objeTosend
    });
    return this.http.get<any>(this.serverUrl + this.SERVER_RECURSO_ACTUALIZAR, { params });
  };
}