import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './components/login/login.component';
import {FormsModule} from '@angular/forms';
import {AngularFireModule} from '@angular/fire/compat';
import {environment} from 'src/environments/environment';
import { MainComponent } from './components/main/main.component';
import { RegistrarComponent } from './components/registrar/registrar.component';
import { AngularFireStorageModule,BUCKET  } from '@angular/fire/compat/storage';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ChatComponent } from './components/chat/chat.component';
import { InicioComponent } from './components/inicio/inicio.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    RegistrarComponent,
    LandingPageComponent,
    PerfilComponent,
    ChatComponent,
    InicioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
  ],
  providers: [
     { provide: 'any', useValue: 'gs://prog-iii.appspot.com' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }