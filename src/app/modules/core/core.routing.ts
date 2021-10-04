import { RolesComponent } from "./../roles/roles.component";
import { MultilistComponent } from "./components/multilist/multilist.component";
import { UsersComponent } from "./../users/users.component";
import { Routes, RouterModule, Route } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AuthGuardService } from "./services/auth-guard.service";
import { PrincipalComponent } from "../principal/principal.component";
import { ProfileComponent } from "../profile/profile.component";
import { HomeComponent } from "../home/home.component";
import { LoginAdminComponent } from "../login-admin/login-admin.component";
import { AdditionComponent } from "../addition/addition.component";
import { OrdersComponent } from "../orders/orders.component";
import { ApplicationsComponent } from "../applications/applications.component";
import { MascarasComponent } from "../mascaras/mascaras.component";
import { GenericComponent } from "../generic/generic.component";
import { AgendaComponent } from "../agenda/agenda.component";
import { CitasComponent } from "../citas/citas.component";
import { HistoriaClinicaComponent } from "../historiaClinica/historiaClinica.component";
import { EsterilizacionesComponent } from "../esterilizaciones/esterilizaciones.component";
import { EgresosComponent } from "../egresos/egresos.component";

export const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: "perfil",
        component: ProfileComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "principal",
        component: PrincipalComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "home",
        component: HomeComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "adiciones",
        component: AdditionComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "users",
        component: UsersComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "orders",
        component: OrdersComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "mascaras",
        component: MascarasComponent,
        canActivate: [AuthGuardService],
      },

      {
        path: "applications",
        component: ApplicationsComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "generic-list/:applicationId",
        component: GenericComponent,
        canActivate: [AuthGuardService],
      },       
      {
        path: "permisos-list",
        component: RolesComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "agenda",
        component: AgendaComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "multilist",
        component: MultilistComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "citas",
        component: CitasComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "esterilizacion",
        component: EsterilizacionesComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "historia-clinica",
        component: HistoriaClinicaComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "egresos",
        component: EgresosComponent,
        canActivate: [AuthGuardService],
      },

      { path: "**", pathMatch: "full", redirectTo: "principal" },
    ],
  },
  { path: "login-admin", component: LoginAdminComponent },

  { path: "**", pathMatch: "full", redirectTo: "login-admin" },
];

//export const routing: ModuleWithProviders = RouterModule.forChild(routes);
export const routing: ModuleWithProviders<Route> = RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' });
