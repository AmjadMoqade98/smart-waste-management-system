import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AreasComponent } from './areas.component';


const routes: Routes = [
  { path: '', component: AreasComponent }
];

@NgModule({
  declarations: [AreasComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AreasModule { }
