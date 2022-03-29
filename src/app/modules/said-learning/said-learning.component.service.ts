import { Injectable } from "@angular/core";
import * as Globals from "../core/globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { filter, Observable } from "rxjs";
import { HttpService } from "../core/services/HttpService";
import { ToolsService } from "../core/services/tools.service";

@Injectable({
  providedIn: "root",
})
export class saidLearningService {
  serverUrl: string;

  constructor(private http: HttpClient,private httpService: HttpService, private toolservice: ToolsService) {
    this.serverUrl = Globals.SERVER;
  }

  getAll(object?): Observable<any> {
    let filtro = "";
    let orden = `order:{
      nombreAnimal: "ASC"
    }`;
    let params = "";
    if(object){
      filtro = `filter: {
        nombreAnimal: "${object.nombreAnimal}"
      }`
    };
    params = this.toolservice.getParams(filtro, orden);
    let body = {
      query: `{
            saidLearning ${params }{
              id
              nombreAnimal
              nombreDueno
              Raza
              NumIdentificacion
              email
              sectorVivienda
              fechaNacimiento
              activo
              eliminado
            }
          }`,
    };
    return this.httpService.callApi(body);
  }

  createMascota(mascota): Observable<any> {
    let body = {
      query: `
      mutation {
        createSaid (saidLearning: {
            nombreAnimal:"${mascota.nombreAnimal}",
            nombreDueno:"${mascota.nombreDueno}",
            Raza:"${mascota.Raza}",
            NumIdentificacion:"${mascota.NumIdentificacion}",
            email:"${mascota.email}",
            sectorVivienda:${mascota.sectorVivienda},
            fechaNacimiento:"${mascota.fechaNacimiento}",
            activo:${mascota.activo},
            eliminado:${mascota.eliminado} 
        }){
          id
        }
      }
      `,
    };
    return this.httpService.callApi(body);
  }

  updateMascota(mascota): Observable<any> {
    let body = {
      query: `
      mutation {
        updateSaid (saidLearning: {
            id:${mascota.id},
            nombreAnimal:"${mascota.nombreAnimal}",
            nombreDueno:"${mascota.nombreDueno}",
            Raza:"${mascota.Raza}",
            NumIdentificacion:"${mascota.NumIdentificacion}",
            email:"${mascota.email}",
            sectorVivienda:${mascota.sectorVivienda},
            fechaNacimiento:"${mascota.fechaNacimiento}",
            activo:${mascota.activo},
            eliminado:${mascota.eliminado}
        }){
          id
        }
      }
      `,
    };
    return this.httpService.callApi(body);
  }

  deleteMascota(mascotaId): Observable<any> {
    let body = {
      query: `
        mutation {
          deleteSaid (saidLearning: {id: ${mascotaId}}){
            id
          }
        }
        `,
    };
    return this.httpService.callApi(body);
  }
}
