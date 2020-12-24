import { Injectable } from "@angular/core";
import * as Globals from "../../modules/core/globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { HttpService } from "../core/services/HttpService";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  serverUrl: string;
  SERVER_RECURSO_LOGIN_ADMIN = "";

  constructor(private http: HttpClient, private httpService: HttpService) {
    this.serverUrl = Globals.SERVER;
  }

  loginWeb(objeTosend): Observable<any> {
    let body = {
      query: `
      query {
        login( username: "${objeTosend.usuario}",
               password: "${objeTosend.password}"){
          ID
          USUARIO_NOMBRE
          USUARIO_CORREO
          USUARIO_LOGIN
          USUARIO_APELLIDO
          USUARIO_TELEFONO
          URL_FOTO_PERFIL
          STATUS_ONLINE
          EMPRESA_ID
          IDIOMA_ID
          PERMISOS {
            nombre
            descripcion
            icon
            url_menu
            applicationId
          }
          IDIOMA{
            NOMBRE_IDIOMA
            BANDERA
          }
          ETIQUETAS {
            LABEL
            NOMBRE
            DESRIPCION
          }
        } 
      }
      `,
    };
    return this.httpService.callApi(body);
  }
}
