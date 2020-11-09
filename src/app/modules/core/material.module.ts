import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatTabsModule } from "@angular/material/tabs";
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';

import { MatDialogModule } from "@angular/material/dialog";

import { MatGridListModule } from "@angular/material/grid-list";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDatepickerModule } from "@angular/material/datepicker";

import { MatRadioModule } from "@angular/material/radio";
import { MatTableModule } from "@angular/material/table";
import { MatChipsModule } from "@angular/material/chips";
import { MatPaginatorModule } from "@angular/material/paginator";

@NgModule({
  declarations: [
    //CourseDialogComponent
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatDialogModule,
    MatGridListModule,
    MatMenuModule,
    MatTabsModule,
    FlexLayoutModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    //MatNativeDateModule,
    MatRadioModule,
    MatTableModule,
    MatPaginatorModule,
    MatChipsModule,
    MatSlideToggleModule,
    //componentes de rutas
  ],

  exports: [
    BrowserAnimationsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatDialogModule,
    MatGridListModule,
    MatMenuModule,
    MatTabsModule,
    FlexLayoutModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    //MatNativeDateModule,
    MatRadioModule,
    MatTableModule,
    MatPaginatorModule,
    MatChipsModule,
  ],

  providers: [],
  bootstrap: [], //componente
})
export class MaterialModule {}
