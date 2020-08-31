import { Component, OnInit } from '@angular/core';
import { CambioContrasenaService } from './cambio-contrasena.service';
import { UserSession } from '../core/interfaces/usersession.interface';
import { Viajes } from '../core/interfaces/viajes.interface';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ModalComponent } from '../core/modal/modal.component';
import { FormControl, FormGroup, Validators, NgModel } from '@angular/forms';
import { ToolsService } from '../../modules/core/services/tools.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-cambio-contrasena',
  templateUrl: './cambio-contrasena.component.html',
  styleUrls: ['./cambio-contrasena.component.scss']
})
export class CambioContrasenaComponent implements OnInit {
  public session: UserSession;
  public datosAlert:any= {};

  public email: string;
  public tkn: string;
  public changepassForm: FormGroup;
  public etiquetas:any= {};
  public IsWait: Boolean = false;


  constructor(private cambioContrasenaService:CambioContrasenaService, private dialog: MatDialog,private toolService: ToolsService,private activateroute : ActivatedRoute) {
    this.etiquetas = JSON.parse(localStorage.getItem("ETIQUETAS"));
    this.session = JSON.parse(localStorage.getItem('USER'));
    this.changepassForm = new FormGroup ({
      password: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.minLength(6)]),
      password2: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.minLength(6)])

    });

    this.datosAlert.titulo = "Autenticación Marlynk";

   }

  ngOnInit() {
   this.activateroute.queryParams.subscribe(params => {
    this.email = params['email'];
    this.tkn = params['tkn'];
  })

  }

  changePassword(obj){
    let objToSend = {
         email : this.email,
         tkn : this.tkn,
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
            this.datosAlert.body = response.text;
            this.datosAlert.buttons = [
              {
                text: "Aceptar",
                icon: "ui-icon-heart",
                click: function () {
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
