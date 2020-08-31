import { Component, OnInit } from '@angular/core';
import { ModificarContrasenaService } from './modificar-contrasena.service';
import { UserSession } from '../../core/interfaces/usersession.interface';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { FormControl, FormGroup, Validators, NgModel } from '@angular/forms';
import { ToolsService } from '../../../modules/core/services/tools.service';
import { Router } from '@angular/router';
import { AuthService } from 'angularx-social-login';

@Component({
  selector: 'app-modificar-contrasena',
  templateUrl: './modificar-contrasena.component.html',
  styleUrls: ['./modificar-contrasena.component.scss']
})
export class ModificarContrasenaComponent implements OnInit {
  public session: UserSession;
  public datosAlert:any= {};
  public changepassForm: FormGroup;
  public IsWait: Boolean = false;
  

  constructor(private cambioContrasenaService:ModificarContrasenaService, private dialog: MatDialog,private toolService: ToolsService,private authService: AuthService
    , private router: Router) {
    this.session = JSON.parse(localStorage.getItem('USER'));
    this.changepassForm = new FormGroup ({

      password: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.minLength(6)]),
      password2: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.minLength(6)])

    });
    

    this.datosAlert.titulo = "Autenticación Marlynk";
 
   }

  ngOnInit() {
  }

  changePassword(obj){
    let objToSend = {
         email : this.session.user.USUARIO_CORREO,
         tkn : this.session.user.USUARIO_TOKEN,
         password : obj.password,
         password2 : obj.password2
    }
      if(objToSend.password == objToSend.password2){    
        this.cambioContrasenaService.changePassword(objToSend).subscribe(response => {
          if(response.mensaje == 'FALSE'){
            this.datosAlert.body = response.text;
            this.datosAlert.buttons = [
              {
                text: "Aceptar",
                icon: "ui-icon-heart",
                click: function () {
                  return true;
                }
              },
            ]
            this.toolService.showDialog(this.datosAlert); 
          } else if(response.mensaje == 'TRUE'){
            this.datosAlert.body = response.text + "\nPor favor inicie sesion de nuevo";
            this.datosAlert.buttons = [
              {
                text: "Aceptar",
                icon: "ui-icon-heart",
                click: function () {
                  localStorage.removeItem("USER");
                  window.location.href = "/home/";
                  return true;
                }
              },
            ]
            this.toolService.showDialog(this.datosAlert); 

          }
  
  
       
        });
      } else {
        this.datosAlert.body = "Las contraseñas no son iguales";
        this.datosAlert.buttons = [
          {
            text: "Aceptar",
            icon: "ui-icon-heart",
            click: function () {
              return true;
            }
          },
        ]
        this.toolService.showDialog(this.datosAlert);
      }
      

  }


}
