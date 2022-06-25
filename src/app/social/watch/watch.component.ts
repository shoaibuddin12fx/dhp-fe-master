import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/services/loader.service';
import { SocialService } from 'src/app/services/social.service';
import { environment } from 'src/environments/environment';
import { CreatePostModalComponent } from '../modals/create-post-modal/create-post-modal.component';
import { VideoLinkComponent } from '../popup/news-feed/video-link/video-link.component';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.scss'],
})
export class WatchComponent implements OnInit {
  feed: any = {};
  posts: any = [];
  user;
  serverImageUrl;
  width: number;
  description = '';
  placeholder: string;
  pageNo = 0;
  pageSize = 10;
  totalPostCount = 0;

  constructor(
    private loaderService: LoaderService,
    private socialService: SocialService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.width = 580;
    this.serverImageUrl = environment.serverImageUrl;
    this.user = JSON.parse(localStorage.getItem('User'));
    this.placeholder = `Whats new ${this.user.fullName}?`;
    this.GetNewsFeed();
  }
  async GetNewsFeed(
    { pageNo, pageSize } = { pageNo: this.pageNo, pageSize: this.pageSize }
  ) {
    this.loaderService.PresentLoading();
    let res: any = await this.socialService.GetNewsFeedVideo(
      this.user.id,
      pageNo,
      pageSize
    );
    if (!res.data.success) {
      // this.toastr.success(res.data.message);
      this.loaderService.DissmissLoading();
      return;
    }
    this.totalPostCount = res?.data?.count;
    this.posts = this.posts.concat(res?.data?.data);
    this.socialService.setPostData(this.posts);
    this.loaderService.DissmissLoading();
  }
  videoURL(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  // UploadModal(type) {
  //   const modalRef = this.dialog.open(CreatePostModalComponent, {
  //     width: '40%',
  //     height: '50%',
  //     disableClose: true,
  //     data: { type: type, description: this.description },
  //   });
  //   modalRef.afterClosed().subscribe((result) => {
  //     if (result !== null && result !== undefined) {
  //       this.description = '';
  //       this.GetNewsFeed();
  //     }
  //   });
  // }

  openVideoDialog(type) {
    const DialogRef = this.dialog.open(VideoLinkComponent, {
      width: '35%',
      height: '60vh',
      disableClose: true,
      data: { type: type, description: this.description },
    });
    DialogRef.afterClosed().subscribe((result) => {
      if (result !== null && result !== undefined) {
        this.description = '';
        // this.GetNewsFeed();
        this.UpsertPost(result.post);
      }
    });
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
}
