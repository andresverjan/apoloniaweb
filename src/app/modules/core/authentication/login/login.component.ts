import { Component, OnInit, Inject } from '@angular/core';
import { LoginService } from './login.service';
import { EtiquetasService } from '../../services/etiquetas.service';
import { UserSession } from '../../interfaces/usersession.interface';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServicesService } from '../../services/services.service';
import { ToolsService } from '../../services/tools.service';
import { RegistroService } from '../../registro/registro.service';
import { AuthService } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import * as Globals from '../../globals';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: SocialUser;
  public data: any;
  public urlLogo: string;
  public userForm: FormGroup;
  public mostrarLogin = true;
  public email: any;
  private regexp: RegExp;
  public datosAlert: any = {};
  private userTmp = null;
  private isLogged = false;
  private isValidatePasswordMsj = null;
  newUser: any;
  public usuario = '';
  public password = '';
  public etiquetas: any = {};
  public usuarioSession: UserSession;
  public ldefaultLanguageId = '1';  // TODO:pendiente passr el idioma por defaul a global.

  constructor(private loginService: LoginService,
              private etiquetasService: EtiquetasService,
              private dialog: MatDialog,
              private router: Router,
              private authService: AuthService,
              private servicesLogin: ServicesService,
              private toolService: ToolsService,
              private serviceUsuario: RegistroService,
              public dialogRef: MatDialogRef<LoginComponent>,
              @Inject(MAT_DIALOG_DATA) public data2: any) {

    localStorage.clear();
    console.log('limpiooo');
    this.datosAlert.titulo = 'Autenticación Marlynk';
    this.urlLogo = this.toolService.getWebRoot() + 'assets/imgs/logoMarlynk.png';
    console.log(this.urlLogo);
  }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      if (this.isLogged == true) {
        this.userSignUp(this.user);
      }
    });

    this.data = [{
      value: 1,
      nombre: 'prueba'
    }, {
      value: 2,
      nombre: 'prueba2'
    }
    ];

    this.loadEtiquetas();
    this.userForm = new FormGroup({
      usuario: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      password: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      ROL_ID: new FormControl('6', [Validators.required, Validators.maxLength(60)]),
      email: new FormControl('', [Validators.maxLength(60)])
    });
  }


  userSignUp(userTemp) {
    this.newUser = new Object();
    this.newUser.EMPRESA_ID = 1;
    this.newUser.USUARIO_ID = userTemp.email;
    this.newUser.CIUDAD_ID = 1;
    this.newUser.PUNTO_ID = 1;
    this.newUser.USUARIO_NOMBRE = userTemp.firstName;
    this.newUser.USUARIO_APELLIDO = '';
    this.newUser.USUARIO_CORREO = userTemp.email;
    this.newUser.USUARIO_LOGIN = userTemp.email;
    this.newUser.USUARIO_PASSWORD = userTemp.id;
    this.newUser.USUARIO_ELIMINADO = 'N';
    this.newUser.ROL_TEXT = 'EMPLEADO';
    this.newUser.USUARIO_ACTIVO = 'S';
    this.newUser.MCA_EMPLEADO = 'S';
    this.newUser.IDIOMA_ID = '1';

    this.serviceUsuario.adicionarUsuario(this.newUser).subscribe(response => {
      console.log('response Adicionar usuario');
      console.log(response);
      if (response.mensaje == 'TRUE') {
        localStorage.removeItem('USER');
        const user = {
          user: response.user,
          token: response.token
        };
        this.validarRolSession(user);
      } else {
        if (response.mensaje == 'FALSE' && response.code == '00001') {
          localStorage.removeItem('USER');
          const user = {
            user: response.user,
            token: response.token
          };
          this.validarRolSession(user);
        }
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  close(resp?: any) {
    this.dialogRef.close(resp);
  }

  autenticar() {
    this.close();
    if (this.userForm.valid) {
      this.login();
    }
  }

  loadEtiquetas() {
    const objEtiqueta = {
      id: Globals.DEFAULT_LANGUAGE
    };

    this.etiquetasService.loadEtiquetas(objEtiqueta).subscribe(res => {
      this.etiquetas = res.data;
      localStorage.removeItem('ETIQUETAS');
      localStorage.setItem('ETIQUETAS', JSON.stringify(this.etiquetas));
    });
  }

  login() {
    console.log(this.userForm.value);
    const login = {
      login: this.userForm.value.usuario,
      password: this.userForm.value.password,
      ROL_ID: this.userForm.value.ROL_ID,
    };

    this.loginService.login(login).subscribe(res => {
      console.log('response login');
      console.log(res);
      this.usuarioSession = res;
      if (this.usuarioSession.mensaje == 'TRUE') {
        this.validarRolSession(this.usuarioSession);
      } else {
        this.usuario = '';
        this.password = '';
        //this.openDialog();
        Swal.fire(
          'Login',
          'Autenticacion incorrecta',
          'error'
        );
      }
    });
  }

  validarRolSession(userSession: any) {
    console.log('validar rol sesion TOKEN');
    // console.log(userSession.token)
    // console.log('validar rol sesion')
    console.log(userSession);
    if (userSession.user.ROL_ID == '6') {
      console.log('Turista');
      localStorage.setItem('USER', JSON.stringify(userSession));
      this.ldefaultLanguageId = userSession.user.IDIOMA_ID;
      this.loadEtiquetas();
      window.location.href = '/home/';
    } else if (userSession.user.ROL_ID == '5') {
      localStorage.setItem('USER', JSON.stringify(userSession));
      this.ldefaultLanguageId = userSession.user.IDIOMA_ID;
      this.loadEtiquetas();
      console.log('Capitan');
      this.router.navigate(['/dashboard']);
    }
    /*if (userSession.user.ROL_ID == '1') {
      console.log('Administrador');
    }*/
  }

  /*runOnchange(obj) {
    console.log('cambio runOnchange');
    console.log(obj);
  }*/

  goToPasswordComponent() {
    this.mostrarLogin = false;
    console.log('Olvidaste la contraseña');
  }

  recordarPassword() {
    const objToSend = {
      email: this.email
    };

    if (this.validaCampos()) {
      this.loginService.recordarPassword(objToSend).subscribe(response => {
        this.isValidatePasswordMsj = response;
        if (this.isValidatePasswordMsj.mensaje == 'TRUE') {
          Swal.fire(
            'Login',
            this.isValidatePasswordMsj.text,
            'error'
          );
        } else if (this.isValidatePasswordMsj.mensaje == 'FALSE') {
          this.datosAlert.body = this.isValidatePasswordMsj.text;
          Swal.fire(
            'Login',
            this.isValidatePasswordMsj.text,
            'error'
          );
        }
      });
    } else {
      Swal.fire(
        'Login',
        'Debe inigresar un email Válido',
        'error'
      );
    }
  }

  validaCampos(): boolean {
    if (this.email != '' && this.toolService.validateEmail(this.email)) {
      console.log('campo correcto');
      return true;
    }
    console.log('error');
    return false;
  }

  gotToLogin() {
    this.mostrarLogin = true;
  }
  /**
   * AUTENTICACION GOOGLE
   */
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    console.log(this.userTmp);
    if (this.userTmp == null) {
      this.isLogged = true;      
      this.dialogRef.close();
    } else {
      this.userSignUp(this.userTmp);
      this.dialogRef.close();
    }
  }

  /**
   * AUTENTICACION FACEBOOK
   */
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    console.log(this.userTmp);
    if (this.userTmp == null) {
      this.isLogged = true;
      console.log('Registrarndo...');
      this.dialogRef.close();
    } else {
      console.log('logueado....');
      this.userSignUp(this.userTmp);
      this.dialogRef.close();
    }
  }

  signOut(): void {
    this.authService.signOut();
  }

}
