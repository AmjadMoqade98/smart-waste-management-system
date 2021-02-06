import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { MapComponent } from './map/map.component';
import { StatisticsComponent } from './statistics/statistics.component';
import {SharedModule} from '../../shared/shared.module';
import {RoundsComponent} from './rounds/rounds.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {path: 'rounds' , component: RoundsComponent}
];

@NgModule({
  declarations: [HomeComponent, MapComponent, StatisticsComponent, RoundsComponent, ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers: []
})
export class HomeModule {}
