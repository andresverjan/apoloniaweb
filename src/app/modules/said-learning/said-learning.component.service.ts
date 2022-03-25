import { Injectable } from "@angular/core";
import * as Globals from "../core/globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { HttpService } from "../core/services/HttpService";

@Injectable({
  providedIn: "root",
})
export class saidLearningService {
  serverUrl: string;

  constructor(private http: HttpClient,private httpService: HttpService) {
    this.serverUrl = Globals.SERVER;
  }

  getAll(object?): Observable<any> {
    let body = {
      query: `{
            saidLearning{
              id
              nombreAnimal
              nombreDueno
              Raza
              NumIdentificacion
              email
              sectorVivienda
              fechaNacimiento
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
            id:"${mascota.id}",
            nombreAnimal:"${mascota.nombreAnimal}",
            nombreDueno:"${mascota.nombreDueno}",
            Raza:"${mascota.Raza}",
            NumIdentificacion:"${mascota.NumIdentificacion}",
            email:"${mascota.email}",
            sectorVivienda:"${mascota.sectorVivienda}",
            fechaNacimiento:"${mascota.fechaNacimiento}"
        })
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
            id:"${mascota.id}",
            nombreAnimal:"${mascota.nombreAnimal}",
            nombreDueno:"${mascota.nombreDueno}",
            Raza:"${mascota.Raza}",
            NumIdentificacion:"${mascota.NumIdentificacion}",
            email:"${mascota.email}",
            sectorVivienda:"${mascota.sectorVivienda}",
            fechaNacimiento:"${mascota.fechaNacimiento}"
        })
      }
      `,
    };
    return this.httpService.callApi(body);
  }

  deleteMascota(mascotaId): Observable<any> {
    let body = {
      query: `
        mutation {
          deleteSaid (saidLearning: {id: "${mascotaId.id}"})
        }
        `,
    };
    return this.httpService.callApi(body);
  }
}
