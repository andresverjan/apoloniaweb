import { Injectable } from "@angular/core";
import * as Globals from "../../modules/core/globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ToolsService } from "../core/services/tools.service";

@Injectable({
  providedIn: "root",
})
export class OrdersService {
  serverUrl: string;

  constructor(private http: HttpClient, private toolsService: ToolsService) {
    this.serverUrl = Globals.SERVER;
  }

  acceptOrder(objeTosend): Observable<any> {
    const _id = objeTosend;
    console.log("ID ACEPTAR", _id);

    let body = {
      query: `
      mutation {
        acceptRequest
        (request:  {
          _id : "${_id}"
        })
          {
            _id
            status
          }
      }`,
    };
    console.log("BODY ACEPTAR", body);

    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  preparedOrder(objeTosend): Observable<any> {
    const _id = objeTosend;
    console.log("ID PREPARAR", _id);

    let body = {
      query: `
      mutation {
        preparedRequest
        (request:  {
          _id : "${_id}"
        })
          {
            _id
            status
          }
      }`,
    };
    console.log("BODY Preparar", body);

    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
  cancelOrder(objeTosend): Observable<any> {
    const _id = objeTosend;
    console.log("ID CANCELAR", _id);

    let body = {
      query: `
      mutation {
        cancelRequest
        (request:  {
          _id : "${_id}"
        })
          {
            _id
            status
          }
      }`,
    };
    console.log("BODY Cancelar", body);

    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  deliveredOrder(objeTosend): Observable<any> {
    const _id = objeTosend;
    console.log("ID Delivered", _id);

    let body = {
      query: `
      mutation {
        deliveredRequest
        (request:  {
          _id : "${_id}"
        })
          {
            _id
            status
          }
      }`,
    };
    console.log("BODY Delivered", body);

    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  fetchOrders(objeTosend): Observable<any> {
    let filtro = "";
    let ordenamiento = "";
    let params = "";

    const { order, filter, properties } = objeTosend;

    if (objeTosend != null) {
      if (filter != null && filter != undefined) {
        filtro = `filter: {
          status: "${filter.status ? filter.status : '1'}"
        }`;
      }

      if (order != null && order != undefined) {
        ordenamiento = `order: {
          updatedAt: "${order.updatedAt}"
        }`;
      }
    }

    params = this.toolsService.getParams(filtro, ordenamiento);

    let body = {
      query: `
      {
        requests
         ${params}
          {
            ${properties}
          }
      }`,
    };

    console.log(body);
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
}
