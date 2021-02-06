import {Bin} from '../../models/bin.model';
import {interval, Observable, ReplaySubject, timer} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ApiService} from './api.service';
import {shareReplay, switchMap, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BinService {
  private readonly PATH = '/bins';

  private BinData: Bin[] = [];
  private BinState: ReplaySubject<Bin[]> = new ReplaySubject<any>(1);

  constructor(private http: HttpClient, private apiService: ApiService) {
    this.LoadData();
  }

  LoadData(): void {
    timer(0, 1000 * 60).pipe(switchMap(() => this.apiService.get(this.PATH))).subscribe(data => {
      this.BinState.next(data);
      this.BinData = data;
    });
  }

  getBins(): Observable<Bin[]> {
    return this.BinState.pipe(shareReplay({refCount: true, bufferSize: 1}));
  }

  getBin(id): Bin {
    if (this.BinData.length > 0) {
      return this.BinData.find(bin => bin.id === id);
    }
    return null;
  }

  addBin(bin: Bin): Observable<Bin> {
    return this.apiService.post(this.PATH, bin).pipe(tap(response => {
      this.BinData.push(response);
      this.BinState.next(this.BinData);
    }));
  }

  updateBin(id, bin: Bin): Observable<Bin> {
    return this.apiService.put(this.PATH + '/' + id, bin).pipe(tap(response => {
      const oldBin = this.BinData.find(bin1 => bin1.id === response.id);
      const index = this.BinData.indexOf(oldBin);
      this.BinData[index] = response;
      this.BinState.next(this.BinData);
    }));
  }

  deleteBin(id): Observable<any> {
    return this.apiService.delete(this.PATH + '/' + id).pipe(tap(response => {
      this.BinData = this.BinData.filter(bin => bin.id !== id);
      this.BinState.next(this.BinData);
    }));
  }
}
