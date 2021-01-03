import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import {AgmCoreModule} from '@agm/core';
import {BinService} from '../../core/services/bin.service';
import { MapComponent } from './map/map.component';
import { StatisticsComponent } from './statistics/statistics.component';
import {AreaService} from '../../core/services/area.service';

const routes: Routes = [
  { path: '', component: HomeComponent }
];

@NgModule({
  declarations: [HomeComponent, MapComponent, StatisticsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  providers: [BinService, AreaService]
})
export class HomeModule { }
