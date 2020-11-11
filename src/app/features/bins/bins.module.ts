import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BinsComponent } from './bins.component';
import { MapComponent } from './map/map.component';
import {SharedModule} from '../../shared/shared.module';
import {HereMapsManager, HereMapsModule} from 'ng2-heremaps';



const routes: Routes = [
  { path: '', component: BinsComponent }
];

@NgModule({
  declarations: [BinsComponent, MapComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule,
        HereMapsModule,
    ] ,
  providers: []
})
export class BinsModule { }
