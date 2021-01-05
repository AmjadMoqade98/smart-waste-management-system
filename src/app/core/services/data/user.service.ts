import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiService} from './api.service';

@Injectable()
export class UserService {
  private readonly PATH = '/user';

  constructor(private apiService: ApiService) {
  }
  getCurrentUser(): Observable<any> {
    return this.apiService.get(this.PATH);
  }
}
