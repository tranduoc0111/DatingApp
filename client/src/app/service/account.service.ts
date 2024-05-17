import { User } from './../models/user';
import { HttpClient } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, ReplaySubject, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  static userInfo: User;
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private presence: PresenceService) {
  }

  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((res: User) => {
        const user = res;
        if (user) {
          this.setCurrentUser(user);
          this.presence.createHubConnection(user);
        }
        AccountService.userInfo = Object.assign({}, user);
        return user;
      })
    )
  }

  register(model: any){
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map((user: User) =>{
        if(user){
          this.setCurrentUser(user);
          this.presence.createHubConnection(user);
        }
        return user;
      })
    )
  }

  setCurrentUser(user: User) {
    user.roles =[];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  getCurrentUser(): Observable<User | null> {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user: User = JSON.parse(userString);
      return of(user);
    } else {
      return of(null);
    }
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null!);
    this.presence.stopHubConenction();
  }

  getDecodedToken(token:any)
  {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
