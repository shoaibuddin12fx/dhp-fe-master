import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  url: string = `${environment.serverUrl}/shop`;
  constructor(private http: HttpClient) {}

  addShopData(data) {
    return this.http.post(`${this.url}/`, data).toPromise();
  }
  updateShopData(id, data) {
    return this.http.put(`${this.url}/${id}`, data).toPromise();
  }

  updateBankData(data) {
    return this.http.post(`${this.url}/bank-account`, data).toPromise();
  }
  updateWarehouseData(data) {
    return this.http.post(`${this.url}/warehouse`, data).toPromise();
  }
  updateBusinessInfoData(data) {
    return this.http.post(`${this.url}/business-info`, data).toPromise();
  }

  updateVoucherData(data) {
    return this.http.post(`${this.url}/vouchers`, data).toPromise();
  }
  getVoucherById(id) {
    return this.http.get(`${this.url}/vouchers-by-id/${id}`).toPromise();
  }

  getVouchersByUserIdShopId(shopId: number, userId: number, data, pageData) {
    const searchable = {
      searchableData: data,
      pageData: pageData,
    };
    return this.http
      .post(`${this.url}/vouchers/${userId}/${shopId}`, searchable)
      .toPromise();
  }
  getAllShop() {
    return this.http.get(`${this.url}`).toPromise();
  }

  getbankAccByUserIdShopId(shopId: number, userId: number) {
    return this.http
      .get(`${this.url}/bank-account/${userId}/${shopId}`)
      .toPromise();
  }
  getwarehouseByUserIdShopId(shopId: number, userId: number) {
    return this.http
      .get(`${this.url}/warehouse/${userId}/${shopId}`)
      .toPromise();
  }
  getBussinessInfoByUserIdShopId(shopId: number, userId: number) {
    return this.http
      .get(`${this.url}/business-info/${userId}/${shopId}`)
      .toPromise();
  }

  getById(id) {
    return this.http.get(`${this.url}/${id}`).toPromise();
  }

  getShopByUserId(id) {
    return this.http.get(`${this.url}/getByUserId/${id}`).toPromise();
  }

  deleteGroupData(id) {
    return this.http.delete(`${this.url}/${id}`).toPromise();
  }
  deleteVoucher(id) {
    return this.http.delete(`${this.url}/delete/${id}`).toPromise();
  }
}
