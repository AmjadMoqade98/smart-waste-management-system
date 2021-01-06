import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {JwtService} from '../auth/jwt.service';

@Injectable()
export class HttpTokenInterceptorService implements HttpInterceptor {
  constructor(private jwtService: JwtService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const headersConfig = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: '',
  };

    const token = this.jwtService.getToken();
    if (token) {
      headersConfig.Authorization = token;
    }

    const request = req.clone({setHeaders: headersConfig});
    return next.handle(request);
  }
}
