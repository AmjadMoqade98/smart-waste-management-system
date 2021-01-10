import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Report, UserRole} from '../../../core/models/report.model';
import {ReportService} from '../../../core/services/data/report.service';
import {EmployeeService} from '../../../core/services/data/employee.service';
import {CitizenService} from '../../../core/services/data/citizen.service';
import {Employee} from '../../../core/models/employee.model';
import {Citizen} from '../../../core/models/citizen.model';
import {forkJoin} from 'rxjs';
import {take} from 'rxjs/operators';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss', '../../../../assets/styles/primeNG.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class ReportsComponent {
  reports: Report[];
  currentReports: ReportData[];
  citizenReports: ReportData[];
  employeeReports: ReportData[];
  employees: Employee[];
  citizens: Citizen[];

  selectedReport;
  numberOfRows = 5;

  showEmployeeReports = true;
  showCitizenReports = false;

  date = new Date().toLocaleDateString();

  items = [
    {
      label: 'Emoployees', command: (event) => {
        this.currentReports = [];
        this.showCitizenReports = false;
        this.showEmployeeReports = true;
        for (const emp of this.employeeReports) {
          this.currentReports.push(emp);
        }
      }
    },
    {
      label: 'Citizens', command: (event) => {
        this.currentReports = [];
        this.showCitizenReports = true;
        this.showEmployeeReports = false;
        for (const citizen of this.citizenReports) {
          this.currentReports.push(citizen);
        }
      }
    },
  ];

  constructor(private reportService: ReportService, private employeeService: EmployeeService,
              private citizenService: CitizenService, private datePipe: DatePipe) {
    this.initializeData();
  }

  initializeData(): void {
    forkJoin({
      employees: this.employeeService.getEmployees().pipe(take(1)),
      citizens: this.citizenService.getCitizens().pipe(take(1)),
      reports: this.reportService.getReports().pipe(take(1)),
    }).subscribe(value => {
      this.employees = value.employees;
      this.citizens = value.citizens;
      this.reports = value.reports;
      this.employeeReports = [];
      this.citizenReports = [];
      for (const report of this.reports) {
        this.prepareReportData(report);
      }

      this.currentReports = [];
      for (const emp of this.employeeReports) {
        this.currentReports.push(emp);
      }
    });
  }

  prepareReportData(report: Report): ReportData {
    const reportD: any = {};
    reportD.id = report.id;
    reportD.title = report.subject;
    reportD.body = report.body;
    reportD.date = this.datePipe.transform(report.created, 'yyyy-MM-dd');
    reportD.bin = '' + report.binId;
    if (report.imageUrl) {
      reportD.image = report.imageUrl;
    }

    for (const citizin of this.citizens) {
      if (citizin.id === report.userId) {
        reportD.username = citizin.username;
        reportD.phone = citizin.phone;
        reportD.userRole = UserRole.Citizen;
        this.citizenReports.push(reportD);
      }
    }

    if (!reportD.username) {
      for (const employee of this.employees) {
        if (employee.id === report.userId) {
          reportD.username = employee.username;
          reportD.phone = employee.phone;
          reportD.userRole = UserRole.Employee;
          this.employeeReports.push(reportD);
        }
      }
    }
    return reportD;
  }

  updateDate(): void {
    this.currentReports = [];
    const date = this.datePipe.transform(this.date, 'yyyy-MM-dd');

    if (this.showEmployeeReports) {
      for (const emp of this.employeeReports) {
        if (emp.date === date) {
          this.currentReports.push(emp);
        }
      }
    } else {
      for (const citizen of this.citizenReports) {
        if (citizen.date === date) {
          this.currentReports.push(citizen);
        }
      }
    }
  }


}


interface ReportData {
  id: number;
  title: string;
  body: string;
  username: string;
  phone: string;
  date: string;
  bin: string;
  image: any;
}

