import { OrderService } from 'src/app/services/order.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {
  orderNumber: any;
  user: any;
  shippingData: any;
  billingData: any;
  orderData: any;
  orderDetails: any[] = [];
  shopId: any;
  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private authService: AuthService
  ) {
    this.shopId = this.route.snapshot.params['shopId'];
    this.orderNumber = this.route.snapshot.params['orderNumber'];
  }

  async ngOnInit() {
    this.user = this.authService.getUser();
    const res: any = await this.orderService.getByOrderNumber(
      this.orderNumber,
      this.user.id,
      this.shopId
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
}
