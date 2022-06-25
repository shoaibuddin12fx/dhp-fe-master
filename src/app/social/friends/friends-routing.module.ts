import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FollowersComponent } from './followers/followers.component';
import { FollowingsComponent } from './followings/followings.component';
import { FriendRequestComponent } from './friend-request/friend-request.component';
import { FriendsComponent } from './friends.component';
import { MyFriendsComponent } from './my-friends/my-friends.component';

const routes: Routes = [
  {
    path: '',
    component: FriendsComponent,
    children: [
      { path: '', redirectTo: 'my-friends' },
      { path: 'my-friends', component: MyFriendsComponent },
      { path: 'friend-requests', component: FriendRequestComponent },
      { path: 'follower', component: FollowersComponent },
      { path: 'following', component: FollowingsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FriendsRoutingModule {}
