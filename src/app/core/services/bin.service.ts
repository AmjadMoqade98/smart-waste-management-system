import {Bin} from '../models/bin.model';
import {Observable, ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ApiService} from './api.service';
import {shareReplay, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';

@Injectable()
// @ts-ignore
export class BinService {
  private readonly PATH = '/bins' ;

  private BinData: Bin[] = [];
  private BinState: ReplaySubject<Bin[]> = new ReplaySubject<any>(1);
  private dataAvailable = false;

  constructor(private http: HttpClient, private apiService: ApiService) {
    if (!this.dataAvailable) {
      this.initData().subscribe(data => {
        this.BinData = data;
        this.BinState.next(data);
        this.dataAvailable = true;
      });
    }
  }

  initData(): Observable<any> {
    if (!this.dataAvailable) {
      return this.apiService.get(this.PATH);
    }
  }

  getBins(): Observable<Bin[]> {
    return this.BinState.pipe(shareReplay({refCount: true, bufferSize: 1}));
  }

  getBin(id){
    return new Observable((observer) => {
      if (this.dataAvailable) {
        observer.next(this.BinData.find(Bin => Bin.id === id));
      } else {
        this.initData().subscribe(data => {
          this.BinData = data;
          this.BinState.next(data);
          observer.next(this.BinData.find(Bin => Bin.id === id));
        });
      }
    });
  }

  addBin(Bin): Observable<Bin> {
    return this.apiService.post(this.PATH, Bin).pipe(tap(response => {
      this.BinData.push(response);
      this.BinState.next(this.BinData);
    }))
  }

  updateBin(id, bin): Observable<Bin> {
    return this.apiService.put(this.PATH + '/' + id, bin).pipe(tap(response => {
      const oldBin = this.BinData.find(bin => bin.id === response.id);
      const index = this.BinData.indexOf(oldBin);
      this.BinData[index] = response;
      this.BinState.next(this.BinData);
    }));
  }

  deleteBin(id): Observable<any>{
    return this.apiService.delete(this.PATH + "/" + id).pipe(tap(response => {
      this.BinData = this.BinData.filter(Bin => Bin.id != id);
      this.BinState.next(this.BinData);
    }));
  }
}
