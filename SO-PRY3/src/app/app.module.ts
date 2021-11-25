import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { APP_ROUTING } from './app.routes';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { InitComponent } from './components/init/init.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatTreeModule} from '@angular/material/tree';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import { ToastrModule } from 'ngx-toastr';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { SignupComponent } from './components/signup/signup.component';
import { DataComponent } from './components/shared/data/data.component';
import { PopUpComponent } from './components/shared/pop-up/pop-up.component';
import { CreateFileComponent } from './components/files/create-file/create-file.component';
import { CreateDirComponent } from './components/directories/create-dir/create-dir.component';
import { ReadFileComponent } from './components/files/read-file/read-file.component';
import { DeleteComponent } from './components/shared/delete/delete.component';
import { MoveComponent } from './components/shared/move/move.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InitComponent,
    NavbarComponent,
    SignupComponent,
    HomeComponent,
    SidebarComponent,
    DataComponent,
    PopUpComponent,
    CreateFileComponent,
    CreateDirComponent,
    ReadFileComponent,
    DeleteComponent,
    MoveComponent,
  ],
  imports: [
    BrowserModule,
    APP_ROUTING,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatTreeModule,
    MatSidenavModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    MatTooltipModule,
    MatMenuModule,
    MatSelectModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
