import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolsService } from '../core/services/tools.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserSession } from '../core/interfaces/usersession.interface';
import {ProfileService} from './profile.service';
import { Paises } from '../core/interfaces/paises.interface';
import { IdiomasService } from '../idiomas/idiomas.service';
import { Idioma } from '../core/interfaces/idiomas.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  selected = "";
  UserResponseProfile: User;
  paisesResponse: Paises = {};

  public listadoIdiomas: Array<Idioma>;
  public profileForm: FormGroup;
  public identificaCapitan: boolean = false;
  public identificaAdmin: boolean = false;
  public identificaUsuario: boolean = false;

  public serverURlImagesProfile: String;
  public IsWait: Boolean = false;
  public actualItemUrl: String;
  private session: UserSession;
  lShowPanelDatosViaje: boolean;
  lShowBtnActualizar: boolean;
  lShowImagen: boolean;
  selectedFiles: FileList;
  selectedFile: File;
  private base64textString: String = "";
  public datosAlert:any= {};

  public findByItem = {
    embarcacion_nombre: "",
    _search: true,
    userId: "",
    token: ""
  }

  public etiquetas:any= {};


  constructor(private route: ActivatedRoute, private router:Router, private toolService:ToolsService,
              private profileService:ProfileService , private lService: IdiomasService) {

    this.serverURlImagesProfile = this.profileService.getWebRootUrl();
    this.etiquetas = JSON.parse(localStorage.getItem("ETIQUETAS"));
    this.session = JSON.parse(localStorage.getItem('USER'));
    this.profileForm = new FormGroup({
      USUARIO_NOMBRE: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      USUARIO_APELLIDO: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      USUARIO_CORREO: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      USUARIO_TELEFONO: new FormControl('', [Validators.maxLength(50)]),
      NOMBRE_CIUDAD: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      NOMBRE_DIRECCION: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      CELULAR: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      USUARIO_NACIMIENTO: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      IDIOMA_ID: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      USUARIO_SEXO: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      COUNTRY: new FormControl('', [Validators.required, Validators.maxLength(50)])
    });
    this.LoadProfileData();
    this.cargarPaises();

    this.datosAlert.titulo = "Autenticación Marlynk";

  }

  ngOnInit() {
    this.CargarIdiomas();
    this.lShowPanelDatosViaje = true;
    this.lShowBtnActualizar = true;
    this.lShowImagen = true;

  }

  LoadProfileData(){
    this.IsWait = true;
    var objProfile = {
      userId: this.session.user.ID,
      token: this.session.token

    };
    this.profileService.getMyProfile(objProfile).subscribe(response => {
      if (response.mensaje == "TRUE") {
        this.IsWait = false;
        this.UserResponseProfile = response.data[0];
        console.log('RESPONSE GETMYPROFILE ', response.data[0]);
        this.validaIdentificador(this.UserResponseProfile.ROL_ID);
        this.llenarCamposForm();
      }
    })
  }

  CargarIdiomas() {
    this.findByItem.userId = this.session.user.ID;
    this.findByItem.token = this.session.token;
    this.lService.cargarIdiomas(this.findByItem).subscribe(data => {
      this.IsWait = false;
      this.listadoIdiomas = data.data;
      console.log('IDIOMAAS')
      console.log(data)
    });
  }

  validaIdentificador(rol: any) {
    switch (rol) {
      case "1":
        this.identificaAdmin = true;
        this.identificaCapitan = false;
        this.identificaUsuario = false;
        break;

      case "5":
        this.identificaAdmin = false;
        this.identificaCapitan = true;
        this.identificaUsuario = false;
        break;

      case "6":
        this.identificaAdmin = false;
        this.identificaCapitan = false;
        this.identificaUsuario = true;
        break;
    }

  }
  cargarPaises() {
    this.toolService.listarPaises().subscribe(response => {
      this.paisesResponse = response;
    })
  }

  llenarCamposForm() {
    var res = this.UserResponseProfile.URL_FOTO_PERFIL.split("?");
    if (res.length >= 0) {
      this.UserResponseProfile.URL_FOTO_PERFIL = res[0];
    }
    this.UserResponseProfile.URL_FOTO_PERFIL = this.UserResponseProfile.URL_FOTO_PERFIL + "?" + Math.random();
    this.actualItemUrl = this.serverURlImagesProfile + this.UserResponseProfile.URL_FOTO_PERFIL;
    this.profileForm.controls['USUARIO_NOMBRE'].setValue(this.UserResponseProfile.USUARIO_NOMBRE);
    this.profileForm.controls['USUARIO_APELLIDO'].setValue(this.UserResponseProfile.USUARIO_APELLIDO);
    this.profileForm.controls['USUARIO_CORREO'].setValue(this.UserResponseProfile.USUARIO_CORREO);
    this.profileForm.controls['USUARIO_TELEFONO'].setValue(this.UserResponseProfile.USUARIO_TELEFONO);
    this.profileForm.controls['NOMBRE_CIUDAD'].setValue(this.UserResponseProfile.NOMBRE_CIUDAD);
    this.profileForm.controls['NOMBRE_DIRECCION'].setValue(this.UserResponseProfile.NOMBRE_DIRECCION);
    this.profileForm.controls['CELULAR'].setValue(this.UserResponseProfile.CELULAR);
    this.profileForm.controls['COUNTRY'].setValue(this.UserResponseProfile.COUNTRY);
    this.profileForm.controls['USUARIO_NACIMIENTO'].setValue(this.UserResponseProfile.USUARIO_NACIMIENTO);
    this.profileForm.controls['IDIOMA_ID'].setValue(this.UserResponseProfile.IDIOMA_ID);
    this.profileForm.controls['USUARIO_SEXO'].setValue(this.UserResponseProfile.USUARIO_SEXO);
  }

  callUpdate() {
    this.UserResponseProfile.USUARIO_NOMBRE = this.profileForm.controls['USUARIO_NOMBRE'].value;
    this.UserResponseProfile.USUARIO_APELLIDO = this.profileForm.controls['USUARIO_APELLIDO'].value;
    this.UserResponseProfile.USUARIO_CORREO = this.profileForm.controls['USUARIO_CORREO'].value;
    this.UserResponseProfile.USUARIO_TELEFONO = this.profileForm.controls['USUARIO_TELEFONO'].value;
    this.UserResponseProfile.NOMBRE_CIUDAD = this.profileForm.controls['NOMBRE_CIUDAD'].value;
    this.UserResponseProfile.NOMBRE_DIRECCION = this.profileForm.controls['NOMBRE_DIRECCION'].value;
    this.UserResponseProfile.CELULAR = this.profileForm.controls['CELULAR'].value;
    this.UserResponseProfile.COUNTRY = this.profileForm.controls['COUNTRY'].value;
    this.UserResponseProfile.USUARIO_NACIMIENTO = this.profileForm.controls['USUARIO_NACIMIENTO'].value;
    this.UserResponseProfile.USUARIO_SEXO = this.profileForm.controls['USUARIO_SEXO'].value;
    this.UserResponseProfile.IDIOMA_ID = this.profileForm.controls['IDIOMA_ID'].value;
    this.UserResponseProfile.STATUS_ONLINE = 'S';
    console.log(this.profileForm.controls['USUARIO_SEXO'].value);

    let newDate = new Date(this.UserResponseProfile.USUARIO_NACIMIENTO);
    this.UserResponseProfile.USUARIO_NACIMIENTO = newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-'
      + newDate.getDate();
    this.callUploadService(this.base64textString);  
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
   * a Base64. y lo pone en la imagen.
  */
  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    console.log(this.base64textString);
    this.actualItemUrl = "data:image/jpeg;base64," + this.base64textString;
  }

  callCancelar() {
    if(this.identificaUsuario == true){
      this.router.navigate(['/home/inicio']);
    } else {
      this.router.navigate(['/dashboard/principal']);
    }
  }

  callUploadService(varImgBase64) {
    this.toolService.showLoading();
    if (varImgBase64 == "") {
      this.actualizarProfileFoto();
    } else {

      var ojb = {
        email: this.UserResponseProfile.USUARIO_CORREO,
        descFoto: "foto perfil",
        userId: this.UserResponseProfile.USUARIO_ID,
        name: "profile",
        img: varImgBase64
      };

      this.toolService.uploadData(ojb).subscribe(response => {
        if (response.mensaje = "TRUE") {
          console.log(response);
          console.log('response path file ', response.pathFile)
          this.UserResponseProfile.URL_FOTO_PERFIL = response.pathFile;
          this.actualizarProfileFoto();
        }
      });
    }
  }

  actualizarProfileFoto() {
    this.profileService.actualizarProfile(this.UserResponseProfile).subscribe(response => {
      this.toolService.closeLoading();
      this.LoadProfileData();
      Swal.fire(
        'Perfil',
        'Perfil Actualizado correctamente',
        'success'
      );
    });
  }

}
