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
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCEjf5CqrDWgkFb266uZ8sk3tDmnWsKPn8',
      libraries: ['drawing']
    }),
    NgxPopper
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
