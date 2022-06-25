import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroupService } from 'src/app/services/groups.service';
import { untilDestroyed } from 'src/app/services/until-destroy';
import { CreateGroupComponent } from 'src/app/social/popup/group/create-group/create-group.component';
import { GroupJoinDisclaimerComponent } from 'src/app/shared/group-join-disclaimer/group-join-disclaimer.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Output() updatedGroup: EventEmitter<any> = new EventEmitter<any>();
  private searchSubscription: any;
  joinedGroups: any[] = [];
  groupList: any[] = [];
  searchResults: any[] = [];
  user: any;
  constructor(
    public Dialog: MatDialog,
    private groupService: GroupService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('User'));
    // this.groupService.getAllGroupsObj().pipe(untilDestroyed(this)).subscribe((groupList) => {
    //     if (groupList && groupList.length > 0) {
    //       this.groupList = groupList;
    //     }
    //   });
    // this.groupService.getAllGroupByFriendIdObj().pipe(untilDestroyed(this)).subscribe((g) => {
    //     if (g && g.length > 0) {
    //       this.joinedGroups = g;
    //     }
    //   });
  }

  ngOnDestroy() {}
  searchGroup(e) {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    this.searchSubscription = this.groupService
      .searchGroup(e)
      .subscribe((res: any) => {
        if (!res.data.success) {
          return;
        }
        this.groupList = res.data.data;
        if (this.groupList && this.groupList.length > 0) {
          this.groupList = this.groupList.map((group) => {
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
  }
  async createGroupDialog() {
    const DialogRef = this.Dialog.open(CreateGroupComponent, {
      width: '35%',
      height: '95vh',
      disableClose: true,
      data: {},
    });
    DialogRef.afterClosed().subscribe((result) => {
      if (result !== null && result !== undefined) {
        this.getMyGroups();
      }
    });
  }
  async getMyGroups() {
    const groupList = (await this.groupService.getAllGroups(
      this.user?.id
    )) as any;
    this.groupService.setAllGroupsObj(groupList.data);
  }

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
            this.upsertPost(group);
          }
        });
    }
  }
  upsertPost(group) {
    this.updatedGroup.emit(group);
  }
}
