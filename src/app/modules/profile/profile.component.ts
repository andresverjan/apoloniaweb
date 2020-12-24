import { Router } from '@angular/router';
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import Swal from 'sweetalert2';
import { ProfileService } from "./profile.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  public profileForm: FormGroup;
  public USUARIO ;
  public IsWait: Boolean = false;
  lShowPanelDatosViaje: boolean;
  lShowBtnActualizar: boolean;
  lShowImagen: boolean;
  userKey: string='USUARIO';
  showProfileUser:boolean = true;
  showIdiom:boolean = false;
  showButton:boolean = true;
  showUpdatePassword:boolean = false;
  idiom = [];
  idiomUser: number;
  valorSeleccionado:string='';
  idiomSelect:number;
  valuePassword: string = "";
 


  public picurl: string = '';

  public clear() {
    this.picurl = '';
  }

  public etiquetas: any = {};

  constructor(private profileService: ProfileService, private router: Router) {
    this.profileForm = new FormGroup({
      USUARIO_NOMBRE: new FormControl(""),
      USUARIO_CORREO: new FormControl(""),
      USUARIO_LOGIN: new FormControl(""),
      USUARIO_APELLIDO: new FormControl(""),
      USUARIO_TELEFONO: new FormControl(""),
      URL_FOTO_PERFIL: new FormControl(""),
      USUARIO_PASSWORD: new FormControl(""),
      USUARIO_CONFIRMACION: new FormControl(""),
    });
  }

  ngOnInit() {
    this.lShowPanelDatosViaje = true;
    this.lShowBtnActualizar = true;
    this.lShowImagen = true;
    this.getUserFromLocalStorage();
    this.changeIdiomEn();
  }

  getUserFromLocalStorage() {
    this.USUARIO = JSON.parse(localStorage.getItem(this.userKey));
    console.log(this.USUARIO, "este es la data de usuario");
    this.profileForm.patchValue(this.USUARIO);
    this.USUARIO.URL_FOTO_PERFIL='assets/Dentist6.png';
  }

  changePassword(){
     const usuarioPass={
      USUARIO_CORREO: this.USUARIO.USUARIO_CORREO,
      USUARIO_PASSWORD: this.profileForm.controls['USUARIO_CONFIRMACION'].value
    }
    if(this.profileForm.controls['USUARIO_PASSWORD'].value== this.profileForm.controls['USUARIO_CONFIRMACION'].value){
    this.profileService.updatePassword(usuarioPass).subscribe((response) => {
      Swal.fire('Contraseña', 'Actualizada correctamente.', 'success');
      this.profileForm.controls['USUARIO_PASSWORD'].reset();
      this.profileForm.controls['USUARIO_CONFIRMACION'].reset();
      localStorage.removeItem("USUARIO");
      this.router.navigate(["/salida"]);
      return response;
    });
    
  }else{
    Swal.fire('Contraseña', 'No es la misma contraseña.', 'error');
    }
    
  
  }
  changeIdiomEn(){
   this.profileService.idiom().subscribe((response) => {     
    this.idiom = response.data.idiomas;
    console.log(this.idiom,"esta es la respuesta de idioma")     
   });
 }

 changeIdiomEs(value){
   value ? this.idiomSelect = value : this.idiomSelect = this.USUARIO.IDIOMA_ID;
   }

   showChangePassword(){
    this.showProfileUser= false;
    this.showUpdatePassword = true;
    this.showIdiom= false;
    this.showButton = false
   }
   showChangeIdiom(){
     
    this.showIdiom= true;
    console.log(this.showIdiom, "este es el boton idiomas")
    this.showProfileUser = false;
    this.showUpdatePassword = false;
   }

   updateprofile(){
     const updateUser = {
        ID:this.USUARIO.ID,
        IDIOMA_ID:this.idiomSelect,
        USUARIO_NOMBRE:this.profileForm.value.USUARIO_NOMBRE,
        USUARIO_APELLIDO:this.profileForm.value.USUARIO_APELLIDO,
        USUARIO_CORREO:this.profileForm.value.USUARIO_CORREO,
        USUARIO_TELEFONO:this.profileForm.value.USUARIO_TELEFONO,
     }

     this.profileService.updateProfile(updateUser).subscribe((response) => {
        Swal.fire("Usuarios", "Actualizado correctamente.", "success");
        this.router.navigate(["/dashboard"]);
     });

   }
  cancelar() {
    
    this.showUpdatePassword = false;
    this.showProfileUser = true;
    this.showButton = true;
    this.valuePassword = "";
    this.profileForm.controls["USUARIO_CONFIRMACION"].reset();
    this.profileForm.controls["USUARIO_PASSWORD"].reset();

  }

 
  
}
