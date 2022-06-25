import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { GroupService } from 'src/app/services/groups.service';
import { untilDestroyed } from 'src/app/services/until-destroy';
import { GroupJoinDisclaimerComponent } from 'src/app/shared/group-join-disclaimer/group-join-disclaimer.component';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss'],
})
export class DiscoverComponent implements OnInit {
  user: any;
  groupList: any[] = [];
  joinedGroups: any;
  constructor(
    private groupService: GroupService,
    public Dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('User'));

    this.groupService
      .getAllGroupsObj()
      .pipe(untilDestroyed(this))
      .subscribe((groupList) => {
        if (groupList && groupList.length > 0) {
          this.groupList = groupList.map((group) => {
            const friend =
              (group?.groupFriend || [])
                .filter((friend) => friend?.userId === this.user?.id)
                .slice(-1)[0] || {};
            return {
              ...group,
              // isRequestedToJoin: !!friend?.isRequestedToJoin,
              isAllowedToVisitPrivate:
                friend?.userId === this.user?.id && friend?.role === '2',
            };
          });
          console.log('user', this.user);
          console.log('groupList', this.groupList);
        }
      });

    this.groupService
      .getAllGroupByFriendIdObj()
      .pipe(untilDestroyed(this))
      .subscribe((g) => {
        if (g && g.length > 0) {
          this.joinedGroups = g;
        }
      });
  }

  async requestToJoin(group) {
    const response: any = await this.groupService.requestToJoin(
      group?.id,
      this.user.id,
      group?.privacyType == 'private'
    );
    if (response?.data?.success) {
      const friend = response?.data?.data;
      const i = group.groupFriend.findIndex((x) => +x.id === +friend.id);
      if (i > -1) {
        group.groupFriend.splice(i, 1, friend);
      } else {
        group.groupFriend = [...(group?.groupFriend || []), friend];
      }
      // group.isPendingRequest = true;
      group.isPostApproval = !!friend?.isPostApproval;
      group.isRequestedToJoin = !!friend?.isRequestedToJoin;
      this.setGroupData(group);
    }
  }

  async JoinPublicGroup(groupId) {
    const groupUser: any = await this.groupService.addGroupUser(
      groupId,
      this.user.id,
      false
    );
    if (groupUser.data.success) {
      const index = this.groupList.findIndex((x) => x.id === groupId);
      if (index > -1) {
        this.groupList[index].isMember = true;
        this.groupList[index].groupFriendCount++;
        this.groupService.setAllGroupByFriendIdObj(this.groupList);
      }
    }
  }

  ngOnDestroy() {}

  onOpenPost(group: any) {
    if (
      group?.privacyType === 'private' &&
      !group?.isMember &&
      !group?.isAllowedToVisitPrivate
    ) {
      const DialogRef = this.Dialog.open(GroupJoinDisclaimerComponent, {
        width: '35%',
        height: '80vh',
        disableClose: true,
        data: {
          groupPrivacy: group?.privacyType,
          groupName: group?.name,
          groupId: group?.id,
          groupCoverPhoto: group?.coverPhoto,
          user: this.user,
          isPostApproval: group?.isPostApproval,
          isRequestedToJoin: group?.isRequestedToJoin,
          isMember: group?.isMember,
        },
      });
      DialogRef.afterClosed()
        .pipe(untilDestroyed(this))
        .subscribe((response) => {
          if (response?.data?.success) {
            const friend = response?.data?.data;
            group.groupFriend = [...(group?.groupFriend || []), friend];
            group.isPostApproval = !!friend?.isPostApproval;
            group.isRequestedToJoin = !!friend?.isRequestedToJoin;
            this.setGroupData(group);
          }
        });
    }
  }

  setGroupData(group) {
    const index = this.groupList.findIndex((x) => x.id === group.id);
    if (index > -1) {
      this.groupList.splice(index, 1, group);
      this.groupService.setAllGroupsObj(this.groupList);
      this.toastr.success('Request send to join');
    }
  }
}
