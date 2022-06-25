import { environment } from './../../environments/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  url: string = `${environment.serverUrl}/shippingAndBilling`;
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get(`${this.url}`).toPromise();
  }

  getByCustomerId(customerId) {
    return this.http
      .get(`${this.url}/getByCustomerId/${customerId}`)
      .toPromise();
  }

  saveShippingAndBilling(data) {
    return this.http.post(`${this.url}`, data).toPromise();
  }
}
