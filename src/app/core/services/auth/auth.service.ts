import {Injectable} from '@angular/core';
import {BehaviorSubject, ReplaySubject} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';
import {JwtService} from './jwt.service';
import {ApiService} from '../data/api.service';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {User} from '../../models/user.model';
import {UserService} from '../data/user.service';
import {environment} from '../../../../environments/environment';

@Injectable()
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAdminSubject = new ReplaySubject<boolean>(1);
  public isAdmin = this.isAdminSubject.asObservable();

  constructor(private jwtService: JwtService, private apiService: ApiService,
              private http: HttpClient, private userService: UserService) {
  }

  setAuthAdmin(user: User): void {
    this.currentUserSubject.next(user);
    this.isAdminSubject.next(true);
    this.jwtService.setToken(user.token);
  }

  destroyToken(): void {
    this.jwtService.destroyToken();
    this.currentUserSubject.next({} as User);
    this.isAdminSubject.next(false);
  }


  populate(): void {
    if (this.jwtService.getToken()) {
      console.log(this.jwtService.getToken());
      this.userService.getCurrentUser().subscribe(
        data => {
          data.token = this.jwtService.getToken();
          this.setAuthAdmin(data);
        },
        err => this.destroyToken()
      );
    } else {
      this.destroyToken();
    }
  }

  tryLogin(credentials): void {
    this.http.post(environment.apiDomain + '/login', JSON.stringify(credentials), {observe: 'response'}).subscribe(
      (resp: HttpResponse<any>) => {
        this.jwtService.setToken(resp.headers.get('Authorization'));
        this.userService.getCurrentUser().subscribe(response => {
          const user = response;
          user.token = resp.headers.get('Authorization');
          this.setAuthAdmin(user);
        });
        return resp;
      }
    );
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }
}
