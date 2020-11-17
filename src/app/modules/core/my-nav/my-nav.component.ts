import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserSession } from '../interfaces/usersession.interface';


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
  public urlLogo: string;
  public usuario;
  public array;
  public navSizeCss = {'margin-left': '255px;' };
  userKey: string='USUARIO';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
    

  constructor(private breakpointObserver: BreakpointObserver, private router:Router) {
    this.urlLogo = "../../../assets/small.png";
    this.usuario= JSON.parse(localStorage.getItem(this.userKey));
  }
  ngOnInit(){
    this.getUserFromLocalStorage();
    this.array=this.usuario.PERMISOS;
  }
  // goToProfile(){
  //   this.mostrarRouter();
  //   this.router.navigate(['/dashboard/perfil']);
  // }

  logout(ruta){
      localStorage.removeItem(this.userKey);
      this.router.navigate([ruta]);
  }

  mostrarSolicitudes(){
    this.MostrarRouter = false;
  }

  mostrarRouter(item){
    this.MostrarRouter = true;
    console.log(item);
    if(item.applicationId){
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.navigate([item.url_menu], {​​ queryParams: {​​ applicationId: item.applicationId }​​ }​​);
    }else{
      if(item.url_menu== '/salida'){
        this.logout(item.url_menu);
      }else{
      this.router.navigate([item.url_menu]);
      }
    }
  }
  
  getUserFromLocalStorage() {
    this.usuario = JSON.parse(localStorage.getItem(this.userKey));
    console.log(this.usuario);   
  }

  afterClick(){    
    this.navSizeCss = this.navSizeCss["margin-left"]=='0px;'?{'margin-left': '255px;'}:{'margin-left': '0px;'};
  } 

}
