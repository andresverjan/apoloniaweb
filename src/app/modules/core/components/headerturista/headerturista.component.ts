import { Component, OnInit } from '@angular/core';
import { ToolsService } from '../../../core/services/tools.service';
import { UserSession } from '../../interfaces/usersession.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'angularx-social-login';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ModalComponent } from '../../modal/modal.component';
import { EtiquetasService } from '../../services/etiquetas.service';
import { Embarcacion } from '../../../core/interfaces/embarcacion.interface';
import * as Globals from '../../globals';

@Component({
  selector: 'app-headerturista',
  templateUrl: './headerturista.component.html',
  styleUrls: ['./headerturista.component.scss']
})
export class HeaderturistaComponent implements OnInit {

  listadoResultados: Array<Embarcacion>;
  public urlLogo: String;
  public showMisViajes: boolean = false;
  public showSerCapitan: boolean = false;
  public showCerrarSesion: boolean = false;
  public showLogin: boolean = true;
  public showRegistrate: boolean = true;
  private session: UserSession;
  private actualUrlFoto: string = "";
  public etiquetas: any = {};
  public IsWait: Boolean = false;
  public lShowPanelListadoResultados: Boolean = true;
  public serverURlImagesCapitanes: String;
  public autoComplete: string;

  message: boolean;




  public findByItem = {
    destino: "",
    _search: true   //si queremos hacer filtro, debe ir como true.
  }

  constructor(private toolService: ToolsService, private router: Router, private authService: AuthService, private route: ActivatedRoute,
    private dialog: MatDialog, private etiquetasService: EtiquetasService) {
    this.loadEtiquetas();
    //this.etiquetas = JSON.parse(localStorage.getItem("ETIQUETAS"));
    this.urlLogo = this.toolService.getWebRoot() + "assets/imgs/logoMarlynkTransparente.png";
    this.session = JSON.parse(localStorage.getItem('USER'));
    console.log(this.session);

    //this.serverURlImagesUsuarios = this.usuarioService.getWebRootUrl();
  }

  loadEtiquetas() {
    var objEtiqueta = {
      id: Globals.DEFAULT_LANGUAGE
    };

    this.etiquetasService.loadEtiquetas(objEtiqueta).subscribe(res => {
      this.etiquetas = res.data;
      localStorage.removeItem('ETIQUETAS');
      localStorage.setItem('ETIQUETAS', JSON.stringify(this.etiquetas));
    })
  };


  findBySearch() {
    console.log(this.findByItem);
    this.cargarResultados();
    this.IsWait = true;
  }

  cargarResultados() {
    this.IsWait = true;
    this.lShowPanelListadoResultados = true;
  }

  filtro(objSeleccionado) {
    console.log(this.autoComplete);
    this.autoComplete = objSeleccionado
  }


  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "300px";
    dialogConfig.data = {
      titulo: "Capitán",
      body: "Esta seguro que desea convertirse en capitán?",
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
        var request = {
          USUARIO_CORREO: this.session.user.USUARIO_CORREO,
          token: this.session.user.USUARIO_TOKEN,
          ID: this.session.user.ID,

        };
        this.toolService.convertirseCapitan(request).subscribe(resp => {
          console.log('respuesta convertirse capitan')
          console.log(resp)
          if (resp.mensaje === 'TRUE') {
            console.log('respuesta convertirse capitan user')
            console.log(resp.user)
            localStorage.removeItem("USER")
            this.router.navigate(['/dashboard']);
            localStorage.setItem("USER", JSON.stringify(resp));
          }
        })

      } else {
        console.log('The dialog was closed');

      }
    });

  }

  presionoBoton() {
    console.log('FILTRO 2', this.findByItem);
  }

  goToViajesTuristas() {
    this.router.navigate(['viajes-turista']);
  }
  goToModificarContrasena() {
    this.router.navigate(['modificar-contrasena']);
  }

  goToPerfilUsuario() {
    this.router.navigate(['perfil']);
  }

  ocultarItemsLogueado() {
    this.showRegistrate = false;
    this.showLogin = false;
    this.showSerCapitan = true;
    this.showCerrarSesion = true;
    this.showMisViajes = true;
  }

  showItemsLogout() {
    this.showRegistrate = true;
    this.showLogin = true;
    this.showSerCapitan = false;
    this.showCerrarSesion = false;
    this.showMisViajes = false;
  }

  logout() {
    localStorage.removeItem("USER");
    this.router.navigate(['../../home']);
    this.showItemsLogout();
    this.authService.signOut();//Metodo para desloguearse de google y Facebook
    console.log(this.authService);
    console.log('SALIENDO.. GOOGLE AND FACEBOOK');

  }
  ngOnInit() {
    if (this.session != null) {
      if (this.session.user.ROL_ID === '6') {
        console.log(this.toolService.getWebRoot());
        this.actualUrlFoto = this.toolService.getWebRoot() + this.session.user.URL_FOTO_PERFIL;
        console.log(this.actualUrlFoto);
        this.ocultarItemsLogueado();
      }
    }

  }

  onKeydown(event) {
    if (event.key === "Enter") {
      this.lShowPanelListadoResultados = false;
      console.log("key key");
    }
  }

}
