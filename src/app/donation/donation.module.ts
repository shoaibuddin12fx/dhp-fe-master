import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DonationRoutingModule } from './donation-routing.module';
import { HomeComponent } from './home/home.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { DonorWallComponent } from './donor-wall/donor-wall.component';
import { MyCampaignsComponent } from './my-campaigns/my-campaigns.component';
import { MyDonationsComponent } from './my-donations/my-donations.component';
import { DonationDetailComponent } from './donation-detail/donation-detail.component';
import { HeaderComponent } from './sub-section/header/header.component';
import { RightBarComponent } from './sub-section/right-bar/right-bar.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CreateCampaignComponent } from './popup/create-campaign/create-campaign.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    HomeComponent,
    DonorWallComponent,
    MyCampaignsComponent,
    MyDonationsComponent,
    DonationDetailComponent,
    HeaderComponent,
    RightBarComponent,
    CreateCampaignComponent,
  ],
  imports: [
    CommonModule,
    DonationRoutingModule,
    MatExpansionModule,
    MatMenuModule,
    MatDialogModule,
    SharedModule,
  ],
})
export class DonationModule {}
