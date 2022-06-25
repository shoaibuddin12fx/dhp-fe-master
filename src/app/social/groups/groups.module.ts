import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupsRoutingModule } from './groups-routing.module';
import { DiscoverComponent } from './discover/discover.component';
import { MyGroupsComponent } from './my-groups/my-groups.component';
import { PublicGroupsComponent } from './public-groups/public-groups.component';
import { PrivateGroupsComponent } from './private-groups/private-groups.component';
import { AdminComponent } from './admin/admin.component';
import { NavbarComponent } from './sub-sections/navbar/navbar.component';
import { SidebarComponent } from './sub-sections/sidebar/sidebar.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
@NgModule({
  declarations: [
    DiscoverComponent,
    MyGroupsComponent,
    PublicGroupsComponent,
    PrivateGroupsComponent,
    AdminComponent,
    NavbarComponent,
    SidebarComponent,
  ],
  imports: [
    CommonModule,
    GroupsRoutingModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatExpansionModule,
  ],
})
export class GroupsModule {}
