import {Component, OnInit} from '@angular/core';
import {Report} from '../../core/models/report.model';
import {ReportService} from '../../core/services/data/report.service';
import {EmployeeService} from '../../core/services/data/employee.service';
import {CitizenService} from '../../core/services/data/citizen.service';
import {Employee} from '../../core/models/employee.model';
import {Citizen} from '../../core/models/citizen.model';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  reports: Report[];
  currentReports: ReportData[] = [];
  employees: Employee[];
  citizens: Citizen[];

  numberOfRows = 5;
  flag = 0;

  constructor(private reportService: ReportService, private employeeService: EmployeeService, private citizenService: CitizenService) {
    this.initializeData();
  }

  ngOnInit(): void {
  }

  initializeData(): void {
    this.employeeService.getEmployees().subscribe(value => {
      this.flag++;
      this.employees = value;

      if (this.flag === 2) {
        this.reportService.getReports().subscribe(reports => {
          this.reports = reports;
          this.currentReports = [];
          for (let i = 0; i < this.numberOfRows; i++) {
            this.currentReports.push(this.prepareReportData(this.reports[i]));
          }
        });
      }
    });
    this.citizenService.getCitizens().subscribe(value => {
      this.flag++;
      this.citizens = value;

      if (this.flag === 2) {
        this.reportService.getReports().subscribe(reports => {
          this.reports = reports;
          this.currentReports = [];
          for (let i = 0; i < this.numberOfRows; i++) {
            this.currentReports.push(this.prepareReportData(this.reports[i]));
          }
        });
      }
    });
  }

  paginate(event): void {
    this.currentReports = [];
    this.numberOfRows = event.rows;
    const start = event.page * this.numberOfRows;
    const end = event.page * this.numberOfRows + this.numberOfRows;
    for (let i = start; i < end; i++) {
      this.currentReports.push(this.prepareReportData(this.reports[i]));
    }
  }

  prepareReportData(report: Report): ReportData {
    const reportD: ReportData = {username: '', phone: '', date: '', body: '', title: '', bin: ''};
    reportD.title = report.subject;
    reportD.body = report.body;
    reportD.date = '1/1/2021';
    reportD.bin = '' + report.binId;

    for (const citizin of this.citizens) {
      if (citizin.id === report.userId) {
        reportD.username = citizin.username;
        reportD.phone = citizin.phone;
      }
    }

    if (reportD.username === '') {
      for (const employee of this.employees) {
        if (employee.id === report.userId) {
          reportD.username = employee.username;
          reportD.phone = employee.phone;
        }
      }
    }
    return reportD;
  }
}

interface ReportData {
  title: string;
  body: string;
  username: string;
  phone: string;
  date: string;
  bin: string;
}

