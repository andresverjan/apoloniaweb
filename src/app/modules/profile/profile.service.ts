import { Injectable } from "@angular/core";
import * as Globals from "../../modules/core/globals";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ToolsService } from "../core/services/tools.service";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  serverUrl: string;
  public USUARIO;
  userKey: string = "USUARIO";
  SERVER_RECURSO_GET_PROFILE = "WsUsers/getMyProfile";
  SERVER_RECURSO_ACTUALIZAR_PROFILE = "WsUsers/actualizar";
  SERVER_RECURSO_ACTUALIZAR_PROFILE_FOTO = "WsUsers/actualizarProfileFoto";

  constructor(private http: HttpClient, private toolService: ToolsService) {
    this.serverUrl = Globals.SERVER;
    this.USUARIO = JSON.parse(localStorage.getItem(this.userKey));
  }

  getMyProfile(objeTosend): Observable<any> {
    let filtro = "";
    let ordenamiento = "";
    let params = "";
    const { filter, properties } = objeTosend;
    if (objeTosend != null) {
      if (filter != null && filter != undefined) {
        filtro = `profile: {
          _id: "${filter._id}"
        }`;
      }
    }
    params = this.toolService.getParams(filtro, ordenamiento);
    let body = {
      query: `{ getMyProfile ${params} { ${properties} }}`,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  actualizarProfile(objeTosend): Observable<any> {
    const params = new HttpParams({
      fromObject: objeTosend,
    });
    return this.http.get(
      this.serverUrl + this.SERVER_RECURSO_ACTUALIZAR_PROFILE,
      { params }
    );
  }

  updatePassword(objeTosend): Observable<any> {
    let body = {
      query: `
      mutation {
        updatePassword (password: {
          USUARIO_CORREO: "${objeTosend.USUARIO_CORREO}",
           USUARIO_PASSWORD: "${objeTosend.USUARIO_PASSWORD}"
        }) {     
           USUARIO_PASSWORD
        }  
      }
      `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
  idiom(): Observable<any> {
    let body = {
      query: `
      {
  idiomas{
    id
    NOMBRE_IDIOMA
  }
}`,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  updateProfile(objeTosend): Observable<any> {
    let body = {
      query: `
        mutation{
            updateUser(User:{
              id:${objeTosend.id}
              IDIOMA_ID:"${objeTosend.IDIOMA_ID}"
              USUARIO_NOMBRE:"${objeTosend.USUARIO_NOMBRE}"
              USUARIO_APELLIDO:"${objeTosend.USUARIO_APELLIDO}"
              USUARIO_CORREO:"${objeTosend.USUARIO_CORREO}"
              USUARIO_TELEFONO:"${objeTosend.USUARIO_TELEFONO}"
              }){
                id
                USUARIO_NOMBRE
                USUARIO_LOGIN
                USUARIO_PASSWORD
            }
            }
      `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
}
