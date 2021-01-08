import {Injectable} from '@angular/core';
import {Truck} from '../../models/truck.model';
import {Observable, ReplaySubject, timer} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ApiService} from './api.service';
import {shareReplay, switchMap, tap} from 'rxjs/operators';

@Injectable()
export class TruckService {
  private readonly PATH = '/vehicles';

  private truckData: Truck[] = [];
  private truckState: ReplaySubject<Truck[]> = new ReplaySubject<any>(1);

  constructor(private http: HttpClient, private apiService: ApiService) {
    this.LoadData();
  }

  LoadData(): void {
    timer(0, 1000 * 60 * 15).pipe(switchMap(() => this.apiService.get(this.PATH))).subscribe(data => {
      this.truckState.next(data);
      this.truckData = data;
    });
  }

  getTrucks(): Observable<Truck[]> {
    return this.truckState.pipe(shareReplay({refCount: true, bufferSize: 1}));
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
    }));
  }

  assignEmployee(truckId, employeeId): Observable<any> {
    return this.apiService.get(this.PATH + '/' + truckId + '/assignEmployee/' + employeeId).pipe(tap(response => {
      this.truckData.find(truck => truck.id !== truckId).employees = [employeeId];
      this.truckState.next(this.truckData);
    }));
  }
}
