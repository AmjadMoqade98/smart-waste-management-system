import {Injectable} from '@angular/core';
import {Report} from '../../models/report.model';
import {Observable, ReplaySubject, timer} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ApiService} from './api.service';
import {shareReplay, switchMap, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private readonly PATH = '/reports';

  private reportData: Report[] = [];
  private reportState: ReplaySubject<Report[]> = new ReplaySubject<any>(1);

  constructor(private http: HttpClient, private apiService: ApiService) {
    this.LoadData();
  }

  LoadData(): void {
   this.apiService.get(this.PATH).subscribe(data => {
      this.reportState.next(data);
      this.reportData = data;
    });
  }

  getReports(): Observable<Report[]> {
    return this.reportState.pipe(shareReplay({refCount: true, bufferSize: 1}));
  }

  getReport(id): Report {
    if (this.reportData.length > 0) {
      return this.reportData.find(report => report.id === id);
    }
    return null;
  }

  addReport(report: Report): Observable<Report> {
    return this.apiService.post(this.PATH, report).pipe(tap(response => {
      this.reportData.push(response);
      this.reportState.next(this.reportData);
    }));
  }

  updateReport(id, status: string): Observable<Report> {
    return this.apiService.put(this.PATH + '?id=' + id + '&status=' + status).pipe(tap(response => {
      const oldreport = this.reportData.find(report1 => report1.id === response.id);
      const index = this.reportData.indexOf(oldreport);

      // ToDo: fix this to the proper way when the api get fixed
      this.reportData[index].status = 'SOLVED';
      this.reportState.next(this.reportData);
    }));
  }

  deleteReport(id): Observable<any> {
    return this.apiService.delete(this.PATH + '/' + id).pipe(tap(response => {
      this.reportData = this.reportData.filter(report => report.id !== id);
      this.reportState.next(this.reportData);
    }));
  }
}
