import { Component, OnInit } from "@angular/core";
import { Viajes } from "../core/interfaces/viajes.interface";
import { Embarcacion } from "../core/interfaces/embarcacion.interface";
import { ToolsService } from "../../modules/core/services/tools.service";
import { Router } from "@angular/router";
import { Detalle } from "../core/interfaces/detalle.interface";
import { EtiquetasService } from "../core/services/etiquetas.service";
import * as Globals from "../core/globals";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  listadoViajes: Array<Viajes> = [];
  listadoEmbarcaciones: Array<Embarcacion> = [];
  public serverURlImagesViajes: String;
  public serverURlImagesEmbarcaciones: String;
  public showMisViajes: boolean = false;
  public showSerCapitan: boolean = false;
  public urlLogo: String;
  private detalle: Detalle = {};
  private usuarioSession: any;
  public etiquetas: any = {};
  public ocultaVerMasViajes: boolean = true;
  public ocultaVerMasEmbarcaciones: boolean = true;
  public cantActualViajes = 0;
  public cantActualEmbarcaciones = 0;
  message: any;
  public isBusqueda: boolean = false;
  public msjResutladosSearchTmp: string;

  public findByItem = {
    item: "",
    _search: true, //si queremos hacer filtro, debe ir como true.
  };

  constructor(
    private toolService: ToolsService,
    private router: Router,
    private etiquetasService: EtiquetasService
  ) {
    //this.etiquetas = JSON.parse(localStorage.getItem("ETIQUETAS"));
    //this.serverURlImagesViajes= this.viajesService.getWebRootUrl();
    this.urlLogo =
      this.toolService.getWebRoot() + "assets/imgs/logoMarlynk.png";
    //this.usuarioSession = JSON.parse(localStorage.getItem("USER"));
  }

  ngOnInit() {
    this.loadEtiquetas();
    /*
    - Escuchador de datos buscador
    - msjResultadosSearchTmp solo se uso temporal para mostrar cuando hay o no resultados
      se debn crear etiquetas para esto, para evitar mensajes quemados
    */
    this.toolService.currentMessage.subscribe((response) => {
      this.listadoViajes = response.data;
      this.message = response;

      if (response.mensaje == "TRUE") {
        this.isBusqueda = true;
        this.msjResutladosSearchTmp = "Resultados de búsqueda";
        this.ocultaVerMasViajes = false;
      } else if (response.mensaje == "FALSE") {
        this.msjResutladosSearchTmp = "No hay Resultados";
        this.ocultaVerMasViajes = false;
      }
    });

    /*if (this.usuarioSession.user.ROL_ID == '5'){
      this.router.navigate(['/dashboard']);
    } */
  }

  loadEtiquetas() {
    var objEtiqueta = {
      id: Globals.DEFAULT_LANGUAGE,
    };

    /*this.etiquetasService.loadEtiquetas(objEtiqueta).subscribe((res) => {
      this.etiquetas = res.data;
      localStorage.removeItem("ETIQUETAS");
      localStorage.setItem("ETIQUETAS", JSON.stringify(this.etiquetas));
    });*/
  }

  cargarViajes() {
    this.cantActualViajes = this.cantActualViajes + 8;
    var obj = {
      cantidad: this.cantActualViajes,
    };
  }

  consultarFiltro(event) {
    event.preventDefault();
  }

  presionoBoton() {}
}
