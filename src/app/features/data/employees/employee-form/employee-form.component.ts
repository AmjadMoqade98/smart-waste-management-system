import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Employee} from '../../../../core/models/employee.model';
import {EmployeeService} from '../../../../core/services/data/employee.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent {

  @Output() onEmployeeAdded: EventEmitter<any> = new EventEmitter<any>();
  @Input() employee: Employee;
  @Input() action: string ;

  spinner = false;

  constructor(private employeeService: EmployeeService) {
  }
  submitEmployee(f: NgForm): void{
    if (f.valid) {
      this.spinner = true;
      if (this.action === 'add') {
        this.employeeService.addEmployee(this.employee).subscribe(employee1 => {
          this.onEmployeeAdded.emit(employee1);
        });
      } else {
        this.employeeService.updateEmployee(this.employee.id, this.employee).subscribe(employee1 => {
          this.onEmployeeAdded.emit(employee1);
        });
      }
    }
  }
}
