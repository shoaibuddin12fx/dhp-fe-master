import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileViewRoutingModule } from './profile-view-routing.module';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { PartnerDetailComponent } from './partner-detail/partner-detail.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [UserDetailComponent, PartnerDetailComponent],
  imports: [
    CommonModule,
    ProfileViewRoutingModule,
    MatExpansionModule,
    MatRadioModule,
    MatDialogModule,
  ],
})
export class ProfileViewModule {}
