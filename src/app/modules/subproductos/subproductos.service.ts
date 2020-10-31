import { Injectable } from '@angular/core';
import * as Globals from '../../modules/core/globals';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubproductosService {
  serverUrl: string;

  constructor(private http: HttpClient) {
    this.serverUrl = Globals.SERVER;
  }

  listarSubproductos(objeTosend: any): Observable<any> {
    let filter = ``;
    if (objeTosend) {//
      filter = `(filter: {`;

      if(objeTosend.comercioId) {
        filter +=   `comercioId: "${objeTosend.comercioId}"`;
      }

      if(objeTosend.productoId) {
        filter +=   `${objeTosend.comercioId? "," : ""} productoId: "${objeTosend.productoId}"`;
      }

      if(objeTosend.name) {
        filter +=   `${objeTosend.comercioId? "," : ""} ${objeTosend.productoId? "," : ""}  name: "${objeTosend.name}"`;
      }

      filter += '})';
    }

    console.log('listarsubproductos service json: ', filter);


    let body = {
      query: `{listarSubproductos ${filter} {_id, productoId, comercioId, name, value, description, activo, img } }`
    }

    console.log("a ver que SALIó en BODYYY", body);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.serverUrl, body, { headers: headers })
  }

  createSubproducto(objeTosend) {
    const { name, img, description, value, productoId, comercioId } = objeTosend;
    let body ={
       query: `mutation {
        createSubproducto(subproducto:
          {
            name: "${name}"
            img: "${img}"
            activo: "true"
            description: "${description}"
            value: "${value}"
            productoId: "${productoId}"
            comercioId: "${comercioId}"
          }
        ) {
          _id
          name
          img
          activo
          description
          productoId
          comercioId
        }
      }
      `
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  updateSubproduct(objeTosend) {
    const { _id, name, img, description, value, productoId, comercioId } = objeTosend;

    let body = {
      query: `
      mutation {
        updateSubproducto (subproducto: {
            _id: "${_id}",
            name: "${name}"
            img: "${img}"
            activo: "true"
            description: "${description}"
            value: "${value}"
            productoId: "${productoId}"
            comercioId: "${comercioId}"
        }) {
          _id
           name
        }
      }
      `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  deleteSubproducto(id) {
    let body = {
      query: `
      mutation {
        deleteSubproducto(subproducto: {_id: "${id}"}) {
          description
        }
      }
          `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  fetchSubProductos(objeTosend): Observable<any> {
    let obj = [objeTosend];
    let json = JSON.stringify(obj);
    console.log(json);

    let filter = ``;
    if (objeTosend != null) {
      filter = `(filter: {
        name: "${objeTosend.name}",
      })`;
    }

    let body = {
      query: `
      {
        listarProductos ${filter} {
          _id
          id
          name
          comercioId
          description
          img
        }
      }
      `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
}
