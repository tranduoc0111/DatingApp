import { useAnimation } from '@angular/animations';
import { AccountService } from './../service/account.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private accountService: AccountService, private toastr: ToastrService) {

  }
  canActivate(): Observable<boolean> {
    return this.accountService.currentUser$.pipe(
      map((user):any => {
        if (user) return true;
        this.toastr.error('You shall not pass!')
      }),
    )
  }

}
