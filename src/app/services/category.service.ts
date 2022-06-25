import { environment } from './../../environments/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  getAllCategory() {
    return this.http.get(environment.serverUrl + `/mainCategory `).toPromise();
  }
  getCategory() {
    return this.http
      .get(environment.serverUrl + `/mainCategory/get-category/1`)
      .toPromise();
  }

  getAllProductCategory() {
    return this.http
      .get(environment.serverUrl + `/productCategory `)
      .toPromise();
  }

  getProductCategoryByParentId(parentId) {
    return this.http
      .get(environment.serverUrl + `/productCategory/${parentId}`)
      .toPromise();
  }

  getAllProductSubCategory() {
    return this.http
      .get(environment.serverUrl + `/productSubCategory `)
      .toPromise();
  }
  getProductSubCategoryByParentId(parentId) {
    return this.http
      .get(environment.serverUrl + `/productSubCategory/${parentId}`)
      .toPromise();
  }
  getSubCategoryByMainCat(parentId) {
    return this.http
      .get(environment.serverUrl + `/mainCategory/get-sub-category/${parentId}`)
      .toPromise();
  }
}
