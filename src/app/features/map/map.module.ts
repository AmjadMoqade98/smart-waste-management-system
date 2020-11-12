import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './map.component';
import {AgmCoreModule} from '@agm/core';
import {BinService} from '../../core/services/bin.service';


const routes: Routes = [
  { path: '', component: MapComponent }
];

@NgModule({
  declarations: [MapComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCEjf5CqrDWgkFb266uZ8sk3tDmnWsKPn8'
    })
  ],
  providers: [BinService]
})
export class MapModule { }
