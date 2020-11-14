import { Injectable } from "@angular/core";
import * as Globals from "../../modules/core/globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  serverUrl: string;
  SERVER_RECURSO_LOGIN_ADMIN = "";

  constructor(private http: HttpClient) {
    this.serverUrl = Globals.SERVER;
  }

  loginWeb(objeTosend): Observable<any> {
    let body = {
      query: `
      query {
        login( username: "${objeTosend.usuario}",
               password: "${objeTosend.password}"){
          USUARIO_NOMBRE
          USUARIO_CORREO
          USUARIO_LOGIN
          USUARIO_APELLIDO
          USUARIO_TELEFONO
          URL_FOTO_PERFIL
          STATUS_ONLINE
          EMPRESA_ID
          PERMISOS {
            nombre
            descripcion
            icon
            url_menu
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
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
}
