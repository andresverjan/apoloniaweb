import { Component, OnInit } from '@angular/core';
import { CapitanesService } from './capitanes.service';
import { Usuarios } from '../core/interfaces/usuarios.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ToolsService } from '../core/services/tools.service';
import { ModalComponent } from '../core/modal/modal.component';
import { UserSession } from '../core/interfaces/usersession.interface';
import { element } from '@angular/core/src/render3';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-capitanes',
  templateUrl: './capitanes.component.html',
  styleUrls: ['./capitanes.component.scss']
})
export class CapitanesComponent implements OnInit {
  public userForm: FormGroup;
  listadoUsuarios: Usuarios = {};
  capitanRequest: User;
  capitanSeleccionado: User;
  capitanEliminar: any;
  public lShowBtnActualizar: Boolean = false;
  public lShowBtnAdicionar: Boolean = false;
  public lShowBtnEliminar: Boolean = false;
  public IsWait: Boolean = false;
  public dialogRef: any;
  public lShowPanelDatosUsuario: Boolean = false;
  public lShowPanelListadoUsuario: Boolean = true;

  actualItemUrl: any;
  urlTemporal: any;
  public session: UserSession;

  selectedFiles: FileList;
  selectedFile: File;
  private base64textString: String = "";

  public serverURlImagesCapitanes: String;
  public etiquetas:any= {};

  public findByItem = {
    USUARIO_NOMBRE: "",
    USUARIO_CORREO: "",
    _search: true   //si queremos hacer filtro, debe ir como true.
  }

  constructor(private lService: CapitanesService, private toolService: ToolsService, private dialog: MatDialog) {
    this.serverURlImagesCapitanes = lService.getWebRootUrl();
    this.etiquetas = JSON.parse(localStorage.getItem("ETIQUETAS"));
    this.session = JSON.parse(localStorage.getItem('USER'));
  }

  ngOnInit() {
    this.loadListado();

    this.userForm = new FormGroup({
      USUARIO_LOGIN: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      COUNTRY: new FormControl('', [Validators.maxLength(50)]),
      USUARIO_NOMBRE: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      USUARIO_CORREO: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      USUARIO_APELLIDO: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      ID: new FormControl('', [Validators.maxLength(50)]),
      ROL_ID: new FormControl('', [Validators.maxLength(50)]),
      USUARIO_TELEFONO: new FormControl('', [Validators.maxLength(50)]),
      USUARIO_ACTIVO: new FormControl('', [Validators.maxLength(50)]),
      IDIOMA_ID: new FormControl('', [Validators.maxLength(50)]),
      EMPRESA_ID: new FormControl('', [Validators.maxLength(50)]),
      CIUDAD_ID: new FormControl('', [Validators.maxLength(50)]),
      PUNTO_ID: new FormControl('', [Validators.maxLength(50)]),
      USUARIO_PASSWORD: new FormControl('', [Validators.maxLength(50)]),
      MCA_EMPLEADO: new FormControl('', [Validators.maxLength(50)]),
      URL_FOTO_PERFIL: new FormControl('', []),
      numeroLicencia: new FormControl('', [Validators.required,]),
    });

  }

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "300px";
    dialogConfig.data = {
      titulo: "Gestión de Capitanes",
      body: "Esta seguro que desea eliminar el capitan?",
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
    this.lService.eliminarUsuario(this.capitanEliminar).subscribe(data => {
      this.IsWait = false;
      this.toolService.closeLoading();
      if (data.mensaje == "TRUE") {
        Swal.fire(
          'Capitanes',
          'Capitan eliminado correctamente',
          'success'
        );
        this.loadListado();
      }
    });
  }

  loadListado(obj?) {
    this.IsWait = true;
    this.lService.cargarUsuarios(obj).subscribe(data => {
      this.listadoUsuarios = data;
      this.listadoUsuarios.data.forEach(element => {
        var res = element.URL_FOTO_PERFIL.split("?");
        if (res.length>=0){
          element.URL_FOTO_PERFIL = res[0];
        }
        element.URL_FOTO_PERFIL = element.URL_FOTO_PERFIL + "?" + Math.random();
      })
      this.IsWait = false;
    });
    this.lShowPanelListadoUsuario = true;
    this.lShowBtnActualizar = false;
    this.lShowBtnEliminar = false;
    this.lShowBtnAdicionar = false;
    this.lShowPanelDatosUsuario = false;
  }

  /*
  * Metodos crud, solo sirven para mostrar los datos en pantalla
  * e inicalizar variables y valores y llenar inputs.. FORM.
  */
  adicionar() {
    this.actualItemUrl="";
    this.base64textString = "";
    this.userForm.reset();
    this.lShowBtnAdicionar = true;
    this.lShowBtnActualizar = false;
    this.lShowBtnEliminar = false;
    this.lShowPanelDatosUsuario = true;
    this.lShowPanelListadoUsuario = false;
  }

  actualizar(user: User) {
    this.actualItemUrl="";
    this.base64textString = "";
    this.urlTemporal="";
    this.capitanSeleccionado = user;
    this.userForm.patchValue(this.capitanSeleccionado);
    this.actualItemUrl = this.serverURlImagesCapitanes + this.capitanSeleccionado.URL_FOTO_PERFIL;
    this.lShowBtnActualizar = true;
    this.lShowBtnEliminar = true;
    this.lShowBtnAdicionar = false;
    this.lShowPanelDatosUsuario = true;
    this.lShowPanelListadoUsuario = false;
  }

  callCancelar() {
    this.actualItemUrl="";
    this.base64textString = "";
    this.showListado();
    this.userForm.reset();
  }

  showListado() {
    this.lShowBtnActualizar = false;
    this.lShowBtnEliminar = false;
    this.lShowBtnAdicionar = false;
    this.lShowPanelDatosUsuario = false;
    this.lShowPanelListadoUsuario = true;
  }

  /*
   * Metodos Call, Ejecutan el llamado del servicio.
   */
  callUpdate() {
    this.IsWait = true;
    this.toolService.showLoading();
    this.capitanRequest = this.userForm.getRawValue();
    if (this.urlTemporal!=""){
      this.capitanRequest.URL_FOTO_PERFIL = this.urlTemporal;
    }
    this.lService.actualizarUsuario(this.capitanRequest).subscribe(data => {
      this.IsWait = false;
      this.toolService.closeLoading();
      if (data.mensaje == "TRUE") {
        Swal.fire(
          'Capitanes',
          'Capitan actualizado correctamente',
          'success'
        );
        this.loadListado();
      }
    });
  }

  callAdd() {
    this.toolService.showLoading();
    this.IsWait = true;
    this.lService.adicionarUsuario(this.userForm.value).subscribe(data => {
      this.IsWait = false;
      this.toolService.closeLoading();
      if (data.mensaje == "TRUE") {
        Swal.fire(
          'Capitanes',
          'Capitan agregado correctamente',
          'success'
        );
        this.loadListado();
      }
    });
  }

  callEliminar(user) {
    this.capitanEliminar = user;
    this.openDialog();
    this.IsWait = false;
  }

  findBy() {
    if (this.findByItem.USUARIO_NOMBRE.length > 1 || this.findByItem.USUARIO_CORREO.length > 1) {
      this.loadListado(this.findByItem);
    } else {
      this.loadListado();
    }
    this.IsWait = true;
  }

  selectFile(event: any) {
    this.selectedFile = event.target.files.item(0);
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
    if (this.base64textString == "") {
      this.callUpdate();
      console.log('vacio');
    } else {

      var metadata = {
        email: this.capitanSeleccionado.USUARIO_CORREO,
        descFoto: "foto capitan",
        userId: this.capitanSeleccionado.ID,
        name: "capitan foto",
        img: this.base64textString
      };

      this.toolService.uploadData(metadata).subscribe(response => {
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
