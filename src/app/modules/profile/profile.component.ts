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
  public usuario = {
    urlPhoto: "",
  };
  public IsWait: Boolean = false;
  lShowPanelDatosViaje: boolean;
  lShowBtnActualizar: boolean;
  lShowImagen: boolean;
  userKey: string='USUARIO';

  public findByItem = {
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
  };
  public etiquetas: any = {};

  constructor(private profileService: ProfileService) {
    this.profileForm = new FormGroup({
      _id: new FormControl(""),
      urlPhoto: new FormControl(""),
      name: new FormControl(""),
      lastName: new FormControl(""),
      email: new FormControl(""),
      phoneNumber: new FormControl(""),
      latlng: new FormControl(""),
    });

    this.LoadProfileData();
    console.log(this.getUserFromLocalStorage());
    
  }

  ngOnInit() {
    this.lShowPanelDatosViaje = true;
    this.lShowBtnActualizar = true;
    this.lShowImagen = true;
  }

  LoadProfileData() {
    this.IsWait = true;
    this.profileService
      .getMyProfile(this.paramsFetchInfo)
      .subscribe((response) => {
        this.usuario = response.data.getMyProfile;
        this.IsWait = false;
        this.profileForm.patchValue(this.usuario);
      });
  }

  getUserFromLocalStorage() {
    return JSON.parse(localStorage.getItem(this.userKey));
  }
}
