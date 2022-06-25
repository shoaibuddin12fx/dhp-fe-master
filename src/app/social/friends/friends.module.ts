import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FriendsRoutingModule } from './friends-routing.module';
import { MyFriendsComponent } from './my-friends/my-friends.component';
import { FollowersComponent } from './followers/followers.component';
import { FollowingsComponent } from './followings/followings.component';
import { FriendRequestComponent } from './friend-request/friend-request.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    MyFriendsComponent,
    FriendRequestComponent,
    FollowersComponent,
    FollowingsComponent,
  ],
  imports: [CommonModule, FriendsRoutingModule, RouterModule],
})
export class FriendsModule {}
