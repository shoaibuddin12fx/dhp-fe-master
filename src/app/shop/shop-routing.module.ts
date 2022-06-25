import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CustomerCareComponent } from './customer-care/customer-care.component';
import { HomeComponent } from './home/home.component';
import { MyOrderComponent } from './my-order/my-order.component';
import { ProductComponent } from './product/product.component';
import { ProductsComponent } from './products/products.component';
import { ShopTypeComponent } from './shop-type/shop-type.component';
import { ShopComponent } from './shop.component';
import { StoreViewComponent } from './store-view/store-view.component';
import { TrackOrderComponent } from './track-order/track-order.component';

const routes: Routes = [
  {
    path: '',
    component: ShopComponent,
    children: [
      { path: '', component: ShopTypeComponent },
      {
        path: ':type/track-order/:id/:productId/:orderNum',
        component: TrackOrderComponent,
      },
      { path: ':type/cart', component: CartComponent },
      { path: ':type/order', component: MyOrderComponent },
      { path: ':type/checkout', component: CheckoutComponent },
      { path: ':type/products/:cat', component: ProductsComponent },
      {
        path: ':type/products/:cat/:prodCat/:prodSubCat',
        component: ProductsComponent,
      },
      { path: ':type/products/:id', component: ProductsComponent },
      { path: ':type/product/:id', component: ProductComponent },
      { path: ':type/store/:shopId', component: StoreViewComponent },
      { path: ':type/home', component: HomeComponent },
      { path: ':type/customer-care', component: CustomerCareComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopRoutingModule {}
