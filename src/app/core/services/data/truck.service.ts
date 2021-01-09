import {Injectable} from '@angular/core';
import {Truck} from '../../models/truck.model';
import {Observable, ReplaySubject, timer} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ApiService} from './api.service';
import {shareReplay, switchMap, tap} from 'rxjs/operators';
import {TruckLocationsService} from './truck-locations.service';
import {EmployeeService} from './employee.service';

@Injectable({
  providedIn: 'root',
})
export class TruckService {
  private readonly PATH = '/vehicles';

  private truckData: Truck[] = [];
  private truckState: ReplaySubject<Truck[]> = new ReplaySubject<any>(1);

  constructor(private http: HttpClient, private apiService: ApiService, private truckLocationsService: TruckLocationsService,
              private employeeService: EmployeeService) {
    this.LoadData();
  }

  LoadData(): void {
    timer(0, 1000 * 60 * 15).pipe(switchMap(() => this.apiService.get(this.PATH))).subscribe(data => {
      this.truckState.next(data);
      this.truckData = data;
    });
  }

  getTrucks(): Observable<Truck[]> {
    return this.truckState.pipe(shareReplay({refCount: true, bufferSize: 1}), tap(x => {
    }));
  }

  getTruck(id): Truck {
    if (this.truckData.length > 0) {
      return this.truckData.find(truck => truck.id === id);
    }
    return null;
  }

  addTruck(truck: Truck): Observable<Truck> {
    return this.apiService.post(this.PATH, truck).pipe(tap(response => {
      this.truckData.push(response);
      this.truckState.next(this.truckData);
      this.truckLocationsService.setTruckLocations({truckId: response.id, location: {x: 31.901944822227613, y: 35.199795697527}});
    }));
  }

  updateTruck(id, truck: Truck): Observable<Truck> {
    return this.apiService.put(this.PATH + '/' + id, truck).pipe(tap(response => {
      const oldTruck = this.truckData.find(truck1 => truck1.id === response.id);
      const index = this.truckData.indexOf(oldTruck);
      this.truckData[index] = response;
      this.truckState.next(this.truckData);
    }));
  }

  deleteTruck(id): Observable<any> {
    return this.apiService.delete(this.PATH + '/' + id).pipe(tap(response => {
      this.truckData = this.truckData.filter(truck => truck.id !== id);
      this.truckState.next(this.truckData);
      this.truckLocationsService.deleteTruckLocation(id);
    }));
  }

  assignEmployee(truckId, employeeId): Observable<any> {
    console.log('assign');
    console.log(truckId);
    return this.apiService.get(this.PATH + '/' + truckId + '/assign-employee/' + employeeId).pipe(tap(response => {
      const index = this.truckData.indexOf(this.truckData.find(truck => truck.id === truckId));
      this.truckData[index].employees = [employeeId];
      this.truckData = this.truckData.filter(value => true);
      this.truckState.next(this.truckData);
      // this is a bad practice i had to to because the api is fucked up
      this.employeeService.refreshEmployees();
    }));
  }

  unassignEmployee(truckId, employeeId): Observable<any> {
    return this.apiService.get(this.PATH + '/' + truckId + '/unassign-employee/' + employeeId).pipe(tap(response => {
      const index = this.truckData.indexOf(this.truckData.find(truck => truck.id === truckId));
      this.truckData[index].employees = [];
      this.truckData = this.truckData.filter(value => true);
      this.truckState.next(this.truckData);
      // this is a bad practice i had to to because the api is fucked up
      this.employeeService.refreshEmployees();
    }));
  }
}
