import { UsersComponent } from "./../users/users.component";
import { Routes, RouterModule } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AuthGuardService } from "./services/auth-guard.service";
import { PrincipalComponent } from "../principal/principal.component";
import { ProfileComponent } from "../profile/profile.component";
import { HomeComponent } from "../home/home.component";
import { LoginAdminComponent } from "../login-admin/login-admin.component";
import { ComerciosComponent } from "../comercios/comercios.component";
import { ProductosComponent } from "../productos/productos.component";
import { AdditionComponent } from "../addition/addition.component";
import { OrdersComponent } from '../orders/orders.component';
import { SubproductosComponent } from '../subproductos/subproductos.component';

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
        path: "comercios",
        component: ComerciosComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "productos",
        component: ProductosComponent,
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
        path: "users",
        component: UsersComponent,
        canActivate: [AuthGuardService],
      },
      { path: 'subproductos', component: SubproductosComponent, canActivate: [AuthGuardService] },
      { path: "**", pathMatch: "full", redirectTo: "principal" }, // default route of the module
    ],
  },
  { path: "login-admin", component: LoginAdminComponent },

  { path: "**", pathMatch: "full", redirectTo: "login-admin" }, // default route of the module
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
