import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {JwtService} from '../services/jwt.service';
import {ApiService} from '../services/api.service';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/user.model';

@Injectable()
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAdminSubject = new ReplaySubject<boolean>(1);
  public isAdmin = this.isAdminSubject.asObservable();

  constructor(private jwtService: JwtService, private apiService: ApiService, private http: HttpClient) {
  }


  setAuthAdmin(user: User): void {
    this.jwtService.setToken(user.token);
    this.currentUserSubject.next(user);
    this.isAdminSubject.next(true);
  }

  destroyToken(): void {
    this.jwtService.destroyToken();
    this.currentUserSubject.next({} as User);
    this.isAdminSubject.next(false);
  }

  tryLogin(type, credentials): Observable<any> {
    console.log(credentials);
    console.log(type);
    return;
    const route = (type === 'login') ? '/login' : '';
    return this.apiService.post('/login' + route, {user: credentials})
      .pipe(map(
        data => {
          if (data.user.role === 'admin') {
            this.setAuthAdmin(data.user);
          }
          return data;
        }
      ));
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }
}
