import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GroupService } from 'src/app/services/groups.service';
import { untilDestroyed } from 'src/app/services/until-destroy';
import { GroupJoinDisclaimerComponent } from 'src/app/shared/group-join-disclaimer/group-join-disclaimer.component';
const PRIVATE = 'private';
@Component({
  selector: 'app-private-groups',
  templateUrl: './private-groups.component.html',
  styleUrls: ['./private-groups.component.scss'],
})
export class PrivateGroupsComponent implements OnInit, OnDestroy {
  user: any;
  groupList: any[] = [];
  constructor(
    private groupService: GroupService,
    public Dialog: MatDialog,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('User'));
    this.groupService
      .getAllGroupsObj()
      .pipe(untilDestroyed(this))
      .subscribe((groupList) => {
        if (groupList && groupList.length > 0) {
          this.groupList = groupList
            .filter((x) => x.privacyType === PRIVATE)
            .map((group) => {
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
          console.log('this.groupList', this.groupList);
        }
      });
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
    } else if (group?.isMember || group?.isAllowedToVisitPrivate) {
      this.router.navigate(['/social/groups/admin', group.id, 'feed']);
    }
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

  setGroupData(group) {
    const index = this.groupList.findIndex((x) => x.id === group.id);
    if (index > -1) {
      this.groupList.splice(index, 1, group);
      this.groupService.setAllGroupsObj(this.groupList);
      this.toastr.success('Request send to join');
    }
  }
}
