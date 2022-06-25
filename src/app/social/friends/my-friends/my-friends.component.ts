import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FriendService } from 'src/app/services/friend.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-my-friends',
  templateUrl: './my-friends.component.html',
  styleUrls: ['./my-friends.component.scss'],
})
export class MyFriendsComponent implements OnInit {
  user;
  friends: [];

  constructor(
    private friendService: FriendService,
    private toastr: ToastrService, private userService: UserService
  ) {}

  async ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('User'));
    await this.GetFriends();
  }

  async GetFriends() {
    let res: any = await this.friendService.GetFriends(this.user.id, null);
    if (!res.data.success) {
      this.toastr.error(res.data.message);
      return;
    }
    this.friends = res?.data.data;
  }
  async followUser(friend: any) {
    friend.friendId;
    let res: any = await this.friendService.followUser(
      friend.userId,
      friend.friendId
    );
    if (!res.data.success) {
      this.toastr.error(res.data.message);
      return;
    }
    this.friends = res?.data.data;
  }
  async unFriendUser(friend: any) {
    let res: any = await this.friendService.unFriendUser(
      friend.userId,
      friend.friendId
    );
    if (!res.data.success) {
      this.toastr.error(res.data.message);
      return;
    }
    this.toastr.success('Successfully Unfriend.');
    await this.userService.updateUserData();
    await this.GetFriends();
  }
}
