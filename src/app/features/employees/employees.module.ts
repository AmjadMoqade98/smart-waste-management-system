import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { EmployeesComponent } from './employees.component';


const routes: Routes = [
  { path: '', component: EmployeesComponent }
];

@NgModule({
  declarations: [EmployeesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class EmployeesModule { }
