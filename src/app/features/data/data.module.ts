import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {BinsComponent} from './bins/bins.component';
import {SharedModule} from '../../shared/shared.module';
import {ReportsComponent} from './reports/reports.component';
import {EmployeesComponent} from './employees/employees.component';
import {EmployeeFormComponent} from './employees/employee-form/employee-form.component';
import {TrucksComponent} from './trucks/trucks.component';


const routes: Routes = [
  { path: 'bins', component: BinsComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: 'trucks', component: TrucksComponent },
];

@NgModule({
  declarations: [BinsComponent, ReportsComponent, EmployeesComponent, EmployeeFormComponent, TrucksComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
})
export class DataModule {}
