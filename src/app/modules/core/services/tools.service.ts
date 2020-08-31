import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { LoadingComponent } from '../loading/loading.component';
import * as Globals from '../globals';
import { ModalComponent } from '../modal/modal.component';
import { LoginComponent } from '../authentication/login/login.component';
import { RegistroComponent } from '../registro/registro.component';

import { AboutComponent } from '../authentication/about/about.component';
import { DetalleComponent } from '../../detalle/detalle.component';
import { PaisesComponent } from '../../paises/paises.component';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ToolsService {
  serverUrl: string;
  webRoot: string;

  public dialogRef: any;
  public msgDialogRef: any;
  public isReloadLogout: boolean = false;
  private messageSource = new BehaviorSubject<any>("Mensaje defecto");
  currentMessage = this.messageSource.asObservable();

  private dataFiltroReporte = new BehaviorSubject<any>("");
  currentMessageFiltroReporte = this.dataFiltroReporte.asObservable();

  constructor(private dialog: MatDialog, private httpClient: HttpClient, private router: Router) {
    this.serverUrl = Globals.SERVER;
    this.webRoot = this.serverUrl + Globals.SERVER_FOLDER_WEBROOT;
  }

  changeMessage(message: any) {
    this.messageSource.next(message);
  }

  addDataFiltroReporte(message:any){
    this.dataFiltroReporte.next(message);
  }

  showDialog(data?) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "300px";
    if (data != null) {
      dialogConfig.data = {
        titulo: data.titulo,
        body: data.body,
        buttons: data.buttons
      }
    }

    const msgDialogRef = this.dialog.open(ModalComponent, dialogConfig);

    msgDialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    })
  }


  showDialogLogin(component) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "600px";

    const msgDialogRef = this.dialog.open(component, dialogConfig);

    msgDialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    })
  }

  showBuscadorModal(component:any, tipoFiltro:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "600px";
    dialogConfig.data = {
      tipoServicio: tipoFiltro
    };

    const msgDialogRef = this.dialog.open(component, dialogConfig);

    msgDialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


  showLoading() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "300px";
    dialogConfig.data = {
      titulo: "Eliminar idioma",
      buttons: [
      ]
    }
    this.dialogRef = this.dialog.open(LoadingComponent, dialogConfig);
  }

  closeLoading() {
    this.dialogRef.close();
  }


  openDialogBtnAceptar(data: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "300px";
    dialogConfig.data = {
      titulo: data.titulo,
      body: data.body,
      buttons: [
        {
          text: "Aceptar",
          icon: "ui-icon-heart",
          click: function () {
            return true;
          }
        }
      ]
    }
    const dialogRef = this.dialog.open(ModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        switch (data.servicio) {
          case "RESERVA":
            this.router.navigate(['home']);
            break;
          case "MISVIAJES":
            break;
        }
        //this.llamarServicioEliminar(request);

      } else {
        console.log('The dialog was closed');
      }
    });

  }

  uploadData(objeTosend): Observable<any> {
    let obj = [objeTosend];
    let json = JSON.stringify(obj);
    console.log(json);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post(this.serverUrl + 'Homes/uploadBase64', json, { headers: headers });
  };

  listarPaises(objeTosend?): Observable<any> {
    const params = new HttpParams({
      fromObject: objeTosend
    });
    return this.httpClient.get(this.serverUrl + 'Paises/listar', { params });

  };

  getWebRoot(): String {
    return this.webRoot;
  };

  setReloadLogout() {
    this.isReloadLogout = true;
  }

  getReloadLogout(): boolean {
    return this.isReloadLogout;
  }

  convertirseCapitan(objeTosend): Observable<any> {
    const params = new HttpParams({
      fromObject: objeTosend
    });
    return this.httpClient.get<any>(this.serverUrl + 'WsUsuarios/becaptain', { params });
  }

  /**
   * Se crea este metodo con el objetivo de tomar cualquier FORMULARIO FORM
   * y poder detectar el nombre del attributo que esta invalido
  */
  public getInvalidControlsInForm(lForm): string[] {
    const invalid = [];
    const controls = lForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  public validateEmail(valor): boolean {
    let regexp: RegExp;
    regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regexp.test(valor)) {
      return true;
    }
    return false;
  }

}
