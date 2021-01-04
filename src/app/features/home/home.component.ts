import {Component, OnInit} from '@angular/core';
import {BinService} from '../../core/services/bin.service';
import {Bin} from '../../core/models/bin.model';
import {ActivatedRoute} from '@angular/router';
import {Area} from '../../core/models/area.model';
import {AreaService} from '../../core/services/area.service';
import {timer} from 'rxjs';
import {Employee} from '../../core/models/employee.model';
import {EmployeeService} from '../../core/services/employee.service';

declare const google: any;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  bins: Bin[];
  areas: Area[];
  employees: Employee[];
  routeParameter: any;

  constructor(private route: ActivatedRoute, private binService: BinService,
              private areaService: AreaService, private employeeService: EmployeeService) {
    this.initializeData();
  }

  ngOnInit(): void {
    this.scrollToSelector();
    this.getRoutParms();
  }

  scrollToSelector(): void {
    this.route.fragment.subscribe(f => {
      const index = f.indexOf('?');
      if (index !== -1){
        f = f.slice(0, index);
      }
      const element = document.querySelector('#' + f );
      if (element) {
        element.scrollIntoView();
      }
    });
  }

  getRoutParms(): void {
    this.route.fragment.subscribe(f => {
      const index = f.indexOf('?');
      if (index !== -1) {
        f = f.slice(index + 1);
        f = '{\"' + f ;
        f = f + '\"}' ;
        f = f.replace('=', '":"');
        f = f.replace('&', '","');
        this.routeParameter =  JSON.parse(f);
      }
    });
  }
  initializeData(): void {
    this.binService.getBins().subscribe(bins => {
      this.bins = bins;
    });
    this.areaService.getAreas().subscribe(areas => {
      this.areas = areas;
    });
    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees;
    });
  }
}


