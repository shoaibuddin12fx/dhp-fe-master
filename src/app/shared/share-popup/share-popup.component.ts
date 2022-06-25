import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShareGroupComponent } from 'src/app/social/popup/activity-box/share-group/share-group.component';
import { TimelineShareComponent } from 'src/app/social/popup/activity-box/timeline-share/timeline-share.component';

@Component({
  selector: 'app-share-popup',
  templateUrl: './share-popup.component.html',
  styleUrls: ['./share-popup.component.scss'],
})
export class SharePopupComponent implements OnInit {
  @Input() post: any;
  @Output() upsertPost: EventEmitter<any> = new EventEmitter<any>();
  constructor(public Dialog: MatDialog) {}

  ngOnInit(): void {}
  sharePostDialog() {
    const DialogRef = this.Dialog.open(ShareGroupComponent, {
      width: '35%',
      height: '50vh',
      disableClose: true,
      data: { post: this.post },
    });
    DialogRef.afterClosed().subscribe((result) => {
      if (result !== null && result !== undefined && result !== '') {
        this.upsertPost.emit(result.post);
      }
    });
  }
  timelineShareDialog() {
    const DialogRef = this.Dialog.open(TimelineShareComponent, {
      width: '35%',
      height: '90vh',
      disableClose: true,
      data: { post: this.post },
    });
    DialogRef.afterClosed().subscribe((result) => {
      if (result !== null && result !== undefined && result !== '') {
        this.upsertPost.emit(result.post);
      }
    });
  }
}
