import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { FriendService } from 'src/app/services/friend.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss'],
})
export class FollowersComponent implements OnInit {
  user;
  followers: [];

  constructor(
    private friendService: FriendService,
    private authService: AuthService,
    private toastr: ToastrService, private userService: UserService
  ) {}

  async ngOnInit() {
    this.user = this.authService.getUser();
    await this.GetFollowers();
  }

  async GetFollowers() {
    let res: any = await this.friendService.GetFollowers(this.user.id);
    if (!res.data.success) {
      this.toastr.error(res.data.message);
      return;
    }
    this.followers = res?.data.data;
  }
  async unFollowUser(friend: any) {
    friend.friendId;
    let res: any = await this.friendService.unfollowUser(
      friend.followeeId,
      friend.followerId
    );
    if (!res.data.success) {
      this.toastr.error(res.data.message);
      return;
    }
    this.toastr.success('Successfully Unfollowed');
    await this.userService.updateUserData();
    await this.GetFollowers();
  }
  async unFriendUser(friend: any) {
    let res: any = await this.friendService.unFriendUser(
      friend.followeeId,
      friend.followerId
    );
    if (!res.data.success) {
      this.toastr.error(res.data.message);
      return;
    }
    this.toastr.success('Successfully Unfriend.');
    await this.userService.updateUserData();
    await this.GetFollowers();
  }

  async AddFriend(friend: any) {
    let o = { friendId: friend.followerId, userId: friend.followeeId };
    let res: any = await this.friendService.AddFriend(o);
    if (!res.data.success) {
      this.toastr.error(res.data.message);
      return;
    }
    this.toastr.success(res.data.message);
    await this.GetFollowers();
  }
  async followUser(friend: any) {
    friend.friendId;
    let res: any = await this.friendService.followUser(
      friend.followeeId,
      friend.followerId
    );
    if (!res.data.success) {
      this.toastr.error(res.data.message);
      return;
    }
    await this.GetFollowers();
  }
}
