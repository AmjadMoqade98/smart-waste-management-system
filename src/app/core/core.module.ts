import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ApiService} from './services/api.service';
import {BinService} from './services/bin.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {HttpTokenInterceptorService} from './services/http-token-interceptor.service';
import {AuthService} from './services/auth.service';
import {AuthGuardAdminService} from './services/auth-guard-admin.service';
import {ErrorInterceptorService} from './services/error.interceptor.service';
import {JwtService} from './services/jwt.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers: [ApiService , BinService , AuthService, AuthGuardAdminService, JwtService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptorService,
      multi: true
    }]
})
export class CoreModule {}
