import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { SocialService } from 'src/app/services/social.service';
import { UserService } from 'src/app/services/user.service';
import { EditProfileImageComponent } from 'src/app/social/popup/profile/edit-profile-image/edit-profile-image.component';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  coverPhoto: string = '';
  user: any = {};
  isProfile = false;
  profileUser: any;
  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private userService: UserService,
    private socialService: SocialService
  ) {
    this.socialService.getIsProfile().subscribe((x) => {
      this.isProfile = x && x.isProfile ? x.isProfile : false;
      if (x && x.profileId) {
        this.getProfileUser(x.profileId);
      }
    });
  }

  ngOnInit() {}
  async getProfileUser(profileId) {
    const res: any = await this.userService.getById(profileId);
    this.profileUser = res.data;
  }

  get getUser() {
    const user = this.authService.getUser();
    return user;
  }
  openProfileImageDialog() {
    const DialogRef = this.dialog.open(EditProfileImageComponent, {
      width: '35%',
      height: '65vh',
      disableClose: true,
      data: {},
    });
  }
}
