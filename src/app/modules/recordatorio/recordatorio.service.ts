import { Injectable } from "@angular/core";
import * as Globals from "../core/globals";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { HttpService } from "../core/services/HttpService";

@Injectable({
  providedIn: "root",
})
export class RecordatorioService {
    
  SERVER_RECURSO_LOGIN_ADMIN = "";

  constructor(private http: HttpClient, private httpService: HttpService) {
      
  }

  list(objeTosend?): Observable<any> {
    let params = "";
    let pagination = `
    pagination: {
      pagina: ${objeTosend?.pagina != "" && objeTosend?.pagina != undefined ? `${objeTosend?.pagina}` : 1}
      limite:  ${objeTosend?.limite != "" && objeTosend?.limite != undefined ? `${objeTosend?.limite}` : 5}
    }`;
    let filter = "";
    if (objeTosend?.filter != null) {
      filter = `,filter: {`;
      filter += objeTosend.filter.nombre != "" ? `nombre: "${objeTosend.filter.nombre}"` : "";
      filter += `}`;
    }
    params = `(${pagination} ${filter} )`;


    let body = {
      query: `{
        recordatorios ${params} {    
          lista {
            id
            nombre
            repetir
            observaciones
            active
            fechaRecordatorio
            repetirCadaTimes
            repetirCada
            endsNever
            endsOn
            endsAfter
            createdBy
            createdAt
            updatedAt
            EMPRESA_ID
          } 
          totalRegistros
        }
     }
     `
    }
    return this.httpService.callApi(body);
  }

  createUsers(objeTosend): Observable<any> {
    let body = {
      query: `
      mutation {
        saveRecordatorios(recordatorio: {
          nombre: "${objeTosend.nombre}", 
          repetir: ${objeTosend.repetir},
          observaciones: "${objeTosend.observaciones}", 
          fechaRecordatorio: "${objeTosend.fechaRecordatorio}", 
          active: ${objeTosend.active},
          repetirCadaTimes: ${objeTosend.repetirCadaTimes}, 
          repetirCada: ${objeTosend.repetirCada},
          endsNever: ${objeTosend.endsNever},
          endsOn: "${objeTosend.endsOn || 0}",
          endsAfter: ${objeTosend.endsAfter}, 
          EMPRESA_ID: ${objeTosend.EMPRESA_ID}}) {
          id
        }
      }
      `,
    };
    return this.httpService.callApi(body);
  }

  updateUsers(objeTosend): Observable<any> {
    console.log(objeTosend);
    let body = {
      query: `
      mutation {
        updateRecordatorios(recordatorio: {
          id: ${objeTosend.id},  
          nombre: "${objeTosend.nombre}", 
          repetir: ${objeTosend.repetir},
          observaciones: "${objeTosend.observaciones}", 
          fechaRecordatorio: "${objeTosend.fechaRecordatorio}", 
          active: ${objeTosend.active},
          repetirCadaTimes: ${objeTosend.repetirCadaTimes}, 
          repetirCada: ${objeTosend.repetirCada},
          endsNever: ${objeTosend.endsNever},
          endsOn: "${objeTosend.endsOn || 0}",
          endsAfter: ${objeTosend.endsAfter}, 
          EMPRESA_ID: ${objeTosend.EMPRESA_ID}}) {
          id
          
        }
      }
      `,
    };
    return this.httpService.callApi(body);
  }

  deleteUsers(id): Observable<any> {
    console.log(id)
    let body = {
      query: `
      mutation {
        deleteRecordatorios(recordatorio: {id: ${id}}) 
      }`,
    };
    return this.httpService.callApi(body);
  }
}