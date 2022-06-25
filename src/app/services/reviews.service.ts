import { environment } from './../../environments/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  constructor(private http: HttpClient) {}
  getAllReviews() {
    return this.http.get(environment.serverUrl + `/reviews `).toPromise();
  }
  getReviewsByUser(id: number) {
    return this.http
      .get(environment.serverUrl + `/reviews/get-review-by-user/` + id)
      .toPromise();
  }
  getReviewsByProduct(id: number) {
    return this.http
      .get(environment.serverUrl + `/reviews/get-review-by-product/` + id)
      .toPromise();
  }
  getReviewsByShop(id: number, prodName: string, rating: number) {
    return this.http
      .get(
        environment.serverUrl +
          `/reviews/get-review-by-shop/${id}/${prodName}/` +
          rating
      )
      .toPromise();
  }
  getShopReviewsByShop(id: number) {
    return this.http
      .get(environment.serverUrl + `/reviews/get-shop-review-by-shop/${id}`)
      .toPromise();
  }

  updateQuantity(id: number, quantity: number) {
    return this.http
      .get(environment.serverUrl + `/reviews/update-quantity/${id}/${quantity}`)
      .toPromise();
  }

  saveReviews(data) {
    return this.http
      .post(environment.serverUrl + `/reviews `, data)
      .toPromise();
  }
  delete(data) {
    return this.http
      .delete(environment.serverUrl + `/reviews/${data}`)
      .toPromise();
  }
}
