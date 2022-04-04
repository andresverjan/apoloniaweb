import { Injectable } from "@angular/core";
import * as Globals from "../globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { HttpService } from "./HttpService";

@Injectable({
  providedIn: "root",
})
export class TableService {
    

  constructor(private http: HttpClient, private httpService: HttpService) {
      
  }

  getAll(objeTosend?: any): Observable<any> {
    console.log(objeTosend);
    let filter = "";
    //si trae filtro
    if (objeTosend) {
      filter = `(filter: {
        TABLE_NAME: "${objeTosend.TABLE_NAME}",
      })`;
    }
    let body = {
      query: `{
        listaTables ${filter}{
          TABLE_NAME
        }
      }`,
    };
    return this.httpService.callApi(body);
  }
}
