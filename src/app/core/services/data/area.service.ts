import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ApiService} from './api.service';
import {shareReplay, tap} from 'rxjs/operators';
import {Area} from '../../models/area.model';
import {EmployeeService} from './employee.service';

@Injectable({
  providedIn: 'root',
})
export class AreaService {
  private readonly PATH = '/areas';

  private areaData: Area[] = [];
  private areaState: ReplaySubject<Area[]> = new ReplaySubject<any>(1);

  constructor(private http: HttpClient, private apiService: ApiService, private employeeService: EmployeeService) {
    this.LoadData();
  }

  LoadData(): void {
    this.apiService.get(this.PATH).subscribe(data => {
      this.areaState.next(data);
      this.areaData = data;
    });
  }

  getAreas(): Observable<Area[]> {
    return this.areaState.pipe(shareReplay({refCount: true, bufferSize: 1}));
  }

  getArea(id): Area {
    if (this.areaData.length > 0) {
      return this.areaData.find(area => area.id === id);
    }
    return null;
  }

  addArea(area: Area): Observable<Area> {
    return this.apiService.post(this.PATH, area).pipe(tap(response => {
      this.areaData.push(response);
      this.areaState.next(this.areaData);
    }));
  }

  updateArea(id, area: Area): Observable<Area> {
    return this.apiService.put(this.PATH + '/' + id, area).pipe(tap(response => {
      const oldArea = this.areaData.find(area1 => area1.id === response.id);
      const index = this.areaData.indexOf(oldArea);
      this.areaData[index] = response;
      this.areaState.next(this.areaData);
    }));
  }

  deleteArea(id): Observable<any> {
    return this.apiService.delete(this.PATH + '/' + id).pipe(tap(response => {
      this.areaData = this.areaData.filter(area => area.id !== id);
      this.areaState.next(this.areaData);
    }));
  }

  getEmployee(id): Observable<any> {
    return this.apiService.get(this.PATH + '/' + id + '/employees');
  }

  assignEmployee(areaId: number , employeeId: number): Observable<any> {
    return this.apiService.get(this.PATH + '/' + areaId + '/assign-employee/' + employeeId).pipe(tap(x => {
      // this is a bad practice i had to to because the api is fucked up
      this.employeeService.refreshEmployees();
    }));
  }

  unassignEmployee(areaId: number , employeeId: number ): Observable<any> {
    return this.apiService.get(this.PATH + '/' + areaId + '/unassign-employee/' + employeeId).pipe(tap(x => {
      // this is a bad practice i had to to because the api is fucked up
      this.employeeService.refreshEmployees();
    }));
  }
}
