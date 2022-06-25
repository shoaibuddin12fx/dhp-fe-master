import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from 'w-ng5';
import { ProfileRoutingModule } from './profile-routing.module';
import { FriendsComponent } from './friends/friends.component';
import { FollowersComponent } from './followers/followers.component';
import { GroupsComponent } from './groups/groups.component';
import { EventsComponent } from './events/events.component';
import { AboutComponent } from './about/about.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AboutPrivacyDataComponent } from './about/about-privacy-data.component';

@NgModule({
  declarations: [
    FriendsComponent,
    FollowersComponent,
    GroupsComponent,
    EventsComponent,
    AboutPrivacyDataComponent,
    AboutComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    ProfileRoutingModule,
    MatTabsModule,
    MatDialogModule,
    MatMenuModule,
    SharedModule,
    PipesModule,
  ],
})
export class ProfileModule {}
