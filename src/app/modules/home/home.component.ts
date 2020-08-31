import { Component, OnInit} from '@angular/core';
import {ViajesService} from '../viajes/viajes.service';
import {EmbarcacionesService} from '../embarcaciones/embarcaciones.service';
import { Viajes } from '../core/interfaces/viajes.interface';
import {Embarcacion} from '../core/interfaces/embarcacion.interface';
import { ToolsService } from '../../modules/core/services/tools.service';
import { Router } from '@angular/router';
import { Detalle } from '../core/interfaces/detalle.interface';
import {Detalleservice} from '../detalle/detalleservice.service';
import { EtiquetasService } from '../core/services/etiquetas.service';
import * as Globals from '../core/globals';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  listadoViajes: Array<Viajes>=[];
  listadoEmbarcaciones: Array<Embarcacion>=[];
  public serverURlImagesViajes : String;
  public serverURlImagesEmbarcaciones : String;
  public showMisViajes:boolean = false;
  public showSerCapitan:boolean = false;
  public urlLogo:String;
  private detalle:Detalle = {};
  private usuarioSession: any;
  public etiquetas:any = {};
  public ocultaVerMasViajes:boolean =  true;
  public ocultaVerMasEmbarcaciones:boolean =  true;
  public cantActualViajes = 0;
  public cantActualEmbarcaciones = 0;
  message : any;
  public isBusqueda:boolean = false;
  public msjResutladosSearchTmp :string;

  public findByItem ={
    item :  "",
    _search   : true   //si queremos hacer filtro, debe ir como true.
  }


  constructor(private viajesService:ViajesService, private embServices:EmbarcacionesService, private toolService: ToolsService,
    private router:Router, private detalleService:Detalleservice , private etiquetasService: EtiquetasService) {
    //this.etiquetas = JSON.parse(localStorage.getItem("ETIQUETAS"));
    this.serverURlImagesViajes= this.viajesService.getWebRootUrl();
    this.serverURlImagesEmbarcaciones = this.embServices.getWebRootUrl();
    this.urlLogo = this.toolService.getWebRoot() +"assets/imgs/logoMarlynk.png";
    this.usuarioSession = JSON.parse(localStorage.getItem("USER"));
   }

   

  
  ngOnInit() { 
    console.log('SESSION HOME')
    console.log(this.usuarioSession)
    this.loadEtiquetas();
    this.cargarViajes();
    this.cargarEmbarcaciones();
   
    /*
    - Escuchador de datos buscador
    - msjResultadosSearchTmp solo se uso temporal para mostrar cuando hay o no resultados
      se debn crear etiquetas para esto, para evitar mensajes quemados
    */
    this.toolService.currentMessage.subscribe(response =>{
      this.listadoViajes = response.data;
      this.message = response;
      console.log("estoy en el home");   
      if(response.mensaje == "TRUE"){
        this.isBusqueda = true;
        this.msjResutladosSearchTmp = "Resultados de búsqueda";
        this.ocultaVerMasViajes = false;
      } else if(response.mensaje == "FALSE"){
        this.msjResutladosSearchTmp = "No hay Resultados";
        this.ocultaVerMasViajes = false;
        
      }
    });
 
    if (this.usuarioSession.user.ROL_ID == '5'){
      this.router.navigate(['/dashboard']);
    } 

    if (this.usuarioSession.user.ROL_ID == '1'){
      this.router.navigate(['/dashboard']);
    }


  }
  loadEtiquetas() {
    var objEtiqueta = {
      id: Globals.DEFAULT_LANGUAGE
    };

    this.etiquetasService.loadEtiquetas(objEtiqueta).subscribe(res => {
      this.etiquetas = res.data;
      localStorage.removeItem('ETIQUETAS');
      localStorage.setItem('ETIQUETAS', JSON.stringify(this.etiquetas));
    })
  };


  cargarViajes(){

    this.cantActualViajes = this.cantActualViajes + 8;

    var obj = {
        cantidad: this.cantActualViajes
    }

    if(this.cantActualViajes <= 32){
      this.viajesService.cargarViajes(obj).subscribe(data =>{
        console.log('RESPUESTAA VIAJES: ');
        console.log(data);
        this.listadoViajes = data.data;
      });
      (this.cantActualViajes >= 32)? this.ocultaVerMasViajes = false: this.ocultaVerMasViajes = true;
    } else {
      this.ocultaVerMasViajes = false;
    }
  
  }



  cargarEmbarcaciones(){
    this.cantActualEmbarcaciones = this.cantActualEmbarcaciones + 8;
    var obj = {
      cantidad: this.cantActualEmbarcaciones
    }
    if(this.cantActualEmbarcaciones <=32){
      this.embServices.cargarEmbarcaciones(obj).subscribe(data =>{
        console.log('RESPUESTAA EMBARCACIONES:');
        console.log(data);
        this.listadoEmbarcaciones = data;
      });
      (this.cantActualEmbarcaciones >= 32)? this.ocultaVerMasEmbarcaciones = false: this.ocultaVerMasEmbarcaciones = true;
    } else {
      this.ocultaVerMasEmbarcaciones = false;
    }

  }


  consultarFiltro(event){
    event.preventDefault();
    console.log('FILTRO ', this.findByItem);
  }

  presionoBoton(){
    console.log('FILTRO 2', this.findByItem);
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
    this.detalle.embarcacionNombre = detalleViaje.embarcacionNombre;
    this.detalle.lat = detalleViaje.lat;
    this.detalle.lng = detalleViaje.lng;

    this.detalleService.setDetalleObjeto(this.detalle);
    this.router.navigate(['home/detalle']);
  }

  goToDetalleEmbarcacion(detalleEmbarcacion:Embarcacion){
    this.detalle.id = detalleEmbarcacion.id;
    this.detalle.urlFoto = detalleEmbarcacion.urlBarco;
    this.detalle.embarcacion_nombre = detalleEmbarcacion.embarcacion_nombre;
    this.detalle.numeroPasajeros = detalleEmbarcacion.numeroPasajeros;
    this.detalle.tripulacion = detalleEmbarcacion.tripulacion;
    this.detalle.pais = detalleEmbarcacion.country;
    this.detalle.capitan_barco = detalleEmbarcacion.capitan_barco;
    this.detalle.tipoDetalle = 'E';
    this.detalle.viajesEmbarcacion = detalleEmbarcacion.Viajes;

    this.detalle.lat = detalleEmbarcacion.lat;
    this.detalle.lng = detalleEmbarcacion.lng;
    this.detalleService.setDetalleObjeto(this.detalle);
    this.router.navigate(['home/detalle']);

  }

}
