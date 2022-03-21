import { Injectable } from "@angular/core";
import * as Globals from "../core/globals";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { HttpService } from "../core/services/HttpService";

@Injectable({
    providedIn: "root",
})

export class GiancarloLearningService{
    serverUrl: string;
    constructor(private http: HttpClient, private httpService: HttpService){
        this.serverUrl = Globals.SERVER;
    }

    listar(){
        
    }

}