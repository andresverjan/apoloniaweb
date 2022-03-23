import { Injectable } from "@angular/core";
import * as Globals from "../core/globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { HttpService } from "../core/services/HttpService";

@Injectable({
    providedIn: "root",
})

export class GiancarloLearningService{
    serverUrl: string;
    constructor(private http: HttpClient, private httpService: HttpService){
        this.serverUrl = Globals.SERVER;
    }

    list(obj?):  Observable<any>{
        let body = {
            query: `{
                giancarloLearning{
                    id
                    nombre
                    apellido
                    cedula
                    email
                    fechaNacimiento
                    activo
                    eliminado
                    sexo
                    edad
                    mascotaFavorita
                  }
            }`
        }
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.http.post('https://http://localhost:3000/api', body, { headers: headers});
    }

}