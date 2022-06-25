import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VolunteerRoutingModule } from './volunteer-routing.module';
import { HomeComponent } from './home/home.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { DetailViewComponent } from './detail-view/detail-view.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { TermsConditionsComponent } from './popup/terms-conditions/terms-conditions.component';
import { CreateProfileComponent } from './popup/create-profile/create-profile.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    HomeComponent,
    DetailViewComponent,
    MyProfileComponent,
    TermsConditionsComponent,
    CreateProfileComponent,
  ],
  imports: [
    CommonModule,
    VolunteerRoutingModule,
    MatRadioModule,
    MatExpansionModule,
    MatMenuModule,
    MatDialogModule,
  ],
})
export class VolunteerModule {}
