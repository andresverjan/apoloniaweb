import { BrowserModule } from "@angular/platform-browser";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { routing } from "./app-routing.module";
import { AppComponent } from "./app.component";

//modulos
import { CoreModule } from "./modules/core/core.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./modules/core/material.module";
import { LayoutModule } from "@angular/cdk/layout";
import { FlexLayoutModule } from "@angular/flex-layout";
import { SocialLoginModule } from "angularx-social-login";
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
/*import {
	IgxTimePickerModule,
	IgxInputGroupModule,
	IgxIconModule
 } from "igniteui-angular";
import { TimepickerDropdownComponent } from "./timepicker-dropdown/timepicker-dropdown.component";*/
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

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
    NgxMaterialTimepickerModule.setLocale('ar-AE')
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
  ],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}
