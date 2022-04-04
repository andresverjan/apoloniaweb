import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from './HttpService';
import { ToolsService } from './tools.service';
import { environment } from "src/environments/environment";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
    private toolService: ToolsService) {
//      this.serverUrl = Globals.SERVER;
  }

  getAll(objeTosend: any): Observable<any> {
    let filtro = "";
    let params = "";
    let ordenamiento = "";

    if (objeTosend != null && objeTosend != undefined && objeTosend) {
      filtro = `filter: { ${Object.keys(objeTosend).map((prop) => {
          if ( typeof objeTosend[prop] === "string" || objeTosend[prop] instanceof String ) {
               return `${prop} : "${objeTosend[prop]}"`;
          } else {
               return `${prop} : ${objeTosend[prop]}`;
          }
        })
      }}`;
    }

    params = this.toolService.getParams(filtro, ordenamiento);

    let body = {
      query: `query{
            products ${params}{
              id
  					  codigo
  					  nombre
              valor
              iva
            }
          }`,
    };
    return this.httpService.callApi(body);
  }
}
