import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {BinService} from '../../../core/services/data/bin.service';
import {Bin} from '../../../core/models/bin.model';
import {Area} from '../../../core/models/area.model';
import {Employee} from '../../../core/models/employee.model';
import {AreaService} from '../../../core/services/data/area.service';
import {EmployeeService} from '../../../core/services/data/employee.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit, OnChanges {
  bins: Bin[] = [];
  areas: Area[] = [];
  employees: Employee[] = [];

  areasOptions = [];

  selectedArea = null ;

  barData;
  totalBins = 0;
  ATBins = 0;
  OTBins = 0;
  UTBins = 0;
  EBins = 0;

  constructor(private binService: BinService, private areaService: AreaService, private employeeService: EmployeeService) {
    this.initializeData();
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
  }

  initializeData(): void {
    this.binService.getBins().subscribe(bins => {
      this.bins = bins;
      this.prepareBar();
    });
    this.areaService.getAreas().subscribe(areas => {
      this.areas = areas;
      this.prepareAreas(areas);
    });
    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees;
    });
  }

  prepareBar(): void {
    this.totalBins = this.bins.length;
    this.ATBins = 0;
    this.OTBins = 0;
    this.UTBins = 0;
    this.EBins = 0;
    for (const bin of this.bins) {
      this.getBinState(bin);
    }

    this.setBarData();
  }


  prepareAreas(areas: Area[]): void {
    this.areasOptions.push({label: 'All Areas', value: null});

    for (const area of areas) {
      this.areasOptions.push({label: area.name, value: area});
    }
  }

  changeBinsArea(area: Area): void {
    this.totalBins = 0;
    this.ATBins = 0;
    this.UTBins = 0;
    this.OTBins = 0;
    this.EBins = 0;
    for (const bin of this.bins) {
      if (area == null || bin.areaId === area.id) {
        this.totalBins++;
        this.getBinState(bin);
      }
    }
    this.barData.datasets[0].data = [this.UTBins, this.ATBins, this.OTBins, this.EBins] ;
    this.setBarData();
  }

  getBinState(bin: Bin): void {
    switch (bin.status) {
      case 'UNDER_THRESHOLD': {
        this.UTBins++;
        break;
      }
      case 'ABOUT_TO_THRESHOLD': {
        this.ATBins++;
        break;
      }
      case 'OVER_THRESHOLD': {
        this.OTBins++;
        break;
      }
      case 'EMERGENCY': {
        this.EBins++;
        break;
      }
    }
  }

  setBarData(): void {
    this.barData = {
      labels: ['UNDER_THRESHOLD', 'ABOUT_TO_THRESHOLD', 'OVER_THRESHOLD', 'EMERGENCY'],
      datasets: [
        {
          data: [this.UTBins, this.ATBins, this.OTBins, this.EBins],
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
