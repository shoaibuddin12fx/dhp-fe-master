import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { PartnerInfoComponent } from './partner-info/partner-info.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: 'profile' },
  { path: 'profile', component: ProfileComponent },
  { path: 'my-profile', component: MyProfileComponent },
  { path: 'partner-info', component: PartnerInfoComponent },
  {
    path: 'profile-view',
    loadChildren: () =>
      import('../../app/matrimonial/profile-view/profile-view.module').then(
        (m) => m.ProfileViewModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatrimonialRoutingModule {}
