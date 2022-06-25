import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DonationDetailComponent } from './donation-detail/donation-detail.component';
import { DonorWallComponent } from './donor-wall/donor-wall.component';
import { HomeComponent } from './home/home.component';
import { MyCampaignsComponent } from './my-campaigns/my-campaigns.component';
import { MyDonationsComponent } from './my-donations/my-donations.component';

const routes: Routes = [
  { path: '', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'donor-wall', component: DonorWallComponent },
  { path: 'my-campaigns', component: MyCampaignsComponent },
  { path: 'my-donations', component: MyDonationsComponent },
  { path: 'donation-detail', component: DonationDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonationRoutingModule {}
