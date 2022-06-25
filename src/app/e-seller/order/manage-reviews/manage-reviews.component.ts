import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ReviewsService } from 'src/app/services/reviews.service';

@Component({
  selector: 'app-manage-reviews',
  templateUrl: './manage-reviews.component.html',
  styleUrls: ['./manage-reviews.component.scss'],
})
export class ManageReviewsComponent implements OnInit {
  shopId: any;
  productReviews: any = [];
  shopReviews: any = [];
  prodRev = {
    prodName: '',
    rating: null,
  };
  ratingList = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
  constructor(
    private reviewService: ReviewsService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.shopId = this.route.snapshot.params['shopId'];
  }

  ngOnInit(): void {
    this.getProdReviews();
    this.getShopReviews();
  }
  getProdReviews() {
    const prodName = this.prodRev.prodName == '' ? null : this.prodRev.prodName;
    this.reviewService
      .getReviewsByShop(this.shopId, prodName, this.prodRev.rating)
      .then((x: any) => {
        this.productReviews = x.data;
      });
  }
  getShopReviews() {
    this.reviewService.getShopReviewsByShop(this.shopId).then((x: any) => {
      this.shopReviews = x.data;
    });
  }
}
