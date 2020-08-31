import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../usuarios/usuarios.service';
import { Usuarios } from '../core/interfaces/usuarios.interface';
import { FormControl, FormGroup, Validators, NgModel } from '@angular/forms';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ToolsService } from '../core/services/tools.service';
import { ModalComponent } from '../core/modal/modal.component'
import { UserSession } from '../core/interfaces/usersession.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  public userForm: FormGroup;
  listadoUsuarios: Usuarios = {};
  usuarioRequest: User;
  usuarioSeleccionado: User;

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

  public serverURlImagesUsuarios: String;
  public etiquetas:any= {};


  public findByItem = {
    USUARIO_NOMBRE: "",
    USUARIO_CORREO: "",
    _search: true   //si queremos hacer filtro, debe ir como true.
  }

  public usuarioEliminar: any;

  constructor(private serviceUsuario: UsuariosService, private toolService: ToolsService, private dialog: MatDialog) {
    this.serverURlImagesUsuarios = serviceUsuario.getWebRootUrl();
    this.session = JSON.parse(localStorage.getItem('USER'));
    this.etiquetas = JSON.parse(localStorage.getItem("ETIQUETAS"));
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
    });
  }

  loadListado(obj?) {
    this.IsWait = true;
    this.serviceUsuario.cargarUsuarios(obj).subscribe(data => {
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
    this.userForm.reset();
    this.lShowBtnAdicionar = true;
    this.lShowBtnActualizar = false;
    this.lShowBtnEliminar = false;
    this.lShowPanelDatosUsuario = true;
    this.lShowPanelListadoUsuario = false;
    this.actualItemUrl = "";
    this.base64textString = "";
  }

  actualizar(user: User) {
    console.log(user);
    this.actualItemUrl = "";
    this.base64textString = "";
    this.urlTemporal="";
    this.usuarioSeleccionado = user;
    this.userForm.patchValue(this.usuarioSeleccionado);
    console.log('capitan select: ', this.usuarioSeleccionado);
    this.actualItemUrl = this.serverURlImagesUsuarios + this.usuarioSeleccionado.URL_FOTO_PERFIL;
    this.lShowBtnActualizar = true;
    this.lShowBtnEliminar = true;
    this.lShowBtnAdicionar = false;
    this.lShowPanelDatosUsuario = true;
    this.lShowPanelListadoUsuario = false;
  }

  callCancelar() {
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

    if (!this.userForm.valid) {
      return true;
    }

    this.IsWait = true;
    this.toolService.showLoading();
    console.log(this.userForm.value);

    this.usuarioRequest = this.userForm.getRawValue();
    console.log(this.usuarioRequest);

    if(this.urlTemporal!=""){
      this.usuarioRequest.URL_FOTO_PERFIL = this.urlTemporal;
    }
    this.serviceUsuario.actualizarUsuario(this.usuarioRequest).subscribe(data => {
      console.log(data);
      this.IsWait = false;
      this.toolService.closeLoading();
      if (data.mensaje == "TRUE") {
        Swal.fire(
          'Usuarios',
          'Usuario actualizado correctamente',
          'success'
        );
        this.loadListado();
      }
    });
  }

  callAdd() {
    this.toolService.showLoading();
    this.IsWait = true;
    console.log(this.userForm.value);
    this.userForm.controls['EMPRESA_ID'].setValue(1);
    this.userForm.controls['CIUDAD_ID'].setValue(1);
    this.userForm.controls['PUNTO_ID'].setValue(1);
    this.userForm.controls['MCA_EMPLEADO'].setValue(1);
    this.userForm.controls['IDIOMA_ID'].setValue(1);
    this.userForm.controls['ROL_ID'].setValue(1);
    this.serviceUsuario.adicionarUsuario(this.userForm.value).subscribe(data => {
     
      if (data.mensaje == "TRUE") {
        Swal.fire(
          'Usuarios',
          'Usuario creado correctamente',
          'success'
        );
        this.loadListado();
      }
      this.IsWait = false;
      this.toolService.closeLoading();
    });
  }

  callEliminar(user) {
    this.usuarioEliminar = user;
    this.openDialog();
    console.log("callEliminar");
  }

  llamarServicioEliminar() {
    this.IsWait = true;
    this.toolService.showLoading();
    console.log('llamo servicio eliminar');
    this.serviceUsuario.eliminarUsuario(this.usuarioEliminar).subscribe(data => {
      this.IsWait = false;
      this.toolService.closeLoading();
      if (data.mensaje == "TRUE") {
        Swal.fire(
          'Usuarios',
          'Usuario eliminado correctamente',
          'success'
        );
        this.loadListado();
      }
    });
  }

  findBy() {
    console.log(this.findByItem);
    if (this.findByItem.USUARIO_NOMBRE.length > 1 || this.findByItem.USUARIO_CORREO.length > 1) {
      console.log("DEBE  LLAMAR SERVICIO DE BUSQUEDA");
      this.loadListado(this.findByItem);
    } else {
      this.loadListado();
    }
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
    if (this.base64textString == "") {
      this.callUpdate();
      console.log('vacio');
    } else {

      var ojb = {
        email: this.usuarioSeleccionado.USUARIO_CORREO,
        descFoto: "foto Usuario",
        userId: this.usuarioSeleccionado.ID,
        name: "profile",
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

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "300px";
    dialogConfig.data = {
      titulo: "Gestión de Usuarios",
      body: "Esta seguro que desea eliminar este usuario?",
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
      console.log('The dialog was closed');
    });



  }

}
