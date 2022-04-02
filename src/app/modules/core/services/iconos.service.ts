import { Injectable } from "@angular/core";
import * as Globals from "../globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { HttpService } from "./HttpService";

@Injectable({
  providedIn: "root",
})
export class IconosService {

  constructor(private http: HttpClient, private httpService: HttpService) {
  }

  getAll(objeTosend?: any): Observable<any> {
    let filter = "";
    if (objeTosend) {
      filter = `(filter: {
        nombre: "${objeTosend.nombre}",
      })`;
    }
    let body = {
      query: `{
        iconos ${filter}{
          nombre
        }
      }`,
    };
    return this.httpService.callApi(body);
  }
}
