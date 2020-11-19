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

import { MatGridListModule } from "@angular/material/grid-list";
import { MatCardModule } from "@angular/material/card";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

import { MatSlideToggleModule } from "@angular/material/slide-toggle";

import { SelectComponent } from "./components/select/select.component";
import { HomeComponent } from "../home/home.component";
import { FooterTursitaComponent } from "../core/components/footer-tursita/footer-tursita.component";
import { LoginAdminComponent } from "../login-admin/login-admin.component";
import { AdditionComponent } from "../addition/addition.component";
import { OrdersComponent } from "../orders/orders.component";
import { ApplicationsComponent } from "../applications/applications.component";
import {
  BuscadormodalComponent,
  DialogOverviewExample,
} from "./components/buscadormodal/buscadormodal.component";
import {
  BuscadormodaliconComponent,
  DialogOverviewExampleIcon,
} from "./components/buscadormodalicon/buscadormodalicon.component";
import { MascarasComponent } from "../mascaras/mascaras.component";
import { TipoCampoComponent } from "../tipo-campo/tipo-campo.component";
import { GenericComponent } from "../generic/generic.component";
import { InputComponent } from "./components/input/input.component";
import { FlatpickrModule } from "angularx-flatpickr";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";

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
    FooterTursitaComponent,
    LoginAdminComponent,
    UsersComponent,
    AdditionComponent,
    ApplicationsComponent,
    OrdersComponent,
    MascarasComponent,
    BuscadormodalComponent,
    DialogOverviewExample,
    BuscadormodaliconComponent,
    DialogOverviewExampleIcon,
    TipoCampoComponent,
    GenericComponent,
    InputComponent,
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
    MatSlideToggleModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),

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
  entryComponents: [ModalComponent, LoadingComponent, DialogOverviewExample],
})
export class CoreModule {}
