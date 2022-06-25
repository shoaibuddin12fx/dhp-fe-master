import { ProductService } from './../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shop-header',
  templateUrl: './shop-header.component.html',
  styleUrls: ['./shop-header.component.scss'],
})
export class ShopHeaderComponent implements OnInit {
  shopType: any;
  searchSubscription: any;
  user: any;
  searchResults: any[] = [];
  searchValue = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {
    this.route.params.subscribe((params) => {
      if (params['type']) {
        this.shopType = params['type'];
      }
    });
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('User'));
  }

  searchText(e) {
    this.searchValue = e;
  }

  Search(type) {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    const value = type === 1 ? this.searchValue : '';
    this.searchSubscription = this.productService
      .Search(value, this.user.id.toString(), this.shopType)
      .subscribe((res: any) => {
        if (!res.data.success) {
          return;
        }
        this.searchResults = res.data.data;
        if (this.searchResults.length <= 0) {
        }
      });
  }
}
