import { Injectable } from "@angular/core";
import * as Globals from "../globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { HttpService } from "./HttpService";

@Injectable({
  providedIn: "root",
})
export class ConfigDashBoardService {
    
  constructor(private http: HttpClient, private httpService: HttpService) {
      
  }

  getDashBoardItemsByTipo(id): Observable<any> {
    let body = {
      query: `
          query  { getDashBoardItemsByTipo (componenteTipo: ${id}) {
            codigo
            Nombre
            descripcion
            componenteTipo
            color1
            color2
            color3
            color4
            orden
            icono
            visible
            titulo
          } }
          `,
    };
    return this.httpService.callApi(body);
  }


}
