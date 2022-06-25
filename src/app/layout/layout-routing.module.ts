import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ESellerComponent } from '../e-seller/e-seller.component';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'social',
        loadChildren: () =>
          import('../social/social.module').then((m) => m.SocialModule),
      },
      {
        path: 'shop',
        loadChildren: () =>
          import('../shop/shop.module').then((m) => m.ShopModule),
      },
      {
        path: 'classified-ads',
        loadChildren: () =>
          import('../classified-ads/classified-ads.module').then(
            (m) => m.ClassifiedAdsModule
          ),
      },
      {
        path: 'event',
        loadChildren: () =>
          import('../event/event.module').then((m) => m.EventModule),
      },
      {
        path: 'job',
        loadChildren: () =>
          import('../job/job.module').then((m) => m.JobModule),
      },
      {
        path: 'polling',
        loadChildren: () =>
          import('../polling/polling.module').then((m) => m.PollingModule),
      },
      {
        path: 'matrimonial',
        loadChildren: () =>
          import('../matrimonial/matrimonial.module').then(
            (m) => m.MatrimonialModule
          ),
      },
      {
        path: 'volunteer',
        loadChildren: () =>
          import('../volunteer/volunteer.module').then(
            (m) => m.VolunteerModule
          ),
      },
      {
        path: 'donation',
        loadChildren: () =>
          import('../donation/donation.module').then((m) => m.DonationModule),
      },
    ],
  },
  {
    path: 'e-seller',
    component: ESellerComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../e-seller/e-seller.module').then((m) => m.ESellerModule),
      },
    ],
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('../setting/setting.module').then((m) => m.SettingModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
