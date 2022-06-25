import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { FriendService } from 'src/app/services/friend.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SocialService } from 'src/app/services/social.service';
import { GroupService } from 'src/app/services/groups.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-my-feeds',
  templateUrl: './my-feeds.component.html',
  styleUrls: ['./my-feeds.component.scss'],
})
export class MyFeedsComponent implements OnInit, OnDestroy {
  feed: any = {};
  posts: any[] = [];
  currentUser: any;
  serverImageUrl;
  description = '';
  placeholder: string;

  // for widget
  friendRequests: any[] = [];
  userGroupList: any[] = [];
  photos: any[] = [];

  // pagination
  pageNo = 0;
  profileUser: any;
  profileId: any;
  pageSize = 10;
  isMyProfile = true;
  totalPostCount = 0;

  constructor(
    private loaderService: LoaderService,
    private friendService: FriendService,
    private toastr: ToastrService,
    private groupService: GroupService,
    private userService: UserService,
    private route: ActivatedRoute,
    private socialService: SocialService // public dialog: MatDialog
  ) {
    this.profileId = this.route.snapshot.params['id'];
  }
  async ngOnInit() {
    // if (this.profileId) {

    this.socialService.isProfile.next({
      isProfile: true,
      profileId: this.profileId,
    });
    this.currentUser = JSON.parse(localStorage.getItem('User'));
    this.isMyProfile = +this.currentUser.id === +this.profileId ? true : false;
    // this.loaderService.PresentLoading();
    const profileUser = (await this.userService.getById(this.profileId)) as any;
    this.profileUser = profileUser.data;
    this.placeholder = `Whats new ${this.profileUser.fullName}?`;
    this.GetRequestedFriends();
    this.getUserGroups();
    this.getPhotos();
    this.GetNewsFeed({ pageNo: this.pageNo, pageSize: this.pageSize });
    // this.loaderService.DissmissLoading();
    // }
  }
  ngOnDestroy(): void {
    this.socialService.setPostData([]);
  }

  async GetNewsFeed(
    { pageNo, pageSize } = { pageNo: this.pageNo, pageSize: this.pageSize }
  ) {
    this.loaderService.PresentLoading();
    let res: any = await this.socialService.GetMyNewsFeed(
      this.profileId,
      pageNo,
      pageSize
    );
    if (!res.data.success) {
      this.loaderService.DissmissLoading();
      return;
    }
    this.totalPostCount = res?.data?.count;
    this.posts = this.posts.concat(res?.data?.data);
    this.socialService.setPostData(this.posts);
    this.loaderService.DissmissLoading();
  }
  UpsertPost(post) {
    const index = this.posts.findIndex((x) => x.id === post.id);
    if (index > -1) {
      this.posts.splice(index, 1, post);
    } else {
      this.posts.push(post);
      this.totalPostCount++;
    }
    this.socialService.setPostData(this.posts);
  }
  deletedPost(post) {
    const index = this.posts.findIndex((x) => x.id === post.id);
    if (index > -1) {
      this.posts.splice(index, 1);
      this.totalPostCount--;
    }
    this.socialService.setPostData(this.posts);
  }
  async GetRequestedFriends() {
    let res: any = await this.friendService.GetRequestedFriends(
      this.currentUser.id
    );
    if (!res.data.success) {
      this.toastr.error(res.data.message);
      return;
    }
    this.friendRequests = res?.data.data;
  }

  async onApproveRequest(friend: any) {
    const payload = { id: friend.id, type: 'a' };
    let res: any = await this.friendService.AcceptDeclineRequest(payload);
    if (!res.data.success) {
      this.toastr.error(res.data.message);
      return;
    }
    this.removeFriendFromList(this.friendRequests, friend);
    this.toastr.success(res.data.message);
    return;
  }

  async onRejectRequest(friend: any) {
    Swal.fire({
      title: 'Are you sure you want to Decline Request!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const payload = { id: friend.id, type: 'd' };
        let res: any = await this.friendService.AcceptDeclineRequest(payload);

        if (!res.data.success) {
          this.toastr.error(res.data.message);
          return;
        }
        this.removeFriendFromList(this.friendRequests, friend);
        this.toastr.success(res.data.message);
        return;
      }
      return;
    });
  }

  removeFriendFromList(friendList: any[], friend: any) {
    const friendIndex = friendList.findIndex((frnd) => frnd.id === friend.id);
    if (friendIndex > -1) {
      friendList.splice(friendIndex, 1);
    }
  }

  async getUserGroups() {
    const groupList = (await this.groupService.getAllGroups(
      this.currentUser?.id
    )) as any;
    if (groupList?.data?.length) {
      this.userGroupList = groupList?.data
        ?.filter((group) => group.userId === this.currentUser.id)
        .slice(0, 3);
    }
  }

  async getPhotos(type = 2) {
    // this.loaderService.PresentLoading();
    const res: any = await this.socialService.GetUserphoto(this.currentUser.id);
    if (!res.data.success) {
      // this.toastr.success(res.data.message);
      // this.loaderService.DissmissLoading();
      return;
    }
    this.photos = res?.data?.data;

    // this.loaderService.DissmissLoading();
  }
}
