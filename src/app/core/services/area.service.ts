import {Injectable} from '@angular/core';
import {Observable, ReplaySubject, timer} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ApiService} from './api.service';
import {shareReplay, switchMap, tap} from 'rxjs/operators';
import {Area} from '../models/Area.model';

@Injectable()
export class AreaService {
  private readonly PATH = '/areas';

  private AreaData: Area[] = [];
  private AreaState: ReplaySubject<Area[]> = new ReplaySubject<any>(1);

  constructor(private http: HttpClient, private apiService: ApiService) {
    this.LoadData();
  }

  LoadData(): void {
    this.apiService.get(this.PATH).subscribe(data => {
      this.AreaState.next(data);
      this.AreaData = data;
    });
  }

  getAreas(): Observable<Area[]> {
    return this.AreaState.pipe(shareReplay({refCount: true, bufferSize: 1}));
  }

  getArea(id): Area {
    if (this.AreaData.length > 0) {
      return this.AreaData.find(area => area.id === id);
    }
    return null;
  }

  addArea(area: Area): Observable<Area> {
    return this.apiService.post(this.PATH, area).pipe(tap(response => {
      this.AreaData.push(response);
      this.AreaState.next(this.AreaData);
    }));
  }

  updateArea(id, area: Area): Observable<Area> {
    return this.apiService.put(this.PATH + '/' + id, area).pipe(tap(response => {
      const oldArea = this.AreaData.find(area1 => area1.id === response.id);
      const index = this.AreaData.indexOf(oldArea);
      this.AreaData[index] = response;
      this.AreaState.next(this.AreaData);
    }));
  }

  deleteArea(id): Observable<any> {
    return this.apiService.delete(this.PATH + '/' + id).pipe(tap(response => {
      this.AreaData = this.AreaData.filter(area => area.id !== id);
      this.AreaState.next(this.AreaData);
    }));
  }
}
