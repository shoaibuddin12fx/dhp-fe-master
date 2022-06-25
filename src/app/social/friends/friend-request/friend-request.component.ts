import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FriendService } from 'src/app/services/friend.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-friend-request',
  templateUrl: './friend-request.component.html',
  styleUrls: ['./friend-request.component.scss'],
})
export class FriendRequestComponent implements OnInit {
  user;
  friends: [];
  pendingFriends: [];

  constructor(
    private friendService: FriendService,
    private toastr: ToastrService, private userService: UserService
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('User'));
    this.GetRequestedFriends();
    this.GetPendingRequests();
  }

  async GetRequestedFriends() {
    let res: any = await this.friendService.GetRequestedFriends(this.user.id);
    if (!res.data.success) {
      this.toastr.error(res.data.message);
      return;
    }
    this.friends = res?.data.data;
  }

  async AcceptDeclineRequest(id, type) {
    if (type === 'd') {
      Swal.fire({
        title: 'Are you sure you want to Decline Request!',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Yes',
      }).then(async (result) => {
        if (result.isConfirmed) {
          let o = { id, type: 'd' };
          let res: any = await this.friendService.AcceptDeclineRequest(o);

          if (!res.data.success) {
            this.toastr.error(res.data.message);
            return;
          }
          await this.GetRequestedFriends();
          await this.GetPendingRequests();
          await this.userService.updateUserData()
          this.friendService.setRequestCount(this.friends.length);
          this.toastr.success(res.data.message);
          return;
        }
        return;
      });
    } else {
      let o = { id, type: 'a' };
      let res: any = await this.friendService.AcceptDeclineRequest(o);
      if (!res.data.success) {
        this.toastr.error(res.data.message);
        return;
      }
      await this.GetRequestedFriends();
      await this.GetPendingRequests();
      await this.userService.updateUserData();
      this.friendService.setRequestCount(this.friends.length);
      this.toastr.success(res.data.message);
      return;
    }
  }

  async GetPendingRequests() {
    let res: any = await this.friendService.GetPendingRequests(this.user.id);
    if (!res.data.success) {
      this.toastr.error(res.data.message);
      return;
    }
    this.pendingFriends = res?.data.data;
  }
}
