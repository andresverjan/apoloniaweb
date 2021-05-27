import { Injectable } from "@angular/core";
import * as Globals from "../globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { HttpService } from "./HttpService";

@Injectable({
  providedIn: "root",
})
export class ConfigParametrosService {
  serverUrl: string;
  constructor(private http: HttpClient, private httpService: HttpService) {
    this.serverUrl = Globals.SERVER;
  }

  configByParamGroup(objeTosend: any): Observable<any> {
    let filter = "";

    if (objeTosend) {
      filter = `(GrupoParametro:"CONTA_CONFIG" {
        NombreParametro: "${objeTosend.NombreParametro}"
      })`;
    }

    let body = {
      query: `query{ configByParamGroup ${filter}{
                id
                NombreParametro
                GrupoParametro
                EmpresaID
                Observaciones
                Valor
            }
          }`,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
  
}