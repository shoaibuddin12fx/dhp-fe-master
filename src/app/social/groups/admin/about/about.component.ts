import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { GroupService } from 'src/app/services/groups.service';
import { SocialService } from 'src/app/services/social.service';
import { GroupMembersComponent } from 'src/app/social/popup/group/group-members/group-members.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  groupId: any;
  groupRules: any[] = [];
  allMembers: any[] = [];
  group: any = {};
  user: any;
  constructor(
    public Dialog: MatDialog,
    private route: ActivatedRoute,
    private socialService: SocialService,
    private groupService: GroupService,
    private toastr: ToastrService
  ) {
    this.groupId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('User'));
    this.getGroupData();
    forkJoin(
      this.groupService.getGroupMembers(this.groupId, 1),
      this.groupService.getGroupMembers(this.groupId, 2),
      this.groupService.getGroupRules(this.groupId)
    ).subscribe((res: any) => {
      this.groupRules = res[2].data?.data;
      this.allMembers = [...res[0].data, ...res[1].data].sort();
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
  async GetGroupRules() {
    let res: any = await this.groupService.getGroupRules(this.groupId);

    this.groupRules = res?.data?.data;
  }
  async GroupMembersDialog(data: any[]) {
    const DialogRef = this.Dialog.open(GroupMembersComponent, {
      width: '35%',
      height: '95vh',
      disableClose: true,
      data: {
        isAdminUser: true,
        data: data,
        isAbout: true,
      },
    });
  }
}
