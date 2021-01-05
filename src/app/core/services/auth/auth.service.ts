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


  // Verify JWT in localstorage with server & load user's info.
  // This runs once on application startup.
  populate(): void {
    // If JWT detected, attempt to get & store user's info
    if (this.jwtService.getToken()) {
      this.userService.getCurrentUser()
        .subscribe(
          data => this.setAuthAdmin(data.user),
          err => this.destroyToken()
        );
    } else {
      // Remove any potential remnants of previous auth states
      this.destroyToken();
    }
  }

  tryLogin(type, credentials): void {
    this.http.post(environment.apiDomain + '/login', JSON.stringify(credentials), {observe: 'response'}).subscribe(
      (resp: HttpResponse<any>) => {
        this.jwtService.setToken(resp.headers.get('Authorization'));
        this.userService.getCurrentUser().subscribe(response => {
          const user = response.body;
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
