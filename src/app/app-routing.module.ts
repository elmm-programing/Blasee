import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {LandingPageComponent} from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import {MainComponent} from './components/main/main.component';
import {RegistrarComponent} from './components/registrar/registrar.component';
import { canActivate } from '@angular/fire/compat/auth-guard';
import { AngularFireAuthGuard, hasCustomClaim, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/compat/auth-guard';
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const routes: Routes = [
  {path:'', component: LandingPageComponent},
  {path:'login', component: LoginComponent},
  {path:'registrar', component: RegistrarComponent},
  {path:'main', component: MainComponent , canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }