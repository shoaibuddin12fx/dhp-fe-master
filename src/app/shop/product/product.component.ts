import { filter } from 'rxjs/operators';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShareGroupComponent } from 'src/app/social/popup/activity-box/share-group/share-group.component';
import { TimelineShareComponent } from 'src/app/social/popup/activity-box/timeline-share/timeline-share.component';
import { ImageViewComponent } from '../popup/product/image-view/image-view.component';
import { LoaderService } from 'src/app/services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { ReviewsService } from 'src/app/services/reviews.service';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  productId: any = null;
  productData: any;
  selectedSize: any = null;
  colorArr: any[] = [];
  sizeArr: any[] = [];
  reviews: any[] = [];
  reviewSummary: any[] = [];
  selectedColor: any = null;
  selectedQuantity = 0;
  selectedSkuData: any;
  shopType: any;
  avgStar = 0;
  cart = {
    quantity: 1,
  };
  selectedSkuDetailData: any[] = [];
  wholesaleCart = {
    shopId: 0,
    productId: 0,
    userId: 0,
    wholesaleCartDetails: [],
  };
  cartArr: any[] = [];
  isCartEdit = false;
  avgStarRatSumary = [];
  hideDescription = false;
  constructor(
    public Dialog: MatDialog,
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private reviewService: ReviewsService,
    private authService: AuthService,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.shopType = this.route.snapshot.params['type'];
    this.productId = this.route.snapshot.params['id'];
    if (this.productId) {
      this.getProductById(this.productId);
    }
  }

  async getProductById(id) {
    this.loaderService.PresentLoading();
    try {
      const res: any = await this.productService.getById(id);
      if (res.data) {
        this.productData = res.data;
        this.wholesaleCart.shopId = this.productData.shopId;
        this.colorArr = [
          ...new Set(this.productData.productDetails.map((x) => x.color)),
        ];
        this.getSelectedColorAndSize();
        console.log(this.productData);
        this.loaderService.DissmissLoading();
      }
    } catch (error) {
      this.toastr.error('Something went wrong');
      this.loaderService.DissmissLoading();
    }
  }

  ngOnInit(): void {
    this.wholesaleCart = {
      shopId: 0,
      productId: this.productId,
      userId: this.authService.getUser().id,
      wholesaleCartDetails: [],
    };
    this.getCustomerReviews();
  }

  sharePostDialog() {
    const DialogRef = this.Dialog.open(ShareGroupComponent, {
      width: '35%',
      height: '50vh',
      disableClose: true,
      data: {},
    });
  }
  timelineShareDialog() {
    const DialogRef = this.Dialog.open(TimelineShareComponent, {
      width: '35%',
      height: '90vh',
      disableClose: true,
      data: {},
    });
  }
  openGalleryDialog() {
    const DialogRef = this.Dialog.open(ImageViewComponent, {
      width: '35%',
      height: '65vh',
      disableClose: true,
      data: {},
    });
  }

  getSelectedColorAndSize() {
    this.selectedSize = null;
    this.selectedColor = this.colorArr[0];
    this.sizeArr = [
      ...new Set(
        this.productData.productDetails
          .map((x) => {
            if (x.color === this.selectedColor) {
              return x.size;
            }
          })
          .filter((y) => y)
      ),
    ];
    this.selectedSize = this.sizeArr[0];
    if (this.shopType == 1) {
      this.getRetailSkuData();
    } else {
      this.getWholeSaleSkuData();
    }
  }

  selectColorAndSize(event?: EventTarget, type?) {
    if (type === 'color') {
      this.selectedColor = event ? event : this.colorArr[0];
      this.sizeArr = [];
      this.sizeArr = [
        ...new Set(
          this.productData.productDetails
            .map((x) => {
              if (x.color === this.selectedColor) {
                return x.size;
              }
            })
            .filter((y) => y)
        ),
      ];
      this.selectedSize = this.sizeArr[0];
    } else {
      this.selectedSize = event ? event : this.sizeArr[0];
    }
    if (this.shopType == 1) {
      this.getRetailSkuData();
    } else {
      this.getWholeSaleSkuData();
    }
  }

  getRetailSkuData() {
    this.selectedSkuData = this.productData.productDetails.find((x) => {
      if (this.selectedSize) {
        if (x.color === this.selectedColor && x.size === this.selectedSize) {
          return x;
        }
      } else {
        if (x.color === this.selectedColor) {
          return x;
        }
      }
    });
  }
  getWholeSaleSkuData() {
    const selectedSkuData = this.productData.productDetails.find(
      (x) => {
        if (this.selectedSize) {
          if (x.color === this.selectedColor && x.size === this.selectedSize) {
            return x;
          }
        } else {
          if (x.color === this.selectedColor) {
            return x;
          }
        }
      }
      // x.color === this.selectedColor && x.size === this.selectedSize
    );
    if (selectedSkuData) {
      this.selectedSkuDetailData = selectedSkuData.productDetailDetails.sort(
        (a, b) => b.price - a.price
      );
    } else {
      this.toastr.error(
        `No product found for color: ${this.selectedColor} and size: ${this.selectedSize}`
      );
    }
  }

  getColor(id, color) {
    document.getElementById(id).style.backgroundColor = color;
  }
  async addToCart() {
    const prodDet = this.productData.productDetails.find((x) => {
      if (this.selectedSize) {
        if (x.color === this.selectedColor && x.size === this.selectedSize) {
          return x;
        }
      } else {
        if (x.color === this.selectedColor) {
          return x;
        }
      }
    });
    // x.color == this.selectedColor && x.size == this.selectedSize
    const obj = {
      quantity: this.cart.quantity,
      id: 0,
      productId: this.productId,
      shopId: this.productData.shopId,
      productDetailId: prodDet.id,
      userId: this.authService.getUser().id,
      price: +this.cart.quantity * +prodDet.price,
      size: this.selectedSize,
      color: this.selectedColor,
    };
    const res: any = await this.cartService.saveCart(obj);
    if (res.data) {
      const data: any = await this.cartService.getCartCountByUser(
        this.authService.getUser().id
      );
      this.cartService.setCartDataCount(data.data.count);
    }
  }
  getCustomerReviews() {
    this.reviewService.getReviewsByProduct(this.productId).then((res: any) => {
      this.reviews = res.data;
      this.reviewSummary = Object.values(
        res.data.reduce((c, { rating }) => {
          c[rating] = c[rating] || { rate: +rating, value: 0, color: '' };
          c[rating].value++;
          return c;
        }, {})
      );
      this.CalculateStarAvg();
    });
  }
  CalculateStarAvg() {
    debugger;
    let oneStar = this.getRatingCount(1);
    let twoStar = this.getRatingCount(2);
    let threeStar = this.getRatingCount(3);
    let fourStar = this.getRatingCount(4);
    let fiveStar = this.getRatingCount(5);
    let oneTotal = oneStar * 1;
    let twoTotal = twoStar * 2;
    let threeTotal = threeStar * 3;
    let fourTotal = fourStar * 4;
    let fiveTotal = fiveStar * 5;
    let totalClicks = oneStar + twoStar + threeStar + fourStar + fiveStar;
    let totalStars = oneTotal + twoTotal + threeTotal + fourTotal + fiveTotal;
    this.avgStar = Math.round((totalStars / totalClicks) * 10) / 10;
    if (Number.isNaN(this.avgStar)) {
      this.avgStar = 0;
    }
    let strRating = this.avgStar;

    let arr = [];

    for (let index = 0; index < 5; index++) {
      if (strRating > 0 && strRating < 1) {
        strRating = 0;
        arr.push(0.5);
      } else if (strRating == 0) {
        arr.push(0);
      } else {
        strRating = strRating - 1;
        arr.push(1);
      }
    }
    this.avgStarRatSumary = arr;
  }
  getRatingCount(item) {
    const res = this.reviewSummary.find((x) => x.rate == item);
    if (res) {
      return res.value;
    } else {
      return 0;
    }
  }
  validateQuantity() {
    if (this.cart.quantity <= 1) {
      this.cart.quantity = 1;
    }
  }

  getReviewBorderClass(item) {
    const width = this.reviewSummary.find((x) => x.rate == item)?.value || 0;
    const d = width / this.reviews.length;
    const w = Math.floor(d * 100);
    return 'w-' + w.toString();
  }

  async goToCart() {
    if (this.shopType == 1) {
      const res: any = await this.cartService.getCartByUser(
        this.authService.getUser().id
      );
      if (res.data) {
        const retailCartData = res.data.filter((x) => x.type == 1);
        const i = retailCartData.findIndex(
          (x) => x.color == this.selectedColor && x.size == this.selectedSize
        );
        if (i < 0) {
          await this.addToCart();
        }
      }
    }
    this.router.navigate(['/shop', this.shopType, 'cart']);
  }

  addToCartArr() {
    debugger;
    const selectedSkuData = Object.assign(
      {},
      this.productData.productDetails.find(
        (x) => {
          if (this.selectedSize) {
            if (
              x.color === this.selectedColor &&
              x.size === this.selectedSize
            ) {
              return x;
            }
          } else {
            if (x.color === this.selectedColor) {
              return x;
            }
          }
        }
        // x.color === this.selectedColor && x.size === this.selectedSize
      )
    );

    let selectedSkuDetailData = selectedSkuData.productDetailDetails.find(
      (x) => x.min <= this.selectedQuantity && x.max >= this.selectedQuantity
    );
    if (!selectedSkuDetailData) {
      selectedSkuDetailData = selectedSkuData.productDetailDetails
        .sort((a, b) => (a.max < b.max ? 1 : -1))
        .find(
          (x) => x.min <= this.selectedQuantity && x.max < this.selectedQuantity
        );
      selectedSkuData.productDetailDetails.sort((a, b) =>
        a.max > b.max ? 1 : -1
      );
    }
    const i = this.cartArr.findIndex(
      (x) => x.color === this.selectedColor && x.size === this.selectedSize
    );

    if (i > -1) {
      const newQuantity = this.isCartEdit
        ? this.selectedQuantity
        : this.cartArr[i].quantity + this.selectedQuantity;
      if (
        selectedSkuData.productDetailDetails.length > 0 &&
        !selectedSkuDetailData
      ) {
        this.toastr.error('quantity can not be greater than maximum value');
        return null;
      }
      // else if (selectedSkuDetailData.max < newQuantity) {
      //   this.toastr.error('quantity can not be greater than maximum value ');
      //   return null;
      // }
      this.cartArr[i].color = this.selectedColor;
      this.cartArr[i].size = this.selectedSize;
      this.cartArr[i].quantity = newQuantity;
      this.cartArr[i].price =
        +selectedSkuDetailData.price * +this.cartArr[i].quantity;
    } else {
      if (
        selectedSkuData.productDetailDetails.length > 0 &&
        !selectedSkuDetailData
      ) {
        this.toastr.error('quantity can not be greater than maximum value');
        return null;
      }
      this.cartArr.push({
        wholesaleCartId: 0,
        userId: this.authService.getUser().id,
        productId: this.productData.id,
        productDetailId: selectedSkuData.id,
        productDetailDetailId: selectedSkuDetailData.id,
        sku: selectedSkuDetailData.sku,
        size: this.selectedSize,
        color: this.selectedColor,
        quantity: this.selectedQuantity,
        price: +selectedSkuDetailData.price * +this.selectedQuantity,
      });
    }
    this.wholesaleCart.wholesaleCartDetails = this.cartArr;
    this.selectedQuantity = 0;
    this.isCartEdit = false;
    // console.log(this.cartArr);
  }
  changeCartArr(i) {
    this.selectedColor = this.cartArr[i].color;
    this.selectedSize = this.cartArr[i].size;
    this.selectedQuantity = this.cartArr[i].quantity;
    this.getWholeSaleSkuData();
    this.isCartEdit = true;
  }
  async saveWholesaleCart() {
    console.log(this.wholesaleCart);
    const res: any = await this.cartService.saveWholesaleCart(
      this.wholesaleCart
    );
    if (res.data) {
      this.cartArr = [];
      const data: any = await this.cartService.getWholesaleCartCountByUser(
        this.authService.getUser().id
      );
      this.cartService.setCartDataCount(data.data.count);
    }
  }

  showDescription() {
    this.hideDescription = !this.hideDescription;
  }

  getSubTotal() {
    let subTotal = 0;
    this.cartArr.forEach((data) => {
      subTotal += +data.price;
    });
    return subTotal;
  }
}
