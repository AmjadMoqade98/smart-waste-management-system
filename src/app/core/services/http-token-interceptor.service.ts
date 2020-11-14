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
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGhvcml0aWVzIjpbeyJhdXRob3JpdHkiOiJST0xFX0FETUlOIn1dLCJpYXQiOjE2MDUzNjk5MzgsImV4cCI6MTYwNTM5ODQwMH0.rssP3-3FqwxSJQD103Zg7tKcZcPJYXJ7OCLQaQ96LQA'
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
