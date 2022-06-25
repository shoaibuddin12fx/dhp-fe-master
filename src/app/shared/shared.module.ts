import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityBoxComponent } from './activity-box/activity-box.component';
import { ContactPopupComponent } from './contact-popup/contact-popup.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { PostUploadComponent } from './post-upload/post-upload.component';
import { SharePopupComponent } from './share-popup/share-popup.component';
import { DateAgoPipe } from '../pipes/pipes/date-ago.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MemberItemComponent } from './member-item/member-item.component';
import { WidgetWrapperComponent } from './widget-wrapper/widget-wrapper.component';
import { FriendRequestWidgetComponent } from './friend-request-widget/friend-request-widget.component';
import { PhotosWidgetComponent } from './photos-widget/photos-widget.component';
import { GroupsWidgetComponent } from './groups-widget/groups-widget.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { RouterModule } from '@angular/router';
import { GroupMemberItemComponent } from './group-member-item/group-member-item.component';
import { GroupJoinDisclaimerComponent } from './group-join-disclaimer/group-join-disclaimer.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ChatPopupComponent } from './chat-popup/chat-popup.component';
import { SafePipe } from '../pipes/safe.pipe';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { PipesModule } from 'w-ng5';

@NgModule({
  declarations: [
    DateAgoPipe,
    ContactPopupComponent,
    ActivityBoxComponent,
    PostUploadComponent,
    SharePopupComponent,
    MemberItemComponent,
    WidgetWrapperComponent,
    FriendRequestWidgetComponent,
    GroupsWidgetComponent,
    PhotosWidgetComponent,
    GroupMemberItemComponent,
    GroupJoinDisclaimerComponent,
    FileUploadComponent,
    ChatPopupComponent,
    SafePipe,
  ],
  imports: [
    MatMenuModule,
    MatSlideToggleModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    RouterModule,
    MatDialogModule,
    PickerModule,
    PipesModule,
  ],
  exports: [
    DateAgoPipe,
    ContactPopupComponent,
    ActivityBoxComponent,
    PostUploadComponent,
    SharePopupComponent,
    MemberItemComponent,
    WidgetWrapperComponent,
    FriendRequestWidgetComponent,
    GroupsWidgetComponent,
    PhotosWidgetComponent,
    GroupMemberItemComponent,
    GroupJoinDisclaimerComponent,
    FileUploadComponent,
    ChatPopupComponent,
    SafePipe,
  ],
})
export class SharedModule {}
