import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatrimonialRoutingModule } from './matrimonial-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { PartnerInfoComponent } from './partner-info/partner-info.component';
import { HeaderComponent } from './sub-section/header/header.component';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { ReportComponent } from './popup/report/report.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { ProfileImageComponent } from './popup/profile-image/profile-image.component';
@NgModule({
  declarations: [
    ProfileComponent,
    MyProfileComponent,
    PartnerInfoComponent,
    HeaderComponent,
    ProfileViewComponent,
    ReportComponent,
    ProfileImageComponent,
  ],
  imports: [
    CommonModule,
    MatrimonialRoutingModule,
    MatExpansionModule,
    MatRadioModule,
    MatDialogModule,
    MatMenuModule,
  ],
})
export class MatrimonialModule {}
