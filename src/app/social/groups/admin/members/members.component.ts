import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { FriendService } from 'src/app/services/friend.service';
import { GroupService } from 'src/app/services/groups.service';
import { untilDestroyed } from 'src/app/services/until-destroy';
import { UserService } from 'src/app/services/user.service';
import { GroupMembersComponent } from 'src/app/social/popup/group/group-members/group-members.component';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
})
export class MembersComponent implements OnInit, OnDestroy {
  groupId: number;
  groupUsers: any[] = [];
  groupAdmins: any[] = [];
  allMembers: any[] = [];
  totalMembers: number = 0;
  friendIds: number[] = [];
  myFriends: any[] = [];
  requestIds: number[] = [];
  currentMonthMember: any[] = [];
  searchText: string = '';
  constructor(
    public Dialog: MatDialog,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private friendService: FriendService,
    private userService: AuthService,
    private groupService: GroupService
  ) {
    this.route.params.subscribe((params) => {
      this.groupId = +params['id'];
    });
  }

  ngOnInit(): void {
    this.getMembers();
    this.groupService.updateMemberCount$
      .pipe(untilDestroyed(this))
      .subscribe((x) => {
        if (x > 0) {
          this.totalMembers = this.totalMembers + x;
        }
      });
  }
  ngOnDestroy() { }
  filter(): any[] {
    if (this.searchText == '') {
      return [];
    }
    return this.allMembers.filter(
      (item) =>
        item.fullName.toLowerCase().indexOf(this.searchText.toLowerCase()) !==
        -1
    );
  }
  getMembers() {
    const user = this.userService.getUser();
    forkJoin(
      this.groupService.getGroupMembers(this.groupId, 1),
      this.groupService.getGroupMembers(this.groupId, 2),
      this.friendService.getMyfriendIds(user.id)
    ).subscribe((res: any) => {
      console.log('res', res);
      this.groupUsers = res[0].data;
      this.groupAdmins = res[1].data;
      this.totalMembers = res[0].data.length + res[1].data.length;
      this.allMembers = [...res[0].data, ...res[1].data].sort();
      const currentMonth = '0' + (new Date().getMonth() + 1);
      const currentYear = new Date().getFullYear();
      this.currentMonthMember = [...res[0].data, ...res[1].data].filter((e) => {
        const dateStr = currentYear + '-' + currentMonth;
        return e.createdDate.indexOf(dateStr) !== -1;
      });
      const userids = res[2].data.data.friendIds.map((x) => x.userId);
      const friendids = res[2].data.data.friendIds.map((x) => x.friendId);
      const reqIds = res[2].data.data.requestUserIds;
      this.friendIds = [...new Set([...userids, ...friendids])];
      this.myFriends = [
        ...this.allMembers.filter((element) =>
          this.friendIds.includes(element.userid)
        ),
      ];
    });
  }
  async GroupMembersDialog(data: any[], title: any) {
    const DialogRef = this.Dialog.open(GroupMembersComponent, {
      width: '35%',
      height: '95vh',
      disableClose: true,
      data: {
        isAdminUser: true,
        title: title,
        data: data,
        isAbout: false,
      },
    });
    DialogRef.afterClosed().subscribe((result) => {
      this.getMembers();
    });
  }
  async onPostApproval(item, event) {
    try {
      const res = await this.groupService.onPostApproval(
        item.id,
        event.checked
      );
      if (res) {
        this.toastr.success('Updated Successfully!!');
      }
    } catch (error) {
      this.toastr.error('Something went wrong!!');
    }
  }
  async removeAsAdmin(item) {
    try {
      const res = await this.groupService.removeAsAdmin(item.id);
      if (res) {
        this.toastr.success('Updated Successfully!!');
        this.getMembers();
      }
    } catch (error) {
      this.toastr.error('Something went wrong!!');
    }
  }
  async blockFromGroup(item) {
    try {
      const res = await this.groupService.blockFromGroup(item.id);
      if (res) {
        this.toastr.success('Updated Successfully!!');
        this.getMembers();
      }
    } catch (error) {
      this.toastr.error('Something went wrong!!');
    }
  }
  async removeMember(item) {
    try {
      const res = await this.groupService.removeMember(item.id);
      if (res) {
        this.toastr.success('Updated Successfully!!');
        this.getMembers();
      }
    } catch (error) {
      this.toastr.error('Something went wrong!!');
    }
  }
  async addAsAdmin(item) {
    try {
      const res = await this.groupService.addAsAdmin(item.id);
      if (res) {
        this.toastr.success('Updated Successfully!!');
        this.getMembers();
      }
    } catch (error) {
      this.toastr.error('Something went wrong!!');
    }
  }
}
