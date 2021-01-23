import {Component} from '@angular/core';
import {AuthService} from './core/services/auth/auth.service';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isAdmin: Observable<boolean>;
  constructor( private authService: AuthService) {
    this.authService.populate();
    this.isAdmin = this.authService.isAdmin;
    console.log(document.cookie);
  }

  title = 'SWMS';
}


