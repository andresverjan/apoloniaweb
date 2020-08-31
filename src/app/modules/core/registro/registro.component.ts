import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolsService } from '../services/tools.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserSession } from '../interfaces/usersession.interface';
import { RegistroService } from './registro.service';
import { Paises } from '../interfaces/paises.interface';
import { ModalComponent } from '../modal/modal.component';
import { MatDialogConfig, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  UserResponseRegistro: User;
  usuarioRequest: User;
  paisesResponse: Paises = {};
  usuarioSeleccionado: User;

  public registroForm: FormGroup;
  //public identificaCapitan:boolean = false;
  //public identificaAdmin:boolean = false;
  //public identificaUsuario:boolean = false;

  //public serverURlImagesProfile : String;
  public IsWait: Boolean = false;
  urlTemporal: any;
  password1: any;
  password2: any;
  //public actualItemUrl : String;
  private session: UserSession;
  lShowPanelDatosViaje: boolean;
  lShowBtnActualizar: boolean;
  lShowImagen: boolean;
  selectedFiles: FileList;
  selectedFile: File;
  private base64textString: String = "";
  public etiquetas:any= {};


  constructor(private serviceUsuario: RegistroService,
     private router: Router,
      private toolService: ToolsService,
     private dialog: MatDialog,
    public dialogRef: MatDialogRef<RegistroComponent>,
    @Inject(MAT_DIALOG_DATA) public data2: any) {

    this.etiquetas = JSON.parse(localStorage.getItem("ETIQUETAS"));
    // this.serverURlImagesProfile = this.profileService.getWebRootUrl();
    this.session = JSON.parse(localStorage.getItem('USER'));
    this.registroForm = new FormGroup({
      USUARIO_LOGIN: new FormControl('', [Validators.maxLength(50)]),
      COUNTRY: new FormControl('', [Validators.maxLength(50)]),
      USUARIO_NOMBRE: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      USUARIO_CORREO: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      USUARIO_APELLIDO: new FormControl('', [ Validators.maxLength(50)]),
      ID: new FormControl('', [Validators.maxLength(50)]),
      ROL_TEXT: new FormControl('', [Validators.maxLength(50)]),
      USUARIO_TELEFONO: new FormControl('', [Validators.maxLength(50)]),
      USUARIO_ACTIVO: new FormControl('', [Validators.maxLength(50)]),
      IDIOMA_ID: new FormControl('', [Validators.maxLength(50)]),
      EMPRESA_ID: new FormControl('', [Validators.maxLength(50)]),
      CIUDAD_ID: new FormControl('', [Validators.maxLength(50)]),
      PUNTO_ID: new FormControl('', [Validators.maxLength(50)]),
      USUARIO_PASSWORD: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      USUARIO_PASSWORD2: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      CODIGO_INTERNACIONAL: new FormControl('', [Validators.maxLength(50)]),
      CELULAR: new FormControl('', [Validators.maxLength(50)]),
      USUARIO_SEXO: new FormControl('', [Validators.maxLength(50)]),
      USUARIO_NACIMIENTO: new FormControl('', [Validators.maxLength(50)]),
      MCA_EMPLEADO: new FormControl('', [Validators.maxLength(50)]),
      URL_FOTO_PERFIL: new FormControl('', [])
    });
    // this.LoadProfileData();
    this.cargarPaises();

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  close(resp?:any){
    this.dialogRef.close(resp);
  }


  ngOnInit() {
    this.lShowPanelDatosViaje = true;
    this.lShowBtnActualizar = true;
    this.lShowImagen = true;

  }

  cargarPaises() {
    this.toolService.listarPaises().subscribe(response => {
      this.paisesResponse = response;
    })
  }

  callAdd() {
    this.toolService.showLoading();
    this.IsWait = true;
    this.registroForm.controls['ROL_TEXT'].setValue("1");
    this.registroForm.controls['USUARIO_LOGIN'].setValue(this.registroForm.controls['USUARIO_CORREO'].value);
    this.registroForm.controls['EMPRESA_ID'].setValue(1);
    this.registroForm.controls['CIUDAD_ID'].setValue(1);
    this.registroForm.controls['PUNTO_ID'].setValue(1);
    this.registroForm.controls['MCA_EMPLEADO'].setValue(1);
    this.registroForm.controls['IDIOMA_ID'].setValue(1);
    let newDate = new Date(this.registroForm.controls['USUARIO_NACIMIENTO'].value);
    this.registroForm.controls['USUARIO_NACIMIENTO'].setValue(newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-'
      + newDate.getDate());
    console.log(this.registroForm.value);
    let todayDate = new Date(Date.parse(Date()));

    if (this.registroForm.controls['USUARIO_PASSWORD'].value != ""
      && this.registroForm.controls['USUARIO_PASSWORD2'].value != ""
      && this.registroForm.controls['USUARIO_PASSWORD'].value == this.registroForm.controls['USUARIO_PASSWORD2'].value) {
      if (todayDate.getFullYear() - 18 < newDate.getFullYear()) {
        this.IsWait = false;
        this.toolService.closeLoading();
        var dataDialogo: any = {
          titulo: "Registro de Usuarios",
          body: "Debe ser Mayor de edad para registrarse.",
          buttons: [
            {
              text: "Aceptar",
              icon: "ui-icon-heart",
              click: function () {
                return true;
              }
            },
          ]
        };
        this.toolService.showDialog(dataDialogo);
      } else {
        this.serviceUsuario.adicionarUsuario(this.registroForm.value).subscribe(data => {
          this.IsWait = false;
          if (data.mensaje == "TRUE") {
            this.openDialog();
            this.toolService.closeLoading();
            console.log('respuestaa: ' + data.mensaje);
            this.callCancelar();
          }else if (data.mensaje == "FALSE" && data.code=="00001" && data.MsgError== "Duplicate Constraint.") {
            this.IsWait = false;
            this.toolService.closeLoading();
            var dataDialogo: any = {
              titulo: "Registro de Usuarios",
              body: "Ya existe una cuenta registrara para el email ingresado",
              buttons: [
                {
                  text: "Aceptar",
                  icon: "ui-icon-heart",
                  click: function () {
                    return true;
                  }
                },
              ]
            };
            this.toolService.showDialog(dataDialogo);
          } else {
            this.IsWait = false;
            this.toolService.closeLoading();
            var dataDialogo: any = {
              titulo: "Registro de Usuarios",
              body: "No se logro registrar el usuario, intente nuevamente",
              buttons: [
                {
                  text: "Aceptar",
                  icon: "ui-icon-heart",
                  click: function () {
                    return true;
                  }
                },
              ]
            };
            this.toolService.showDialog(dataDialogo);
          }
        });
      }
    } else {
      this.IsWait = false;
      this.toolService.closeLoading();
      var dataDialogo: any = {
        titulo: "Registro de Usuarios",
        body: "No se logro registrar el usuario, Verifique su contraseña e intente nuevamente",
        buttons: [
          {
            text: "Aceptar",
            icon: "ui-icon-heart",
            click: function () {
              return true;
            }
          },
        ]
      };
      this.toolService.showDialog(dataDialogo);
    }



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
  }

  callCancelar() {
    //this.router.navigate(['/dashboard/principal']);
    this.router.navigate(['/home']);
  }


  callUploadService() {

    console.log(this.toolService.getInvalidControlsInForm(this.registroForm));

    this.password1 = this.registroForm.controls['USUARIO_PASSWORD'].value;
    this.password2 = this.registroForm.controls['USUARIO_PASSWORD2'].value;
    if (this.password1 != this.password2)
      console.log("son diferenteesss..");

    if (this.base64textString == "") {
      this.callAdd();
      console.log('vacio');
    } else {

      var ojb = {
        email: this.registroForm.controls['USUARIO_CORREO'].value,
        descFoto: "foto Usuario",
        userId: '',
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
          // this.registroForm.controls['URL_FOTO_PERFIL'].setValue(this.urlTemporal);
          this.callAdd();
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
      titulo: "Registro de Usuarios",
      body: "Registro éxitoso, por favor revisar correo electrónico enviado para activar la cuenta...",
      buttons: [
        {
          text: "Aceptar",
          icon: "ui-icon-heart",
          click: function () {
            return true;
          }
        },
      ]
    }
    const dialogRef = this.dialog.open(ModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }


  /* actualizarProfileFoto(){
     this.registroService.actualizarProfile(this.UserResponseRegistro).subscribe(response =>{
       this.toolService.closeLoading();
       //this.LoadProfileData();
     })
   }*/

}
