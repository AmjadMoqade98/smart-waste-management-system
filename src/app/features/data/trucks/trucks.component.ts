import {Component, OnInit} from '@angular/core';
import {TruckOptions} from './truck.options';
import {Truck} from '../../../core/models/truck.model';
import {Area} from '../../../core/models/area.model';
import {Employee} from '../../../core/models/employee.model';
import {TruckService} from '../../../core/services/data/truck.service';
import {AreaService} from '../../../core/services/data/area.service';
import {ConfirmationService} from 'primeng/api';
import {Router} from '@angular/router';
import {EmployeeService} from '../../../core/services/data/employee.service';
import {forkJoin} from 'rxjs';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-trucks',
  templateUrl: './trucks.component.html',
  styleUrls: ['./trucks.component.css', '../../../../assets/styles/primeNG.scss']
})
export class TrucksComponent {

  trucks: Truck[];
  areas: Area[];
  employees: Employee[];

  trucksData: TruckData[] = [];
  cols = TruckOptions.cols;
  statusOptions = TruckOptions.status;
  areasOptions;
  employeesOptions;

  newTruck: any = {};

  isAddingTruck = false;

  msg;
  rows = 5;
  flag = 0;

  constructor(private truckService: TruckService, private areaService: AreaService, private confirmationService: ConfirmationService,
              private router: Router, private employeeService: EmployeeService) {
    this.initializeData();
  }

  initializeData(): void {
    forkJoin({
      areas: this.areaService.getAreas().pipe(take(1)),
      employees: this.employeeService.getEmployees().pipe(take(1)),
      trucks: this.truckService.getTrucks().pipe(take(1)),
    }).subscribe(value => {
      this.areas = value.areas;
      this.employees = value.employees;
      this.trucks = value.trucks;
      this.prepareAreas();
      this.prepareEmployees();
      this.prepareTableData();
      this.initSubscribtions();
    });
  }

  initSubscribtions(): void {
    this.truckService.getTrucks().subscribe(value => {
      this.trucks = value;
      this.prepareTableData();
    });
  }

  prepareAreas(): void {
    this.areasOptions = [];
    this.areasOptions.push({label: 'All', value: null});
    for (const area of this.areas) {
      this.areasOptions.push({label: area.name, value: area.name});
    }
  }

  prepareEmployees(): void {
    this.employeesOptions = [];
    this.employeesOptions.push({label: 'All', value: null});
    for (const employee of this.employees) {
      this.employeesOptions.push({label: employee.username, value: employee.username});
    }
  }

  prepareTableData(): void {
    this.trucksData = [];
    for (const truck of this.trucks) {
      this.trucksData.push(this.prepareTruckData(truck));
    }
  }

  prepareTruckData(truck: Truck): any {
    const truckD: any = {};
    truckD.id = truck.id;
    truckD.number = truck.number;
    truckD.area = 'No Area';
    truckD.employee = 'No Employee';
    truckD.status = 'FREE';
    if (truck.employees && truck.employees.length > 0) {
      const employee = this.employees.find(value => value.id === truck.employees[0]);
      console.log(employee);
      truckD.employee = employee.username;
      const area = this.areas.find(value => value.id === employee.areaIdsList[0]);
      console.log(area);
      truckD.area = area.name;
      truckD.status = 'USED';
    }
    return truckD;
  }

  confirmDelete(truck): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this truck?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.truckService.deleteTruck(truck.id).subscribe(value => {
          this.msg = [{
            severity: 'success', summary: 'Confirmed', detail: 'truck removed successfully'
          }];
        });
      },
    });
  }

  addTruckPrepare(): void {
    this.isAddingTruck = true;
  }

  addTruck(): void {
    this.truckService.addTruck(this.newTruck).subscribe(value => {
      this.msg = [{
        severity: 'success', summary: 'Confirmed', detail: 'truck added successfully'
      }];
      this.isAddingTruck = false;
      this.newTruck = {};
    });
  }


  clearMessages(): void {
    this.msg = [];
  }
}

export interface TruckData {
  id: number;
  number: number;
  area: string;
  employee: string;
  status: string;
}
