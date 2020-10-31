import { Injectable } from "@angular/core";
import * as Globals from "../../modules/core/globals";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ToolsService } from '../core/services/tools.service'

@Injectable({
  providedIn: "root",
})
export class ComerciosService {
  serverUrl: string;

  constructor(private http: HttpClient, private toolService: ToolsService) {
    this.serverUrl = Globals.SERVER;
  }

  ListComercios(objeTosend?): Observable<any> {
    let filtro = "";
    let ordenamiento = "";
    let params = "";

    const { order, filter, properties } = objeTosend;
    // let objTest = {
    //   filter: {},
    //   order: {},
    //   properties: "",
    // };

    if (objeTosend != null) {
      if (filter != null && filter != undefined) {
        filtro = `filter: {
          name: "${filter.name}",
          location: "${filter.location}",
          description: "${filter.description}",
        }`;
      }
      if (order != null && order != undefined) {
        ordenamiento = `order: {
          name: "${order.name}",
          id: "${order.id}", 
          location: "${order.location}",
          description: "${order.description}"
        }`;
      }
    }

    params = this.toolService.getParams(filtro, ordenamiento);

    let body = {
      query: `{ comercios ${params} { ${properties} }}`,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  createComercio(objeTosend): Observable<any> {
    let body = {
      query: `
      mutation {
        createComercio (comercio: {
            id: "${objeTosend.id}"
            name: "${objeTosend.name}",
            location: "${objeTosend.location}",
            description: "${objeTosend.description}",
            lat: "${objeTosend.lat}",
            lng: "${objeTosend.lng}",
        }) {
           name
        }
      }
      `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  updateComercio(objeTosend): Observable<any> {
    let body = {
      query: `
      mutation {
        updateComercio (comercio: {
            _id: "${objeTosend._id}",
            id: "${objeTosend.id}",
            name: "${objeTosend.name}",
            location: "${objeTosend.location}",
            description: "${objeTosend.description}",
            lat: "${objeTosend.lat}",
            lng: "${objeTosend.lng}",
        }) {
           name
        }
      }
      `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  deleteComercio(id): Observable<any> {
    let body = {
      query: `
        mutation {
          deleteComercio(comercio: {_id: "${id}"}) {
             description
          }
        }
        `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
}
