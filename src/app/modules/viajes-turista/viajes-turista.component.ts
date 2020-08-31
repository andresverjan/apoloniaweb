import { Component, OnInit } from '@angular/core';
import { ViajesTuristasService } from './viajes-turistas.service';
import { UserSession } from '../core/interfaces/usersession.interface';
import { Viajes } from '../core/interfaces/viajes.interface';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ModalComponent } from '../core/modal/modal.component';
import { ToolsService } from '../core/services/tools.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-viajes-turista',
  templateUrl: './viajes-turista.component.html',
  styleUrls: ['./viajes-turista.component.scss']
})
export class ViajesTuristaComponent implements OnInit {
  public session: UserSession;
  public showFinalizados:boolean = false;
  public showPendientes:boolean = false;
  public showCancelados:boolean = false;
  public showAceptados:boolean = false;

  public showContenedorPendientes:boolean = true;
  public showContenedorCancelados:boolean = false;
  public showContenedorFinalizados:boolean = false;
  public showContenedorAceptados:boolean = false;


  dataMisViajesPendientes:Array<any>;
  dataMisViajesFinalizados:Array<any>;
  dataMisViajesCancelados:Array<any>;
  dataMisViajesAceptados:Array<any>;
  public serverURlImagesViajes : String;

  public IsWait: Boolean = false;
  public datosAlert:any= {};
  public usuarioSession:any= {};
  public etiquetas:any= {};


  constructor(private misViajesService:ViajesTuristasService, private dialog: MatDialog ,private toolService: ToolsService,) {
    this.validarSesion();
    this.session = JSON.parse(localStorage.getItem('USER'));
    this.etiquetas = JSON.parse(localStorage.getItem("ETIQUETAS"));
    this.serverURlImagesViajes = this.misViajesService.getWebRootUrl();
    this.datosAlert.titulo = "Gestión de Mis Viajes";
   }

  ngOnInit() {
    this.LoadMisViajes();
  }

  validarSesion(){
    this.usuarioSession = JSON.parse(localStorage.getItem("USER"));
    if (this.usuarioSession != null && this.usuarioSession.user.ROL_ID == '6') {
      this.etiquetas = JSON.parse(localStorage.getItem("ETIQUETAS"));
    }
  }

  LoadMisViajes(){
    var objProfile = {
      userId: this.session.user.ID,
      token: this.session.token
    };
    this.misViajesService.cargarViajesPendientes(objProfile).subscribe(resp => {
      console.log(resp);
      this.dataMisViajesPendientes = resp.data.pendientes;
      this.dataMisViajesFinalizados = resp.data.finalizadas;
      this.dataMisViajesCancelados = resp.data.canceladas;
      this.dataMisViajesAceptados = resp.data.aceptadas;
      console.log(this.dataMisViajesAceptados);

      if ( this.dataMisViajesPendientes.length <= 0){
        this.showPendientes = true;
      }
      if ( this.dataMisViajesFinalizados.length <= 0){
        this.showFinalizados = true;
      }
      if ( this.dataMisViajesCancelados.length <= 0){
        this.showCancelados = true;
      }
      if ( this.dataMisViajesAceptados.length <= 0){
        this.showAceptados = true;
      }
    });
  }

  cancelarViajePendiente(ObjetoSolicitudViaje:any){
    var request = {
      ID_SOLICITUD: ObjetoSolicitudViaje.Solicitud.ID,
      ID_CANCELA: this.session.user.ID,
      CLIENTE_ID_SOLICITA : ObjetoSolicitudViaje.Solicitud.CLIENTE_ID_SOLICITA,
      EMBARCACION_ID : ObjetoSolicitudViaje.Solicitud.EMBARCACION_ID,
      FECHA_SOLICITUD : ObjetoSolicitudViaje.Solicitud.FECHA_SOLICITUD,
      SOLICITUD_DESTINO : ObjetoSolicitudViaje.Solicitud.SOLICITUD_DESTINO,
      SOLICITUD_ORIGEN : ObjetoSolicitudViaje.Solicitud.SOLICITUD_ORIGEN,
      NUMERO_ANFITRIONES : ObjetoSolicitudViaje.Solicitud.NUMERO_ANFITRIONES
    };
    this.openDialog(request);
  }
  aceptarViajePendiente(ObjetoSolicitudViaje:any){
    var request = {
      ID_SOLICITUD: ObjetoSolicitudViaje.Solicitud.ID,
      ID_ACEPTA: this.session.user.ID,
      CLIENTE_ID_SOLICITA : ObjetoSolicitudViaje.Solicitud.CLIENTE_ID_SOLICITA,
      EMBARCACION_ID : ObjetoSolicitudViaje.Solicitud.EMBARCACION_ID,
      FECHA_SOLICITUD : ObjetoSolicitudViaje.Solicitud.FECHA_SOLICITUD,
      SOLICITUD_DESTINO : ObjetoSolicitudViaje.Solicitud.SOLICITUD_DESTINO,
      SOLICITUD_ORIGEN : ObjetoSolicitudViaje.Solicitud.SOLICITUD_ORIGEN,
      NUMERO_ANFITRIONES : ObjetoSolicitudViaje.Solicitud.NUMERO_ANFITRIONES
    };
    this.openDialogAceptarSolicitud(request);
  }

  MostrarFinalizados(){
    this.showContenedorPendientes = false;
    this.showContenedorCancelados = false;
    this.showContenedorFinalizados = true;
    this.showContenedorAceptados = false;
  }

  MostrarPendientes(){
    this.showContenedorPendientes = true;
    this.showContenedorFinalizados = false;
    this.showContenedorCancelados = false;
    this.showContenedorAceptados = false;
  }

  MostrarCancelados(){
    this.showContenedorPendientes = false;
    this.showContenedorFinalizados = false;
    this.showContenedorCancelados = true;
    this.showContenedorAceptados = false;
  }

  MostrarAceptadas(){
    this.showContenedorPendientes = false;
    this.showContenedorFinalizados = false;
    this.showContenedorCancelados = false;
    this.showContenedorAceptados = true;
  }

  openDialog(request:any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "300px";
    dialogConfig.data = {
      titulo: "Gestión de Mis Viajes",
      body: "Esta seguro que desea cancelar este viaje?",
      buttons: [
        {
          text: "Aceptar",
          icon: "ui-icon-heart",
          click: function () {
            return true;
          }
        },
        {
          text: "Cancelar",
          icon: "ui-icon-heart",
          click: function () {
            return false;
          }
        }
      ]
    };
    const dialogRef = this.dialog.open(ModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.llamarServicioEliminar(request);
      } else {
        console.log('The dialog was closed');
      }
    });

  }

  openDialogAceptarSolicitud(request:any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "300px";
    dialogConfig.data = {
      titulo: "Gestión de Mis Viajes",
      body: "Esta seguro que desea aceptar este viaje?",
      buttons: [
        {
          text: "Aceptar",
          icon: "ui-icon-heart",
          click: function () {
            return true;
          }
        },
        {
          text: "Aceptar",
          icon: "ui-icon-heart",
          click: function () {
            return false;
          }
        }
      ]
    };
    const dialogRef = this.dialog.open(ModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.llamarServicioAceptar(request);
      }
    });
  }

  openDialogBtnAceptar(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "300px";
    dialogConfig.data = {
      titulo: "Gestión de Mis Viajes",
      body: "Viaje aceptado con éxito.",
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
        window.location.reload();
      } else {
        console.log('The dialog was closed');
      }
    });

  }

  llamarServicioEliminar(request:any){
    this.IsWait = true;
    this.misViajesService.cancelarViajePendiente(request).subscribe(resp => {
      console.log("RESPONSE VIAJES CANCELAR")
      console.log(resp);
      if (resp.mensaje === "TRUE"){
        Swal.fire(
          'Viajes',
          'Viaje cancelado correctamente',
          'success'
        );
        //this.datosAlert.body = "Viaje aceptado con éxito.";
        //this.openDialogBtnAceptar();
        this.IsWait = false;
      }

    });
  }

  llamarServicioAceptar(request:any){
    this.IsWait = true;
    this.misViajesService.aceptarViajePendiente(request).subscribe(resp => {
      if (resp.mensaje === "TRUE"){
        //this.datosAlert.body = "Viaje aceptado con éxito.";
        //this.openDialogBtnAceptar();
        Swal.fire(
          'Viajes',
          'Viaje aceptado correctamente',
          'success'
        );
        this.IsWait = false;
      }
    });
  }


}