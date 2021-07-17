import { NgModule } from "@angular/core";
import { Routes, RouterModule, Route } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";
//import { TextoscorreosComponent } from './modules/textoscorreos/textoscorreos.component';

const routes: Routes = [
  { path: "login", loadChildren: "./modules/core/core.module#CoreModule" },
];

export const routing: ModuleWithProviders<Route> = RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' });

export class AppRoutingModule {}
