import { Component, OnInit, OnDestroy } from '@angular/core';
import { GroupService } from 'src/app/services/groups.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit, OnDestroy {
  user: any;
  myGroupList: any[] = [];
  constructor(private groupService: GroupService) {}

  async ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('User'));
    const groupList = (await this.groupService.getAllGroups(
      this.user?.id
    )) as any;
    this.groupService.setAllGroupsObj(groupList.data);
  }
  ngOnDestroy(): void {
    this.groupService.clearGroupData();
  }
}
