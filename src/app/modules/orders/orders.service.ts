import { Injectable } from "@angular/core";
import * as Globals from "../../modules/core/globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ToolsService } from "../core/services/tools.service";
import { HttpService }  from "../core/services/HttpService";

@Injectable({
  providedIn: "root",
})
export class OrdersService {
  serverUrl: string;

  constructor(private http: HttpClient, private toolsService: ToolsService, private httpService: HttpService) {
    this.serverUrl = Globals.SERVER;
  }

  acceptOrder(objeTosend): Observable<any> {
    const _id = objeTosend;

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
    return this.httpService.callApi(body);
     
     
  }

  preparedOrder(objeTosend): Observable<any> {
    const _id = objeTosend;

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

    return this.httpService.callApi(body);
     
     
  }
  cancelOrder(objeTosend): Observable<any> {
    const _id = objeTosend;

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

    return this.httpService.callApi(body);
     
     
  }

  deliveredOrder(objeTosend): Observable<any> {
    const _id = objeTosend;

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

    return this.httpService.callApi(body);
     
     
  }

  fetchOrders(objeTosend): Observable<any> {
    let filtro = "";
    let ordenamiento = "";
    let params = "";

    const { order, filter, properties } = objeTosend;

    if (objeTosend != null) {
      if (filter != null && filter != undefined) {
        filtro = `filter: {
          status: "${filter.status ? filter.status : "1"}"
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

    return this.httpService.callApi(body);
     
     
  }
}
