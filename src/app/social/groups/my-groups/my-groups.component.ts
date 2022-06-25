import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GroupService } from 'src/app/services/groups.service';
import { untilDestroyed } from 'src/app/services/until-destroy';

@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.scss'],
})
export class MyGroupsComponent implements OnInit, OnDestroy {
  user: any;
  myGroupList: any[] = [];
  joinedGroups: any[] = [];
  constructor(private groupService: GroupService, private router: Router) {}

  async ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('User'));

    this.groupService
      .getAllGroupsObj()
      .pipe(untilDestroyed(this))
      .subscribe((groupList) => {
        if (groupList && groupList.length > 0) {
          this.myGroupList = groupList.filter((x) => x.userId === this.user.id);
        }
      });
    const groupListByFriendId = (await this.groupService.getByfriendId(
      this.user.id
    )) as any;
    this.groupService.setAllGroupByFriendIdObj(groupListByFriendId.data);
    if (groupListByFriendId.data && groupListByFriendId.data.length > 0) {
      const uniqueIds = new Set();

      const unique = groupListByFriendId.data.filter((element) => {
        const isDuplicate = uniqueIds.has(element.id);

        uniqueIds.add(element.id);

        if (!isDuplicate) {
          return true;
        }
      });

      // const gg = new Set([g])
      unique.forEach((g) => {
        const joinedGroups = g.groupFriend.find(
          (x) => x.userId === this.user.id
        );
        if (joinedGroups) {
          this.joinedGroups = this.joinedGroups.concat(g);
        }
      });
    }
    // });
  }
  ngOnDestroy() {}

  openGroup(id) {
    this.router.navigate(['/admin/feed/' + id]);
  }
}
