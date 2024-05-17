import { ActivatedRoute } from '@angular/router';
import { Bills } from './../models/bill';
import { BillService } from './../service/bill.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bills',
  standalone: true,
  imports: [],
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.css']
})
export class BillsComponent implements OnInit {
  vnpay: string = "";
  constructor(private billService: BillService) { }
  bill: Bills = {
    id: 1,
    amount: 150000,
    callBackUrl: "https://localhost:4200/members"
  }
  ngOnInit(): void {
  }

  vnPay() {
    this.billService.VnPay(this.bill).subscribe(res=>{
      window.location.href = res;
    });
  }
}
