import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdViewComponent } from './ad-view/ad-view.component';
import { HomeComponent } from './home/home.component';
import { MyAdsComponent } from './my-ads/my-ads.component';

const routes: Routes = [
  { path: '', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'ad-view', component: AdViewComponent },
  { path: 'my-ads', component: MyAdsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClassifiedAdsRoutingModule {}
