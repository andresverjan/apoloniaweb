import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Detalle } from '../core/interfaces/detalle.interface';
import { Detalleservice } from '../detalle/detalleservice.service'
import { ToolsService } from '../core/services/tools.service'
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ProfileService } from '../profile/profile.service';
import { Usuarios } from '../core/interfaces/usuarios.interface';
import { UserSession } from '../core/interfaces/usersession.interface';
import { LoginComponent } from '../core/authentication/login/login.component';
import * as Globals from '../../modules/core/globals';
import { ViajesService } from '../viajes/viajes.service';
import { Viajes } from '../core/interfaces/viajes.interface';



@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {

  public reservaForm: FormGroup;
  public detalle: Detalle = {};
  public serverURLimages: String;
  public urlFotoCapitan: any;
  public nombreCapitan: any;
  public usuarioDetalle: User;
  private usuarioSession: any;
  public reserva: any = {};
  public minDate:any;
  public maxDate:any;
  public datosAlert:any= {};
  public etiquetas:any= {};
  public IsWait: Boolean = false;
  public listadoViajesEmbarcacion: Array<any>;
  public serverURlImagesViajes : String;
  public MostrarNoViajes:boolean = false;




  constructor(private detalleService: Detalleservice, private toolService: ToolsService, private router: Router,
    private profileService: ProfileService, private viajesService:ViajesService) {
    this.etiquetas = JSON.parse(localStorage.getItem("ETIQUETAS"));
    this.serverURlImagesViajes= this.viajesService.getWebRootUrl();
    this.detalle = this.detalleService.getDetalleObjeto();
    console.log(this.detalle)
    this.reservaForm = new FormGroup({
    llegada: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    salida: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    huespedes: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.min(1), Validators.max(+this.detalle.numeroPasajeros)])
    });

    this.minDate = Globals.MIN_DATE_VALIDA_FORMULARIO;
    this.maxDate = Globals.MAX_DATE_VALIDA_FORMULARIO;

    this.serverURLimages = this.toolService.getWebRoot();
    this.loadProfileData(this.detalle.capitan_barco);
    this.datosAlert.titulo = "Reservas de Viajes";
  }

  ngOnInit() {
    this.cargarViajesEmbarcacion();
    /*var minCurrentDate = new Date();
    var maxNewDate = new Date( minCurrentDate.getFullYear()+ 1, minCurrentDate.getMonth() + 1, minCurrentDate.getDate());
    this.minDate = minCurrentDate;
    this.maxDate = maxNewDate;
    */
  }

  localizar(obj){
    console.log(obj);
    var url = "https://www.google.com/maps/?q=" + obj.lat +","+ obj.lng;
    console.log(url);
    window.open(url, "_blank");
  }

  cargarViajesEmbarcacion(){
    this.listadoViajesEmbarcacion = this.detalle.viajesEmbarcacion;
    if (this.listadoViajesEmbarcacion.length <= 0){
      this.MostrarNoViajes = true;
    }else{
      this.MostrarNoViajes = false;
    }
  }

  goToDetalleViaje(detalleViaje:Viajes){
    this.detalle.id = detalleViaje.id;
    this.detalle.urlFoto = detalleViaje.urlFoto;
    this.detalle.origen = detalleViaje.origen;
    this.detalle.destino = detalleViaje.destino;
    this.detalle.precio = detalleViaje.precio;
    this.detalle.numeroPasajeros = detalleViaje.numeroPasajeros;
    this.detalle.numeroDias = detalleViaje.numeroDias;
    this.detalle.experiencia = detalleViaje.experiencia;
    this.detalle.embarcacion_id = detalleViaje.embarcacion_id;
    this.detalle.tipoDetalle = 'V';
    this.detalle.viaje_id = detalleViaje.id;

    this.detalleService.setDetalleObjeto(this.detalle);
    this.router.navigate(['home/detalle']);
  }

  loadProfileData(capitanBarco: any) {
    var objProfile = {
      userId: capitanBarco,
      token: ''

    };
    this.profileService.getMyProfile(objProfile).subscribe(response => {
      this.usuarioDetalle = response.data[0];
      console.log('PROFILE ', this.usuarioDetalle);
      this.loadInfoDetalle();

    })
  }

  loadInfoDetalle() {
    this.urlFotoCapitan = this.usuarioDetalle.URL_FOTO_PERFIL;
    this.nombreCapitan = this.usuarioDetalle.USUARIO_NOMBRE;
  }
  goToHome() {
    this.toolService.changeMessage(false);
    this.router.navigate(['home']);
  }

  solicitarReserva() {
    this.usuarioSession = JSON.parse(localStorage.getItem("USER"));
    if (this.usuarioSession != null && this.usuarioSession.user.ROL_ID == '6') {
      this.crearRequestReserva();
      console.log("LOGUEADO OK TURISTA");
      if (this.validacionesReserva(this.reserva)){
        this.realizaReserva();
      }else{
        console.log("error al validar el formulario");
      }
    } else {
      console.log("LOGUEADO FALSE");
      this.toolService.showDialogLogin(LoginComponent);
    }

  }

  crearRequestReserva(){
    let newDate = new Date(this.reservaForm.controls['salida'].value);
    this.reserva.ORIGEN = this.detalle.origen;
    this.reserva.DESTINO = this.detalle.destino;
    this.reserva.HORA = "12:00";
    this.reserva.FECHA = newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-'
      + newDate.getDate();
    this.reserva.NUMERO_ANFITRIONES = this.reservaForm.controls['huespedes'].value;
    this.reserva.EMBARCACION_ID = this.detalle.embarcacion_id;
    this.reserva.CLIENTE_ID = this.usuarioSession.user.ID;
    this.reserva.TIPO_SOLICITUD = "IDA";
    this.reserva.VIAJE_ID = this.detalle.viaje_id;
  }

  realizaReserva(){
    this.IsWait = true;
    console.log("RESERVA A ENVIAR ", this.reserva);
    this.detalleService.solicitarReserva(this.reserva).subscribe(resp => {
      this.IsWait = false;
      console.log("RESPUESTA RESERVA ");
      this.datosAlert.body = "Reserva realizada con éxito!!";
      this.datosAlert.servicio = "RESERVA";
      this.toolService.openDialogBtnAceptar(this.datosAlert);
      console.log(resp);
    });

    console.log(this.reservaForm.value);
  }

  openGoogleMaps(){
    var latitud = 28.6139;
    var longitud = 77.2090;
    window.open('https://www.google.com/maps/search/?api=1&query=' + latitud + ',' + longitud, "_blank");
  }


  validacionesReserva(reservaRequest):boolean{
    var anfitriones = +reservaRequest.NUMERO_ANFITRIONES;
    var numPasajeros = +this.detalle.numeroPasajeros;

    console.log(anfitriones);
    console.log(numPasajeros);

    if (anfitriones > numPasajeros) {
      this.datosAlert.body = "El número de anfitriones supera el límite";
      this.toolService.showDialog(this.datosAlert);
      return false;
    }

    return true;

  }

}
