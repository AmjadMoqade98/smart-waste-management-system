import {Component, Inject, NgZone, PLATFORM_ID} from '@angular/core';
import {AuthService} from './core/services/auth/auth.service';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {NavigationEnd, Router} from '@angular/router';
import {isPlatformBrowser} from '@angular/common';
import {filter, first} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  isAdmin: Observable<boolean>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private authService: AuthService,
    private zone: NgZone,
    private router: Router,

  ) {
    this.authService.populate();
    this.isAdmin = this.authService.isAdmin;
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        this.router.events.pipe(filter(event => event instanceof NavigationEnd), first()).subscribe(() => {
          const preloader = document.querySelector('.site-preloader');

          preloader.addEventListener('transitionend', (event: TransitionEvent) => {
            if (event.propertyName === 'opacity') {
              preloader.remove();
            }
          });
          preloader.classList.add('site-preloader__fade');
        });
      });
    }
  }


  title = 'SWMS';
}


