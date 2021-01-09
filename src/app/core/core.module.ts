import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiService} from './services/data/api.service';
import {BinService} from './services/data/bin.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {HttpTokenInterceptorService} from './services/interceptor/http-token-interceptor.service';
import {AuthService} from './services/auth/auth.service';
import {AdminAuthGuard} from './services/auth/admin-auth-guard.service';
import {ErrorInterceptorService} from './services/interceptor/error.interceptor.service';
import {JwtService} from './services/auth/jwt.service';
import {UserService} from './services/data/user.service';
import {AngularFireDatabase} from '@angular/fire/database';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers: [ApiService, AuthService, AdminAuthGuard, JwtService,
    UserService, AngularFireDatabase,
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
export class CoreModule {
}
