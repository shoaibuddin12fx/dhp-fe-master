import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreatePostComponent } from 'src/app/social/popup/news-feed/create-post/create-post.component';
import { VideoLinkComponent } from 'src/app/social/popup/news-feed/video-link/video-link.component';

@Component({
  selector: 'app-post-upload',
  templateUrl: './post-upload.component.html',
  styleUrls: ['./post-upload.component.scss'],
})
export class PostUploadComponent implements OnInit {
  @Output() getNewsFeed: EventEmitter<any> = new EventEmitter<any>();
  @Output() upsertPost: EventEmitter<any> = new EventEmitter<any>();
  @Input() isGroupPost = false;
  @Input() groupId = null;
  @Input() groupPostApproval = false;

  user: any;
  description = '';
  placeholder: string;
  constructor(public Dialog: MatDialog) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('User'));
    this.placeholder = `Whats new ${this.user.fullName}?`;
  }

  openCreatePostDialog(type) {
    const DialogRef = this.Dialog.open(CreatePostComponent, {
      width: '35%',
      height: '80vh',
      disableClose: true,
      data: {
        type: type,
        description: this.description,
        isGroupPost: this.isGroupPost,
        groupId: this.groupId,
        groupPostApproval: this.groupPostApproval,
      },
    });
    DialogRef.afterClosed().subscribe((result) => {
      if (result !== null && result !== undefined) {
        this.description = '';
        this.upsertPost.emit(result.post);
      }
    });
  }

  openVideoDialog(type) {
    const DialogRef = this.Dialog.open(VideoLinkComponent, {
      width: '35%',
      height: '60vh',
      disableClose: true,
      data: {
        type: type,
        description: this.description,
        isGroupPost: this.isGroupPost,
        groupId: this.groupId,
        groupPostApproval: this.groupPostApproval,
      },
    });
    DialogRef.afterClosed().subscribe((result) => {
      if (result !== null && result !== undefined) {
        this.description = '';
        this.upsertPost.emit(result.post);
      }
    });
  }
}
