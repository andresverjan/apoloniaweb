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
        console.log("OBJ: " + obj);
        let params = "";
        let pagination = `
        pagination: {
        pagina: ${obj?.pagina != "" && obj?.pagina != undefined ? `${obj?.pagina}` : 1}
        limite:  ${obj?.limite != "" && obj?.limite != undefined ? `${obj?.limite}` : 5}
        }`;
        let filter = "";
        if (obj?.filter != null) {
        filter = `,filter: {`;
        filter += obj.filter.nombre != "" ? `nombre: "${obj.filter.nombre}"` : "";
        filter += `}`;
        }
        params = `(${pagination} ${filter} )`;
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
        return this.httpService.callApi(body);
    }


    createUser(obj): Observable<any> {
        let body = {
            query: `
            mutation {
                createGiancarloLearning(tablaObject: {
                    nombre: "${obj.nombre}",
                    apellido: "${obj.apellido}",
                    cedula: "${obj.cedula}",
                    email: "${obj.email}",
                    fechaNacimiento: "${obj.fechaNacimiento}",
                    activo: ${obj.activo},
                    eliminado: ${obj.eliminado},
                    sexo: "${obj.sexo}",
                    edad: ${obj.edad},
                    mascotaFavorita: "${obj.mascotaFavorita}"}) {
                        id
                    }
            }
            `,
        };
        return this.httpService.callApi(body);
    }

    updateUser(obj): Observable<any>{
        let body = {
            query:  `
            mutation {
                updateGiancarloLearning(tablaObject: {
                    id: ${obj.id},
                    nombre: "${obj.nombre}",
                    apellido: "${obj.apellido}",
                    cedula: "${obj.cedula}",
                    email: "${obj.email}",
                    fechaNacimiento: "${obj.fechaNacimiento}",
                    activo: ${obj.activo},
                    eliminado: ${obj.eliminado},
                    sexo: "${obj.sexo}",
                    edad: ${obj.edad},
                    mascotaFavorita: "${obj.mascotaFavorita}"}) {
                        id
                    }
            }
            `,
        };
        return this.httpService.callApi(body);

    }

    deleteUser(id): Observable<any>{
        let body = {
            query: `
            mutation {
                deleteGiancarloLearning(tablaObject: {
                    id: ${id}
                })
            }`
        }
        return this.httpService.callApi(body);
    }
}