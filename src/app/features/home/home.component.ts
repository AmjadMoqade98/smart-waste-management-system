import {Component, OnInit} from '@angular/core';
import {Bin} from '../../core/models/bin.model';
import {ActivatedRoute} from '@angular/router';
import {Area} from '../../core/models/area.model';
import {Employee} from '../../core/models/employee.model';

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

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.handleRouteParams();
  }


  handleRouteParams(): void {
    console.log(this.route.snapshot.queryParams);

    this.route.fragment.subscribe(f => {
      const element = document.querySelector('#' + f);
      if (element && Object.keys(this.route.snapshot.queryParams).length === 0) {
        element.scrollIntoView();
      }
    });

    this.routeParameter = this.route.snapshot.queryParams;
  }
}


