import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http'
import { map, catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as Globals from '../globals';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

    
  constructor(private http:HttpClient) { 
      
  }

  cargarEtiquetas(id:string):Observable<any>{
   return this.http.get<Object>( this.serverUrl + 'Etiquetas/listarByIdiomaNew?id='+id);
  }
  
  getSessionStorage(): any {
    return localStorage.getItem('USER');
  }
}
