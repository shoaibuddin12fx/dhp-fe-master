import { environment } from './../../environments/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  public cartDataCount$: BehaviorSubject<number> = new BehaviorSubject(0);
  constructor(private http: HttpClient) {}
  getAllCart() {
    return this.http.get(environment.serverUrl + `/cart `).toPromise();
  }
  getCartByUser(id: number) {
    return this.http
      .get(environment.serverUrl + `/cart/get-cart-by-user/` + id)
      .toPromise();
  }

  getWholesaleCartByUser(id: number) {
    return this.http
      .get(environment.serverUrl + `/wholesaleCart/get-cart-by-user/` + id)
      .toPromise();
  }

  getCartCountByUser(id: number) {
    return this.http
      .get(environment.serverUrl + `/cart/get-cart-count-by-user/` + id)
      .toPromise();
  }

  getWholesaleCartCountByUser(id: number) {
    return this.http
      .get(
        environment.serverUrl + `/wholesaleCart/get-cart-count-by-user/` + id
      )
      .toPromise();
  }

  updateQuantity(id: number, quantity: number) {
    return this.http
      .get(environment.serverUrl + `/cart/update-quantity/${id}/${quantity}`)
      .toPromise();
  }

  updateWholesaleCartDetailQuantity(id: number, quantity: number) {
    return this.http
      .get(
        environment.serverUrl +
          `/wholesaleCart/update-quantity/${id}/${quantity}`
      )
      .toPromise();
  }

  saveCart(data) {
    return this.http.post(environment.serverUrl + `/cart `, data).toPromise();
  }

  saveWholesaleCart(data) {
    return this.http
      .post(environment.serverUrl + `/wholesaleCart `, data)
      .toPromise();
  }
  delete(data) {
    return this.http
      .delete(environment.serverUrl + `/cart/${data}`)
      .toPromise();
  }

  deleteWholesaleCart(data) {
    return this.http
      .delete(environment.serverUrl + `/wholesaleCart/${data}`)
      .toPromise();
  }

  setCartDataCount(event) {
    this.cartDataCount$.next(event);
  }

  getCartDataCount(): Observable<any> {
    return this.cartDataCount$.asObservable();
  }
}
