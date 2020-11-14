import {Injectable} from '@angular/core';

@Injectable()
export  class JwtService {

  getToken(): string {
    return  window.localStorage['jwtToken'];
  }

  setToken(token: string): void {
    window.localStorage['jwtToken'] = token ;
  }

  destroyToken(): void{
    window.localStorage.removeItem('jwtToken');
  }
}
