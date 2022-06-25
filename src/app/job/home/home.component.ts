import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShareGroupComponent } from 'src/app/social/popup/activity-box/share-group/share-group.component';
import { TimelineShareComponent } from 'src/app/social/popup/activity-box/timeline-share/timeline-share.component';
import { CreateJobComponent } from '../popup/create-job/create-job.component';
import { ReportComponent } from '../popup/report/report.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(public Dialog: MatDialog) {}

  ngOnInit(): void {}
  createJobDialog() {
    const DialogRef = this.Dialog.open(CreateJobComponent, {
      width: '35%',
      height: '90vh',
      disableClose: true,
      data: {},
    });
  }
  openReportDialog() {
    const DialogRef = this.Dialog.open(ReportComponent, {
      width: '35%',
      height: '52vh',
      disableClose: true,
      data: {},
    });
  }
  sharePostDialog() {
    const DialogRef = this.Dialog.open(ShareGroupComponent, {
      width: '35%',
      height: '50vh',
      disableClose: true,
      data: {},
    });
  }
  timelineShareDialog() {
    const DialogRef = this.Dialog.open(TimelineShareComponent, {
      width: '35%',
      height: '90vh',
      disableClose: true,
      data: {},
    });
  }
}
