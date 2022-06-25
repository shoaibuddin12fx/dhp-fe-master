import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocialRoutingModule } from './social-routing.module';
import { SocialComponent } from './social.component';
import { NewsFeedComponent } from './news-feed/news-feed.component';
import { GroupsComponent } from './groups/groups.component';
import { FriendsComponent } from './friends/friends.component';
import { PhotosComponent } from './photos/photos.component';
import { WatchComponent } from './watch/watch.component';
import { ProfileComponent } from './profile/profile.component';
import { MyFeedsComponent } from './profile/my-feeds/my-feeds.component';
import { CreatePostModalComponent } from './modals/create-post-modal/create-post-modal.component';
import { DateAgoPipe } from '../pipes/pipes/date-ago.pipe';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HobbiesComponent } from './popup/profile/hobbies/hobbies.component';
import { GenderComponent } from './popup/profile/gender/gender.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DOBComponent } from './popup/profile/dob/dob.component';
import { RelationshipComponent } from './popup/profile/relationship/relationship.component';
import { WorkComponent } from './popup/profile/work/work.component';
import { CollegeComponent } from './popup/profile/college/college.component';
import { SchoolComponent } from './popup/profile/school/school.component';
import { CityComponent } from './popup/profile/city/city.component';
import { NumberComponent } from './popup/profile/number/number.component';
import { EmailComponent } from './popup/profile/email/email.component';
import { MatRadioModule } from '@angular/material/radio';
import { EditProfileComponent } from './popup/profile/edit-profile/edit-profile.component';
import { EditCoverComponent } from './popup/profile/edit-cover/edit-cover.component';
import { EditProfileImageComponent } from './popup/profile/edit-profile-image/edit-profile-image.component';
import { CreateGroupComponent } from './popup/group/create-group/create-group.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { CreatePostComponent } from './popup/news-feed/create-post/create-post.component';
import { VideoLinkComponent } from './popup/news-feed/video-link/video-link.component';
import { SharedModule } from '../shared/shared.module';
import { LikePostComponent } from './popup/activity-box/like-post/like-post.component';
import { PostViewComponent } from './popup/activity-box/post-view/post-view.component';
import { InviteFriendsComponent } from './popup/group/invite-friends/invite-friends.component';
import { ShareGroupComponent } from './popup/activity-box/share-group/share-group.component';
import { TimelineShareComponent } from './popup/activity-box/timeline-share/timeline-share.component';
import { GroupRulesComponent } from './popup/group/group-rules/group-rules.component';
import { ReportComponent } from './popup/activity-box/report/report.component';
import { MatMenuModule } from '@angular/material/menu';
import { PhotoComponent } from './popup/photo/photo.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { GroupMembersComponent } from './popup/group/group-members/group-members.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PipesModule } from 'w-ng5';
@NgModule({
  declarations: [
    // DateAgoPipe,
    SocialComponent,
    NewsFeedComponent,
    GroupsComponent,
    FriendsComponent,
    PhotosComponent,
    WatchComponent,
    ProfileComponent,
    MyFeedsComponent,
    CreatePostModalComponent,
    HobbiesComponent,
    GenderComponent,
    DOBComponent,
    RelationshipComponent,
    WorkComponent,
    CollegeComponent,
    SchoolComponent,
    CityComponent,
    NumberComponent,
    EmailComponent,
    EditProfileComponent,
    EditCoverComponent,
    EditProfileImageComponent,
    CreateGroupComponent,
    GroupMembersComponent,
    CreatePostComponent,
    VideoLinkComponent,
    LikePostComponent,
    PostViewComponent,
    InviteFriendsComponent,
    ShareGroupComponent,
    TimelineShareComponent,
    GroupRulesComponent,
    ReportComponent,
    PhotoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SocialRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    SweetAlert2Module,
    MatProgressBarModule,
    MatDialogModule,
    MatRadioModule,
    MatExpansionModule,
    SharedModule,
    MatMenuModule,
    NgSelectModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    PipesModule
  ],
  providers: [],
})
export class SocialModule {}
