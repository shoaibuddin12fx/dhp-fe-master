import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { FriendService } from 'src/app/services/friend.service';
import { ProductService } from 'src/app/services/product.service';
import { ReviewsService } from 'src/app/services/reviews.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit {
  user: any;
  friends: any[] = [];
  selectedFriends: '';
  reviewForm: FormGroup;
  sellerReviewForm: FormGroup;
  profilePhoto = '';
  coverPhoto = '';
  product: any = {};
  review: any = {};
  isFriendShow = true;
  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private productService: ProductService,
    private reviewService: ReviewsService,
    private authService: AuthService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ReviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  async ngOnInit() {
    this.user = this.authService.getUser();
    if (this.data.reviewId) {
      this.isFriendShow = false;
      // const res: any = await this.reviewService.getById(this.data.reviewId);
      // if (res) {
      //   this.review = res.data;
      //   this.profilePhoto = this.review.profilePhoto;
      //   this.coverPhoto = this.review.coverPhoto;
      // }
    }
    this.getProductByID();
    this.createForm();
  }
  getProductByID() {
    this.productService.getById(this.data.productId).then((x: any) => {
      this.product = x.data;
      this.createForm();
      this.createSellerReviewForm();
    });
  }
  createForm() {
    this.reviewForm = this.fb.group({
      id: [this.review ? this.review.id : 0],
      title: [this.review ? this.review.title : null],
      description: [this.review ? this.review.description : null],
      shopId: [null],
      userId: [this.authService.getUser().id],
      type: [1],
      productId: [this.data.productId],
      rating: [this.review ? this.review.rating : null],
    });
  }

  createSellerReviewForm() {
    this.sellerReviewForm = this.fb.group({
      id: [this.review ? this.review.id : 0],
      title: [this.review ? this.review.title : null],
      description: [this.review ? this.review.description : null],
      shopId: [this.product.shop.id],
      userId: [this.authService.getUser().id],
      type: [2],
      productId: [null],
      rating: [this.review ? this.review.rating : null],
    });
  }

  async save(isProduct = true) {
    if (isProduct ? this.reviewForm.valid : this.sellerReviewForm.valid) {
      try {
        if (
          isProduct ? this.reviewForm.value : this.sellerReviewForm.value <= 0
        ) {
          const res = await this.reviewService.saveReviews(
            isProduct ? this.reviewForm.value : this.sellerReviewForm.value
          );
          this.toastr.success('Created Successfully');
        } else {
          const res = await this.reviewService.saveReviews(
            isProduct ? this.reviewForm.value : this.sellerReviewForm.value
          );
          this.toastr.success('Updated Successfully');
        }
        this.dialogRef.close('saved');
      } catch (error) {
        this.toastr.error(error.error.meta.message);
      }
    }
  }
}
