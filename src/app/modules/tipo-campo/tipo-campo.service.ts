import { Injectable } from "@angular/core";
import * as Globals from "../../modules/core/globals";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { HttpService } from "../core/services/HttpService";

@Injectable({
  providedIn: "root",
})
export class TipoCampoService {

  constructor(private http: HttpClient,  private httpService: HttpService ) {
  }

  getAll(objeTosend?): Observable<any> {
    let filter = "";

    //si trae filtro
    if (objeTosend) {
      filter = `(filter: {
        nombre: "${objeTosend.nombre}",
      })`;
    }

    let body = {
      query: `{
        tipocampos ${filter} {
          id
          nombre
          descripcion
          active
          createdBy
        }
      }
      `,
    };
    return this.httpService.callApi(body);
     
     
  }
}
