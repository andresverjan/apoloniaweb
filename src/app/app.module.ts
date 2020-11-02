import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { routing } from "./app-routing.module";
import { AppComponent } from "./app.component";

//modulos
import { CoreModule } from "./modules/core/core.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./modules/core/material.module";
import { LayoutModule } from "@angular/cdk/layout";
import { FlexLayoutModule } from "@angular/flex-layout";
import { SocialLoginModule } from "angularx-social-login";
import * as Globals from "./modules/core/globals";
import {
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
  LinkedInLoginProvider,
} from "angularx-social-login";
import { MascarasComponent } from "./modules/mascaras/mascaras.component";
import { FiltroBusquedaComponent } from "./modules/core/components/filtro-busqueda/filtro-busqueda.component";
import { TipoCampoComponent } from "./modules/tipo-campo/tipo-campo.component";
import {
  BuscadormodalComponent,
  DialogOverviewExample,
} from "./modules/core/components/buscadormodal/buscadormodal.component";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(Globals.GOOGLE_AUTENTICA),
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(Globals.FACEBOOK_AUTENTICA),
  },
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    MascarasComponent,
    BuscadormodalComponent,

    TipoCampoComponent,
    DialogOverviewExample,
  ],
  imports: [
    BrowserModule,
    routing,
    CoreModule,
    BrowserAnimationsModule,
    MaterialModule,
    LayoutModule,
    FlexLayoutModule,
    SocialLoginModule,
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig,
    },

    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
