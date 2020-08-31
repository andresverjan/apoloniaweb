import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToolsService } from '../core/services/tools.service';
import { BuscadormodalComponent } from '../core/components/buscadormodal/buscadormodal.component';
import { ViajesService } from '../viajes/viajes.service';

import { Detalleservice } from '../detalle/detalleservice.service';
import { UsuariosService } from '../usuarios/usuarios.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {

public filtrosForm:FormGroup;
public selected:any = "";
public selectedTipoSolicitud:any = "";
private dataFiltro:any = {};
private dataModalFiltro:any = {};
public etiquetas:any= {};
public mostrarFiltroUsuario:boolean = false;
public mostrarFiltroCapitan:boolean = false;
public mostrarFiltroEmbarcacion:boolean = false;
public displayedColumns: string[] = [ 'nombreturista', 'emailturista', 'nombrecapitan' , 'emailcapitan',  'nombre', 'destino', 'Fecha', 'NumeroDias', 'precio'];
public dataSource:any;
public muestraTablaReporte:boolean = false;

  constructor(private toolService:ToolsService, private solicitudesService:Detalleservice,
    private usuariosService:UsuariosService) {
    this.etiquetas = JSON.parse(localStorage.getItem("ETIQUETAS"));
    this.filtrosForm = new FormGroup({
      filtroUsuario: new FormControl('', [ Validators.maxLength(50)]),
      filtroCapitan: new FormControl('', [ Validators.maxLength(50)]),
      filtroEmbarcacion: new FormControl('', [ Validators.maxLength(50)]),
      filtroEliminados: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      filtroFechaInicio: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      filtroTipoSolicitud: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      filtroFechaFin: new FormControl('', [Validators.required, Validators.maxLength(50)])
    });
   }

   abrirModalBuscador(tipoFiltro:any){
     console.log('hola modal');
     this.toolService.showBuscadorModal(BuscadormodalComponent, tipoFiltro);
   }

   filtrarTipo(){
     console.log(this.selected);
     this.filtrosForm.reset();
     this.dataModalFiltro = {};

     if(this.selected === 'USU'){
       this.dataFiltro.tipoServicio = 'usuario';
       this.mostrarFiltroUsuario = true;
     }else{
       this.mostrarFiltroUsuario = false;
     }

     if(this.selected === 'CAP'){
      this.dataFiltro.tipoServicio = 'capitan';
      this.mostrarFiltroCapitan = true;
    }else{
      this.mostrarFiltroCapitan = false;
    }

    if(this.selected === 'EMB'){
      this.dataFiltro.tipoServicio = 'embarcacion';
      this.mostrarFiltroEmbarcacion = true;
    }else{
      this.mostrarFiltroEmbarcacion = false;
    }

   }

   limpiarFiltros(){
     this.filtrosForm.reset();
     this.muestraTablaReporte = false;
   }

   filtrarTipoSolicitud(){
    if (this.selectedTipoSolicitud === 'aceptadas'){
      this.dataFiltro.TIPO_SOLICITUD = 'aceptadas';
    }
    if (this.selectedTipoSolicitud === 'pendientes'){
      this.dataFiltro.TIPO_SOLICITUD = 'pendientes';
    }
    if (this.selectedTipoSolicitud === 'canceladas'){
      this.dataFiltro.TIPO_SOLICITUD = 'canceladas';
    }
    if (this.selectedTipoSolicitud === 'finalizadas'){
      this.dataFiltro.TIPO_SOLICITUD = 'finalizadas';
    }
    if (this.selectedTipoSolicitud === 'todas'){
      this.dataFiltro.TIPO_SOLICITUD = 'todas';
    }
  }

  generarReporte(){
    let fechaInicio = new Date(this.filtrosForm.controls['filtroFechaInicio'].value);
    let fechaFin = new Date(this.filtrosForm.controls['filtroFechaFin'].value);
    this.dataFiltro.FECHA_INICIO = fechaInicio.getFullYear() + '-' + (fechaInicio.getMonth() + 1) + '-'
    + fechaInicio.getDate();
    this.dataFiltro.FECHA_FIN = fechaFin.getFullYear() + '-' + (fechaFin.getMonth() + 1) + '-'
    + fechaFin.getDate();
    this.dataFiltro.USUARIO_ID = this.dataModalFiltro.ID;
    this.dataFiltro.MUESTRA_ELIMINADOS = this.filtrosForm.controls['filtroEliminados'].value;
    console.log('REQUEST REPORTE');
    console.log(this.dataFiltro);

    this.solicitudesService.reporteSolicitudes(this.dataFiltro).subscribe(data => {
      this.dataSource = data.data;
      this.muestraTablaReporte = true;
    });
  }

  ngOnInit() {
    this.toolService.currentMessageFiltroReporte.subscribe( data => {
      console.log("data desde el modal");
      this.dataModalFiltro = data;
      console.log(data);
      this.filtrosForm.controls['filtroUsuario'].setValue(data.USUARIO_NOMBRE);
      this.filtrosForm.controls['filtroCapitan'].setValue(data.USUARIO_NOMBRE);
      this.filtrosForm.controls['filtroEmbarcacion'].setValue(data.embarcacion_nombre);
    });
  }

}
