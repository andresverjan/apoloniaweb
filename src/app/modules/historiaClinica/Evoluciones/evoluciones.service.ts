import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ToolsService } from "../../core/services/tools.service";
import { environment } from "src/environments/environment";
import { HttpService } from "../../core/services/HttpService";

@Injectable({
  providedIn: "root",
})
export class EvolucionesService {

  constructor(private http: HttpClient, private toolService: ToolsService, private httpService: HttpService) { }

  getAll(objeTosend?: any): Observable<any> {
    let params = "";
    let ordenamiento = "";
    let filter = "";
    //si trae filtro
    if (objeTosend) {
      filter = `(filter: {
        Cedula: "${objeTosend}"
      })`;
    }

    params = this.toolService.getParams(filter, ordenamiento);

    let body = {
      query: `{
        getCitasHC ${filter}{
          id
          Paciente
          Cedula
          IdOdontologo
          Fecha
          Observacion
          Nombres
          Apellidos
        }
      }
      `,
    };

    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(environment.apiUrl, body, { headers: headers });
  }

  save(objeTosend): Observable<any> {
    let paramTest = [];
    Object.entries(objeTosend).forEach(([key, value]) => {
      paramTest.push(key + ': "' + value + '"');
    });
    console.log(paramTest);
    console.log(paramTest.toString());
    let body = {
      query: `
          mutation {
            saveEvolucion (citaHC: {${paramTest.toString()}}   ) { 
                title
            }
          }
          `,
    };
    return this.httpService.callApi(body);
  }

  update(objeTosend): Observable<any> {
    let paramTest = [];
    Object.entries(objeTosend).forEach(([key, value]) => {
      if(key === 'id'){
        paramTest.push(key + ': ' + value );
      }else{
        paramTest.push(key + ': "' + value + '"');  
      }
    });
    console.log(paramTest);
    console.log(paramTest.toString());
    let body = {
      query: `
          mutation {
            updateEvolucion (citaHC: {${paramTest.toString()}}   ) { 
                id
                Cedula
            }
          }
          `,
    };
    return this.httpService.callApi(body);
  }


}
