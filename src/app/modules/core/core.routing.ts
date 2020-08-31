import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {AboutComponent} from './authentication/about/about.component';
import {UsuariosComponent} from '../usuarios/usuarios.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CapitanesComponent } from '../capitanes/capitanes.component';
import {PaisesComponent} from '../paises/paises.component';
import {IdiomasComponent} from '../idiomas/idiomas.component';
import { EmbarcacionesComponent } from '../embarcaciones/embarcaciones.component';
import { ViajesComponent } from '../viajes/viajes.component';
import {AuthGuardService} from './services/auth-guard.service';
import {PrincipalComponent} from '../principal/principal.component';
import {ProfileComponent} from '../profile/profile.component';
import { HomeComponent } from '../home/home.component';
import {DetalleComponent} from '../detalle/detalle.component';
import { PrincipalTuristaComponent } from './principal-turista/principal-turista.component';
import { LoginAdminComponent } from '../login-admin/login-admin.component';
import { ViajesTuristaComponent } from '../viajes-turista/viajes-turista.component';
import { CambioContrasenaComponent } from '../cambio-contrasena/cambio-contrasena.component';
import { ModificarContrasenaComponent } from '../cambio-contrasena/modificar-contrasena/modificar-contrasena.component';
import { TextoscorreosComponent } from '../textoscorreos/textoscorreos.component';
import { ReportesComponent } from '../reportes/reportes.component';


export const routes: Routes = [
    //{ path: '', component: LoginComponent }, // default route of the module

    { path: 'dashboard',
     component: DashboardComponent,
     canActivate: [AuthGuardService],
     children : [

  { path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuardService]},
  { path: 'capitanes', component: CapitanesComponent, canActivate: [AuthGuardService]},
  { path: 'idiomas', component: IdiomasComponent, canActivate: [AuthGuardService]},
  { path: 'embarcaciones', component: EmbarcacionesComponent, canActivate: [AuthGuardService]},
  { path: 'viajes', component: ViajesComponent , canActivate: [AuthGuardService]},
  { path: 'paises', component: PaisesComponent, canActivate: [AuthGuardService]},
  { path: 'perfil', component: ProfileComponent, canActivate: [AuthGuardService]},
  { path: 'principal', component: PrincipalComponent, canActivate: [AuthGuardService]},
  { path: 'correos', component: TextoscorreosComponent, canActivate: [AuthGuardService]},
  { path: 'reportes', component: ReportesComponent, canActivate: [AuthGuardService]},
  { path: 'home', component: HomeComponent},
  { path: '**', pathMatch: 'full', redirectTo: 'principal' }// default route of the module
     ]

  },

    { path: 'home', component: PrincipalTuristaComponent , children : [
      { path: 'detalle', component: DetalleComponent},
      { path: 'about', component: AboutComponent},
      { path: 'inicio', component: HomeComponent},
      { path: 'viajes-turista', component: ViajesTuristaComponent},
      { path: 'modificar-contrasena', component: ModificarContrasenaComponent},
      { path: 'perfil', component: ProfileComponent, canActivate: [AuthGuardService]},
      { path: '**', pathMatch: 'full', redirectTo: 'inicio' },
    ]},

    { path: 'changepass', component: CambioContrasenaComponent},
    { path: 'login-admin', component: LoginAdminComponent},
    { path: '**', pathMatch: 'full', redirectTo: 'home' }// default route of the module

  ];

  export const routing: ModuleWithProviders = RouterModule.forChild(routes);
