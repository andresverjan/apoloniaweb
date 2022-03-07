import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { LoadingComponent } from "../loading/loading.component";
import * as Globals from "../globals";
import { ModalComponent } from "../modal/modal.component";
import { Router } from "@angular/router";
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: "root",
})
export class ToolsService {
  serverUrl: string;
  webRoot: string;

  public dialogRef: any;
  public msgDialogRef: any;
  public isReloadLogout: boolean = false;
  private messageSource = new BehaviorSubject<any>("Mensaje defecto");
  public userKey: string = "USUARIO";
  currentMessage = this.messageSource.asObservable();

  private dataFiltroReporte = new BehaviorSubject<any>("");
  currentMessageFiltroReporte = this.dataFiltroReporte.asObservable();

  constructor(
    private dialog: MatDialog,
    private httpClient: HttpClient,
    private router: Router
  ) {
    this.serverUrl = Globals.SERVER;
    this.webRoot = this.serverUrl + Globals.SERVER_FOLDER_WEBROOT;
  }

  changeMessage(message: any) {
    this.messageSource.next(message);
  }

  addDataFiltroReporte(message: any) {
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
        buttons: data.buttons,
      };
    }

    const msgDialogRef = this.dialog.open(ModalComponent, dialogConfig);

    msgDialogRef.afterClosed().subscribe((result) => { });
  }

  showDialogLogin(component) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "600px";

    const msgDialogRef = this.dialog.open(component, dialogConfig);

    msgDialogRef.afterClosed().subscribe((result) => { });
  }

  showBuscadorModal(component: any, tipoFiltro: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "600px";
    dialogConfig.data = {
      tipoServicio: tipoFiltro,
    };

    const msgDialogRef = this.dialog.open(component, dialogConfig);

    msgDialogRef.afterClosed().subscribe((result) => { });
  }

  showLoading() {
    const dialogConfig = new MatDialogConfig(); 
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "300px";
    dialogConfig.data = {
      titulo: "Eliminar idioma",
      buttons: [],
    };
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
          },
        },
      ],
    };
    const dialogRef = this.dialog.open(ModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        switch (data.servicio) {
          case "RESERVA":
            this.router.navigate(["home"]);
            break;
          case "MISVIAJES":
            break;
        }
        //this.llamarServicioEliminar(request);
      } else {
      }
    });
  }

  uploadData(objeTosend): Observable<any> {
    let obj = [objeTosend];
    let json = JSON.stringify(obj);

    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.httpClient.post(this.serverUrl + "Homes/uploadBase64", json, {
      headers: headers,
    });
  }

  listarPaises(objeTosend?): Observable<any> {
    const params = new HttpParams({
      fromObject: objeTosend,
    });
    return this.httpClient.get(this.serverUrl + "Paises/listar", { params });
  }

  getWebRoot(): String {
    return this.webRoot;
  }

  setReloadLogout() {
    this.isReloadLogout = true;
  }

  getReloadLogout(): boolean {
    return this.isReloadLogout;
  }

  convertirseCapitan(objeTosend): Observable<any> {
    const params = new HttpParams({
      fromObject: objeTosend,
    });
    return this.httpClient.get<any>(this.serverUrl + "WsUsuarios/becaptain", {
      params,
    });
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
    regexp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    if (regexp.test(valor)) {
      return true;
    }
    return false;
  }

  formatCurrency(number: number): string {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
    return formatter.format(number);
  }

  public getParams(filtro, ordenamiento): string {
    let params = "";

    if (filtro.length > 1) {
      params = "(" + filtro;
    }
    if (ordenamiento.length > 1) {
      if (params.length > 1) {
        params += ",";
      } else {
        params += "(";
      }
      params += ordenamiento;
    }

    if (params.length > 1) {
      params += ")";
    }

    return params;
  }

  public setTime(isoDate: string): String {
    const date = new Date(Date.parse(isoDate));

    let currentDate: any = date.getDate();
    let currentMonth: any = date.getMonth() + 1;
    let currentYear: any = date.getFullYear();
    let currentHrs: any = date.getHours();
    let currentMins: any = date.getMinutes();
    let currentSecs: any = date.getSeconds();
    let currentDateTime: any;

    currentDate = currentDate < 10 ? "0" + currentDate : currentDate;
    currentMonth = currentMonth < 10 ? "0" + currentMonth : currentMonth;
    currentHrs = currentHrs < 10 ? "0" + currentHrs : currentHrs;
    currentMins = currentMins < 10 ? "0" + currentMins : currentMins;
    currentSecs = currentSecs < 10 ? "0" + currentSecs : currentSecs;

    currentDateTime =
      currentYear +
      "-" +
      currentMonth +
      "-" +
      currentDate +
      "T" +
      currentHrs +
      ":" +
      currentMins +
      ":" +
      currentSecs;
    return currentDateTime;
  }
  getUserFromLocalStorage(): any {
    return JSON.parse(localStorage.getItem(this.userKey));
  }
  
  exportHtmlToPdf(elementId: string, pathFile: string) {
    var element = document.getElementById(elementId);
    html2canvas(element, {
      logging: false
    }).then(function (canvas) {
      var pdf = new jsPDF('l', 'mm', 'a4');//A4 paper, portrait
      var ctx = canvas.getContext('2d'),
        a4w = 270, a4h = 257,//A4 size, 210mm x 297mm, 10 mm margin on each side, display area 190x277
        imgHeight = Math.floor(a4h * canvas.width / a4w),//Convert pixel height of one page image to A4 display scale
        renderedHeight = 0;
      while (renderedHeight < canvas.height) {
        var page = document.createElement("canvas");
        page.width = canvas.width;
        page.height = Math.min(imgHeight, canvas.height - renderedHeight);//Maybe less than one page
        //Trim the specified area with getImageData and draw it into the canvas object created earlier
        page.getContext('2d').putImageData(ctx.getImageData(0, renderedHeight, canvas.width, Math.min(imgHeight, canvas.height - renderedHeight)), 0, 0);
        //Add an image to the page with a 10 mm / 20 mm margin
        pdf.addImage(page.toDataURL('image/jpeg', 1.0), 'JPEG', 10, 20, a4w, Math.min(a4h, a4w * page.height / page.width));
        //Add header logo
        //pdf.addImage(imgDataPDF, 'PNG', 5, 3, 20, 30);
        renderedHeight += imgHeight;
        if (renderedHeight < canvas.height)
          pdf.addPage();//Add an empty page if there is more to follow
        //delete page;
      }
      pdf.save(pathFile);
    });
  }

  exportHtmlToPdfOriginal(elementId: string, pathFile: string) {
    var element = document.getElementById(elementId);
    html2canvas(element, {
      logging: false
    }).then(function (canvas) {
      var pdf = new jsPDF('p', 'mm', 'a4');//A4 paper, portrait
      var ctx = canvas.getContext('2d'),
        a4w = 190, a4h = 277,//A4 size, 210mm x 297mm, 10 mm margin on each side, display area 190x277
        imgHeight = Math.floor(a4h * canvas.width / a4w),//Convert pixel height of one page image to A4 display scale
        renderedHeight = 0;
      while (renderedHeight < canvas.height) {
        var page = document.createElement("canvas");
        page.width = canvas.width;
        page.height = Math.min(imgHeight, canvas.height - renderedHeight);//Maybe less than one page
        //Trim the specified area with getImageData and draw it into the canvas object created earlier
        page.getContext('2d').putImageData(ctx.getImageData(0, renderedHeight, canvas.width, Math.min(imgHeight, canvas.height - renderedHeight)), 0, 0);
        //Add an image to the page with a 10 mm / 20 mm margin
        pdf.addImage(page.toDataURL('image/jpeg', 1.0), 'JPEG', 10, 20, a4w, Math.min(a4h, a4w * page.height / page.width));
        //Add header logo
        //pdf.addImage(imgDataPDF, 'PNG', 5, 3, 20, 30);
        renderedHeight += imgHeight;
        if (renderedHeight < canvas.height)
          pdf.addPage();//Add an empty page if there is more to follow
        //delete page;
      }
      pdf.save(pathFile);
    });
  }

}
