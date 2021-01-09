import {Component} from '@angular/core';
import {BinService} from '../../../core/services/data/bin.service';
import {Bin} from '../../../core/models/bin.model';
import {Area} from '../../../core/models/area.model';
import {Employee} from '../../../core/models/employee.model';
import {AreaService} from '../../../core/services/data/area.service';
import {EmployeeService} from '../../../core/services/data/employee.service';
import {TruckService} from '../../../core/services/data/truck.service';
import {Citizen} from '../../../core/models/citizen.model';
import {CitizenService} from '../../../core/services/data/citizen.service';
import {Truck} from '../../../core/models/truck.model';
import {forkJoin} from 'rxjs';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
  bins: Bin[] = [];
  areas: Area[] = [];
  employees: Employee[] = [];
  citizens: Citizen[] = [];
  trucks: Truck[] = [];

  areasOptions = [];
  barData;
  selectedArea = null;
  cardsInfo;

  constructor(private binService: BinService, private areaService: AreaService, private employeeService: EmployeeService,
              private trucksService: TruckService, private citizenService: CitizenService) {
    this.initializeData();
  }

  initializeData(): void {
    forkJoin({
      bins: this.binService.getBins().pipe(take(1)),
      areas: this.areaService.getAreas().pipe(take(1)),
      employees: this.employeeService.getEmployees().pipe(take(1)),
      citizens: this.citizenService.getCitizens().pipe(take(1)),
      trucks: this.trucksService.getTrucks().pipe(take(1)),
    }).subscribe(value => {
      this.bins = value.bins;
      this.areas = value.areas;
      this.employees = value.employees;
      this.citizens = value.citizens;
      this.trucks = value.trucks;
      this.cardsInfo = [
        {label: 'total bins', value: this.bins.length},
        {label: 'total areas', value: this.areas.length},
        {label: 'total employees', value: this.employees.length},
        {label: 'total registered citizens', value: this.citizens.length},
        {label: 'total trucks', value: this.trucks.length},
      ];
      this.prepareBarData(null);
      this.prepareAreas(this.areas);
    });
  }

  prepareAreas(areas: Area[]): void {
    this.areasOptions.push({label: 'All Areas', value: null});

    for (const area of areas) {
      this.areasOptions.push({label: area.name, value: area});
    }
  }

  changeBinsArea(area: Area): void {
    this.prepareBarData(area);
  }

  prepareBarData(area): void {
    let totalBins = 0;
    let ATBins = 0;
    let UTBins = 0;
    let OTBins = 0;
    let EBins = 0;
    for (const bin of this.bins) {
      if (area == null || bin.areaId === area.id) {
        totalBins++;
        switch (bin.status) {
          case 'UNDER_THRESHOLD': {
            UTBins++;
            break;
          }
          case 'ABOUT_TO_THRESHOLD': {
            ATBins++;
            break;
          }
          case 'OVER_THRESHOLD': {
            OTBins++;
            break;
          }
          case 'EMERGENCY': {
            EBins++;
            break;
          }
        }
      }
    }
    this.barData = {
      labels: ['UNDER_THRESHOLD', 'ABOUT_TO_THRESHOLD', 'OVER_THRESHOLD', 'EMERGENCY'],
      datasets: [
        {
          data: [UTBins, ATBins, OTBins, EBins],
          backgroundColor: [
            '#2aeb77',
            '#f5cf27',
            '#2063ab',
            '#ff0000',
          ],
          hoverBackgroundColor: [
            '#2aeb77',
            '#f5cf27',
            '#2063ab',
            '#ff0000',
          ]
        }
      ]
    };
  }
}
