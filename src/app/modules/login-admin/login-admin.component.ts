import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToolsService } from '../core/services/tools.service';
import { UserSession } from '../core/interfaces/usersession.interface';
import { EtiquetasService } from '../core/services/etiquetas.service';
import { LoginService } from '../core/authentication/login/login.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ModalComponent } from '../core/modal/modal.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as Globals from '../core/globals';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.scss']
})
export class LoginAdminComponent implements OnInit {
  public userForm: FormGroup;
  public etiquetas: any = {};
  public urlLogo: string;

  public usuario: string = "";
  public password: string = "";
  public usuarioSession: UserSession;
  public ldefaultLanguageId: string = "1";

  constructor(private toolService: ToolsService, private etiquetasService: EtiquetasService,
    private loginService: LoginService, private dialog: MatDialog, private router: Router,
  ) {
    this.urlLogo = this.toolService.getWebRoot() + "assets/imgs/logoMarlynk.png";
    this.ldefaultLanguageId = Globals.DEFAULT_LANGUAGE;
  }

  ngOnInit() {
    this.loadEtiquetas();
    this.userForm = new FormGroup({
      usuario: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      password: new FormControl('', [Validators.required, Validators.maxLength(60)])
    });
  }


  loadEtiquetas() {
    console.log("cargando etiquetas");
    var objEtiqueta = {
      id: this.ldefaultLanguageId
    };

    this.etiquetasService.loadEtiquetas(objEtiqueta).subscribe(res => {
      this.etiquetas = res.data;
      localStorage.removeItem('ETIQUETAS');
      localStorage.setItem('ETIQUETAS', JSON.stringify(this.etiquetas));
    });
  }

  login() {
    let login = {
      login: this.userForm.value.usuario,
      password: this.userForm.value.password,
      ROL_ID: 1
    };

    this.loginService.login(login).subscribe(res => {
      this.usuarioSession = res;
      if (this.usuarioSession.mensaje == "TRUE") {
        if (this.usuarioSession.user.ROL_ID == '1') {
          console.log("Administrador");
          this.router.navigate(['/dashboard']);
        } else {
          this.showMsgBadLogin();
        }
        localStorage.setItem('USER', JSON.stringify(this.usuarioSession));
        //HAVERJAN Force to update etiquetas.
        this.ldefaultLanguageId = this.usuarioSession.user.IDIOMA_ID;
        this.loadEtiquetas();
      } else {
        this.usuario = "";
        this.password = "";
        this.showMsgBadLogin();
        //this.openDialog();
      }
    });
  }

  showMsgBadLogin() {
    Swal.fire({
      title: '',
      text: 'Autenticacion Incorrecta',
      type: 'warning',
      showCancelButton: false,
    });
  }

  autenticar() {
    if (this.userForm.valid) {
      this.login();
    }
  }

  /*openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "300px";
    dialogConfig.data = {
      titulo: "Login",
      body: "Autenticacion incorrecta",
      buttons: [
        {
          text: "Aceptar",
          icon: "ui-icon-heart",
          click: function () {
            console.log("hizo click!");
          }
        }
      ]
    }
      const dialogRef = this.dialog.open(ModalComponent, dialogConfig);
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }*/


}
