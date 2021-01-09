import {Component, OnInit} from '@angular/core';
import {Report, UserRole} from '../../../core/models/report.model';
import {ReportService} from '../../../core/services/data/report.service';
import {EmployeeService} from '../../../core/services/data/employee.service';
import {CitizenService} from '../../../core/services/data/citizen.service';
import {Employee} from '../../../core/models/employee.model';
import {Citizen} from '../../../core/models/citizen.model';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  reports: Report[] = [];
  currentReports: ReportData[] = [];
  citizenReports: ReportData[] = [];
  employeeReports: ReportData[] = [];
  employees: Employee[];
  citizens: Citizen[];

  items = [
    {
      label: 'Emoployees', command: (event) => {
        this.currentReports = [];
        this.showCitizenReports = false;
        this.showEmployeeReports = true;
        for (let i = 0; i < this.numberOfRows; i++) {
          if (this.employeeReports[i]) {
            this.currentReports.push(this.employeeReports[i]);
          }
        }
      }
    },
    {
      label: 'Citizens', command: (event) => {
        this.currentReports = [];
        this.showCitizenReports = true;
        this.showEmployeeReports = false;
        for (let i = 0; i < this.numberOfRows; i++) {
          if (this.citizenReports[i]) {
            this.currentReports.push(this.citizenReports[i]);
          }
        }
      }
    },
  ];

  showEmployeeReports = true;
  showCitizenReports = false;

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
          this.employeeReports = [];
          this.citizenReports = [];
          for (const report of this.reports) {
            this.prepareReportData(report);
          }
          for (let i = 0; i < this.numberOfRows; i++) {
            if (this.employeeReports[i]) {
              this.currentReports.push(this.employeeReports[i]);
            }
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
          this.employeeReports = [];
          this.citizenReports = [];
          for (const report of this.reports) {
            this.prepareReportData(report);
          }
          for (let i = 0; i < this.numberOfRows; i++) {
            if (this.employeeReports[i]) {
              this.currentReports.push(this.employeeReports[i]);
            }
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
      if (this.showCitizenReports) {
        console.log(this.citizenReports[i]);
        if (this.citizenReports[i]) {
          this.currentReports.push(this.citizenReports[i]);
        }
      } else {
        if (this.employeeReports[i]) {
          this.currentReports.push(this.employeeReports[i]);
        }
      }
    }
  }

  prepareReportData(report: Report): ReportData {
    const reportD: any = {};
    reportD.id = report.id;
    reportD.title = report.subject;
    reportD.body = report.body;
    reportD.date = '1/1/2021';
    reportD.bin = '' + report.binId;
    reportD.imageUrl = report.imageUrl;

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
}

interface ReportData {
  id: number;
  title: string;
  body: string;
  username: string;
  phone: string;
  date: string;
  bin: string;
  imageUrl: string;
}

