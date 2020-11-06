import { Injectable } from "@angular/core";
import * as Globals from "../globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ColumnaService {
  serverUrl: string;

  constructor(private http: HttpClient) {
    this.serverUrl = Globals.SERVER;
  }
  
  /* ES Obligatorio Enviar objeTosend FILTER; REQUIERE EL NOMBRE DE LA TABLA*/
  getAll(objeTosend: any): Observable<any> {
    let filter = "";

    //si trae filtro
    if (objeTosend) {
      filter = `(filter: {
        TABLE_NAME: "${objeTosend.TABLE_NAME}",
      })`;
    }

    let body = {
      query: `{
        listaCamposTable ${filter}{
          COLUMN_NAME    
          DATA_TYPE
          COLUMN_TYPE    
          CHARACTER_MAXIMUM_LENGTH 
        }
      }
      `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
}
