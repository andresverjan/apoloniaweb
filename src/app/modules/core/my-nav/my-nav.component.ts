import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserSession } from '../interfaces/usersession.interface';
import { UsuariosService } from '../../usuarios/usuarios.service';


@Component({
  selector: 'my-nav',
  templateUrl: './my-nav.component.html',
  styleUrls: ['./my-nav.component.scss']
})
export class MyNavComponent {

  public session:UserSession;
  public serverURlImagesUsuarios : String;
  public actualUrlFoto:string;
  public etiquetas:any= {};
  public MostrarSolicitudesCapitan:boolean = false;
  public MostrarRouter:boolean = true;


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver, private router:Router, private usuarioService:UsuariosService) {
    this.etiquetas = JSON.parse(localStorage.getItem("ETIQUETAS"));
    this.session = JSON.parse(localStorage.getItem('USER'));
    this.serverURlImagesUsuarios = this.usuarioService.getWebRootUrl();
    this.actualUrlFoto = this.session.user.URL_FOTO_PERFIL;

  }

  goToProfile(){
    this.mostrarRouter();
    this.router.navigate(['/dashboard/perfil']);
  }

  logout(){
      localStorage.removeItem('USER');
      this.router.navigate(['home/inicio']);

  }

  mostrarSolicitudes(){
    this.MostrarSolicitudesCapitan = true;
    this.MostrarRouter = false;
  }

  mostrarRouter(){
    this.MostrarSolicitudesCapitan = false;
    this.MostrarRouter = true;
  }



}
