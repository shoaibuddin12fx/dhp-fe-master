import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { IEditCoverPhoto } from 'src/app/interfaces/shared.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-cover',
  templateUrl: './edit-cover.component.html',
  styleUrls: ['./edit-cover.component.scss'],
})
export class EditCoverComponent implements OnInit {
  coverPhotoUrl: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { photos: any[]; coverPhotoUrl: string; userId: string },
    private userService: UserService,
    public dialogRef: MatDialogRef<EditCoverComponent>,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.coverPhotoUrl = this.data?.coverPhotoUrl;
  }

  onSelectImageFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.coverPhotoUrl = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onSelectPhoto(photo: any) {
    this.coverPhotoUrl = photo?.url;
  }

  async onUpdateCoverPhoto() {
    if (this.coverPhotoUrl) {
      try {
        const payload: IEditCoverPhoto = {
          userId: this.data?.userId,
          coverPhoto: this.coverPhotoUrl,
        };
        const res: any = await this.userService.editCoverPhoto(payload);
        this.toastr.success('Created Successfully');
        this.dialogRef.close('saved');
        const data: any = await this.userService.getById(this.data?.userId);
        localStorage.setItem('User', JSON.stringify(data.data));
      } catch (error) {
        this.toastr.error(error.error.meta.message);
      }
    }
  }
}
