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

  configByParamGroup(grupoParametro: any): Observable<any> {
    let filter = "";

    if (grupoParametro) {
      filter = `(GrupoParametro:"${grupoParametro}")`;
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
    return this.httpService.callApi(body);
     
     
  }

  incrementCountConfigParamOnPayment(param): Observable<any> {
  let body = {
      query: `mutation {
                updateParamGroup(configParam: { id: ${param.id},
                                                Valor: "${
                                                  parseInt(param.Valor) + 1
                                                }"
                                               })
              }
            `,
    };
    return this.httpService.callApi(body);
     
     
  }
}
