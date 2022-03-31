import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {LandingPageComponent} from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import {MainComponent} from './components/main/main.component';
import {RegistrarComponent} from './components/registrar/registrar.component';

const routes: Routes = [
  {path:'', component: LandingPageComponent},
  {path:'login', component: LoginComponent},
  {path:'registrar', component: RegistrarComponent},
  {path:'main', component: MainComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }