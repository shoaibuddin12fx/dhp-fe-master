import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ShopRoutingModule } from './shop-routing.module';
import { ShopComponent } from './shop.component';
import { TrackOrderComponent } from './track-order/track-order.component';
import { CartComponent } from './cart/cart.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MyOrderComponent } from './my-order/my-order.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ProductsComponent } from './products/products.component';
import { ProductComponent } from './product/product.component';
import { ShopTypeComponent } from './shop-type/shop-type.component';
import { HomeComponent } from './home/home.component';
import { StoreViewComponent } from './store-view/store-view.component';
import { ShippingBillingComponent } from './popup/shipping-billing/shipping-billing.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { ShopHeaderComponent } from './shop-header/shop-header.component';
import { MatMenuModule } from '@angular/material/menu';
import { CustomerCareComponent } from './customer-care/customer-care.component';
import { MatIconModule } from '@angular/material/icon';
import { ImageViewComponent } from './popup/product/image-view/image-view.component';
import { ReviewComponent } from './popup/review/review.component';
import { CancelOrderComponent } from './popup/cancel-order/cancel-order.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { EmailContactComponent } from './popup/email-contact/email-contact.component';
import { NgxStarRatingModule } from 'ngx-star-rating';

@NgModule({
  declarations: [
    ShopComponent,
    TrackOrderComponent,
    CartComponent,
    MyOrderComponent,
    CheckoutComponent,
    ProductsComponent,
    ProductComponent,
    ShopTypeComponent,
    HomeComponent,
    StoreViewComponent,
    ShippingBillingComponent,
    ShopHeaderComponent,
    CustomerCareComponent,
    ImageViewComponent,
    ReviewComponent,
    CancelOrderComponent,
    EmailContactComponent,
  ],
  imports: [
    CommonModule,
    ShopRoutingModule,
    MatTabsModule,
    MatRadioModule,
    MatDialogModule,
    MatExpansionModule,
    MatMenuModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatPaginatorModule,
    NgxStarRatingModule,
  ],
})
export class ShopModule {}
