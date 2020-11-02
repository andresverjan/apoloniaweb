import { UsersComponent } from "./../users/users.component";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FooterComponent } from "./footer/footer.component";
import { HttpClientModule } from "@angular/common/http";
import { ServicesService } from "./services/services.service";
import { PrincipalComponent } from "../principal/principal.component";
import { ProfileComponent } from "../profile/profile.component";

import { routing } from "./core.routing";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "../core/material.module";
import { MyNavComponent } from "./my-nav/my-nav.component";
import { ModalComponent } from "./modal/modal.component";
import { LoadingComponent } from "./loading/loading.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import {
  MatGridListModule,
  MatCardModule,
  MatMenuModule,
  MatIconModule,
  MatButtonModule,
  MatDialogRef,
} from "@angular/material";
import { SelectComponent } from "./components/select/select.component";
import { HomeComponent } from "../home/home.component";
import { HeaderturistaComponent } from "./components/headerturista/headerturista.component";
import { FooterTursitaComponent } from "../core/components/footer-tursita/footer-tursita.component";
import { LoginAdminComponent } from "../login-admin/login-admin.component";
import { ComerciosComponent } from "../comercios/comercios.component";
import { ProductosComponent } from "../productos/productos.component";
import { AdditionComponent } from "../addition/addition.component";
import { OrdersComponent } from '../orders/orders.component';
import { ApplicationsComponent } from '../applications/applications.component';
import {
  BuscadormodalComponent,
  DialogOverviewExample,
} from "./components/buscadormodal/buscadormodal.component";

@NgModule({
  declarations: [
    //componentes
    FooterComponent,
    MyNavComponent,
    ModalComponent,
    LoadingComponent,
    DashboardComponent,
    SelectComponent,
    PrincipalComponent,
    ProfileComponent,
    HomeComponent,
    HeaderturistaComponent,
    FooterTursitaComponent,
    LoginAdminComponent,
    UsersComponent,
    ComerciosComponent,
    ProductosComponent,
    AdditionComponent,
    ApplicationsComponent,
    OrdersComponent,
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
    //    ProductosComponent
    //componentes de rutas
  ],

  exports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MyNavComponent,
    //    ProductosComponent
  ],

  providers: [ServicesService],
  bootstrap: [], //componente
  entryComponents: [
    ModalComponent,
    LoadingComponent,
    BuscadormodalComponent,
    DialogOverviewExample,
  ],
})
export class CoreModule {}
