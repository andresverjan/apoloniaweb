import { Injectable } from "@angular/core";
//import * as Globals from "../globals";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  constructor(private http: HttpClient) {}

  public callApi(body): Observable<any> {
    console.log(
      body.query.toString().replace(/\r?\n/g, "").replace(/\s+/g, " ")
    );
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(environment.apiUrl, body, { headers: headers });
  }
}
