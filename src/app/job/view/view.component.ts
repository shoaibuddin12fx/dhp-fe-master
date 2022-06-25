import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShareGroupComponent } from 'src/app/social/popup/activity-box/share-group/share-group.component';
import { TimelineShareComponent } from 'src/app/social/popup/activity-box/timeline-share/timeline-share.component';
import { JobApplyComponent } from '../popup/job-apply/job-apply.component';
import { ReportComponent } from '../popup/report/report.component';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  constructor(public Dialog: MatDialog) {}

  ngOnInit(): void {}
  jobApplyDialog() {
    const DialogRef = this.Dialog.open(JobApplyComponent, {
      width: '35%',
      height: '76vh',
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
