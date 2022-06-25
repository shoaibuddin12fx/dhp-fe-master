import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FriendService } from 'src/app/services/friend.service';
import { untilDestroyed } from 'src/app/services/until-destroy';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
})
export class FriendsComponent implements OnInit, OnDestroy {
  private searchSubscription: any; //property that will store the search http subscription
  user;
  searchResults: any[] = [];
  suggestedFriends: any[] = [];
  friendRequestCount = 0;
  isSuggestionTabExpended = true;
  image = '../../../assets/images/groups/group-profile.jpg';

  constructor(
    private friendService: FriendService,
    private toastr: ToastrService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('User'));
    this.getSuggestedFriends();
    this.friendService
      .getRequestCount()
      .pipe(untilDestroyed(this))
      .subscribe((g) => {
        this.friendRequestCount = g;
      });
  }
  ngOnDestroy(): void {}

  async getSuggestedFriends() {
    try {
      const res = await this.friendService
        .getSuggestedFriends(this.user?.id)
        .toPromise();
      this.suggestedFriends = res?.data?.data;
    } catch (error) {}
  }

  Search(e) {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    this.searchSubscription = this.friendService
      .Search(e, this.user.id)
      .subscribe((res: any) => {
        if (!res.data.success) {
          return;
        }
        this.searchResults = res.data.data;
        if (this.searchResults.length <= 0) {
          this.isSuggestionTabExpended = true;
        }
      });
  }

  async AddFriend(friendId, type) {
    let o = { friendId, userId: this.user.id };
    let res: any = await this.friendService.AddFriend(o);
    if (!res.data.success) {
      this.toastr.error(res.data.message);
      return;
    }
    if (type === 'searched') {
      const i = this.searchResults.findIndex((x) => x.id === friendId);
      if (i > -1) {
        this.searchResults[i].isFriend = false;
        this.searchResults[i].friendStatus = 'Request Pending';
      }
    } else {
      await this.getSuggestedFriends();
    }
    this.toastr.success(res.data.message);
    return;
  }

  async UnFriend(friendId) {
    Swal.fire({
      title: 'Are you sure you want to UnFriend!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    }).then(async (result) => {
      if (result.isConfirmed) {
        let o = { friendId, userId: this.user.id, unFriend: true };
        let res: any = await this.friendService.UnFriend(o);
        if (!res.data.success) {
          this.toastr.error(res.data.message);
          return;
        }
        await this.userService.updateUserData();
      }
    });
  }

  async Follow(friendId) {
    let o = { friendId, userId: this.user.id };
    let res: any = await this.friendService.Follow(o);
    if (!res.data.success) {
      this.toastr.error(res.data.message);
      return;
    }
  }

  async UnFollow(friendId) {
    Swal.fire({
      title: 'Are you sure you want to UnFollow!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    }).then(async (result) => {
      if (result.isConfirmed) {
        let o = { friendId, userId: this.user.id, unFollow: true };
        let res: any = await this.friendService.UnFollow(o);
        if (!res.data.success) {
          this.toastr.error(res.data.message);
          return;
        }
        await this.userService.updateUserData();
      }
    });
  }

  async AcceptDeclineRequest(friendId, type) {
    if (type === 'd') {
      Swal.fire({
        title: 'Are you sure you want to Decline Request!',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Yes',
      }).then(async (result) => {
        if (result.isConfirmed) {
          let o = { friendId, userId: this.user.id, type: 'd' };
          let res: any = await this.friendService.AcceptDeclineRequest(o);
          if (!res.data.success) {
            this.toastr.error(res.data.message);
            return;
          }
        }
      });
    } else {
      let o = { friendId, userId: this.user.id, type: 'a' };
      let res: any = await this.friendService.AcceptDeclineRequest(o);
      if (!res.data.success) {
        this.toastr.error(res.data.message);
        return;
      }
    }
  }
}
