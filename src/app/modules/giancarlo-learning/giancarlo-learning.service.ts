import { Injectable } from "@angular/core";
import * as Globals from "../core/globals";
import { HttpClient} from "@angular/common/http";
import { Observable } from "rxjs";
import { HttpService } from "../core/services/HttpService";
import { ToolsService } from "../core/services/tools.service";

@Injectable({
    providedIn: "root",
})

export class GiancarloLearningService{
    serverUrl: string;
    constructor(private http: HttpClient, private httpService: HttpService, private toolService: ToolsService ){
        this.serverUrl = Globals.SERVER;
    }

    list(obj?):  Observable<any>{
        let filter = "";
        let params = "";
        let ordenamiento = `order: {
            nombre: "ASC"
          }`;
        if(obj){
            filter = `filter: {
                nombre: "${obj.nombre}",
            }`;
        }
        params = this.toolService.getParams(filter, ordenamiento);
        let body = {
        query: `{
            giancarloLearning ${params}{
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
                deleteGiancarloLearning(tablaObject: {id: ${id}}){
                    id
                }
            }`,
        };
        return this.httpService.callApi(body);
    }
}