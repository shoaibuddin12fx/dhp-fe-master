import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { CancelOrderComponent } from '../popup/cancel-order/cancel-order.component';
import { ReviewComponent } from '../popup/review/review.component';

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  styleUrls: ['./track-order.component.scss'],
})
export class TrackOrderComponent implements OnInit {
  productId: any;
  user: any;
  orderData: any = {};
  orderDetails: any = [];
  shippingData: any = {};
  billingData: any = {};
  orderNum: any = '';
  constructor(
    public Dialog: MatDialog,
    private route: ActivatedRoute,
    private authService: AuthService,
    private orderService: OrderService
  ) {
    this.productId = this.route.snapshot.params.productId;
    this.orderNum = this.route.snapshot.params.orderNum;
  }

  async ngOnInit() {
    this.user = this.authService.getUser();
    this.getOrderData();
  }
  async getOrderData() {
    const res: any = await this.orderService.getByOrderNumber(
      this.route.snapshot.params.orderNum,
      this.user.id,
      null
    );
    this.orderData = res.data;
    this.orderDetails = res.data.orderDetails;
    this.shippingData = res.data.shippingAndBilling.find(
      (x) => x.type === 'shipping'
    );
    this.billingData = res.data.shippingAndBilling.find(
      (x) => x.type === 'billing'
    );
  }
  getSubTotal() {
    let subTotal = 0;
    this.orderDetails.forEach((data) => {
      subTotal += +data.subTotal;
    });
    return subTotal;
  }
  openReviewDialog() {
    const DialogRef = this.Dialog.open(ReviewComponent, {
      width: '35%',
      height: '80vh',
      disableClose: true,
      data: {
        productId: this.productId,
      },
    });
  }
  cancelOrderDialog() {
    const DialogRef = this.Dialog.open(CancelOrderComponent, {
      width: '35%',
      height: '72vh',
      disableClose: true,
      data: {
        id: this.orderNum,
      },
    });
    DialogRef.afterClosed().subscribe((x) => {
      this.getOrderData();
    });
  }
}
