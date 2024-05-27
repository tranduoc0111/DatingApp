import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../service/account.service';
import { Router } from '@angular/router';
import { RegisterDto } from '../models/service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  type1: string = 'password';
  type2: string = 'password';
  isText1: boolean = false;
  isText2: boolean = false;
  eyeIcon1: string = "fa-eye-slash";
  eyeIcon2: string = "fa-eye-slash";
  form!: FormGroup;
  maxDate!: Date;
  validationErrors: string[] = [];

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private accountService: AccountService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    this.form = this.fb.group({
      username: ['', Validators.required],
      knowAs: ['', [
        Validators.required
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
      ]],
      comfirmPassword: ['', [
        Validators.required,
        Validators.minLength(6),
      ]],
      dateOfBirth: ['', Validators.required],
      gender: ['male'],
      city: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.form.value.password !== this.form.value.comfirmPassword) {
        this.toast.info('Không trùng khớp mật khẩu');
        return;
      }

      const body = Object.assign(new RegisterDto(), this.form.value);

      this.accountService.register(body).subscribe({
        next: () => {
          this.router.navigateByUrl('/members');
        },
        error: (err) => {
          this.validationErrors = err;
        }
      });
    } else {
      this.toast.error('Có lỗi xảy ra, vui lòng kiểm tra lại thông tin');
    }
  }

  togglePasswordVisibility(isText: boolean, eyeIcon: string, type: string) {
    isText = !isText;
    eyeIcon = isText ? "fa-eye" : "fa-eye-slash";
    type = isText ? 'text' : 'password';
  }

  hideShowPass() {
    this.isText1 = !this.isText1;
    this.eyeIcon1 = this.isText1 ? "fa-eye" : "fa-eye-slash";
    this.type1 = this.isText1 ? 'text' : 'password';
  }

  hideShowRePass() {
    this.isText2 = !this.isText2;
    this.eyeIcon2 = this.isText2 ? "fa-eye" : "fa-eye-slash";
    this.type2 = this.isText2 ? 'text' : 'password';
  }
}
