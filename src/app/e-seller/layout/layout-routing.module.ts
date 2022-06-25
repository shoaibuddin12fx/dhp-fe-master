import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FaqComponent } from '../faq/faq.component';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { ManageOrderComponent } from '../order/manage-order/manage-order.component';
import { ManageReviewsComponent } from '../order/manage-reviews/manage-reviews.component';
import { AddProductComponent } from '../product/add-product/add-product.component';
import { ManageProductComponent } from '../product/manage-product/manage-product.component';
import { AddVoucherComponent } from '../promotion/add-voucher/add-voucher.component';
import { ManageVoucherComponent } from '../promotion/manage-voucher/manage-voucher.component';
import { ShopProfileComponent } from '../setting/shop-profile/shop-profile.component';
import { LayoutComponent } from './layout.component';

// const routes: Routes = [
//   { path: 'dashboard/:shopId', component: DashboardComponent },
//   { path: 'add-product/:shopId', component: AddProductComponent },
//   { path: 'manage-product/:shopId', component: ManageProductComponent },
//   { path: 'manage-order/:shopId', component: ManageOrderComponent },
//   { path: 'manage-reviews/:shopId', component: ManageReviewsComponent },
//   { path: 'add-voucher/:shopId', component: AddVoucherComponent },
//   { path: 'manage-voucher/:shopId', component: ManageVoucherComponent },
//   { path: 'shop-profile/:shopId', component: ShopProfileComponent },
//   { path: 'faqs/:shopId', component: FaqComponent },
//   { path: 'order-detail/:shopId', component: OrderDetailComponent },
// ];
const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: ':shopId/dashboard', component: DashboardComponent },
      { path: ':shopId/add-product', component: AddProductComponent },
      { path: ':shopId/add-product/:id', component: AddProductComponent },
      { path: ':shopId/manage-product', component: ManageProductComponent },
      { path: ':shopId/manage-order', component: ManageOrderComponent },
      { path: ':shopId/manage-reviews', component: ManageReviewsComponent },
      { path: ':shopId/add-voucher', component: AddVoucherComponent },
      { path: ':shopId/add-voucher/:id', component: AddVoucherComponent },
      { path: ':shopId/manage-voucher', component: ManageVoucherComponent },
      { path: ':shopId/shop-profile', component: ShopProfileComponent },
      { path: ':shopId/faqs', component: FaqComponent },
      {
        path: ':shopId/order-detail/:orderNumber',
        component: OrderDetailComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
