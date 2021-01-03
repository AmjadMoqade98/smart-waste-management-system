import {Injectable} from '@angular/core';
import {Employee} from '../models/Employee.model';
import {Observable, ReplaySubject, timer} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ApiService} from './api.service';
import {shareReplay, switchMap, tap} from 'rxjs/operators';

@Injectable()
export class EmployeeService {
private readonly PATH = '/employees';

private employeeData: Employee[] = [];
private employeeState: ReplaySubject<Employee[]> = new ReplaySubject<any>(1);

  constructor(private http: HttpClient, private apiService: ApiService) {
    this.LoadData();
  }

  LoadData(): void {
    timer(0, 1000 * 60 * 15).pipe(switchMap(() => this.apiService.get(this.PATH))).subscribe(data => {
    this.employeeState.next(data);
    this.employeeData = data;
  });
}

  getEmployees(): Observable<Employee[]> {
    return this.employeeState.pipe(shareReplay({refCount: true, bufferSize: 1}));
  }

  getEmployee(id): Employee {
    if (this.employeeData.length > 0) {
      return this.employeeData.find(employee => employee.id === id);
    }
    return null;
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.apiService.post(this.PATH, employee).pipe(tap(response => {
      this.employeeData.push(response);
      this.employeeState.next(this.employeeData);
    }));
  }

  updateEmployee(id, employee: Employee): Observable<Employee> {
    return this.apiService.put(this.PATH + '/' + id, employee).pipe(tap(response => {
      const oldEmployee = this.employeeData.find(employee1 => employee1.id === response.id);
      const index = this.employeeData.indexOf(oldEmployee);
      this.employeeData[index] = response;
      this.employeeState.next(this.employeeData);
    }));
  }

  deleteEmployee(id): Observable<any> {
    return this.apiService.delete(this.PATH + '/' + id).pipe(tap(response => {
      this.employeeData = this.employeeData.filter(employee => employee.id !== id);
      this.employeeState.next(this.employeeData);
    }));
  }
}
