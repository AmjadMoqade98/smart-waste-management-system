import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {CoreModule} from './core/core.module';
import {SharedModule} from './shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app.routing.module';
import {AgmCoreModule} from '@agm/core';
import { NgxPopper } from 'angular-popper';
import {AdminAuthGuard} from './core/services/auth/admin-auth-guard.service';
import {NoAuthGuard} from './core/services/auth/no-auth-guard.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    SharedModule,
    CoreModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgxPopper
  ],
  providers: [AdminAuthGuard , NoAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
