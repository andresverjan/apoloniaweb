import { Router } from "@angular/router";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import Swal from "sweetalert2";
import { ProfileService } from "./profile.service";
import { ApexAxisChartSeries, ApexChart, ApexTitleSubtitle, ApexXAxis, ChartComponent } from "ng-apexcharts";


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;

  public chartOptions: Partial<ChartOptions>;
  public optionsDonut: {};
  public optionsPie: {};

  public profileForm: FormGroup;
  public passwordForm: FormGroup;
  public USUARIO;
  public isWaiting: Boolean = false;
  lShowPanelDatosViaje: boolean;
  lShowBtnActualizar: boolean;
  lShowImagen: boolean;
  userKey: string = "USUARIO";
  showProfileUser: boolean = true;
  showIdiom: boolean = false;
  showButton: boolean = true;
  showUpdatePassword: boolean = false;
  listadoIdiomas = [];
  idiomUser: number;
  valorSeleccionado: string = "";
  idiomSelect: number;
  valuePassword: string = "";
  public te = 'testttt';


  public picurl: string = "";

  public clear() {
    this.picurl = "";
  }

  public etiquetas: any = {};
  public series: [];

  constructor(private profileService: ProfileService, private router: Router) {

    this.chartOptions = {
      series: [
        {
          name: "My-series",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }
      ],
      chart: {
        height: 350,
        type: "bar"
      },
      title: {
        text: "My First Angular Chart"
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
      }
    };

    this.optionsDonut = {
      chart: {
        type: 'donut'
      },
      series: [30,40,45,50,49,60,70,91,125],
      xaxis: {
        categories: [1991,1992,1993,1994,1995,1996,1997, 1998,1999]
      }
    };

    this.optionsPie = {
      chart: {
        type: 'pie'
      },
      series: [30,40,45,50,49,60,70,91,125],
      xaxis: {
        categories: [1991,1992,1993,1994,1995,1996,1997, 1998,1999]
      }
    };



    this.profileForm = new FormGroup({
      USUARIO_NOMBRE: new FormControl(""),
      USUARIO_CORREO: new FormControl(""),
      USUARIO_LOGIN: new FormControl(""),
      USUARIO_APELLIDO: new FormControl(""),
      USUARIO_TELEFONO: new FormControl(""),
      URL_FOTO_PERFIL: new FormControl(""),
      USUARIO_PASSWORD: new FormControl(""),
      USUARIO_CONFIRMACION: new FormControl(""),
      IDIOMA_ID: new FormControl(""),
    });

    this.passwordForm = new FormGroup({
      USUARIO_PASSWORD: new FormControl(""),
      USUARIO_CONFIRMACION: new FormControl(""),
    });


  }

  ngOnInit() {
    this.lShowPanelDatosViaje = true;
    this.lShowBtnActualizar = true;
    this.lShowImagen = true;
    this.getUserFromLocalStorage();
    this.fetchIdiomas();
  }

  getUserFromLocalStorage() {
    this.USUARIO = JSON.parse(localStorage.getItem(this.userKey));
    this.profileForm.patchValue(this.USUARIO);
    this.USUARIO.URL_FOTO_PERFIL = "assets/Dentist6.png";
  }

  changePassword() {
    const usuarioPass = {
      USUARIO_CORREO: this.USUARIO.USUARIO_CORREO,
      USUARIO_PASSWORD: this.passwordForm.controls["USUARIO_PASSWORD"].value,
    };
    if (
      this.passwordForm.controls["USUARIO_PASSWORD"].value ==
      this.passwordForm.controls["USUARIO_CONFIRMACION"].value
    ) {
      this.profileService.updatePassword(usuarioPass).subscribe((response) => {
        Swal.fire("Contraseña", "Actualizada correctamente.", "success");
        this.profileForm.controls["USUARIO_PASSWORD"].reset();
        this.profileForm.controls["USUARIO_CONFIRMACION"].reset();
        localStorage.removeItem("USUARIO");
        this.router.navigate(["/salida"]);
        return response;
      });
    } else {
      Swal.fire("Contraseña", "No es la misma contraseña.", "error");
    }
  }
  fetchIdiomas() {
    this.profileService.idiom().subscribe((response) => {
      response.data.idiomas.forEach((item) => {
        this.listadoIdiomas.push({
          value: item.id,
          nombre: item.NOMBRE_IDIOMA,
        });
      });
    });
  }

  changeIdiomEs(value) {
    value
      ? (this.idiomSelect = value)
      : (this.idiomSelect = this.USUARIO.IDIOMA_ID);
  }

  showChangePassword() {
    this.showProfileUser = false;
    this.showUpdatePassword = true;
    this.showIdiom = false;
    this.showButton = false;
  }
  showChangeIdiom() {
    this.showIdiom = true;
    this.showProfileUser = false;
    this.showUpdatePassword = false;
  }

  updateprofile() {
    const updateUser = {
      id: this.USUARIO.id,
      IDIOMA_ID: this.profileForm.value.IDIOMA_ID,
      USUARIO_NOMBRE: this.profileForm.value.USUARIO_NOMBRE,
      USUARIO_APELLIDO: this.profileForm.value.USUARIO_APELLIDO,
      USUARIO_CORREO: this.profileForm.value.USUARIO_CORREO,
      USUARIO_TELEFONO: this.profileForm.value.USUARIO_TELEFONO,
    };

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
