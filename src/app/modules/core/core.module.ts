import { RolesComponent } from "./../roles/roles.component";
import { AvatarComponent } from "./components/avatar/avatar.component";
import { FullCalendarModule } from "@fullcalendar/angular";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { UsersComponent } from "./../users/users.component";
import { BrowserModule } from "@angular/platform-browser";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
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
import { OrdersComponent } from "../orders/orders.component";
import { ApplicationsComponent } from "../applications/applications.component";
import { RecordatorioComponent } from "../recordatorio/recordatorio.component";


import {
  BuscadormodalComponent,
  DialogOverviewExample,
} from "./components/buscadormodal/buscadormodal.component";
import {
  BuscadormodaliconComponent,
  DialogOverviewExampleIcon,
} from "./components/buscadormodalicon/buscadormodalicon.component";
import { MascarasComponent } from "../mascaras/mascaras.component";
import { CitasComponent } from "../citas/citas.component";
import { HistoriaClinicaComponent } from "../historiaClinica/historiaClinica.component";
import { DatosPacienteComponent } from "../historiaClinica/DatosPaciente/datosPaciente.component";
import { EvolucionesComponent } from "../historiaClinica/Evoluciones/evoluciones.component";
import { EsterilizacionComponent } from "../historiaClinica/Evoluciones/Esterilizacion/esterilizacion.component";
import { DetalleComponent } from "../historiaClinica/Evoluciones/detalle/detalle.component";
import { RemisionComponent } from "../historiaClinica/Evoluciones/Remision/remision.component";
import { TipoCampoComponent } from "../tipo-campo/tipo-campo.component";
import { GenericComponent } from "../generic/generic.component";
import { InputComponent } from "./components/input/input.component";
import { ToogleComponent } from "./components/toogle/toogle.component";
import { SchedulerComponent } from "./components/scheduler/scheduler.component";
import { AgendaComponent } from "../agenda/agenda.component";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { MultilistComponent } from "./components/multilist/multilist.component";
import { MatListModule } from "@angular/material/list";
import { AvatarDragDirective } from "./components/avatar/avatarDragDropDirective";
import { DatepickerComponent } from "./components/datepicker/datepicker.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";
import { DatetimeComponent } from "./components/datetime/datetime.component";
import { GDatetimeComponent } from "./components/Gdatetime/Gdatetime.component";
import { SliderComponent } from "./components/slider/slider.component";
import { MatSliderModule } from "@angular/material/slider";
import { RecetarioComponent } from "../historiaClinica/Evoluciones/Recetario/recetario.component";
import { LaboratoriosComponent } from "../historiaClinica/Evoluciones/Laboratorios/laboratorios.component";
import { MultilistObservacionesComponent } from "./components/multilist-observaciones/multilist-observaciones.component";
import { EventosAdversosComponent } from "../historiaClinica/Evoluciones/EventosAdversos/eventosAdversos.component";
import { EsterilizacionesComponent } from '../esterilizaciones/esterilizaciones.component';
import { EgresosComponent } from "../egresos/egresos.component";
import { EgresosPagadosComponent } from "../egresos/egresos-pagados/egresos-pagados.component";
import { ConfigEgresosComponent } from "../egresos/config-egresos/config-egresos.component";
import { NumericComponent } from './components/numeric/numeric.component';
import { ListadoComponent } from './components/listado/listado.component';
import {  BasiccardComponent } from './components/basiccard/basiccard.component';
import { PieChartComponent } from './components/piechart/piechart.component';
import { GcolorpickerComponent } from './components/Gcolorpicker/gcolorpicker.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';
import { ColorpickerComponent } from "./components/colorpicker/colorpicker.component";
import { VentasComponent } from '../ventas/ventas.component';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from "@angular-material-components/datetime-picker";


FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin,
]);

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
    ApplicationsComponent,
    OrdersComponent,
    MascarasComponent,
    CitasComponent,
    BuscadormodalComponent,
    DialogOverviewExample,
    BuscadormodaliconComponent,
    DialogOverviewExampleIcon,
    TipoCampoComponent,
    GenericComponent,
    InputComponent,
    AgendaComponent,
    MultilistComponent,
    ToogleComponent,
    AvatarComponent,
    AvatarDragDirective,
    RolesComponent,
    SchedulerComponent,
    DatepickerComponent,
    DatetimeComponent,
    GDatetimeComponent,
    SliderComponent,
    HistoriaClinicaComponent,
    DatosPacienteComponent,
    EvolucionesComponent,
    EsterilizacionComponent,
    DetalleComponent,
    RecetarioComponent,
    RemisionComponent,
    LaboratoriosComponent,
    MultilistObservacionesComponent,
    EventosAdversosComponent,
    EsterilizacionesComponent,
    EgresosComponent,
    EgresosPagadosComponent,
    ConfigEgresosComponent,
    NumericComponent,
    BasiccardComponent,
    PieChartComponent,
    ListadoComponent,
    BasiccardComponent,
    ColorpickerComponent,
    GcolorpickerComponent,
    RecordatorioComponent,
    VentasComponent
  ],

  imports: [
    BrowserModule,
    HttpClientModule,
    routing,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    MaterialModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    FullCalendarModule,
    MatListModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule,
    MatSliderModule,
    NgxMatColorPickerModule,
    NgxMatTimepickerModule,
    NgxMatDatetimePickerModule
  ],

  exports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    MaterialModule,
    MyNavComponent,
  ],

  providers: [ServicesService,
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS },
    /*{ provide: OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS, useValue: { useUtc: true } },*/],
  bootstrap: [DatetimeComponent], //componente
  entryComponents: [ModalComponent, LoadingComponent, DialogOverviewExample],
  schemas: [ NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA ]
})
export class CoreModule {}
