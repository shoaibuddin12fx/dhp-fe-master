import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShareGroupComponent } from 'src/app/social/popup/activity-box/share-group/share-group.component';
import { TimelineShareComponent } from 'src/app/social/popup/activity-box/timeline-share/timeline-share.component';
import { CreateAdComponent } from '../popup/create-ad/create-ad.component';

@Component({
  selector: 'app-my-ads',
  templateUrl: './my-ads.component.html',
  styleUrls: ['./my-ads.component.scss'],
})
export class MyAdsComponent implements OnInit {
  constructor(public Dialog: MatDialog) {}

  ngOnInit(): void {}
  createAdDialog() {
    const DialogRef = this.Dialog.open(CreateAdComponent, {
      width: '35%',
      height: '80vh',
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
