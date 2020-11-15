import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class HttpTokenInterceptorService implements HttpInterceptor {
  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('request sent');
    const headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGhvcml0aWVzIjpbeyJhdXRob3JpdHkiOiJST0xFX0FETUlOIn1dLCJpYXQiOjE2MDU0NTIwNjMsImV4cCI6MTYwNTQ4NDgwMH0.KQOwHmWr-Di2Wu4YvFrA7BzUnVbc4AfTNWeGkG6COOo'
    };

    // const token = this.jwtService.getToken();
    //
    // if (token) {
    //   headersConfig['Authorization'] = `Token ${token}`;
    // }

    const request = req.clone({setHeaders: headersConfig});
    return next.handle(request);
  }
}
