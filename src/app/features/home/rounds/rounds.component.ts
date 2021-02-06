import {Component, OnInit} from '@angular/core';
import {RoundService} from '../../../core/services/data/round.service';
import {Round} from '../../../core/models/round.model';
import {forkJoin} from 'rxjs';
import {take} from 'rxjs/operators';
import {AreaService} from '../../../core/services/data/area.service';
import {EmployeeService} from '../../../core/services/data/employee.service';
import {Area} from '../../../core/models/area.model';
import {Employee} from '../../../core/models/employee.model';
import {Router} from '@angular/router';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-rounds',
  templateUrl: './rounds.component.html',
  styleUrls: ['./rounds.component.css']
})
export class RoundsComponent implements OnInit {

  rounds: Round[] = [];
  processing: RoundData[] = [];
  finished: RoundData[] = [];
  currentFinished: RoundData[] = [];
  currentProcessing: RoundData[] = [];

  employees: Employee[];
  areas: Area[];

  areasOptions;
  selectedArea: Area;
  employeesOptions;
  selectedEmployee: Employee;
  late: number;
  onTime: number;

  constructor(
    private roundService: RoundService,
    private areaService: AreaService,
    private employeeService: EmployeeService,
    private router: Router,
    private datePipe: DatePipe,
  ) {
    this.initializeData();
  }

  initializeData(): void {
    forkJoin({
      areas: this.areaService.getAreas().pipe(take(1)),
      employees: this.employeeService.getEmployees().pipe(take(1)),
      rounds: this.roundService.getRounds().pipe(take(1)),
    }).subscribe(value => {
      this.areas = value.areas;
      this.employees = value.employees;
      this.rounds = value.rounds;

      this.prepareData();
      this.calculateLate();
      this.prepareAreaOptions();
      this.prepareEmployeeOptions();
    });
  }

  ngOnInit(): void {
  }

  prepareData(): void {
    this.processing = [];
    this.finished = [];

    for (const round of this.rounds) {
      if (round.roundStatus === 'IN_PROGRESS') {
        this.processing.push(this.prepareRound(round));
      } else {
        this.finished.push(this.prepareRound(round));
      }
    }

    this.currentProcessing = this.processing;
    this.currentFinished = this.finished;
  }

  prepareRound(round: Round): RoundData {
    const round1: any = {};
    round1.id = round.id;
    round1.employee = this.employees.find(value => value.id === round.userId);
    round1.roundStatus = round.roundStatus;
    round1.bins = (round.binIdsList) ? round.binIdsList : [];
    round1.endTime = this.datePipe.transform(round.endTime, 'h:mm a');
    round1.startTime = this.datePipe.transform(round.startTime, 'h:mm a');
    round1.area = this.areas.find(value => value.id === round1.employee.areaIdsList[0]);
    round1.day = this.datePipe.transform(round.startTime, 'EEEE, MMMM d, y');
    round1.late = (Math.random() * 100);
    return round1;
  }


  prepareAreaOptions(): void {
    this.areasOptions = [
      {label: 'Select Area', value: null},
    ];

    for (const area of this.areas) {
      this.areasOptions.push({label: area.name, value: area});
    }
  }

  prepareEmployeeOptions(): void {
    this.employeesOptions = [
      {label: 'Select Employee', value: null},
    ];

    for (const employee of this.employees) {
      this.employeesOptions.push({label: employee.username, value: employee});
    }
  }


  filterRounds(): void {
    this.filterProcessedRounds();
    this.filterFinishedRounds();
  }

  filterFinishedRounds(): void {
    const currentFinished = [];
    if (this.selectedEmployee) {
      for (const round of this.finished) {
        if (round.employee.id === this.selectedEmployee.id) {
          currentFinished.push(round);
        }
      }
      this.currentFinished = currentFinished;
    } else if (this.selectedArea) {
      for (const round of this.finished) {
        const emp = this.employees.find(value => value.id === round.employee.id);
        const area = this.areas.find(value => value.id === emp.areaIdsList[0]);
        if (area && area.id === this.selectedArea.id) {
          currentFinished.push(round);
        }
      }
      this.currentFinished = currentFinished;

    } else {
      this.currentFinished = this.finished;
    }
  }

  filterProcessedRounds(): void {
    const currentProcessed = [];
    if (this.selectedEmployee) {
      for (const round of this.processing) {
        if (round.employee.id === this.selectedEmployee.id) {
          currentProcessed.push(round);
        }
      }
      this.currentProcessing = currentProcessed;
    } else if (this.selectedArea) {
      for (const round of this.processing) {
        const emp = this.employees.find(value => value.id === round.employee.id);
        const area = this.areas.find(value => value.id === emp.areaIdsList[0]);
        if (area && area.id === this.selectedArea.id) {
          currentProcessed.push(round);
        }
      }
      this.currentProcessing = currentProcessed;
    } else {
      this.currentProcessing = this.processing;
    }
  }

  focusArea(areaId: number): void {
    this.router.navigate(['/map'], {queryParams: {areaId}});
  }

  lateFormatter(minutes: number): string {
    let h = Math.floor(minutes / 60);
    h = Math.round(h  * 100) / 100;
    const m = Math.round((minutes % 60));

    return '' + h + ' houres  ' + m + ' minutes';
  }


  calculateLate(): void {
    this.late = 0;
    for (const round of this.currentProcessing) {
      if (round.late > 60) {
        this.late++;
      }
    }
    for (const round of this.currentFinished) {
      if (round.late > 60) {
        this.late++;
      }
    }

    this.onTime = this.currentFinished.length + this.currentProcessing.length - this.late;
  }
}

interface RoundData {
  id: number;
  employee: Employee;
  roundStatus?: 'IN_PROGRESS' | 'FINISHED';
  bins: number[];
  endTime: string;
  startTime: string;
  area: Area;
  day: string;
  late: number;
}
