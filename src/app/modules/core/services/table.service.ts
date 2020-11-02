import { Injectable } from "@angular/core";
import * as Globals from "../globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TableService {
  serverUrl: string;

  constructor(private http: HttpClient) {
    this.serverUrl = Globals.SERVER;
  }

  getAll(objeTosend?: any): Observable<any> {
    let filter = "";
    //si trae filtro
    if (objeTosend) {
      filter = `(filter: {
        TABLE_NAME: "${objeTosend.nombre}",
      })`;
    }
    let body = {
      query: `{
        listaTables ${filter}{
          TABLE_NAME
        }
      }`,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
}
