import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DiscoverComponent } from './discover/discover.component';
import { GroupsComponent } from './groups.component';
import { MyGroupsComponent } from './my-groups/my-groups.component';
import { PrivateGroupsComponent } from './private-groups/private-groups.component';
import { PublicGroupsComponent } from './public-groups/public-groups.component';

const routes: Routes = [
  {
    path: '',
    component: GroupsComponent,
    children: [
      { path: '', redirectTo: 'discover' },
      { path: 'discover', component: DiscoverComponent },
      { path: 'my-groups', component: MyGroupsComponent },
      { path: 'public-groups', component: PublicGroupsComponent },
      { path: 'private-groups', component: PrivateGroupsComponent },
      {
        path: 'admin',
        loadChildren: () =>
          import('../groups/admin/admin.module').then((m) => m.AdminModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupsRoutingModule {}
