import { NgModule } from "@angular/core";
import { Routes, RouterModule, Route } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";
//import { TextoscorreosComponent } from './modules/textoscorreos/textoscorreos.component';

const routes: Routes = [
  { path: "login", loadChildren: "./modules/core/core.module#CoreModule" },
];

//export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
export const routing: ModuleWithProviders<Route> = RouterModule.forRoot(routes);

/**
 * @NgModule({
  imports: [RouterModule.forRoot(routes,
    { enableTracing: true } // <-- debugging purposes only
    )],
  exports: [RouterModule]
})
 */

export class AppRoutingModule {}
