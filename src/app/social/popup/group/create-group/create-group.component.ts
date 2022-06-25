import { GroupService } from './../../../../services/groups.service';
import { FriendService } from 'src/app/services/friend.service';
import { Component, Inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss'],
})
export class CreateGroupComponent implements OnInit {
  user: any;
  friends: any[] = [];
  selectedFriends: '';
  groupForm: FormGroup;
  profilePhoto = '';
  coverPhoto = '';
  group: any = {};
  isFriendShow = true;
  constructor(
    private friendService: FriendService,
    private toastr: ToastrService,
    private groupService: GroupService,
    private authService: AuthService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  async ngOnInit() {
    this.user = this.authService.getUser();
    await this.GetFriends();
    if (this.data.groupId) {
      this.isFriendShow = false;
      const res: any = await this.groupService.getById(
        this.data.groupId,
        this.user?.id
      );
      if (res) {
        this.group = res.data;
        this.profilePhoto = this.group.profilePhoto;
        this.coverPhoto = this.group.coverPhoto;
      }
    }

    this.createForm();
  }

  get getCoverPhoto() {
    const user = this.authService.getUser();
    return user;
  }
  createForm() {
    this.groupForm = this.fb.group({
      id: [this.group ? this.group.id : 0],
      name: [
        this.group ? this.group.name : '',
        Validators.compose([Validators.required]),
      ],
      description: [this.group ? this.group.description : ''],
      privacyType: [this.group ? this.group.privacyType : ''],
      profilePhoto: [this.group ? this.group.profilePhoto : ''],
      coverPhoto: [this.group ? this.group.coverPhoto : ''],
      userId: [''],
      userIds: [''],
      role: [''],
      other: [''],
    });
  }
  async GetFriends() {
    let res: any = await this.friendService.GetFriends(this.user.id, null);
    if (!res.data.success) {
      this.toastr.error(res.data.message);
      return;
    }
    this.friends = res?.data.data;
  }

  async save() {
    if (this.groupForm.valid) {
      this.groupForm.value.userId = this.user.id.toString();
      this.groupForm.value.userIds = this.groupForm.value.userIds.toString();
      try {
        if (this.groupForm.value.id <= 0) {
          const res = await this.groupService.addGroupData(
            this.groupForm.value
          );
          this.toastr.success('Created Successfully');
        } else {
          const res = await this.groupService.updateGroup(this.groupForm.value);
          this.toastr.success('Updated Successfully');
        }
        this.dialogRef.close('saved');
      } catch (error) {
        this.toastr.error(error.error.meta.message);
      }
    }
  }
  getName(event: EventTarget) {
    console.log(event);
  }
  onProfileChange(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      let This = this;
      reader.onload = (event: any) => {
        this.profilePhoto = event.target.result;
        this.groupForm.controls['profilePhoto'].setValue(this.profilePhoto);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  onCoverChange(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      let This = this;
      reader.onload = (event: any) => {
        this.coverPhoto = event.target.result;
        this.groupForm.controls['coverPhoto'].setValue(this.coverPhoto);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
}
