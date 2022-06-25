import { untilDestroyed } from 'src/app/services/until-destroy';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SocialService } from 'src/app/services/social.service';
import { LikePostComponent } from 'src/app/social/popup/activity-box/like-post/like-post.component';
import { PostViewComponent } from 'src/app/social/popup/activity-box/post-view/post-view.component';
import { ReportComponent } from 'src/app/social/popup/activity-box/report/report.component';
import { DomSanitizer } from '@angular/platform-browser';
import { CreatePostComponent } from 'src/app/social/popup/news-feed/create-post/create-post.component';
import { LoaderService } from 'src/app/services/loader.service';
import { FriendService } from 'src/app/services/friend.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-activity-box',
  templateUrl: './activity-box.component.html',
  styleUrls: ['./activity-box.component.scss'],
})
export class ActivityBoxComponent implements OnInit, OnDestroy {
  // @Input() posts: any[] = [];
  posts: any[] = [];
  // pagination
  @Input() pageNo = 0;
  @Input() pageSize = 10;
  // infinite scroll
  @Input() scrollDistance = 1.5;
  @Input() scrollUpDistance = 2;
  @Input() throttle = 300;
  @Input() isVideo = false;
  @Input() isGroup = false;
  @Input() groupId = null;
  @Input() totalPostCount = 0;
  // @Output() getNewsFeed = new EventEmitter<true>();
  @Output() getNewsFeed: EventEmitter<{
    pageNo: number;
    pageSize: number;
  } | null> = new EventEmitter<{ pageNo: number; pageSize: number } | null>();
  @Output() deletedPost: EventEmitter<any> = new EventEmitter<any>();
  @Output() upsertedPost: EventEmitter<any> = new EventEmitter<any>();

  user: any;
  showCommentSection = false;
  addComment: '';
  toEditPost = 0;
  toEditComment = 0;
  replyPlaceHolder = 'reply';
  constructor(
    public Dialog: MatDialog,
    private socialService: SocialService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private loaderService: LoaderService,
    private friendService: FriendService, private userService: UserService
  ) {}

  ngOnDestroy() {
    this.socialService.setPostData([]);
  }
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('User'));
    this.socialService
      .getPostData()
      .pipe(untilDestroyed(this))
      .subscribe((x) => {
        this.posts = x.sort((a, b) => {
          return <any>new Date(b.createdDate) - <any>new Date(a.createdDate);
        });
      });
  }
  openLikePostDialog(likeUsers) {
    const DialogRef = this.Dialog.open(LikePostComponent, {
      width: '35%',
      height: '75vh',
      disableClose: true,
      data: { likeUsers: likeUsers },
    });
  }
  openPostViewDialog(post) {
    const DialogRef = this.Dialog.open(PostViewComponent, {
      width: '85%',
      height: '95vh',
      data: { post: !post.parentPostId ? post : null , postId: post.parentPostId ? post.parentPostId : post.id},
    });
    DialogRef.afterClosed().subscribe((result) => {
      if (result !== null && result !== undefined) {
        const index = this.posts.findIndex((x) => x.id === post.id);
        if (index > -1) {
          this.posts.splice(index, 1, post);
          // this.posts[index].comments = comments.data?.data.filter(
          //   (x) => x.parentCommentId === 0 || !x.parentCommentId
          // );
          // this.posts[index].comments.forEach((p: any) => {
          //   p.childComment = comments.data?.data.filter(
          //     (x) => x.postId === postId && x.parentCommentId === p.id
          //   );
          // });
        }
      }
    });
  }
  openReportDialog(post: any) {
    console.log('groupId', this.groupId);
    console.log('user', this.user);

    const DialogRef = this.Dialog.open(ReportComponent, {
      width: '35%',
      height: 'auto',
      disableClose: true,
      data: {
        groupId: this.groupId,
        postId: post.id,
        userId: this.user.id,
      },
    });
  }

  async Like(post, comment?, child?) {
    let obj: any;

    if (!comment && !child) {
      obj = { postId: post.id, userId: this.user.id };
    }
    if (comment && !child) {
      obj = {
        postId: post.id,
        userId: this.user.id,
        commentId: comment ? comment.id : null,
      };
    } else if (comment && child) {
      obj = {
        postId: post.id,
        userId: this.user.id,
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
      post.likeUsers = res?.data?.user;
    }
  }

  async AddComment(event, post, comment?) {
    if (
      event.target.value !== '' &&
      event.target.value.replace(/\s/g, '') !== ''
    ) {
      let obj = {
        postId: post.id,
        userId: this.user.id,
        description: event.target.value,
        replyTo: comment && comment.userId ? comment.userId : null,
        parentCommentId: comment && comment.id ? comment.id : null,
      };
      let res: any = await this.socialService.AddComment(obj);
      if (res.data.success) {
        const index = this.posts.findIndex((x) => x.id === post.id);
        if (index > -1) {
          this.posts[index].commentsCount++;
        }
        // this.getNewsFeed.emit();
        this.getComment(post.id);
        this.toastr.success(res.data.message);
        return (event.target.value = '');
      }
    }
  }
  editComment(postId, commentId) {
    this.toEditPost = postId;
    this.toEditComment = commentId;
  }

  async deleteComment(postId, commentId) {
    let res: any = await this.socialService.deleteComment(commentId);
    if (res.data.success) {
      // this.getNewsFeed.emit();
      // this.getComment(postId);
      const index = this.posts.findIndex((x) => x.id === postId);
      if (index > -1) {
        this.posts[index].commentsCount--;
        const commentIndex = this.posts[index].comments.findIndex(
          (comment) => comment?.id === commentId
        );
        this.posts[index].comments.splice(commentIndex, 1);
      }
      this.toastr.success(res.data.message);
    }
  }

  async UpdateComment(post, comment, id) {
    if (comment !== '') {
      let obj = {
        postId: post.id,
        userId: this.user.id,
        description: comment,
      };
      let res: any = await this.socialService.EditComment(obj, id);
      if (res.data.success) {
        // this.getNewsFeed.emit();
        this.getComment(post.id);
        this.toEditPost = 0;
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
      this.user.id
    )) as any;
    const index = this.posts.findIndex((x) => x.id === postId);
    if (index > -1) {
      this.posts[index].comments = comments.data?.data.filter(
        (x) => x.parentCommentId === 0 || !x.parentCommentId
      );
      this.posts[index].comments.forEach((p: any) => {
        p.childComment = comments.data?.data.filter(
          (x) => x.postId === postId && x.parentCommentId === p.id
        );
      });
    }
  }

  onScrollDown() {
    if (this.posts.length < this.totalPostCount) {
      this.getNewsFeed.emit({ pageNo: ++this.pageNo, pageSize: this.pageSize });
    }
  }

  onUp() {
    // this.getNewsFeed.emit({pageNo: --this.pageNo, pageSize: this.pageSize});
  }
  videoURL(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onEditPost(post: any) {
    const DialogRef = this.Dialog.open(CreatePostComponent, {
      width: '35%',
      height: '80vh',
      disableClose: true,
      data: {
        isEdit: true,
        title: 'Edit Post',
        type: post?.type,
        mediaUrl: (post?.url && post?.url[0]?.url) || null,
        mediaTitle: (post?.url && post?.url[0]?.title) || null,
        description: post?.description,
        isGroupPost: this.isGroup,
        groupId: this.groupId,
      },
    });
    DialogRef.afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(async (result) => {
        try {
          this.loaderService.PresentLoading();
          const mediaObj = {
            title: result?.mediaTitle,
            type: result?.mediaType,
            url: result?.mediaUrl,
            isActive: true,
            id: (post?.url && post?.url[0]?.id) || null,
          };
          const payload = {
            postId: post?.id,
            description: result?.description,
            type: result?.mediaType,
            isGroupPost: post?.isGroupPost,
            groupId: post?.groupId,
            ...(result?.mediaType !== 'text' && { media: [mediaObj] }),
          };
          const response = await this.socialService.EditPost(payload);
          if (response?.data?.success) {
            post.description = result?.description;
            post.url = payload?.media || post.url;
          }
        } finally {
          this.loaderService.DissmissLoading();
        }
      });
  }

  async deletePost(id) {
    this.loaderService.PresentLoading();
    try {
      let res: any = await this.socialService.DeletePost(id);
      if (res?.data?.success) {
        this.deletedPost.emit(res?.data?.data);
        this.toastr.success('Post Deleted');
        this.loaderService.DissmissLoading();
      }
    } catch (e) {
      this.toastr.error('Something went wrong');
      this.loaderService.DissmissLoading();
    }
  }

  upsertPost(event) {
    this.upsertedPost.emit(event);
  }

  async unFollowUser(item: any) {
    let res: any = await this.friendService.unfollowUser(
      this.user.id,
      item.userId
    );
    if (!res.data.success) {
      this.toastr.error(res.data.message);
      return;
    }
    const length = this.posts.length;
    for (let i = 0; i < length; i++) {
      const index = this.posts.findIndex((x) => x.userId === item.userId);
      if (index > -1) {
        this.posts.splice(index, 1);
      }
    }
    this.toastr.success('Successfully Unfollowed');
    await this.userService.updateUserData();
  }
}
