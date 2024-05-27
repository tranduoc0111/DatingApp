import { HttpClient } from '@angular/common/http';
import { Bills } from '../models/bills';
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  VnPay(bill: Bills) {
    return this.http.post(this.baseUrl + "bill/createVnPay", bill, { responseType: 'text' });
  }

  getbills() {
    return this.http.get(this.baseUrl + 'bill/get-bills');
  }
  createUserBill(bill: any) {
    return this.http.post<any>(this.baseUrl + 'bill/create-userbill',bill ).pipe(map(data=>{
      return data;
    }));
  }

  getUserBill(bill: any)
  {
    return this.http.get(this.baseUrl + 'bill', bill);
  }
}
