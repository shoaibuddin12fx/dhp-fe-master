import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from 'src/app/services/groups.service';
import { CreateGroupComponent } from '../../popup/group/create-group/create-group.component';
import { InviteFriendsComponent } from '../../popup/group/invite-friends/invite-friends.component';
import { untilDestroyed } from 'src/app/services/until-destroy';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, OnDestroy {
  groupId: any;
  user: any;
  group: any = {};
  subscription: Subscription;
  isGroupAdmin = false;
  constructor(
    public Dialog: MatDialog,
    private route: ActivatedRoute,
    private groupService: GroupService
  ) {
    this.route.firstChild.params.subscribe((params) => {
      this.groupId = +params['id'];
    });
  }

  async ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('User'));
    const res: any = await this.groupService.getById(
      this.groupId,
      this.user?.id
    );
    if (res) {
      this.group = res.data;
      const index = this.group?.groupFriend.findIndex(x => x.userId === this.user.id);
      if (index > -1) {
       this.isGroupAdmin = +this.group?.groupFriend[index].role === 2 ? true : false
      }
      // this.isGroupAdmin = this.-?.userId === this.user?.id;
    }
    this.groupService.updateMemberCount$
      .pipe(untilDestroyed(this))
      .subscribe((x) => {
        if (x > 0) {
          this.group.groupFriendCount = this.group.groupFriendCount + x;
        }
      });
    this.subscription = this.groupService
      .getGroupUpdateMessage()
      .subscribe((message) => {
        this.getGroupData();
        this.groupService.clearGroupUpdateMessage();
      });
  }
  async getGroupData() {
    const res: any = await this.groupService.getById(
      this.groupId,
      this.user?.id
    );
    if (res) {
      this.group = res.data;
    }
  }
  async createGroupDialog() {
    const DialogRef = this.Dialog.open(CreateGroupComponent, {
      width: '35%',
      height: '95vh',
      disableClose: true,
      data: {
        groupId: this.groupId,
      },
    });
    DialogRef.afterClosed().subscribe(async (x) => {
      await this.getGroupData();
    });
  }
  inviteFriendDialog() {
    const DialogRef = this.Dialog.open(InviteFriendsComponent, {
      width: '35%',
      height: '40vh',
      disableClose: true,
      data: {
        group: this.group,
      },
    });
    DialogRef.afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((response) => {
        if (response?.data?.success) {
        }
      });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
