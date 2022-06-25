import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ESellerRoutingModule } from './e-seller-routing.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { ESellerComponent } from './e-seller.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatMenuModule } from '@angular/material/menu';
import { ManageProductComponent } from './product/manage-product/manage-product.component';
import { AddProductComponent } from './product/add-product/add-product.component';
import { ManageOrderComponent } from './order/manage-order/manage-order.component';
import { ManageReviewsComponent } from './order/manage-reviews/manage-reviews.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AddVoucherComponent } from './promotion/add-voucher/add-voucher.component';
import { ManageVoucherComponent } from './promotion/manage-voucher/manage-voucher.component';
import { MatRadioModule } from '@angular/material/radio';
import { ShopProfileComponent } from './setting/shop-profile/shop-profile.component';
import { FaqComponent } from './faq/faq.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { LayoutComponent } from './layout/layout.component';
import { CreateShopComponent } from './setup/create-shop/create-shop.component';
import { ShopsComponent } from './setup/shops/shops.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShopService } from '../services/shop.service';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  declarations: [
    ESellerComponent,
    DashboardComponent,
    ManageProductComponent,
    AddProductComponent,
    ManageOrderComponent,
    ManageReviewsComponent,
    AddVoucherComponent,
    ManageVoucherComponent,
    ShopProfileComponent,
    FaqComponent,
    OrderDetailComponent,
    LayoutComponent,
    CreateShopComponent,
    ShopsComponent,
  ],
  imports: [
    CommonModule,
    ESellerRoutingModule,
    MatExpansionModule,
    MatMenuModule,
    MatTabsModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    NgSelectModule,
    FormsModule,
    SharedModule,
  ],
  providers: [ShopService],
})
export class ESellerModule {}
