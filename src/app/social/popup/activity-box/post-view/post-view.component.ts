import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SocialService } from 'src/app/services/social.service';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.scss'],
})
export class PostViewComponent implements OnInit {
  post: any;
  currentUser: any;
  toEditComment: any;
  replyPlaceHolder: string;
  postId: any;
  constructor(
    public dialogRef: MatDialogRef<PostViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private socialService: SocialService,
    private toastr: ToastrService
  ) {
    this.post = data.post;
    this.postId = data.postId;
    if (!this.post && this.postId && typeof (this.postId) === 'number') {
      this.getPostData();
    }
  }

  ngOnInit(): void {
    if (this.post?.id) {
      this.currentUser = JSON.parse(localStorage.getItem('User'));
      this.getComment(this.post?.id);
    }
  }
  async getPostData() {
    this.currentUser = JSON.parse(localStorage.getItem('User'));
    const datass: any = await this.socialService.getSinglePost(this.postId, this.currentUser?.id);
    this.post = datass.data;
    this.getComment(this.post.id);
  }

  async Like(post, comment?, child?) {
    let obj: any;

    if (!comment && !child) {
      obj = { postId: post.id, userId: this.currentUser.id };
    }
    if (comment && !child) {
      obj = {
        postId: post.id,
        userId: this.currentUser.id,
        commentId: comment ? comment.id : null,
      };
    } else if (comment && child) {
      obj = {
        postId: post.id,
        userId: this.currentUser.id,
        commentId: child ? child.id : null,
      };
    }
    let res: any = await this.socialService.Like(obj);
    if (!res.data.success) {
      this.toastr.success(res.data.message);
      return;
    } else {
      if (!comment && !child) {
        post.isLike = !post.isLike;
        if (!post.isLike) post.likeCount -= 1;
        else post.likeCount += 1;
      } else if (comment && !child) {
        const com = post.comments.find((x) => x.id === comment.id);
        com.isLike = !com.isLike;
      } else if (comment && child) {
        const com = post.comments.find((x) => x.id === child.parentCommentId);
        const ch = com.childComment.find((x) => x.id === child.id);
        ch.isLike = !ch.isLike;
      }
    }
  }

  async AddComment(event, post, comment?) {
    if (
      event.target.value !== '' &&
      event.target.value.replace(/\s/g, '') !== ''
    ) {
      let obj = {
        postId: post.id,
        userId: this.currentUser.id,
        description: event.target.value,
        replyTo: comment && comment.userId ? comment.userId : null,
        parentCommentId: comment && comment.id ? comment.id : null,
      };
      let res: any = await this.socialService.AddComment(obj);
      if (res.data.success) {
        this.post.commentsCount++;
        // const index = this.posts.findIndex((x) => x.id === post.id);
        // if (index > -1) {
        //   this.posts[index].commentsCount++;
        // }
        // this.getNewsFeed.emit();
        this.getComment(post.id);
        this.toastr.success(res.data.message);
        return (event.target.value = '');
      }
    }
  }
  editComment(postId, commentId) {
    // this.toEditPost = postId;
    this.toEditComment = commentId;
  }

  async deleteComment(postId, commentId) {
    let res: any = await this.socialService.deleteComment(commentId);
    if (res.data.success) {
      // this.getNewsFeed.emit();
      // this.getComment(postId);
      this.post.commentsCount--;
      const commentIndex = this.post.comments.findIndex(
        (comment) => comment?.id === commentId
      );
      if (commentIndex > -1) {
        this.post.comments.splice(commentIndex, 1);
      }
      this.toastr.success(res.data.message);
    }
  }

  async UpdateComment(post, comment, id) {
    if (comment !== '') {
      let obj = {
        postId: post.id,
        userId: this.currentUser.id,
        description: comment,
      };
      let res: any = await this.socialService.EditComment(obj, id);
      if (res.data.success) {
        // this.getNewsFeed.emit();
        this.getComment(post.id);
        // this.toEditPost = 0;
        this.toEditComment = 0;
        this.toastr.success(res.data.message);
        return (comment = '');
      }
    }
  }

  replyComment(comments) {
    this.replyPlaceHolder = `reply to ${comments.firstName} ${comments.lastName}`;
  }

  async getComment(postId) {
    const comments = (await this.socialService.getComment(
      postId,
      this.currentUser.id
    )) as any;
    // const index = this.posts.findIndex((x) => x.id === postId);
    // if (index > -1) {
    this.post.comments = comments.data?.data.filter(
      (x) => x.parentCommentId === 0 || !x.parentCommentId
    );
    this.post.comments.forEach((p: any) => {
      p.childComment = comments.data?.data.filter(
        (x) => x.postId === postId && x.parentCommentId === p.id
      );
    });
    // }
  }
}
