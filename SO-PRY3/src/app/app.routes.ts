import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { SignupComponent } from "./components/signup/signup.component";
import { InitComponent } from "./components/init/init.component";
import { HomeComponent } from "./components/home/home.component";

const APP_ROUTES : Routes = [
    {path: 'my-drive', component: HomeComponent},
    {path: 'home', component: InitComponent}, 
    {path: 'login', component: LoginComponent}, 
    {path: 'signup', component: SignupComponent}, 
    {path: '**', pathMatch: 'full', redirectTo: 'home'} /* PREDETERMINADA */
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, {useHash:true});