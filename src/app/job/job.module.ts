import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobRoutingModule } from './job-routing.module';
import { HomeComponent } from './home/home.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { ViewComponent } from './view/view.component';
import { ManageComponent } from './manage/manage.component';
import { JobApplyComponent } from './popup/job-apply/job-apply.component';
import { CreateJobComponent } from './popup/create-job/create-job.component';
import { ReportComponent } from './popup/report/report.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    HomeComponent,
    ViewComponent,
    ManageComponent,
    JobApplyComponent,
    CreateJobComponent,
    ReportComponent,
  ],
  imports: [
    CommonModule,
    JobRoutingModule,
    MatExpansionModule,
    MatMenuModule,
    MatDialogModule,
  ],
})
export class JobModule {}
