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
  show:boolean = false;
  shows:boolean = false;


  public picurl: string = '';

  public clear() {
    this.picurl = '';
  }

  /*public findByItem = {
    embarcacion_nombre: "",
    _search: true,
    userId: "",
    token: "",
  };
  public paramsFetchInfo = {
    filter: {
      _id: this.getUserFromLocalStorage()._id
    },
    properties: "_id  name lastName, email, phoneNumber,latlng, urlPhoto ",
  };*/
  public etiquetas: any = {};

  constructor(private profileService: ProfileService) {
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

    //this.LoadProfileData();
    //console.log(this.getUserFromLocalStorage());

  }

  ngOnInit() {
    this.lShowPanelDatosViaje = true;
    this.lShowBtnActualizar = true;
    this.lShowImagen = true;
    this.getUserFromLocalStorage();
  }

  /*LoadProfileData() {
    this.IsWait = true;
    this.profileService
      .getMyProfile(this.paramsFetchInfo)
      .subscribe((response) => {
        this.usuario = response.data.getMyProfile;
        this.IsWait = false;
        this.profileForm.patchValue(this.usuario);
      });
  }*/

  getUserFromLocalStorage() {
    this.USUARIO = JSON.parse(localStorage.getItem(this.userKey));
    console.log(this.USUARIO);
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
      this.show= false;
      return response;
    });
    
  }else{
    Swal.fire('Contraseña', 'No es la misma contraseña.', 'error');
    }
    
  
  }
  changeIdiomEn(){
    const usuarioIdiom={
     USUARIO_CORREO: this.USUARIO.USUARIO_CORREO,
     IDIOMA_ID: "1"
   }
   
   this.profileService.updateIdiom(usuarioIdiom).subscribe((response) => {
    Swal.fire('Idiom', 'Updated successfully', 'success');
     this.shows= false;
     return response;
   });
 }
 changeIdiomEs(){
  const usuarioIdiom={
   USUARIO_CORREO: this.USUARIO.USUARIO_CORREO,
   IDIOMA_ID: "2"
 }
 
 this.profileService.updateIdiom(usuarioIdiom).subscribe((response) => {
  Swal.fire('Idioma', 'Actualizado correctamente.', 'success');
   this.shows= false;
   return response;
 });
}
   showChange(){
    this.show= true;
   }
   showChanges(){
    this.shows= true;
   }

 
  
}
