import { SocialService } from 'src/app/services/social.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { EditCoverComponent } from '../popup/profile/edit-cover/edit-cover.component';
import { EditProfileComponent } from '../popup/profile/edit-profile/edit-profile.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LoaderService } from 'src/app/services/loader.service';
import { FriendService } from 'src/app/services/friend.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  coverPhoto: string = '';
  profileId: number;
  user: any;
  photos: any[] = [];
  isMyProfile = true;
  subscriptions: Subscription;
  profileData: any;
  showChatBox = false;
  chatUserProfile: any;
  // public profileId: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private userService: UserService,
    private socialService: SocialService,
    private route: ActivatedRoute,
    private router: Router,
    private loaderService: LoaderService,
    private friendService: FriendService,
    private toastr: ToastrService
  ) {
    this.subscriptions = new Subscription();
    this.route.firstChild.params.subscribe((params) => {
      this.profileId = +params['id'];
      this.user = JSON.parse(localStorage.getItem('User'));
      this.isMyProfile = +this.user.id === +this.profileId ? true : false;
      this.socialService.isProfile.next({
        isProfile: true,
        profileId: this.profileId,
      });
    });
  }

  async ngOnInit() {
    this.loaderService.PresentLoading();
    this.subscribeToRouteChanges();
    this.getPhotos();
    this.user = JSON.parse(localStorage.getItem('User'));

    if (this.isMyProfile) {
      this.profileData = await this.userService.getById(this.profileId);
    } else {
      this.profileData = await this.userService.getByProfileId(
        this.user.id,
        this.profileId
      );
    }
    this.coverPhoto = this.profileData?.data?.coverPhoto;

    this.loaderService.DissmissLoading();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.socialService.isProfile.next(null);
  }
  subscribeToRouteChanges(): void {
    this.loaderService.PresentLoading();
    const routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.route.firstChild.params.subscribe((params) => {
          this.profileId = +params['id'];
          this.user = JSON.parse(localStorage.getItem('User'));
          this.isMyProfile = +this.user.id === +this.profileId ? true : false;
          this.socialService.isProfile.next({
            isProfile: true,
            profileId: this.profileId,
          });

          this.loaderService.DissmissLoading();
        });
      });

    this.subscriptions.add(routerSubscription);
  }

  async getPhotos() {
    this.loaderService.PresentLoading();
    const res: any = await this.socialService.GetUserphoto(this.user.id);
    if (!res.data.success) {
      this.loaderService.DissmissLoading();
      return;
    }
    this.photos = res?.data?.data;
    console.log(this.photos);

    this.loaderService.DissmissLoading();
  }

  get getCoverPhoto() {
    // const user = this.authService.getUser();
    return this.coverPhoto;
  }

  openEditProfileDialog() {
    const DialogRef = this.dialog.open(EditProfileComponent, {
      width: '35%',
      height: '85vh',
      disableClose: true,
      data: {},
    });
  }
  openEditCoverDialog() {
    const DialogRef = this.dialog.open(EditCoverComponent, {
      width: '35%',
      height: '65vh',
      disableClose: true,
      data: {
        photos: this.photos,
        coverPhotoUrl: this.coverPhoto,
        userId: this.user?.id,
      },
    });
  }

  async AddFriend(friendId) {
    let o = { friendId, userId: this.user.id };
    let res: any = await this.friendService.AddFriend(o);
    if (!res.data.success) {
      this.toastr.error(res.data.message);
      return;
    }
    this.profileData.data.isFriend = true;
    this.toastr.success(res.data.message);
    return;
  }

  openChatBox(user, isOpen) {
    this.chatUserProfile = user;
    this.showChatBox = isOpen;
  }
  closeChatBox(value) {
    this.showChatBox = value;
  }
}
