import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassifiedAdsRoutingModule } from './classified-ads-routing.module';
import { HomeComponent } from './home/home.component';
import { AdViewComponent } from './ad-view/ad-view.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PackagesComponent } from './popup/packages/packages.component';
import { CreateAdComponent } from './popup/create-ad/create-ad.component';
import { MyAdsComponent } from './my-ads/my-ads.component';
import { ClassifiedHeaderComponent } from './classified-header/classified-header.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { SharedModule } from '../shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
@NgModule({
  declarations: [
    HomeComponent,
    AdViewComponent,
    PackagesComponent,
    CreateAdComponent,
    MyAdsComponent,
    ClassifiedHeaderComponent,
  ],
  imports: [
    CommonModule,
    ClassifiedAdsRoutingModule,
    MatDialogModule,
    MatExpansionModule,
    SharedModule,
    MatMenuModule,
    MatRadioModule,
  ],
})
export class ClassifiedAdsModule {}
