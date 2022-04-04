import { Injectable } from "@angular/core";
import * as Globals from "../../modules/core/globals";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ToolsService } from "../core/services/tools.service";
import { HttpService }  from "../core/services/HttpService";

@Injectable({
  providedIn: "root",
})
export class ProfileService {    
  public USUARIO;
  userKey: string = "USUARIO";

  constructor(private http: HttpClient, private toolService: ToolsService, private httpService: HttpService) {
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
    return this.httpService.callApi(body);
  }  

  updatePassword(objeTosend): Observable<any> {
    let body = {
      query: `
      mutation {
        updatePassword (password: {
          USUARIO_CORREO: "${objeTosend.USUARIO_CORREO}",
           USUARIO_PASSWORD: "${objeTosend.USUARIO_PASSWORD}"
        }) {     
          USUARIO_CORREO
        }  
      }
      `,
    };
    return this.httpService.callApi(body);
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
    return this.httpService.callApi(body);
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
                IDIOMA_ID
            }
            }
      `,
    };
    return this.httpService.callApi(body);
  }
}
