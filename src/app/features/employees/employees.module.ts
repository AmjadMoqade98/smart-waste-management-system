import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { EmployeesComponent } from './employees.component';
import {SharedModule} from '../../shared/shared.module';
import { EmployeeFormComponent } from './employee-form/employee-form.component';


const routes: Routes = [
  { path: '', component: EmployeesComponent }
];

@NgModule({
  declarations: [EmployeesComponent, EmployeeFormComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule
    ]
})
export class EmployeesModule { }
