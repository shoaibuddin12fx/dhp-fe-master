import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { FriendService } from 'src/app/services/friend.service';
import { GroupService } from 'src/app/services/groups.service';

@Component({
  selector: 'app-invite-friends',
  templateUrl: './invite-friends.component.html',
  styleUrls: ['./invite-friends.component.scss'],
})
export class InviteFriendsComponent implements OnInit {
  user: any;
  friends: any[] = [];
  group: any = null;
  userIds: any[] = [];
  selectedFriends: any[] = [];
  constructor(
    private friendService: FriendService,
    private toastr: ToastrService,
    private authService: AuthService,
    private groupService: GroupService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<InviteFriendsComponent>
  ) {}

  async ngOnInit() {
    this.user = this.authService.getUser();
    this.group = this.data?.group;
    await this.GetFriends();
  }

  async GetFriends() {
    let res: any = await this.friendService.GetFriends(this.user.id, null);
    if (!res.data.success) {
      this.toastr.error(res.data.message);
      return;
    }
    this.friends = res?.data.data;
    console.log(this.friends);
  }

  createPayload() {
    return {
      id: this.group?.id,
      name: this.group?.name,
      description: this.group?.description,
      privacyType: this.group?.privacyType,
      profilePhoto: this.group?.profilePhoto,
      coverPhoto: this.group?.coverPhoto,
      userId: this.group?.userId,
      userIds: '',
      role: '',
      other: '',
    };
  }

  async onInviteFriends() {
    this.selectedFriends.forEach((element) => {
      this.userIds.push(
        element.userId !== this.user.id ? element.userId : element.friendId
      );
    });
    if (this.userIds?.length) {
      const payload = this.createPayload();
      payload.userIds = this.userIds.join(',');
      const res: any = await this.groupService
        .inviteFriends(payload)
        .toPromise();
      console.log(res);
      if (res.data.success) {
        this.groupService.updateMemberCount(res.data.count);
        this.dialogRef.close();
      } else {
        this.userIds = [];
        this.dialogRef.close();
        this.toastr.error('Member Already Exist');
      }
    }
  }
  getUserId(event) {
    this.selectedFriends = event;
  }
}
