import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './authentication/login/login.component';
import { ServicesService } from './services/services.service';
import { AboutComponent } from '../core/authentication/about/about.component';
import { PaisesComponent } from '../paises/paises.component';
import { UsuariosComponent } from '../usuarios/usuarios.component';
import { CapitanesComponent } from '../capitanes/capitanes.component';
import { IdiomasComponent } from '../idiomas/idiomas.component';
import { EmbarcacionesComponent } from '../embarcaciones/embarcaciones.component';
import { ViajesComponent } from '../viajes/viajes.component';
import { PrincipalComponent } from '../principal/principal.component';
import { ProfileComponent } from '../profile/profile.component';

import { routing } from './core.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../core/material.module';
import { MyNavComponent } from './my-nav/my-nav.component';
import { ModalComponent } from './modal/modal.component';
import { LoadingComponent } from './loading/loading.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatGridListModule, MatCardModule, MatMenuModule, MatIconModule, MatButtonModule } from '@angular/material';
import { SelectComponent } from './components/select/select.component';
import { HomeComponent } from '../home/home.component';
import { DetalleComponent } from '../detalle/detalle.component'
import { HeaderturistaComponent } from './components/headerturista/headerturista.component';
import { FooterTursitaComponent } from '../core/components/footer-tursita/footer-tursita.component';
import { PrincipalTuristaComponent } from './principal-turista/principal-turista.component';
import { RegistroComponent } from './registro/registro.component';
import { LoginAdminComponent } from '../login-admin/login-admin.component';
import { ViajesTuristaComponent } from '../viajes-turista/viajes-turista.component';
import { CambioContrasenaComponent } from '../cambio-contrasena/cambio-contrasena.component';
import { ModificarContrasenaComponent } from '../cambio-contrasena/modificar-contrasena/modificar-contrasena.component';
import { TextoscorreosComponent } from '../textoscorreos/textoscorreos.component';
import { BuscadormodalComponent } from './components/buscadormodal/buscadormodal.component';
import { ReportesComponent } from '../reportes/reportes.component';








@NgModule({
  declarations: [
    //componentes
  FooterComponent,
    LoginComponent,
    AboutComponent,
    MyNavComponent,
    ModalComponent,
    LoadingComponent,
    PaisesComponent,
    DashboardComponent,
    UsuariosComponent,
    CapitanesComponent,
    IdiomasComponent,
    SelectComponent,
    EmbarcacionesComponent,
    CapitanesComponent,
    ViajesComponent,
    PrincipalComponent,
    ProfileComponent,
    HomeComponent,
    DetalleComponent,
    HeaderturistaComponent,
    FooterTursitaComponent,
    PrincipalTuristaComponent,
    RegistroComponent,
    LoginAdminComponent,
    ViajesTuristaComponent,
    CambioContrasenaComponent,
    ModificarContrasenaComponent,
    TextoscorreosComponent,
    ReportesComponent,
    BuscadormodalComponent

    ],

  imports: [
    BrowserModule,
    HttpClientModule,
    routing,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,

    //componentes de rutas
  ],

  exports :[
    AboutComponent,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MyNavComponent,

  ],

  providers: [ServicesService],
  bootstrap: [],//componente
  entryComponents: [ModalComponent, LoadingComponent, LoginComponent, RegistroComponent,
  BuscadormodalComponent]
})
export class CoreModule { }
