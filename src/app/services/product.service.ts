import { environment } from './../../environments/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getAllProducts() {
    return this.http.get(environment.serverUrl + `/products`).toPromise();
  }

  getRetailerProducts(shopId, data, pageData) {
    const searchable = {
      searchableData: data,
      pageData: pageData,
    };
    return this.http
      .post(
        environment.serverUrl + `/products/getRetailerProducts/${shopId}`,
        searchable
      )
      .toPromise();
  }

  getSKUByShopId(shopId) {
    return this.http
      .get(environment.serverUrl + `/products/get-shop-sku/${shopId}`)
      .toPromise();
  }

  getWholeSellerProducts(shopId, data, pageData) {
    const searchable = {
      searchableData: data,
      pageData: pageData,
    };
    return this.http
      .post(
        environment.serverUrl + `/products/getWholeSellerProducts/${shopId}`,
        searchable
      )
      .toPromise();
  }

  addProduct(data) {
    return this.http
      .post(environment.serverUrl + `/products`, data)
      .toPromise();
  }

  updateProduct(data, id) {
    return this.http
      .put(environment.serverUrl + `/products/${id}`, data)
      .toPromise();
  }

  getById(id) {
    return this.http
      .post(`${environment.serverUrl}/products/${id}`, '')
      .toPromise();
  }

  deleteProductById(id, type) {
    if (type === 1) {
      return this.http
        .delete(
          `${environment.serverUrl}/products/deleteProductDetailById/${id}`
        )
        .toPromise();
    } else {
      return this.http
        .delete(
          `${environment.serverUrl}/products/deleteProductDeteilDetailById/${id}`
        )
        .toPromise();
    }
  }
  getProductsByShop(limit, shopId) {
    const pageData = {
      limit: limit,
    };
    return this.http
      .post(
        `${environment.serverUrl}/products/getProductsByShop/${+shopId}`,
        pageData
      )
      .toPromise();
  }

  getHomeScreenCategoryProducts(limit, shopType, catIds?) {
    const pageData = {
      limit: limit,
    };
    const body = {
      pageData: pageData,
      catIds: catIds ? [catIds] : '',
    };
    return this.http
      .post(
        `${
          environment.serverUrl
        }/products/getHomeScreenCategoryProducts/${+shopType}`,
        body
      )
      .toPromise();
  }
  getfilterProducts(data, pageData) {
    const body = {
      pageData: pageData,
      data: data,
    };
    return this.http
      .post(`${environment.serverUrl}/products/filter-products/data`, body)
      .toPromise();
  }
  getHomeScreenCategoryProductsByCategory(limit, data) {
    return this.http
      .post(
        `${environment.serverUrl}/products/getHomeScreenCategoryProductsByCategory/${limit}`,
        data
      )
      .toPromise();
  }

  getRandomWholeSellerProducts(limit) {
    return this.http
      .post(
        `${environment.serverUrl}/products/getRandomWholeSellerProducts/${limit}`,
        ''
      )
      .toPromise();
  }

  getRandomWholeSellerProductsByCategory(limit, data) {
    return this.http
      .post(
        `${environment.serverUrl}/products/getRandomWholeSellerProductsByCategory/${limit}`,
        data
      )
      .toPromise();
  }

  Search(text, userId, shopType) {
    return this.http.post(
      `${environment.serverUrl}/products/search-products/data`,
      { text: text, userId: userId, type: shopType }
    );
  }
}
