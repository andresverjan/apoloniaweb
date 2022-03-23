import { Injectable } from "@angular/core";
import * as Globals from "../core/globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { HttpService } from "../core/services/HttpService";
import * as moment from "moment";

@Injectable({
  providedIn: "root",
})
export class saidLearningService {
  serverUrl: string;

  constructor(
    private httpService: HttpService) {
    this.serverUrl = Globals.SERVER;
  }

  getAll(object?):  Observable<any>{
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
              activo
              eliminado
            }
          }`
    }
    return this.httpService.callApi(body);
}
}