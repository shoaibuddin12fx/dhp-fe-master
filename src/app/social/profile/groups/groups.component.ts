import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GroupService } from 'src/app/services/groups.service';
import { SocialService } from 'src/app/services/social.service';
import { untilDestroyed } from 'src/app/services/until-destroy';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit, OnDestroy {
  user: any;
  myGroupList: any[] = [];
  joinedGroups: any[] = [];
  search: string = '';
  constructor(
    private groupService: GroupService,
    private router: Router,
    private socialService: SocialService
  ) {}

  async ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('User'));
    this.socialService.isProfile.next({
      isProfile: true,
      profileId: this.user.id,
    });
    const promises = [];
    promises.push(await this.groupService.getGroupsByUserId(this.user.id));
    promises.push(await this.groupService.getByfriendId(this.user.id));
    Promise.all(promises).then((g) => {
      if (g[0] && g[0].data.length > 0) {
        this.myGroupList = g[0].data.filter((x) => x.userId === this.user.id);
      }

      if (g[1] && g[1].data.length > 0) {
        this.joinedGroups = g[1].data.filter((x) => x.userId === this.user.id);
      }
    });
  }
  ngOnDestroy(): void {}

  openGroup(id) {
    this.router.navigate(['/admin/feed/' + id]);
  }
}
