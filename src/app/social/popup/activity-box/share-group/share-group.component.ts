import { GroupService } from './../../../../services/groups.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SocialService } from 'src/app/services/social.service';

@Component({
  selector: 'app-share-group',
  templateUrl: './share-group.component.html',
  styleUrls: ['./share-group.component.scss'],
})
export class ShareGroupComponent implements OnInit {
  user: any;
  myGroupList: any[] = [];
  joinedGroups: any[] = [];
  myGroups: any[] = [];
  placeholder: string;
  post: any;
  showLoading = false;
  search = '';

  constructor(public dialogRef: MatDialogRef<ShareGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private socialService: SocialService, private groupService: GroupService) {
    this.post = data.post;
  }

  async ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('User'));
    this.placeholder = `Whats new ${this.user.fullName}?`;
    const promises = [];
    promises.push(await this.groupService.getGroupsByUserId(this.user.id));
    promises.push(await this.groupService.getByfriendId(this.user.id));
    Promise.all(promises).then((g) => {
      if (g[0] && g[0].data.length > 0) {
        this.myGroupList = g[0].data.filter((x) => x.userId === this.user.id);
      }

      if (g[1] && g[1].data.length > 0) {
        this.joinedGroups = g[1].data.filter((x) => x.userId === this.user.id);
      }
      this.myGroups = this.myGroupList.concat(this.joinedGroups);
    });

  }

  async share(id) {
    this.post.isSharedPost = true;
    this.post.isGroupPost = true;
    const data = {
      userId: this.post.userId,
      mediaUrl: this.post?.url[0]?.url || '',
      mediaTitle: this.post?.url[0]?.title || '',
      mediaType: this.post.type,
      isGroupPost: this.post.isGroupPost,
      // groupId: this.post.groupId,
      isSharedPost: this.post.isSharedPost,
      sharedBy: this.user.id,
      description: this.post.description,
      sharedDescription: '',
      parentPostId: this.post?.id,
      groupId: id,
    };
    console.log(data);
    this.showLoading = true;

    const post = (await this.socialService.UploadPost(data)) as any;
    this.post.isSharedPost = false;
    this.post.isGroupPost = false;
    this.showLoading = false;
    this.dialogRef.close(post.data);
  }
}
