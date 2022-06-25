import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartStoreService {
  private selectedProductList$: BehaviorSubject<[]> = new BehaviorSubject([]);
  private voucher$: BehaviorSubject<any> = new BehaviorSubject('');

  // selectedProductList: any[] = [];
  constructor() {}

  setSelectedProductList(value: any) {
    this.selectedProductList$.next(value);
  }

  getSelectedProductList() {
    return this.selectedProductList$.asObservable();
  }

  setVoucher(value: any) {
    this.voucher$.next(value);
  }

  getVoucher() {
    return this.voucher$.asObservable();
  }
}
