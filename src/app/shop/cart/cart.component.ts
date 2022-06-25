import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { CartStoreService } from 'src/app/services/cartstore.service';
import { untilDestroyed } from 'src/app/services/until-destroy';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  retailCartData: any[] = [];
  wholesaleCartData: any[] = [];
  selectedProductList: any[] = [];
  shopType: any;
  subTotal = 0;
  voucher = '';
  constructor(
    private cartService: CartService,
    private cartStoreService: CartStoreService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.shopType = +this.route.snapshot.params['type'];
  }

  // ngOnDestroy(): void {

  // }
  async ngOnInit() {
    await this.getCartData();
    this.cartStoreService.getVoucher().subscribe((voucher) => {
      this.voucher = voucher;
    });
    this.cartStoreService
      .getSelectedProductList()
      .subscribe((selectedProductList) => {
        this.selectedProductList = selectedProductList;
        selectedProductList.forEach((element) => {
          this.checkProduct(element);
        });
      });
  }
  async getCartData() {
    if (this.shopType == 1) {
      const res: any = await this.cartService.getCartByUser(
        this.authService.getUser().id
      );
      if (res.data) {
        this.retailCartData = res.data.filter((x) => x.type == 1);
        let count = 0;
        this.retailCartData.forEach((element: any) => {
          count += element.quantity;
        });
        this.cartService.setCartDataCount(count);
      }
    } else {
      const res: any = await this.cartService.getWholesaleCartByUser(
        this.authService.getUser().id
      );
      if (res.data) {
        this.wholesaleCartData = res.data.filter((x) => x.type != 1);
        let count = 0;
        this.wholesaleCartData.forEach((element: any) => {
          element.wholesaleCartDetails.forEach((det) => {
            count += det.quantity;
          });
        });
        this.cartService.setCartDataCount(count);
      }
    }
  }
  async onQuantityChange(item) {
    if (this.shopType == 1) {
      const res: any = await this.cartService.updateQuantity(
        item.cartId,
        item.quantity
      );
    } else {
      const res: any = await this.cartService.updateWholesaleCartDetailQuantity(
        item.id,
        item.quantity
      );
    }
    await this.getCartData();
  }

  async deleteItem(cartId) {
    if (this.shopType == 1) {
      await this.cartService.delete(cartId);
    } else {
      await this.cartService.deleteWholesaleCart(cartId);
    }
    await this.getCartData();
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

  ifAllChecked() {
    if (
      this.selectedProductList.length > 0 &&
      this.selectedProductList.length ===
        (this.shopType == 1
          ? this.retailCartData.length
          : this.wholesaleCartData.length)
    ) {
      return true;
    } else {
      return false;
    }
  }
  checkProduct(item) {
    let data: any;
    if (this.shopType == 1) {
      data = this.retailCartData.find((x) => x.id === item.id);
    } else {
      data = this.wholesaleCartData.find((x) => x.id === item.id);
      data.selected = false;
    }
    if (data) {
      data.selected = true;
    } else {
    }
  }
  selectProduct(item) {
    this.checkProduct(item);
    const index = this.selectedProductList.findIndex(
      (x: any) => x.id === item.id
    );
    if (index > -1) {
      this.selectedProductList.splice(index, 1);
      console.log(this.selectedProductList);
      this.cartStoreService.setSelectedProductList(this.selectedProductList);
      return false;
    } else {
      this.selectedProductList.push(item);
      console.log(this.selectedProductList);
      this.cartStoreService.setSelectedProductList(this.selectedProductList);
      return true;
    }
  }
  selectAllProducts() {
    const data =
      this.shopType == 1 ? this.retailCartData : this.wholesaleCartData;

    if (this.selectedProductList.length <= 0) {
      this.selectedProductList = Object.assign([], data);
      data.forEach((data) => {
        data.selected = true;
      });
      // this.cartStoreService.setSelectedProductList(this.selectedProductList);
      // return true;
    } else if (
      this.selectedProductList.length > 0 &&
      this.selectedProductList.length < data.length
    ) {
      this.selectedProductList = Object.assign([], data);
      data.forEach((data) => {
        data.selected = true;
      });
      // this.cartStoreService.setSelectedProductList(this.selectedProductList);
      // return true;
    } else if (
      this.selectedProductList.length > 0 &&
      this.selectedProductList.length === data.length
    ) {
      this.selectedProductList = [];
      data.forEach((data) => {
        data.selected = false;
      });
      // this.cartStoreService.setSelectedProductList(this.selectedProductList);
      // return false;
    } else {
      this.selectedProductList = [];
      data.forEach((data) => {
        data.selected = false;
      });
      // return false;
    }
    this.cartStoreService.setSelectedProductList(this.selectedProductList);
  }
  isProductSelected() {
    if (this.selectedProductList.length <= 0) {
      return false;
    } else {
      return true;
    }
  }

  setVoucher() {
    this.cartStoreService.setVoucher(this.voucher);
  }

  getColor(id, color) {
    document.getElementById(id).style.backgroundColor = color;
  }
}
