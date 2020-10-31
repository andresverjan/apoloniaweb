import { Injectable } from "@angular/core";
import * as Globals from "../../modules/core/globals";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ToolsService } from '../core/services/tools.service'

@Injectable({
  providedIn: "root",
})
export class ProductosService {
  serverUrl: string;

  constructor(private http: HttpClient, private toolsService: ToolsService) {
    this.serverUrl = Globals.SERVER;
  }

  deleteProducto(id) {
    let body = {
      query: `
      mutation {
        deleteProducto(producto: {_id: "${id}"}) {
          description
        }
      }
          `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
  createProducto(objeTosend) {
    const { id, name, img, description, comercioId } = objeTosend;
    let body = {
      query: `mutation {
        createProducto(producto:
          {
            id: "${id}",
            name: "${name}",
            img: "${img}",
            description: "${description}"
            comercioId: ${comercioId}
          }
        ) {
          name
          description
          id
          img
          comercioId
        }
      }
      `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  updateProduct(objeTosend) {
    const { _id, id, name, img, description, comercioId } = objeTosend;

    let body = {
      query: `
      mutation {
        updateProducto (producto: {
            _id: "${_id}",
            id: "${id}",
            name: "${name}",
            img: "${img}",
            description: "${description}"
            comercioId: ${comercioId}
        }) {     
           name
        }  
      }
      `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  fetchProductos(objeTosend): Observable<any> {
    //   let filter = ``;
    //   if (objeTosend) {
    //     filter = `(filter: {
    //       name: "${objeTosend.name}",
    //       comercioId: ${objeTosend.comercioId}
    //     })`;
    //   }

    //   let body = {
    //     query: `
    //     {
    //       listarProductos ${filter} {
    //         _id
    //         id
    //         name
    //         comercioId
    //         description
    //         img
    //       }
    //     }
    //     `,
    //   };

    //   let headers = new HttpHeaders().set("Content-Type", "application/json");
    //   return this.http.post(this.serverUrl, body, { headers: headers });
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
          comercioId: ${filter.comercioId}
        }`;
      }
      if (order != null && order != undefined) {
        ordenamiento = `order: {
          name: "${order.name}",
          comercioId: "${order.comercioId}",
          location: "${order.location}",
          description: "${order.description}"
        }`;
      }
    }
    
    params = this.toolsService.getParams(filtro, ordenamiento);

    let body = {
      query: `
      {
        listarProductos
         ${params}
          { 
            ${properties} 
          }
      }`,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
}
