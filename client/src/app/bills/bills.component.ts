import { ActivatedRoute } from '@angular/router';
import { BillService } from './../service/bill.service';
import { Component, OnInit } from '@angular/core';
import { AccountService } from '../service/account.service';
import { finalize, take } from 'rxjs';
import { User } from '../models/user';
import { AdminService } from '../service/admin.service';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.css']
})
export class BillsComponent implements OnInit {
  vnpay: string = "";
  bills: any = [];
  user!: User;
  billItem: any;
  vnp_TransactionStatus: string = "";
  private callBackUrl = "https://localhost:4200/bills";
  constructor(private adminService: AdminService, private accountService: AccountService, private billService: BillService, private route: ActivatedRoute) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user)
  }
  ngOnInit(): void {
    this.getBills();
    this.route.queryParamMap.subscribe(params => {
      this.vnp_TransactionStatus = params.get('vnp_TransactionStatus') || '';
    });
    console.log(this.vnp_TransactionStatus)
    const storedBillItem = window.localStorage.getItem('billItem');
    if (storedBillItem) {
      this.billItem = JSON.parse(storedBillItem);
      // Xóa giá trị của billItem từ LocalStorage sau khi đã lấy ra
      window.localStorage.removeItem('billItem');
    }
    this.createUserBill();
  }

  vnPay(bill: any) {
    this.billItem = bill;
    const billItemForCreateUserBill = { id: this.billItem.id, amount: this.billItem.amount };
    this.billItem.callBackUrl = this.callBackUrl;
    this.billService.VnPay(this.billItem).subscribe(res => {
      window.localStorage.setItem('billItem', JSON.stringify(billItemForCreateUserBill));
      window.location.href = res;
      window.onfocus = () => {
        window.location.reload();
        window.onfocus = null;
      };
    });
  }

  getBills() {
    this.billService.getbills().subscribe((res) => {
      this.bills = res;
      if (this.bills.length >= 2) {
        const button1 = document.querySelector('#bill-1 button');
        const button2 = document.querySelector('#bill-2 button');

        if (button1) {
          button1.setAttribute('data-id', this.bills[0].id);
          button1.setAttribute('data-amount', this.bills[0].amount);
        }
        if (button2) {
          button2.setAttribute('data-id', this.bills[1].id);
          button2.setAttribute('data-amount', this.bills[1].amount);
        }
      }
    });
  }

  handleButtonClick(event: Event) {
    const button = event.target as HTMLElement;
    const id = button.getAttribute('data-id');
    const amount = button.getAttribute('data-amount');

    if (id && amount) {
      const bill = { id: Number(id), amount: Number(amount) };
      this.vnPay(bill);
    }
  }

  createUserBill() {
    if (this.vnp_TransactionStatus == "00") {
      this.billItem.username = this.user.username;
      this.billService.createUserBill(this.billItem)
      .pipe(
        finalize(() => {
          this.updateRole()
        })
      )

      .subscribe();
    }
  }

  updateRole() {
    if (this.vnp_TransactionStatus == "00") {
      this.billItem.username = this.user.username;
      // this.adminService.updateUserRole(this.billItem).subscribe();
    }
  }
}
