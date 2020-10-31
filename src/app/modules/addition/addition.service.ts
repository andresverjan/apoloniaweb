import { Injectable } from "@angular/core";
import * as Globals from "../../modules/core/globals";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AdditionsService {
  serverUrl: string;

  constructor(private http: HttpClient) {
    this.serverUrl = Globals.SERVER;
  }
  
  ListAddition(objeTosend?): Observable<any> {
    let filter = "";
    if (objeTosend != null) {
      filter = `(filter: {
        name: "${objeTosend.name}",
        description: "${objeTosend.description}",
        
      })`;
    }

    let body = {
      query: `{ additions ${filter} { _id name value description img  }}`,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  createAddition(objeTosend): Observable<any> {
    let body = {
      query: `
      mutation {
        createAddition (addition: {
            name: "${objeTosend.name}",
            value: "${objeTosend.value}",
            img:"${objeTosend.img}",
            active:"true",
            description: "${objeTosend.description}",
        }) {     
           name
        }  
      }
      `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  updateAddition(objeTosend): Observable<any> {
    let body = {
      query: `
      mutation {
        updateAddition (addition: {
            _id: "${objeTosend._id}",
            name: "${objeTosend.name}",
            value:"${objeTosend.value}",
            img:"${objeTosend.img}",
            active:"${objeTosend.active}",
            description: "${objeTosend.description}",
            
        }) {     
           name
        }  
      }
      `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }

  deleteAddition(id): Observable<any> {
    let body = {
      query: `
        mutation {
          deleteAddition(addition: {_id: "${id}"}) {
             description
          }
        }
        `,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
}
