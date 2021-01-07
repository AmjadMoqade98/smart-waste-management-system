import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { MapComponent } from './map/map.component';
import { StatisticsComponent } from './statistics/statistics.component';
import {SharedModule} from '../../shared/shared.module';
import {TruckLocationsService} from '../../core/services/data/truck-locations.service';

const routes: Routes = [
  { path: '', component: HomeComponent }
];

@NgModule({
  declarations: [HomeComponent, MapComponent, StatisticsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers: [TruckLocationsService]
})
export class HomeModule { }
