import { Injectable } from "@angular/core";
import * as Globals from "../core/globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ApplicationService {
  serverUrl: string;

  constructor(private http: HttpClient) {
    this.serverUrl = Globals.SERVER;
  }

  getAll(): Observable<any> {
    let body = {
      query: `{
        applications{
          id
          nombre
          nombreTabla
          active
          createdBy
          createdAt
          updatedAt
        }
      }`,
    };
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.serverUrl, body, { headers: headers });
  }
}
