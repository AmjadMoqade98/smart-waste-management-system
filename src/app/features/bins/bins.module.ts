import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BinsComponent } from './bins.component';
import {SharedModule} from '../../shared/shared.module';
import {BinService} from '../../core/services/bin.service';


const routes: Routes = [
  { path: '', component: BinsComponent }
];

@NgModule({
  declarations: [BinsComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule,
    ] ,
  providers: [BinService]
})
export class BinsModule { }
