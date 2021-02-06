import {Injectable} from '@angular/core';
import {Round} from '../../models/round.model';
import {Observable, ReplaySubject, timer} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ApiService} from './api.service';
import {shareReplay, switchMap, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RoundService {
  private readonly PATH = '/rounds';

  private roundData: Round[] = [];
  private roundState: ReplaySubject<Round[]> = new ReplaySubject<any>(1);

  constructor(private http: HttpClient, private apiService: ApiService) {
    this.LoadData();
  }

  LoadData(): void {
    this.apiService.get(this.PATH).subscribe(data => {
      this.roundState.next(data);
      this.roundData = data;
    });
  }

  getRounds(): Observable<Round[]> {
    return this.roundState.pipe(shareReplay({refCount: true, bufferSize: 1}));
  }

}
