import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { FriendService } from 'src/app/services/friend.service';
import { SocialService } from 'src/app/services/social.service';
import { UserService } from 'src/app/services/user.service';
import { ReportComponent } from '../../popup/activity-box/report/report.component';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
})
export class FriendsComponent implements OnInit, OnDestroy {
  friends: any = ([] = []);
  currentUser: any;
  search: string = '';
  friendRequests: any[] = [];
  profileId: any;
  constructor(
    public Dialog: MatDialog,
    private friendService: FriendService,
    private authService: AuthService,
    private toastr: ToastrService,
    private socialService: SocialService,
    private route: ActivatedRoute, private userService: UserService

  ) {
    this.profileId = this.route.snapshot.params['id'];
  }

  async ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('User'));
    this.socialService.isProfile.next({
      isProfile: true,
      profileId: this.profileId,
    });
    this.GetRequestedFriends();
    await this.GetFriends();
  }
  ngOnDestroy(): void { }

  async GetFriends() {
    let res: any = await this.friendService.GetFriends(
      // this.userService.getUser().id
      this.profileId, this.authService.getUser().id
    );
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
  openReportDialog() {
    const DialogRef = this.Dialog.open(ReportComponent, {
      width: '35%',
      height: 'auto',
      disableClose: true,
      data: {},
    });
  }
  async GetRequestedFriends() {
    let res: any = await this.friendService.GetRequestedFriends(
      this.currentUser.id
    );
    if (!res.data.success) {
      this.toastr.error(res.data.message);
      return;
    }
    this.friendRequests = res?.data.data;
  }

  async onApproveRequest(friend: any) {
    const payload = { id: friend.id, type: 'a' };
    let res: any = await this.friendService.AcceptDeclineRequest(payload);
    if (!res.data.success) {
      this.toastr.error(res.data.message);
      return;
    }
    this.removeFriendFromList(this.friendRequests, friend);
    this.toastr.success(res.data.message);
    return;
  }

  async onRejectRequest(friend: any) {
    Swal.fire({
      title: 'Are you sure you want to Decline Request!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const payload = { id: friend.id, type: 'd' };
        let res: any = await this.friendService.AcceptDeclineRequest(payload);

        if (!res.data.success) {
          this.toastr.error(res.data.message);
          return;
        }
        this.removeFriendFromList(this.friendRequests, friend);
        this.toastr.success(res.data.message);
        return;
      }
      return;
    });
  }

  removeFriendFromList(friendList: any[], friend: any) {
    const friendIndex = friendList.findIndex((frnd) => frnd.id === friend.id);
    if (friendIndex > -1) {
      friendList.splice(friendIndex, 1);
    }
  }

  async AddFriend(friendId) {
    let o = { friendId, userId: this.currentUser.id };
    let res: any = await this.friendService.AddFriend(o);
    if (!res.data.success) {
      this.toastr.error(res.data.message);
      return;
    }
    const i = this.friends.findIndex(x => x.id === friendId)
    if (i > -1) {
      this.friends[i].isFriend = false;
      this.friends[i].friendStatus = 'Request Pending';
    }
    this.toastr.success(res.data.message);
    return;
  }
}
