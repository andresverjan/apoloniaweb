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
  GoogleLoginProvider,
  FacebookLoginProvider,
} from "angularx-social-login";
import { MascarasComponent } from "./modules/mascaras/mascaras.component";
import { TipoCampoComponent } from "./modules/tipo-campo/tipo-campo.component";
/*import {
  BuscadormodalComponent,
  DialogOverviewExample,
} from "./modules/core/components/buscadormodal/buscadormodal.component";*/

import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';


/*const config = new AuthServiceConfig([
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
}*/

@NgModule({
  declarations: [AppComponent],
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
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
