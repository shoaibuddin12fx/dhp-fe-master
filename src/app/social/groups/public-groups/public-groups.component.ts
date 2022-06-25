import { Component, OnDestroy, OnInit } from '@angular/core';
import { GroupService } from 'src/app/services/groups.service';
import { untilDestroyed } from 'src/app/services/until-destroy';
const PUBLIC = 'public';
@Component({
  selector: 'app-public-groups',
  templateUrl: './public-groups.component.html',
  styleUrls: ['./public-groups.component.scss'],
})
export class PublicGroupsComponent implements OnInit, OnDestroy {
  user: any;
  groupList: any[] = [];
  constructor(private groupService: GroupService) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('User'));
    this.groupService
      .getAllGroupsObj()
      .pipe(untilDestroyed(this))
      .subscribe((groupList) => {
        if (groupList && groupList.length > 0) {
          this.groupList = groupList.filter((x) => x.privacyType === PUBLIC);
          console.log('groupList', this.groupList);
        }
      });
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
}
