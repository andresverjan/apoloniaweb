import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http'
import { Observable } from 'rxjs';
import * as Globals from '../globals';

@Injectable({
  providedIn: 'root'
})
export class EtiquetasService {
  serverUrl :string;

  constructor(private http:HttpClient) { 
      this.serverUrl= Globals.SERVER;
  }
  
  loadEtiquetas(objeTosend): Observable<any> {
      const params = new HttpParams({
        fromObject: objeTosend
      });
      return this.http.get(this.serverUrl +'Etiquetas/listarByIdiomaNew', {params});
    }; 
  
}
