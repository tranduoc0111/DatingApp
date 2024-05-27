import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';

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

  updateUserRole(username:any){

  }
}
