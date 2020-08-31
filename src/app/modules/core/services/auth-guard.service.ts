import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {LoginService} from '../authentication/login/login.service';
import { UserSession } from '../interfaces/usersession.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private loginService: LoginService , private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('entro canActivate')

    let UserSession =  localStorage.getItem("USER");
    if (UserSession !== null ){
      console.log("logueado OK");
      return true;
    }else{
      console.log("no LOGUEADO");
      this.router.navigate(['/login'], {
        queryParams: {
          return: state.url
        }
      });
    }

return false;
  }
}
