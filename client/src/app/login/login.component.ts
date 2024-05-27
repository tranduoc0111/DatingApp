import { Component, OnInit } from '@angular/core';
import { AccountService } from '../service/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  model: any = {};

  constructor(
    public accountService: AccountService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = 'text' : this.type = 'password';
  }

  login() {
    console.log(this.model);
    this.accountService.login(this.model).subscribe(() => {
      this.router.navigateByUrl('/members')
    })
  }

}
