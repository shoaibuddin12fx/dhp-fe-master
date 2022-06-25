import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartnerDetailComponent } from './partner-detail/partner-detail.component';
import { ProfileViewComponent } from './profile-view.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileViewComponent,
    children: [
      { path: '', redirectTo: 'user-detail' },
      { path: 'user-detail', component: UserDetailComponent },
      { path: 'partner-detail', component: PartnerDetailComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileViewRoutingModule {}
