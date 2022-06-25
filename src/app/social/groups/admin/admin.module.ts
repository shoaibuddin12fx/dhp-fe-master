import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { FeedComponent } from './feed/feed.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AboutComponent } from './about/about.component';
import { MembersComponent } from './members/members.component';
import { EventsComponent } from './events/events.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatPaginatorModule } from '@angular/material/paginator';
@NgModule({
  declarations: [
    FeedComponent,
    AboutComponent,
    MembersComponent,
    EventsComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    AdminRoutingModule,
    MatTabsModule,
    MatMenuModule,
    MatSlideToggleModule,
    SharedModule,
    InfiniteScrollModule,
    MatPaginatorModule,
  ],
})
export class AdminModule {}
