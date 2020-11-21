import { MultilistComponent } from './components/multilist/multilist.component';
import { MultilistTestComponent } from './components/multilist copy/multilist.component-test';
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
        path: "generic-list",
        component: GenericComponent,
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
        path: "multilist-test",
        component: MultilistTestComponent,
        canActivate: [AuthGuardService],
      },

      { path: "**", pathMatch: "full", redirectTo: "principal" }, // default route of the module
    ],
  },
  { path: "login-admin", component: LoginAdminComponent },

  { path: "**", pathMatch: "full", redirectTo: "login-admin" }, // default route of the module
];

//export const routing: ModuleWithProviders = RouterModule.forChild(routes);
export const routing: ModuleWithProviders<Route> = RouterModule.forRoot(routes);
