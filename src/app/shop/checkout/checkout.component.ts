import { ActivatedRoute, Router } from '@angular/router';
import { async } from '@angular/core/testing';
import { AuthService } from './../../services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShippingBillingComponent } from '../popup/shipping-billing/shipping-billing.component';
import { CartService } from 'src/app/services/cart.service';
import { untilDestroyed } from 'src/app/services/until-destroy';
import { CartStoreService } from 'src/app/services/cartstore.service';
import { EmailContactComponent } from '../popup/email-contact/email-contact.component';
import { OrderService } from 'src/app/services/order.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  user: any;
  shippingData: any;
  billingData: any;
  selectedProductList: any[] = [];
  subTotal = 0;
  voucher = '';
  shippingFees = 0;
  paymentFee = 0;
  commision = 0;
  email: any;
  contactNo: any;
  shopType: number;
  constructor(
    public Dialog: MatDialog,
    private authService: AuthService,
    public cartService: CartService,
    private cartStoreService: CartStoreService,
    private checkoutService: CheckoutService,
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.shopType = +this.route.snapshot.params['type'];
  }

  // ngOnDestroy() {
  // }
  async ngOnInit() {
    this.user = this.authService.getUser();
    this.cartStoreService.getVoucher().subscribe((voucher) => {
      this.voucher = voucher;
    });
    this.cartStoreService
      .getSelectedProductList()
      .subscribe((selectedProductList) => {
        this.selectedProductList = selectedProductList;
        console.log(this.selectedProductList);
      });
    await this.getShippingData();
  }
  async getShippingData() {
    try {
      const shippingBilling: any = await this.checkoutService.getByCustomerId(
        this.user.id
      );
      console.log(shippingBilling);
      this.shippingData = shippingBilling.data.find(
        (x) => x.type === 'shipping'
      );
      this.billingData = shippingBilling.data.find((x) => x.type === 'billing');
    } catch (error) {
      console.log(error);
    }
  }
  shippingAddressDialog(type) {
    const DialogRef = this.Dialog.open(ShippingBillingComponent, {
      width: '35%',
      height: '75vh',
      disableClose: true,
      data: this.shippingData
        ? {
            type: type,
            data:
              type === 'shipping'
                ? [this.shippingData, this.billingData]
                : [this.billingData],
          }
        : { type: type, data: null },
    });
    DialogRef.afterClosed().subscribe(async (result) => {
      if (result !== null && result !== undefined) {
        const res: any = await this.checkoutService.saveShippingAndBilling(
          result
        );
        if (res.data.success) {
          this.shippingData = res.data.data.find((x) => x.type === 'shipping');
          this.billingData = res.data.data.find((x) => x.type === 'billing');
        }
        console.log(result);
      }
    });
  }

  emailContactDialog(type) {
    const DialogRef = this.Dialog.open(EmailContactComponent, {
      width: '35%',
      height: '50vh',
      disableClose: true,
      data: {
        type: type,
        data: type === 'email' ? this.user.email : this.user.contactNo,
      },
    });
    DialogRef.afterClosed().subscribe(async (result) => {
      if (result !== null && result !== undefined) {
        if (type === 'email') {
          this.email = result;
        } else {
          this.contactNo = result;
        }
        console.log(result);
      }
    });
  }

  selectProduct(item) {
    const index = this.selectedProductList.findIndex(
      (x: any) => x.id === item.id
    );
    if (index > -1) {
      this.selectedProductList.splice(index, 1);
      console.log(this.selectedProductList);
      // let count = 0;
      // this.selectedProductList.forEach((element: any) => {
      //  count += element.quantity;
      // });
      // this.cartService.setCartDataCount(count);
      this.cartStoreService.setSelectedProductList(this.selectedProductList);
      return false;
    } else {
      this.selectedProductList.push(item);
      console.log(this.selectedProductList);
      // let count = 0;
      // this.selectedProductList.forEach((element: any) => {
      //  count += element.quantity;
      // });
      // this.cartService.setCartDataCount(count);
      this.cartStoreService.setSelectedProductList(this.selectedProductList);
      return true;
    }
  }

  getSubTotal() {
    let subTotal = 0;
    if (this.shopType == 1) {
      this.selectedProductList.forEach((data) => {
        subTotal += +data.quantity * +data.cartPrice;
      });
      return subTotal;
    } else {
      this.selectedProductList.forEach((data) => {
        data.wholesaleCartDetails.forEach((element) => {
          subTotal += +element.price;
        });
      });
      return subTotal;
    }
  }

  async proceedToPay() {
    if (!this.shippingData) {
      this.toastr.error('No shipping Data available.');
      return null;
    }
    if (!this.billingData) {
      this.toastr.error('No billing Data available.');
      return null;
    }

    const orderDetail = [];
    if (this.shopType == 1) {
      this.selectedProductList.forEach((element) => {
        orderDetail.push({
          // id: 0,
          orderId: 0,
          productId: element.id,
          sku: element.sku,
          productName: element.productName,
          quantity: element.quantity,
          subTotal: +element.cartPrice * +element.quantity,
          voucher: this.voucher,
        });
      });
    } else {
      this.selectedProductList.forEach((element) => {
        element.wholesaleCartDetails.forEach((det) => {
          orderDetail.push({
            // id: 0,
            orderId: 0,
            productId: det.productId,
            sku: det.sku,
            productName: element.productName,
            quantity: +det.quantity,
            subTotal: +det.price * +det.quantity,
            voucher: this.voucher,
          });
        });
      });
    }
    this.subTotal = this.getSubTotal();
    const data = {
      orderNumber: '',
      shippingFees: this.shippingFees,
      grandTotal: this.subTotal + this.shippingFees,
      commision: this.commision,
      paymentFee: this.paymentFee,
      phoneNumber: this.contactNo ? this.contactNo : this.user.contactNo,
      email: this.email ? this.email : this.user.email,
      status: 'In Process',
      action: 'Ready to Ship',
      orderDetails: orderDetail,
      customerId: this.user.id,
      isActive: true,
    };
    let res: any = await this.orderService.saveorder(data);
    if (res.data.success) {
      this.selectedProductList.forEach(async (element) => {
        if (this.shopType == 1) {
          await this.cartService.delete(element.cartId);
        } else {
          await this.cartService.deleteWholesaleCart(element.cartId);
        }
      });
      setTimeout(() => {
        this.cartStoreService.setSelectedProductList([]);
        this.router.navigate(['/shop', this.shopType, 'cart']);
      }, 200);
    }
  }

  getColor(id, color) {
    document.getElementById(id).style.backgroundColor = color;
  }
}
