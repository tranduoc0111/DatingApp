import { Router } from '@angular/router';
import { AccountService } from './../service/account.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  constructor(
    public accountService: AccountService,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
  }

  login() {
    this.accountService.login(this.model).subscribe(res => {
      this.router.navigateByUrl('/members')
    })
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/')
  }

  routerLink(param: string) {
    const user = localStorage.getItem('user');

    if (user) {
      this.router.navigateByUrl(param);
    } else {
      this.router.navigateByUrl("/login");
    }
  }
}
