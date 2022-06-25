import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { ShopsComponent } from './setup/shops/shops.component';
import { CreateShopComponent } from './setup/create-shop/create-shop.component';

const routes: Routes = [
  { path: '', redirectTo: 'shops' },
  { path: 'shops', component: ShopsComponent },
  { path: 'create-shop', component: CreateShopComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'main',
        loadChildren: () =>
          import('./layout/layout.module').then((x) => x.LayoutModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ESellerRoutingModule {}
