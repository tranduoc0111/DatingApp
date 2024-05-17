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
  currentUser: any = {};
  checkRole: boolean = false;

  constructor(public accountService: AccountService, private router: Router,
    private toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.accountService.getCurrentUser().subscribe(res => {
      if (res) {
        this.checkRole = res.roles.find(e=>e == "Member") ? true : false;
      } else {
        console.log('Không có người dùng hiện tại');
      }
    });
  }

  login() {
    this.accountService.login(this.model).subscribe(res =>{
    this.router.navigateByUrl('/members')
    this.checkRole = res.roles.find(e=>e == "Member") ? true : false;
    } )
  }

  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/')
  }
}
