import {Injectable} from '@angular/core';
import {Citizen} from '../../models/citizen.model';
import {Observable, ReplaySubject, timer} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ApiService} from './api.service';
import {shareReplay, switchMap, tap} from 'rxjs/operators';
// tslint:disable-next-line:no-shadowed-variable

@Injectable({
  providedIn: 'root',
})
export class CitizenService {
  private readonly PATH = '/citizens';

  private citizenData: Citizen[] = [];
  private citizenState: ReplaySubject<Citizen[]> = new ReplaySubject<any>(1);

  constructor(private http: HttpClient, private apiService: ApiService) {
    this.LoadData();
  }

  LoadData(): void {
    timer(0, 1000 * 60 * 15).pipe(switchMap(() => this.apiService.get(this.PATH))).subscribe(data => {
      this.citizenState.next(data);
      this.citizenData = data;
    });
  }

  getCitizens(): Observable<Citizen[]> {
    return this.citizenState.pipe(shareReplay({refCount: true, bufferSize: 1}));
  }

  getCitizen(id): Citizen {
    if (this.citizenData.length > 0) {
      return this.citizenData.find(citizen => citizen.id === id);
    }
    return null;
  }

  addCitizen(citizen: Citizen): Observable<Citizen> {
    return this.apiService.post(this.PATH, citizen).pipe(tap(response => {
      this.citizenData.push(response);
      this.citizenState.next(this.citizenData);
    }));
  }

  updateCitizen(id, citizen: Citizen): Observable<Citizen> {
    return this.apiService.put(this.PATH + '/' + id, citizen).pipe(tap(response => {
      const oldcitizen = this.citizenData.find(citizen1 => citizen1.id === response.id);
      const index = this.citizenData.indexOf(oldcitizen);
      this.citizenData[index] = response;
      this.citizenState.next(this.citizenData);
    }));
  }

  deleteCitizen(id): Observable<any> {
    return this.apiService.delete(this.PATH + '/' + id).pipe(tap(response => {
      this.citizenData = this.citizenData.filter(citizen => citizen.id !== id);
      this.citizenState.next(this.citizenData);
    }));
  }
}
