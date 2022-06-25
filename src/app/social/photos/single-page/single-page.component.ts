import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/services/loader.service';
import { SocialService } from 'src/app/services/social.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { PhotoComponent } from '../../popup/photo/photo.component';

@Component({
  selector: 'app-single-page',
  templateUrl: './single-page.component.html',
  styleUrls: ['./single-page.component.scss'],
})
export class SinglePageComponent implements OnInit {
  feed: any = {};
  posts: any = [];
  user;
  serverImageUrl;
  width: number;
  description = '';
  type: number = 2;
  constructor(
    private loaderService: LoaderService,
    private socialService: SocialService,
    private userService: UserService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.type = +this.route.snapshot.paramMap.get('type');
    this.width = 580;
    this.serverImageUrl = environment.serverImageUrl;
    this.user = JSON.parse(localStorage.getItem('User'));
    this.getPhotos(this.type);
  }
  async getPhotos(type) {
    this.loaderService.PresentLoading();
    let res: any;
    if (type == 0 || type == 1) {
      res = await this.userService.GetUserphoto(this.user.id, type);
      if (!res.data.success) {
        // this.toastr.success(res.data.message);
        this.loaderService.DissmissLoading();
        return;
      }
      this.posts = res?.data?.data;
    } else {
      res = await this.socialService.GetUserphoto(this.user.id);
      if (!res.data.success) {
        // this.toastr.success(res.data.message);
        this.loaderService.DissmissLoading();
        return;
      }
      this.posts = res?.data?.data;
    }

    this.loaderService.DissmissLoading();
  }

  openPhotoDialog(type, item, id) {
    const DialogRef = this.dialog.open(PhotoComponent, {
      width: '35%',
      height: '70vh',
      disableClose: true,
      data: { type: type, url: item },
    });
    DialogRef.afterClosed().subscribe((result) => {
      if (result === 'delete') {
        this.description = '';
        this.deletePost(id);
      }
    });
  }

  async deletePost(id) {
    this.loaderService.PresentLoading();
    try {
      let res: any = await this.socialService.DeletePost(id);
      if (res?.data?.success) {
        const index = this.posts.findIndex((x) => x.id == id);
        if (index > -1) {
          this.posts.splice(index, 1);
        }
        // this.deletedPost.emit(res?.data?.data);
        this.toastr.success('Photo Deleted');
        this.loaderService.DissmissLoading();
      }
    } catch (e) {
      this.toastr.error('Something went wrong');
      this.loaderService.DissmissLoading();
    }
  }
}
