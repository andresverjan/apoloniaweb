import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UsuariosService } from '../../../usuarios/usuarios.service';
import { CapitanesService } from '../../../capitanes/capitanes.service';
import { EmbarcacionesService } from '../../../embarcaciones/embarcaciones.service';
import { UserSession } from '../../interfaces/usersession.interface';
import { ToolsService } from '../../services/tools.service';


@Component({
  selector: 'app-buscadormodal',
  templateUrl: './buscadormodal.component.html',
  styleUrls: ['./buscadormodal.component.scss']
})
export class BuscadormodalComponent implements OnInit {
  dataSource: any;
  public itemBuscar: any;
  public findByItem: any = {}
  public tituloServicio: any;
  public session: UserSession;
  public dataFromPage = {
    tipoServicio : ''
  };
  public etiquetas:any= {};
  constructor(public dialogRef: MatDialogRef<BuscadormodalComponent>,
    @Inject(MAT_DIALOG_DATA) public data2: any, private usuarioService: UsuariosService,
    private capitanesService: CapitanesService, private embarcacionesService: EmbarcacionesService,
    private toolService: ToolsService) {
    this.session = JSON.parse(localStorage.getItem('USER'));
    this.etiquetas = JSON.parse(localStorage.getItem("ETIQUETAS"));
    console.log('data buscador modal');
    console.log(this.data2);
    this.dataFromPage = this.data2;
    console.log(this.dataFromPage);
  }

  ngOnInit() {
    this.loadListado();
  }

  loadListado(objFindItem?: any) {
    if (this.data2.tipoServicio === 'USUARIO') {
      this.tituloServicio = 'Buscar Usuario';
      this.usuarioService.cargarUsuarios(objFindItem).subscribe(data => {
        console.log('DATA USUARIO');
        console.log(data.data);
        this.dataSource = data.data;
      });
    }

    if (this.data2.tipoServicio === 'CAPITAN') {
      this.tituloServicio = 'Buscar Capitán';
      this.capitanesService.cargarUsuarios(objFindItem).subscribe(data => {
        console.log('DATA CAPITANES');
        console.log(data);
        this.dataSource = data.data;
      });
    }

    if (this.data2.tipoServicio === 'EMBARCACION') {
      this.tituloServicio = 'Buscar Embarcación';
      this.embarcacionesService.filtrarEmbarcaciones(objFindItem).subscribe(data => {
        console.log('DATA EMBARCACIONES');
        console.log(data);
        this.dataSource = data.data;
      });
    }
  }

  findBy() {
    if (this.itemBuscar.length > 1 && this.data2.tipoServicio === 'USUARIO') {
      this.findByItem._search = true;
      this.findByItem.USUARIO_NOMBRE = this.itemBuscar;
      console.log("DEBE LLAMAR SERVICIO DE BUSQUEDA USUARIO");
      this.loadListado(this.findByItem);
    } else if (this.itemBuscar.length > 1 && this.data2.tipoServicio === 'CAPITAN') {
      this.findByItem._search = true;
      this.findByItem.USUARIO_NOMBRE = this.itemBuscar;
      console.log("DEBE  LLAMAR SERVICIO DE BUSQUEDA USUARIO");
      this.loadListado(this.findByItem);
    } else if (this.itemBuscar.length > 1 && this.data2.tipoServicio === 'EMBARCACION') {
      this.findByItem._search = true;
      this.findByItem.embarcacion_nombre = this.itemBuscar;
      this.findByItem.userId = this.session.user.ID;
      this.findByItem.token = this.session.token;
      console.log("DEBE  LLAMAR SERVICIO DE BUSQUEDA USUARIO");
      this.loadListado(this.findByItem);
    } else {
      this.loadListado();
    }
  }

  getUsuario(element) {
    console.log(element);
    this.toolService.addDataFiltroReporte(element);
    this.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  close(resp?: any) {
    this.dialogRef.close(resp);
  }


}
