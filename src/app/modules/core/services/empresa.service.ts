import { Injectable } from "@angular/core";
import * as Globals from "../globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { HttpService } from "./HttpService";
import { ToolbarInput } from "@fullcalendar/angular";
import { ToolsService } from "./tools.service";

@Injectable({
  providedIn: "root",
})
export class EmpresaService {
  constructor(
    private http: HttpClient,
    private httpService: HttpService
  ) {
  }

  getEmpresaById(objeTosend: any): Observable<any> {
    let filter = "";
    console.log(objeTosend);
    if (objeTosend) {
      filter = `(id: ${objeTosend})`;
    }
    let body = {
      query: `
      {
        getEmpresaById${filter}{
          nombre
          codigo
          descripcion
          primaryColor
          secondaryColor
          accentColor
          warnColor
          urlLogo 
          NIT
          celular
          direccion
          ciudad
          telefono   
        }
      }`,
    };
    return this.httpService.callApi(body);
  }

}
