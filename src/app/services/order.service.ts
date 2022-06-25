import { environment } from './../../environments/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}
  getAllOrders(data, pageData, shopId) {
    const body = {
      searchableData: data,
      pageData: pageData,
    };
    return this.http
      .post(environment.serverUrl + `/orders/getAll/${shopId}`, body)
      .toPromise();
  }
  getAllOrdersByUser(data) {
    const body = {
      searchableData: data,
    };
    return this.http
      .post(environment.serverUrl + `/orders/get-orders-by-user`, body)
      .toPromise();
  }
  getAllOrderById(id) {
    return this.http.get(environment.serverUrl + `/orders/${id} `).toPromise();
  }

  getByOrderNumber(orderNumber, customerId, shopId) {
    const data = {
      customerId: customerId,
      shopId: shopId,
    };
    return this.http
      .post(
        environment.serverUrl + `/orders/getByOrderNumber/${orderNumber}`,
        data
      )
      .toPromise();
  }

  saveorder(data) {
    return this.http.post(environment.serverUrl + `/orders `, data).toPromise();
  }
  cancelOrder(data) {
    return this.http
      .post(environment.serverUrl + `/orders/cancel-order `, data)
      .toPromise();
  }

  changeOrderStatus(data) {
    return this.http
      .post(environment.serverUrl + `/orders/change-order-status `, data)
      .toPromise();
  }
  updateorder(data, id) {
    return this.http
      .put(environment.serverUrl + `/orders/${id} `, data)
      .toPromise();
  }
  delete(id) {
    return this.http
      .delete(environment.serverUrl + `/orders/${id}`)
      .toPromise();
  }
}
