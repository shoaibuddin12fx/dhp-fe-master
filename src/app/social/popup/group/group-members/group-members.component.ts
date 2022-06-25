import { GroupService } from './../../../../services/groups.service';
import { FriendService } from 'src/app/services/friend.service';
import { Component, Inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-group-members',
  templateUrl: './group-members.component.html',
  styleUrls: ['./group-members.component.scss'],
})
export class GroupMembersComponent implements OnInit {
  isAdminUsers: boolean = true;
  isAbout: boolean = true;
  users: any[] = [];
  selectedFriends: '';
  groupForm: FormGroup;
  profilePhoto = '';
  coverPhoto = '';
  title: any;
  constructor(
    private friendService: FriendService,
    private toastr: ToastrService,
    private groupService: GroupService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<GroupMembersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isAdminUsers = data.isAdminUser;
    this.isAbout = data.isAbout;
    this.users = data.data;
    this.title = data.title
  }

  ngOnInit(): void {}
  close() {
    this.dialogRef.close();
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
      }
    } catch (error) {
      this.toastr.error('Something went wrong!!');
    }
  }
}
