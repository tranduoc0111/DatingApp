import { HttpClient } from '@angular/common/http';
import { Bills } from './../models/bill';
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class BillService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  VnPay(bill: Bills) {
    return this.http.post(this.baseUrl + "bill/createVnPay", bill, {responseType: 'text'});
  }
}
