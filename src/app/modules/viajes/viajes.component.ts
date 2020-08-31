import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Embarcacion } from '../core/interfaces/embarcacion.interface';
import { Viajes } from '../core/interfaces/viajes.interface'
import { ViajesService } from './viajes.service';
import { EmbarcacionesService } from '../embarcaciones/embarcaciones.service'
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ModalComponent } from '../core/modal/modal.component';
import { ToolsService } from '../core/services/tools.service';
import { ResponseViajes } from '../core/interfaces/viaje.response';
import { UserSession } from '../core/interfaces/usersession.interface';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.component.html',
  styleUrls: ['./viajes.component.scss']
})
export class ViajesComponent implements OnInit {

  listadoEmbarcaciones: Array<Embarcacion>;
  ViajesResponse: ResponseViajes = {};
  viajeRequest: Viajes;
  viajeEliminar: Viajes;
  viajeSeleccionado: Viajes;

  selected = "";

  private base64textString: String = "";

  public session: UserSession;
  selectedFiles: FileList;
  selectedFile: File;
  public urlTemporal: string = "";

  public serverURlImagesViajes: String;
  public actualItemUrl: String;
  public IsWait: Boolean = false;
  public dialogRef: any;
  public viajeForm: FormGroup;
  public lShowPanelListadoViajes: Boolean = true;
  public lShowPanelDatosViaje: boolean = false;
  public lShowBtnAdicionar: boolean = false;
  public lShowBtnActualizar: boolean = false;
  public lShowBtnEliminar: boolean = false;
  public etiquetas:any= {};


  public findByItem = {
    embarcacion_nombre: "",
    _search: true,   //si queremos hacer filtro, debe ir como true.
    userId: "",
    token: "",
    Destino: ""
  }

  constructor(private embarcacionesService: EmbarcacionesService, private toolService: ToolsService, private viajesService: ViajesService,
    private dialog: MatDialog) {
    this.etiquetas = JSON.parse(localStorage.getItem("ETIQUETAS"));
    this.session = JSON.parse(localStorage.getItem('USER'));
    this.serverURlImagesViajes = this.viajesService.getWebRootUrl();
  }

  ngOnInit() {
    this.cargarEmbarcaciones();
    this.cargarViajes();
    this.viajeForm = new FormGroup({
      id: new FormControl('', [Validators.maxLength(50)]),
      USUARIO_ID: new FormControl('', [Validators.maxLength(50)]),
      embarcacion_id: new FormControl('', [Validators.maxLength(50)]),
      urlFoto: new FormControl('', [Validators.maxLength(250)]),
      puertoMarina: new FormControl('', [Validators.maxLength(50)]),
      numeroTripulacion: new FormControl('', [Validators.maxLength(50)]),
      incluye: new FormControl('', [Validators.maxLength(50)]),
      preciodesc: new FormControl('', [Validators.maxLength(50)]),
      origen: new FormControl('', [Validators.maxLength(50)]),
      destino: new FormControl('', [Validators.maxLength(50)]),
      numeroDias: new FormControl('', [Validators.maxLength(50)]),
      experiencia: new FormControl('', [Validators.maxLength(50)]),
      precio: new FormControl('', [Validators.maxLength(50)]),
      numeroPasajeros: new FormControl('', [, Validators.maxLength(50)])
    });

  }

  cargarEmbarcaciones() {
    this.IsWait = true;
    this.findByItem.userId = this.session.user.ID;
    this.findByItem.token = this.session.token;
    this.embarcacionesService.cargarEmbarcaciones(this.findByItem).subscribe(data => {
      this.IsWait = false;
      console.log('DATA EMBARCACIONES SELECT', data)
      this.listadoEmbarcaciones = data;
    });
  }

  cargarViajes() {
    /*this.findByItem = {
      embarcacion_nombre: "",
      _search: false, //si queremos hacer filtro, debe ir como true.
      userId: "",
      token: "",
      Destino : ""
    };*/
    this.IsWait = true;
    console.log( this.session);
    console.log(this.session.user.ROL_ID);
    if (this.session.user.ROL_ID != '1') {
      this.findByItem.userId = this.session.user.ID;
      this.findByItem._search = true;
    }
    this.findByItem.token = this.session.token;
    this.viajesService.cargarViajes(this.findByItem).subscribe(data => {
      this.IsWait = false;
      this.ViajesResponse = data;
      this.ViajesResponse.data.forEach(element => {
        var res = element.urlFoto.split("?");
        if (res.length >= 0) {
          element.urlFoto = res[0];
        }
        element.urlFoto = element.urlFoto + "?" + Math.random();
      });
      console.log('DATA VIAJES', this.ViajesResponse);
    });
    this.lShowPanelListadoViajes = true;
    this.lShowPanelDatosViaje = false;
    this.lShowBtnActualizar = false;
    this.lShowBtnEliminar = false;
  }

  callAdd() {
    this.viajeForm.controls['USUARIO_ID'].setValue(this.session.user.USUARIO_ID);
    this.viajeRequest = this.viajeForm.getRawValue();
    this.IsWait = true;
    this.toolService.showLoading();
    console.log('Objeto ', this.viajeRequest);
    this.viajesService.crearViaje(this.viajeRequest).subscribe(data => {
      this.toolService.closeLoading();
      this.IsWait = false;
      if (data.mensaje == "TRUE") {
        console.log("registro exitoso ", data);
        Swal.fire(
          'Viajes',
          'Viaje creado correctamente',
          'success'
        );
        this.cargarViajes();
      }
    });
  }

  callUpdate() {
    this.viajeForm.controls['USUARIO_ID'].setValue(this.session.user.USUARIO_ID);
    this.viajeRequest = this.viajeForm.getRawValue();
    this.IsWait = true;
    this.toolService.showLoading();
    //console.log(this.viajeRequest);
    console.log(this.urlTemporal);
    if (this.urlTemporal != "") {
      //console.log("TEMPORAL  NO ES VACIA!!!");
      this.viajeRequest.urlFoto = this.urlTemporal;
    } else {
      console.log("TEMPORAL ES VACIA!!!");
      console.log(this.viajeRequest);
    }

    this.viajesService.actualizarViaje(this.viajeRequest).subscribe(data => {
      console.log(data);
      if (data.mensaje == "TRUE") {
        Swal.fire(
          'Viajes',
          'Viaje actualizado correctamente',
          'success'
        );
        this.cargarViajes();
      }
      this.toolService.closeLoading();
      this.IsWait = false;
    });
  }


  callCancelar() {
    this.viajeForm.reset();
    this.lShowPanelDatosViaje = false;
    this.lShowPanelListadoViajes = true;
  }

  adicionar() {
    this.viajeForm.reset();
    this.lShowBtnAdicionar = true;
    this.lShowBtnActualizar = false;
    this.lShowBtnEliminar = false;
    this.lShowPanelDatosViaje = true;
    this.lShowPanelListadoViajes = false;

    this.actualItemUrl = "";
    this.base64textString = "";

  }

  actualizar(viaje) {
    this.actualItemUrl = "";
    this.base64textString = "";
    this.urlTemporal = "";

    this.viajeForm.patchValue(viaje);
    this.viajeSeleccionado = viaje;
    this.actualItemUrl = this.serverURlImagesViajes + this.viajeForm.controls['urlFoto'].value;
    this.lShowBtnActualizar = true;
    this.lShowBtnEliminar = true;
    this.lShowBtnAdicionar = false;
    this.lShowPanelDatosViaje = true;
    this.lShowPanelListadoViajes = false;
    this.urlTemporal = "";
  }

  callEliminar(viajeElimina: Viajes) {
    viajeElimina.USUARIO_ID = this.session.user.USUARIO_ID;
    this.viajeEliminar = viajeElimina;
    this.openDialog();
  }

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "300px";
    dialogConfig.data = {
      titulo: "Gestión de Embarcaciones",
      body: "Esta seguro que desea eliminar la embarcación?",
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
        this.llamarServicioEliminar();
      } else {
        console.log('The dialog was closed');
      }
    });

  }

  llamarServicioEliminar() {
    this.toolService.showLoading();
    this.IsWait = true;
    console.log('DATA A ELIMINAR ', this.viajeEliminar)
    this.viajesService.eliminarViaje(this.viajeEliminar).subscribe(data => {
      this.toolService.closeLoading();
      this.IsWait = false;
      console.log('DATA ELIMINAR', data);
      if (data.mensaje == "TRUE") {
        Swal.fire(
          'Viajes',
          'Viaje eliminado correctamente',
          'success'
        );
        this.cargarViajes();
        this.IsWait = false;
      }
    })
    this.IsWait = true;
  }


  findBy() {
    console.log(this.findByItem);
    this.cargarViajes();
    this.IsWait = true;
  }

  selectFile(event: any) {
    this.selectedFile = event.target.files.item(0);
    console.log(event.target.files)

    if (this.selectedFile.type.match('image.*')) {
      this.selectedFiles = event.target.files;
    } else {
      alert('invalid format!');
    }
    /**Objeto Reder que lee el fichero y realiza las
     * peticiones de conversión a Base64.
     */
    var reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsBinaryString(this.selectedFiles[0]);
  }

  /**Metodo que realiza la conversión del archivo detectado por el reader
  * a Base64.
 */
  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    this.actualItemUrl = "data:image/jpeg;base64," + this.base64textString;
  }

  callUploadService() {
    console.log(this.toolService.getInvalidControlsInForm(this.viajeForm));
    if (!this.viajeForm.valid) {
      return true;
    }
    if (this.base64textString == "") {
      this.callUpdate();
      console.log('vacio');
    } else {
      var ojb = {
        email: this.session.user.USUARIO_CORREO,
        descFoto: "foto viaje",
        userId: this.viajeSeleccionado.capitan_barco,
        name: "fotoViaje" + this.viajeSeleccionado.id,
        img: this.base64textString
      };

      //console.log('se envia ojb ', ojb)
      this.toolService.uploadData(ojb).subscribe(response => {
        console.log('responsee: ', response);
        if (response.mensaje = "TRUE") {
          console.log('response path file ', response.pathFile)
          this.urlTemporal = response.pathFile;
          this.callUpdate();
        }
      });

    }

  }

}
