import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {TruckLocationsService} from './core/services/data/truck-locations.service';
import {AuthService} from './core/services/auth/auth.service';
import {JwtService} from './core/services/auth/jwt.service';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isAdmin: Observable<boolean>;
  constructor(private truckLocationsService: TruckLocationsService , private authService: AuthService) {
    this.authService.populate();
    this.isAdmin = this.authService.isAdmin;
    truckLocationsService.getTruckLocations().subscribe(value => console.log(value));
  }

  title = 'SWMS';
}


