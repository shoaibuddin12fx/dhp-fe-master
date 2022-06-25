import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { FriendService } from 'src/app/services/friend.service';
import { SocialService } from 'src/app/services/social.service';
import { UserService } from 'src/app/services/user.service';
import { ReportComponent } from '../../popup/activity-box/report/report.component';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss'],
})
export class FollowersComponent implements OnInit, OnDestroy {
  filteredMembers: any[] = [];
  user;

  filterOptions = ['Followers', 'Followings'];
  selectedFilterOption = '';
  search = '';
  profileId: any;
  constructor(
    private friendService: FriendService,
    private authService: AuthService,
    private toastr: ToastrService,
    public Dialog: MatDialog,
    private socialService: SocialService,
    private route: ActivatedRoute, private userService: UserService
  ) {
    this.profileId = this.route.snapshot.params['id'];
  }

  async ngOnInit() {
    this.user = this.authService.getUser();
    this.socialService.isProfile.next({
      isProfile: true,
      profileId: this.profileId,
    });
    await this.setFilterOption(this.filterOptions[0]);
  }
  ngOnDestroy(): void { }

  async getFilteredMembers() {
    const memberFilterOption: Record<string, Promise<any>> = {
      Followers: this.friendService.GetFollowers(this.profileId),
      Followings: this.friendService.GetFollowing(this.profileId ),
    };
    const res = await memberFilterOption[this.selectedFilterOption];
    if (!res.data.success) {
      this.toastr.error(res.data.message);
      return;
    }
    this.filteredMembers = res?.data.data;
  }

  async setFilterOption(option: string) {
    this.selectedFilterOption = option;
    await this.getFilteredMembers();
  }

  openReportDialog() {
    const DialogRef = this.Dialog.open(ReportComponent, {
      width: '35%',
      height: 'auto',
      disableClose: true,
      data: {},
    });
  }

  async followMember(member: any) {
    const res: any = await this.friendService.followUser(
      member.followeeId,
      member.followerId
    );
    if (!res.data.success) {
      this.toastr.error(res.data.message);
      return;
    }
    this.toastr.success('Successfully Followed');
    member.isfollowedbyyou = '1';
  }

  async unFollowMember(member: any) {
    const res: any = await this.friendService.unfollowUser(
      member.followeeId,
      member.followerId
    );
    if (!res.data.success) {
      this.toastr.error(res.data.message);
      return;
    }
    this.toastr.success('Successfully Unfollowed');
    await this.userService.updateUserData();
    member.isfollowedbyyou = '0';
  }

  async addFriend(member: any) {
    const payload = { friendId: member.followerId, userId: member.followeeId };
    const res: any = await this.friendService.AddFriend(payload);
    if (!res.data.success) {
      this.toastr.error(res.data.message);
      return;
    }
    this.toastr.success('Successfully Unfriend.');
    member.isfriend = '1';
  }

  async unFriendMember(member: any) {
    const res: any = await this.friendService.unFriendUser(
      member.followeeId,
      member.followerId
    );
    if (!res.data.success) {
      this.toastr.error(res.data.message);
      return;
    }
    this.toastr.success('Successfully Unfriend.');
    await this.userService.updateUserData();
    member.isfriend = '0';
  }
}
