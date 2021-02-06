import {Component} from '@angular/core';
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

})
export class ReportsComponent {
  reports: Report[];
  currentReports: ReportData[];
  citizenReports: ReportData[];
  employeeReports: ReportData[];
  employees: Employee[];
  citizens: Citizen[];

  msg;

  flag = false;

  selectedReport;

  showEmployeeReports = false;
  showCitizenReports = false;
  showProcessed = false;
  showNonProcessed = true;

  date = new Date().toLocaleDateString();

  items1 = [
    {
      label: 'All', command: (event) => {
        this.showCitizenReports = false;
        this.showEmployeeReports = false;
        this.prepareCurrentReports();
      }
    },
    {
      label: 'Emoployees', command: (event) => {
        this.showCitizenReports = false;
        this.showEmployeeReports = true;
        for (const emp of this.employeeReports) {
          this.currentReports.push(emp);
        }
        this.prepareCurrentReports();
      }
    },
    {
      label: 'Citizens', command: (event) => {
        this.currentReports = [];
        this.showCitizenReports = true;
        this.showEmployeeReports = false;
        this.prepareCurrentReports();
      }
    },
  ];

  items2 = [
    {
      label: 'Non-Processed', command: (event) => {
        this.showProcessed = false;
        this.showNonProcessed = true;
        this.prepareCurrentReports();
      }
    },
    {
      label: 'Processed', command: (event) => {
        this.showProcessed = true;
        this.showNonProcessed = false;
        this.prepareCurrentReports();
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
      this.prepareCurrentReports();
      this.flag = true;

      for (const rep of this.reports) {
        if (rep.status === 'SENT') {
          this.reportService.updateReport(rep.id, 'PENDING').subscribe();
        }
      }
      this.reportService.getReports().subscribe(reports => {
        if (this.flag) {
          this.employeeReports = [];
          this.citizenReports = [];
          this.reports = reports;
          for (const report of this.reports) {
            this.prepareReportData(report);
          }
          this.prepareCurrentReports();
        }
      });
    });
  }

  prepareReportData(report: Report): ReportData {
    const reportD: any = {};
    reportD.id = report.id;
    reportD.title = report.subject;
    reportD.body = report.body;
    reportD.date = this.datePipe.transform(report.created, 'yyyy-MM-dd');
    reportD.bin = '' + report.binId;
    if (!report.status) {
      reportD.status = 'SENT';
    } else {
      reportD.status = report.status;
    }
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

  prepareCurrentReports(): void {
    if (this.showProcessed) {
      if (this.showEmployeeReports) {
        this.currentReports = this.employeeReports.filter(value => {
          return value.status === 'SOLVED';
        });
      } else if (this.showCitizenReports) {
        this.currentReports = this.citizenReports.filter(value => {
          return value.status === 'SOLVED';
        });
      } else {
        this.currentReports = this.getAllReports().filter(value => {
          return value.status === 'SOLVED';
        });
      }
    } else {
      if (this.showEmployeeReports) {
        this.currentReports = this.employeeReports.filter(value => {
          return value.status !== 'SOLVED';
        });
      } else if (this.showCitizenReports) {
        this.currentReports = this.citizenReports.filter(value => {
          return value.status !== 'SOLVED';
        });
      } else {
        this.currentReports = this.getAllReports().filter(value => {
          return value.status !== 'SOLVED';
        });
      }
    }
  }

  // updateDate(): void {
  //   this.currentReports = [];
  //   const date = this.datePipe.transform(this.date, 'yyyy-MM-dd');
  //
  //   if (this.showEmployeeReports) {
  //     for (const emp of this.employeeReports) {
  //       if (emp.date === date) {
  //         this.currentReports.push(emp);
  //       }
  //     }
  //   } else {
  //     for (const citizen of this.citizenReports) {
  //       if (citizen.date === date) {
  //         this.currentReports.push(citizen);
  //       }
  //     }
  //   }
  // }

  ProcessedReport(report: ReportData): void {
    const report1 = this.reports.filter(value => value.id === report.id)[0];
    report1.status = 'SOLVED';
    this.reportService.updateReport(report1.id, report1.status).subscribe(value => {
      this.clearMessages();
      this.msg = [{
        severity: 'success', summary: 'Confirmed',
        detail: 'report assigned as solved'
      }];
    });
  }


  getAllReports(): ReportData[] {
    return this.citizenReports.concat(this.employeeReports);
  }

  clearMessages(): void {
    this.msg = [];
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
  status: 'SENT' | 'REVIEWED' | 'PENDING' | 'SOLVED';
}


