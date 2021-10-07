import { Component, ViewChild } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { UserSession } from "../interfaces/usersession.interface";
import { RouterLinkActive } from '@angular/router';
import { MatMenuTrigger } from "@angular/material/menu";

@Component({ 
  selector: "my-nav",
  templateUrl: "./my-nav.component.html",
  styleUrls: ["./my-nav.component.scss"],
})
export class MyNavComponent {  
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild('childMenu') public childMenu;
  
  public session: UserSession;
  public serverURlImagesUsuarios: String;
  public actualUrlFoto: string;
  public etiquetas: any = {};
  public MostrarSolicitudesCapitan: boolean = false;
  public MostrarRouter: boolean = true;
  public urlLogo: string;
  public usuario;
  public array;
  public navSizeCss = { "margin-left": "255px;" };
  userKey: string = "USUARIO";

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result) => result.matches));

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    this.urlLogo = "../../../assets/small.png";
    this.usuario = JSON.parse(localStorage.getItem(this.userKey));
  }
  ngOnInit() {
    this.getUserFromLocalStorage();
    this.array = this.usuario.PERMISOS.map((item) => {
      if (item.applicationId) {
        item.routerLink = item.url_menu+ '/' +item.applicationId;
      } else {
        item.routerLink = item.url_menu;
      }
      return item;
    });
  }

  menuOver() {
    this.trigger.openMenu();
  }

  menuOut(){
    this.trigger.closeMenu();
  }

  logout(ruta) {
    localStorage.removeItem(this.userKey);
    this.router.navigate([ruta]);
  }

  mostrarSolicitudes() {
    this.MostrarRouter = false;
  }

  mostrarRouter(event:any, item) {
    this.MostrarRouter = true;
    if (item.applicationId) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.navigate([item.routerLink], {
        queryParams: { applicationId: item.applicationId },
      });
      item.selected = true;
    } else {
      if (item.url_menu == "/salida") {
        this.logout(item.url_menu);
      } else {
        this.router.navigate([item.url_menu]);
      }
    }
  }

  getUserFromLocalStorage() {
    this.usuario = JSON.parse(localStorage.getItem(this.userKey));
  }

  afterClick() {
    this.navSizeCss =
      this.navSizeCss["margin-left"] == "0px;"
        ? { "margin-left": "255px;" }
        : { "margin-left": "0px;" };
  }
}
