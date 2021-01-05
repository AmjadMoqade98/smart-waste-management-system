import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import {first, map, take, tap} from 'rxjs/operators';
import {AuthService} from './auth.service';

@Injectable()
export class NoAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isAdmin.pipe(take(1), map(value => !value), tap(value => {
      if (value === false) {
        this.router.navigate(['home']);
      }
    }));
  }
}
