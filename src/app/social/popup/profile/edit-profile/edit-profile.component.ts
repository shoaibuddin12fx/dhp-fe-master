import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { CreateGroupComponent } from '../../group/create-group/create-group.component';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  user: any = {};
  groupForm: FormGroup;
  profilePhoto = '';
  coverPhoto = '';
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CreateGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    const res = this.getUser();
    this.createForm(res);
  }
  getUser() {
    const user = this.authService.getUser();
    this.coverPhoto = user.coverPhoto;
    this.profilePhoto = user.profilePhoto;
    this.user = user;
    return user;
  }

  createForm(user: any) {
    this.groupForm = this.fb.group({
      firstName: [user.firstName],
      fullName: [user.fullName],
      lastName: [user.lastName],
      bio: [user.bio],
      profilePhoto: [user.profilePhoto],
      coverPhoto: [user.coverPhoto],
      userId: [user.id],
    });
  }

  async save() {
    if (this.groupForm.valid) {
      this.groupForm.value.userId = this.user.id.toString();
      try {
        const res: any = await this.userService.editProfile(
          this.groupForm.value
        );
        await this.userService.updateUserData();
        this.toastr.success('Created Successfully');
        this.dialogRef.close('saved');
      } catch (error) {
        this.toastr.error(error.error.meta.message);
      }
    }
  }
  onProfileChange(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.profilePhoto = event.target.result;
        this.groupForm.controls['profilePhoto'].setValue(this.profilePhoto);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  onCoverChange(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.coverPhoto = event.target.result;
        this.groupForm.controls['coverPhoto'].setValue(this.coverPhoto);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
}
