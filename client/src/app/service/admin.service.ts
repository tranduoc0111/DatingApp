import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getUserWithRoles(){
    return this.http.get<Partial<User[]>>(this.baseUrl +'admin/users-with-roles');
  }

  updateUserRoles(username:any, roles:any){
    return this.http.post(this.baseUrl + 'admin/edit-roles/' + username+ '?roles=' + roles, {});
  }

  updateUserRole(bill: any) {
    return this.http.post<any>(this.baseUrl + 'admin/update-role', bill).pipe(map(data => {
      return data;
    }));
  }
}
