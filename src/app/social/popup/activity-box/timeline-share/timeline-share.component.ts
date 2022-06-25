import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SocialService } from 'src/app/services/social.service';

@Component({
  selector: 'app-timeline-share',
  templateUrl: './timeline-share.component.html',
  styleUrls: ['./timeline-share.component.scss'],
})
export class TimelineShareComponent implements OnInit {
  post: any;
  user: any;
  placeholder: string;
  sharedDescription: '';
  showLoading = false;

  constructor(
    public dialogRef: MatDialogRef<TimelineShareComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private socialService: SocialService
  ) {
    this.post = data.post;
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('User'));
    this.placeholder = `Whats new ${this.user.fullName}?`;
  }

  async share() {
    this.post.isSharedPost = true;
    const data = {
      userId: this.post.userId,
      mediaUrl:
        this.post?.url.length > 0
          ? this.post?.url[0]?.url
          : this.post?.url?.url || '',
      mediaTitle:
        this.post?.url.length > 0
          ? this.post?.url[0]?.title
          : this.post?.url.title || '',
      mediaType: this.post.type,
      isGroupPost: this.post.isGroupPost,
      groupId: this.post.groupId,
      isSharedPost: this.post.isSharedPost,
      sharedBy: this.user.id,
      description: this.post.description,
      sharedDescription: this.sharedDescription,
      parentPostId: this.post?.id,
    };
    console.log(data);
    this.showLoading = true;

    const post = (await this.socialService.UploadPost(data)) as any;
    this.post.isSharedPost = false;
    this.showLoading = false;
    this.dialogRef.close(post.data);
  }
}
