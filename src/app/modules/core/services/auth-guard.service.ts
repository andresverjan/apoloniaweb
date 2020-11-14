import { Injectable } from "@angular/core";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { UserSession } from "../interfaces/usersession.interface";

@Injectable({
  providedIn: "root",
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let UserSession = localStorage.getItem("USER");
    if (UserSession !== null) {
      return true;
    } else {
      return true; //Temporal. HAVERJAN...
      this.router.navigate(["/login-admin"], {
        queryParams: {
          return: state.url,
        },
      });
    }

    return false;
  }
}
