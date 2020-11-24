import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ProfileService } from "./profile.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  public profileForm: FormGroup;
  public USUARIO = {
    URL_FOTO_PERFIL: ""
  };
  public IsWait: Boolean = false;
  lShowPanelDatosViaje: boolean;
  lShowBtnActualizar: boolean;
  lShowImagen: boolean;
  userKey: string='USUARIO';


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
}
