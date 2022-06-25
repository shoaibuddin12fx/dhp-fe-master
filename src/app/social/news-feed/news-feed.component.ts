import { GroupService } from 'src/app/services/groups.service';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/services/loader.service';
import { SocialService } from 'src/app/services/social.service';
import { CreatePostModalComponent } from '../modals/create-post-modal/create-post-modal.component';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { PostViewComponent } from '../popup/activity-box/post-view/post-view.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.scss'],
})
export class NewsFeedComponent implements OnInit, OnDestroy {
  feed: any = {};
  posts: any[] = [];
  user;
  serverImageUrl;
  description = '';
  placeholder: string;

  // pagination
  pageNo = 0;
  pageSize = 10;
  totalPostCount = 0;
  myGroups: any[] = [];
  videoPosts: any[] = [];
  postId: any;

  constructor(
    private loaderService: LoaderService,
    private socialService: SocialService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private groupService: GroupService,
    private router: ActivatedRoute
  ) {
    this.postId = +this.router.snapshot.queryParams.postId;
  }

  ngOnDestroy(): void {
    this.socialService.setPostData([]);
  }

  async ngOnInit() {
    this.serverImageUrl = environment.serverImageUrl;
    this.user = JSON.parse(localStorage.getItem('User'));
    this.placeholder = `Whats new ${this.user.fullName}?`;
    this.getMyGroups(this.user.id);
    this.GetNewsFeed({ pageNo: this.pageNo, pageSize: this.pageSize });
    this.GetVideosFeed();
    if (this.postId && typeof(this.postId) === 'number') {
      const datass: any = await this.socialService.getSinglePost(this.postId, this.user?.id);
      this.openPostViewDialog(datass.data);
    }
  }
  openPostViewDialog(post) {
    const DialogRef = this.dialog.open(PostViewComponent, {
      width: '85%',
      height: '95vh',
      data: { post: post },
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
  async getMyGroups(userId) {
    let res: any = await this.groupService.getMyGroups(userId);
    this.myGroups = res.data;
  }

  async GetNewsFeed(
    { pageNo, pageSize } = { pageNo: this.pageNo, pageSize: this.pageSize }
  ) {
    this.loaderService.PresentLoading();
    let res: any = await this.socialService.GetNewsFeed(
      this.user.id,
      pageNo,
      pageSize
    );
    if (!res.data.success) {
      this.loaderService.DissmissLoading();
      return;
    }
    this.totalPostCount = res?.data?.count;
    this.posts = this.posts.concat(res?.data?.data);
    this.socialService.setPostData(this.posts);
    this.loaderService.DissmissLoading();
  }

  async GetVideosFeed() {
    this.loaderService.PresentLoading();
    let res: any = await this.socialService.GetNewsFeedVideo(
      this.user.id, 0, 3
    );
    if (!res.data.success) {
      // this.toastr.success(res.data.message);
      this.loaderService.DissmissLoading();
      return;
    }
    // this.totalPostCount = res?.data?.count;
    this.videoPosts = this.videoPosts.concat(res?.data?.data);
    // this.socialService.setPostData(this.posts);
    this.loaderService.DissmissLoading();
  }
  UpsertPost(post) {
    const index = this.posts.findIndex((x) => x.id === post.id);
    if (index > -1) {
      this.posts.splice(index, 1, post);
    } else {
      this.posts.push(post);
      this.totalPostCount++;
    }
    this.socialService.setPostData(this.posts);
  }
  deletedPost(post) {
    const index = this.posts.findIndex((x) => x.id === post.id);
    if (index > -1) {
      this.posts.splice(index, 1);
      this.totalPostCount--;
    }
    this.socialService.setPostData(this.posts);
  }
  UploadModal(type) {
    // const modalRef = this.modalService.open(CreatePostModalComponent);

    const modalRef = this.dialog.open(CreatePostModalComponent, {
      width: '40%',
      height: '50%',
      disableClose: true,
      data: { type: type, description: this.description },
    });
    modalRef.afterClosed().subscribe((result) => {
      if (result !== null && result !== undefined) {
        this.description = '';
        this.GetNewsFeed();
      }
    });

    // modalRef.componentInstance.clickevent.subscribe(($e) => {
    //   if ($e) this.GetNewsFeed();
    // });
  }

  async EditPost(postId) {
    this.loaderService.PresentLoading();
    let res: any = await this.socialService.EditPost(postId);
    if (!res.data.success) {
      this.loaderService.DissmissLoading();
      return;
    }
    this.feed = res.data.data;
    this.posts = this.feed.posts;
    this.loaderService.DissmissLoading();
  }

  DeletePost(postId) {
    let that = this;
    Swal.fire({
      title: 'Are you sure you want to delete!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    }).then(async (result) => {
      if (result.isConfirmed) {
        that.loaderService.PresentLoading();
        let res: any = await that.socialService.DeletePost(postId);
        if (res.data.success) {
          this.GetNewsFeed();
          that.toastr.success(res.data.message);
          that.loaderService.DissmissLoading();
          return;
        }
        that.toastr.error(res.data.message);
        that.loaderService.DissmissLoading();
      }
    });
  }

  async Like(post) {
    let obj = { postId: post.id, userId: this.user.id };
    let res: any = await this.socialService.Like(obj);
    if (!res.data.success) {
      this.toastr.success(res.data.message);
      return;
    } else {
      post.isLike = !post.isLike;
      if (!post.isLike) post.likeCount -= 1;
      else post.likeCount += 1;
    }
  }

  async AddComment(post) {
    let obj = {
      postId: post.id,
      userId: this.user.userId,
      comment: post.comment,
    };
    let res: any = await this.socialService.AddComment(obj);
    if (!res.data.success) {
      this.toastr.success(res.data.message);
      return;
    }
  }


}
