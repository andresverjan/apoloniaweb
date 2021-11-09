import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { LoginService } from "./login.service";
import { EmpresaService } from "../core/services/empresa.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-login-admin",
  templateUrl: "./login-admin.component.html",
  styleUrls: ["./login-admin.component.scss"],
})
export class LoginAdminComponent implements OnInit {
  public IsWait: Boolean = false;
  public userForm: FormGroup;
  public urlLogo: string;

  public usuario: string = "";
  public password: string = "";
  public userData: any = {};
  public WRONG_AUTENTICATION = "Autenticación Incorrecta";

  userKey: string = "USUARIO";
  constructor( private loginService: LoginService, 
               private empresaService: EmpresaService,
               private router: Router) {
    this.urlLogo = "../../../assets/small.png";
  }

  ngOnInit() {
    this.userForm = new FormGroup({
      usuario: new FormControl("", [
        Validators.required,
        Validators.maxLength(60),
      ]),
      password: new FormControl("", [
        Validators.required,
        Validators.maxLength(60),
      ]),
    });
  }

  login() {
    
    this.loginService.loginWeb(this.userForm.value).subscribe((response) => {
      this.IsWait = false;
      this.userData = response;
      console.log(this.userData.data);
      if (this.userData.data.login !== null) {
        localStorage.setItem(
          this.userKey,
          JSON.stringify(this.userData.data.login)
        );

        let empresaIdTmp = this.userData.data.login.EMPRESA_ID;
        console.log(empresaIdTmp);
        this.empresaService.getEmpresaById(empresaIdTmp).subscribe((res)=> {
          console.log("Empresa ID PACIENTE ID");
          console.log(res);
          let empresaConfig = res.data.getEmpresaById;
          console.log(empresaConfig);
          document.documentElement.style.setProperty('--primaryColor', empresaConfig.primaryColor);
          document.documentElement.style.setProperty('--secondaryColor', empresaConfig.secondaryColor);
          document.documentElement.style.setProperty('--accentColor', empresaConfig.accentColor);    
          document.documentElement.style.setProperty('--warnColor', empresaConfig.warnColor);

          this.router.navigate(["/dashboard"]);
        });
        
      } else {
        this.showMsgBadLogin(this.WRONG_AUTENTICATION, "Autenticación");
      }
    });
  }

  showMsgBadLogin(mensaje: string, titulo: string) {
    Swal.fire({
      title: titulo,
      icon: "error",
      text: mensaje,
      showCancelButton: false,
      confirmButtonText: `Aceptar`,
      denyButtonText: `Cancelar`,
    });
  }

  autenticar() {
    if (this.userForm.valid) {
      this.login();
    }
  }
}
