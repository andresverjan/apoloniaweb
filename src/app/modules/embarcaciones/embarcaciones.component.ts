import { Component, OnInit } from '@angular/core';
import { CapitanesService } from '../capitanes/capitanes.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuarios } from '../core/interfaces/usuarios.interface';
import { Embarcacion } from '../core/interfaces/embarcacion.interface';
import { EmbarcacionesService } from './embarcaciones.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ToolsService } from '../core/services/tools.service';
import { ModalComponent } from '../core/modal/modal.component';
import { UserSession } from '../core/interfaces/usersession.interface';
//import { ConsoleReporter } from 'jasmine';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-embarcaciones',
  templateUrl: './embarcaciones.component.html',
  styleUrls: ['./embarcaciones.component.scss']
})
export class EmbarcacionesComponent implements OnInit {

  listadoCapitanes: Array<User>;
  listadoEmbarcaciones: Array<Embarcacion>;
  embarcacionRequest: Embarcacion = {};
  embarcacionSeleccionada: Embarcacion;
  embarcacionEliminar: any;
  selected = "";
  idCapitan: any;
  public urlTemporal: string = "";

  public session: UserSession;
  selectedFiles: FileList;
  selectedFile: File;
  private base64textString: String = "";

  public serverURlImagesBanderas: String;
  public actualItemUrl: String;
  public IsWait: Boolean = false;
  public dialogRef: any;
  public embarcacionForm: FormGroup;
  public lShowPanelListadoEmbarcaciones: Boolean = true;
  public lShowPanelDatosEmbarcacion: boolean = false;
  public lShowBtnAdicionar: boolean = false;
  public lShowBtnActualizar: boolean = false;
  public lShowBtnEliminar: boolean = false;
  public ocultarSelector: boolean = false;

  public clasificacionesVelero = [];
  public listaModelos = [];
  public clasificacionesMotor = [];

  public alistaClasificacion: any;
  public alistaModelo: any;
  public etiquetas:any= {};


  public findByItem = {
    embarcacion_nombre: "",
    _search: true,   //si queremos hacer filtro, debe ir como true.
    userId: "",
    token: ""
  }

  constructor(private capitanesService: CapitanesService, private toolService: ToolsService, private embServices: EmbarcacionesService,
    private dialog: MatDialog) {
    this.etiquetas = JSON.parse(localStorage.getItem("ETIQUETAS"));
    this.session = JSON.parse(localStorage.getItem('USER'));

    this.serverURlImagesBanderas = embServices.getWebRootUrl();


    this.clasificacionesVelero = [
      {
        value: "Velero",
        description: "Velero"
      }, {
        value: "Catamaran",
        description: "Catamaran"
      }, {
        value: "Trimaran",
        description: "Trimaran"
      }
    ];

    this.clasificacionesMotor = [
      {
        value: "Consola",
        description: "Consola Central"
      }, {
        value: "Yate",
        description: "Yate"
      }, {
        value: "Mega",
        description: "Mega yate"
      }
    ];

    this.listaModelos = [
      {
        value: "Sport",
        description: "Sport fishing"
      }, {
        value: "Cruising",
        description: "Cruising"
      }
    ];
  }

  ngOnInit() {
    this.cargarCapitanes();
    this.cargarEmbarcaciones();
    this.embarcacionForm = new FormGroup({
      id: new FormControl('', [Validators.maxLength(60)]),
      capitan_barco: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      numeroRegistro: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      puertoMarina: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      embarcacionTipo: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      marca: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      tonelaje: new FormControl('', [Validators.maxLength(60)]),
      modelo: new FormControl('', [Validators.maxLength(60)]),
      year: new FormControl('', [Validators.maxLength(60)]),
      size: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      urlBarco: new FormControl('', [Validators.maxLength(250)]),
      clasificacion: new FormControl('', [Validators.maxLength(60)]),
      nivelSeguridad: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      country: new FormControl('', [Validators.maxLength(50)]),
      countryFlag: new FormControl('', [Validators.maxLength(60)]),
      lat: new FormControl('', [Validators.maxLength(60)]),
      lng: new FormControl('', [Validators.maxLength(60)]),
      embarcacion_nombre: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      tripulacion: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      numeroPasajeros: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    });

    console.log("INI");
    console.log(this.session.user.ROL_ID);
    if (this.session.user.ROL_ID != '1') {
      console.log("ES DIFERENTE DE 1");
      this.embarcacionForm.controls['capitan_barco'].setValue(this.session.user.ID);
    }
  }

  cargarCapitanes() {
    this.IsWait = true;
    this.capitanesService.cargarUsuarios().subscribe(data => {
      this.listadoCapitanes = data.data;
      this.IsWait = false;
    });
  }

  onChangeEm() {
    let lembarcacionTipo = this.embarcacionForm.controls['embarcacionTipo'].value;
    if (lembarcacionTipo == "Vela") {
      this.alistaClasificacion = this.clasificacionesVelero;
      this.alistaModelo = [];
    } else {
      this.alistaClasificacion = this.clasificacionesMotor;
      this.alistaModelo = this.listaModelos;
    }
  }

  cargarEmbarcaciones() {
    this.IsWait = true;
    this.findByItem.userId = this.session.user.ID;
    this.findByItem.token = this.session.token;
    this.embServices.cargarEmbarcaciones(this.findByItem).subscribe(data => {
      this.listadoEmbarcaciones = data;
      this.listadoEmbarcaciones.forEach(element => {
        var res = element.urlBarco.split("?");
        if (res.length>=0){
          element.urlBarco = res[0];
        }
        element.urlBarco = element.urlBarco + "?" + Math.random();
      })
      this.IsWait = false;
    })
    this.lShowPanelListadoEmbarcaciones = true;
    this.lShowPanelDatosEmbarcacion = false;
    this.lShowBtnActualizar = false;
    this.lShowBtnEliminar = false;
  }

  callAdd() {
    console.log(this.toolService.getInvalidControlsInForm(this.embarcacionForm));
    this.IsWait = true;
    this.toolService.showLoading();
    this.embarcacionRequest = this.embarcacionForm.getRawValue();
    console.log('Objeto ', this.embarcacionRequest);
    this.embServices.crearEmbarcacion(this.embarcacionRequest).subscribe(data => {
      if (data.mensaje == "TRUE") {
        console.log("registro exitoso ", data);
        Swal.fire(
          'Embarcaciones',
          'Embarcacion creada correctamente',
          'success'
        );
        this.cargarEmbarcaciones();
        this.IsWait = false;
        this.toolService.closeLoading();
      }
    })
  }

  callUpdate() {
    this.IsWait = true;
    this.toolService.showLoading();
    this.embarcacionRequest = this.embarcacionForm.getRawValue();
    if (this.urlTemporal != "") {
      this.embarcacionRequest.urlBarco = this.urlTemporal;
    } else {
      console.log("TEMPORAL ES VACIA!!!");
    }

    this.embServices.actualizarEmbarcacion(this.embarcacionRequest).subscribe(data => {
      if (data.mensaje == "TRUE") {
        Swal.fire(
          'Embarcaciones',
          'Embarcacion actualizada correctamente',
          'success'
        );
        this.cargarEmbarcaciones();
        this.IsWait = false;
        this.toolService.closeLoading();
      }
    });
  }


  callCancelar() {
    this.embarcacionForm.reset();
    this.lShowPanelDatosEmbarcacion = false;
    this.lShowPanelListadoEmbarcaciones = true;
  }

  adicionar() {
    this.embarcacionForm.reset();
    this.lShowBtnAdicionar = true;
    this.lShowBtnActualizar = false;
    this.lShowBtnEliminar = false;
    this.lShowPanelDatosEmbarcacion = true;
    this.lShowPanelListadoEmbarcaciones = false;

    this.actualItemUrl="";
    this.base64textString = "";

    console.log("INI");
    console.log(this.session.user.ROL_ID);
    if (this.session.user.ROL_ID != '1') {
      console.log("ES DIFERENTE DE 1");
      this.embarcacionForm.controls['capitan_barco'].setValue(this.session.user.ID);
    }
  }

  actualizar(embarcacion) {
    this.actualItemUrl="";
    this.base64textString = "";
    this.urlTemporal = "";


    this.embarcacionSeleccionada = embarcacion;
    this.embarcacionForm.patchValue(embarcacion);
    this.actualItemUrl =   this.serverURlImagesBanderas+ this.embarcacionForm.controls['urlBarco'].value;
    this.lShowBtnActualizar = true;
    this.lShowBtnEliminar = true;
    this.lShowBtnAdicionar = false;
    this.lShowPanelDatosEmbarcacion = true;
    this.lShowPanelListadoEmbarcaciones = false;
    this.onChangeEm();
    console.log('ARCHIVO SUBIDO BASE 64', this.base64textString);
  }

  callEliminar(user) {
    this.embarcacionEliminar = user;
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
    }
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
    this.IsWait = true;
    this.toolService.showLoading();
    this.embServices.eliminarEmbarcacion(this.embarcacionEliminar).subscribe(data => {
      console.log('DATA ELIMINAR', data);
      this.IsWait = false;
      this.toolService.closeLoading();
      if (data.mensaje == "TRUE") {
        Swal.fire(
          'Embarcaciones',
          'Embarcacion eliminada correctamente',
          'success'
        );
        this.cargarEmbarcaciones();
      }
    })
  }


  findBy() {
    console.log(this.findByItem);
    this.cargarEmbarcaciones();
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
    console.log("ENTRO");
    console.log(this.toolService.getInvalidControlsInForm(this.embarcacionForm));

    if (!this.embarcacionForm.valid) {
      return true;
    }
    if (this.base64textString == "") {
      this.callUpdate();
      console.log('vacio');
    } else {
      var ojb = {
        email: this.session.user.USUARIO_CORREO,
        descFoto: "foto embarcacion",
        userId: this.embarcacionSeleccionada.capitan_barco,
        name: "embarcacion" + this.embarcacionSeleccionada.id,
        img: this.base64textString
      };

      //console.log('se envia ojb ', ojb)
      this.toolService.uploadData(ojb).subscribe(response => {
        console.log('responsee: ', response);
        if (response.mensaje = "TRUE") {
          console.log(response);
          console.log('response path file ', response.pathFile)
          this.urlTemporal = response.pathFile;
          this.callUpdate();
        }

      });

    }

  }


}
