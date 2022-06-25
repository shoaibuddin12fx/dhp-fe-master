import { Component, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupService } from 'src/app/services/groups.service';

@Component({
  selector: 'app-group-join-disclaimer',
  templateUrl: './group-join-disclaimer.component.html',
  styleUrls: ['./group-join-disclaimer.component.scss'],
})
export class GroupJoinDisclaimerComponent implements OnInit {
  groupName = '';
  groupId = null;
  groupPrivacy = '';
  groupCoverPhoto = '';
  isRequestedToJoin = false;
  isPostApproval = false;
  user: any = null;

  title = 'Join Group';
  isMember: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<GroupJoinDisclaimerComponent>,
    private groupService: GroupService
  ) {}

  ngOnInit() {
    this.setDialogData();
  }

  setDialogData() {
    this.groupName = this.data?.groupName;
    this.groupId = this.data?.groupId;
    this.groupCoverPhoto = this.data?.groupCoverPhoto;
    this.isRequestedToJoin = this.data?.isRequestedToJoin;
    this.isPostApproval = this.data?.isPostApproval;
    this.user = this.data?.user;
    this.groupPrivacy = this.data?.groupPrivacy;
    this.isMember = this.data?.isMember;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  async requestToJoin() {
    const response = await this.groupService.requestToJoin(
      this.groupId,
      this.user.id,
      this.groupPrivacy == 'private'
    );
    this.dialogRef.close(response);
  }
}
