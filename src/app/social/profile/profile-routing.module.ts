import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { EventsComponent } from './events/events.component';
import { FollowersComponent } from './followers/followers.component';
import { FriendsComponent } from './friends/friends.component';
import { GroupsComponent } from './groups/groups.component';
import { MyFeedsComponent } from './my-feeds/my-feeds.component';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      { path: '', redirectTo: 'my-feed' },
      { path: 'my-feed', component: MyFeedsComponent },
      { path: ':id/my-feed', component: MyFeedsComponent },
      { path: ':id/user-feed', component: MyFeedsComponent },
      { path: ':id/about', component: AboutComponent },
      { path: ':id/friends', component: FriendsComponent },
      { path: ':id/followers', component: FollowersComponent },
      { path: ':id/groups', component: GroupsComponent },
      { path: ':id/events', component: EventsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
