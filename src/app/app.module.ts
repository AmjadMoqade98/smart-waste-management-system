import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {CoreModule} from './core/core.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app.routing.module';
import {AdminAuthGuard} from './core/services/auth/admin-auth-guard.service';
import {NoAuthGuard} from './core/services/auth/no-auth-guard.service';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {TruckLocationsService} from './core/services/data/truck-locations.service';
import {AuthService} from './core/services/auth/auth.service';
import {HashLocationStrategy} from "@angular/common";
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {SharedModule} from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    SharedModule,
  ],
  providers: [AdminAuthGuard , NoAuthGuard, TruckLocationsService, AuthService, HashLocationStrategy],
  bootstrap: [AppComponent ]
})
export class AppModule { }
