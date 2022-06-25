import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SocialService } from 'src/app/services/social.service';

@Component({
  selector: 'app-video-link',
  templateUrl: './video-link.component.html',
  styleUrls: ['./video-link.component.scss'],
})
export class VideoLinkComponent implements OnInit {
  currentUser: any;
  postForm: FormGroup;
  showLoading = false;
  selectedFile: File = null;
  constructor(
    public dialogRef: MatDialogRef<VideoLinkComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private socialService: SocialService // private loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('User'));
    this.createForm();
  }
  createForm() {
    this.postForm = this.fb.group({
      description: [
        this.data.description ? this.data.description : '',
        Validators.compose([Validators.required]),
      ],
      userId: [this.currentUser.id],
      mediaUrl: [''],
      mediaTitle: [''],
      mediaType: [this.data.type],
    });
  }
  FileSelected(event) {
    const file = <File>event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      let This = this;
      reader.onload = (event: any) => {
        this.selectedFile = event.target.result;
        this.postForm.controls['mediaUrl'].setValue(this.selectedFile);
        this.postForm.controls['mediaTitle'].setValue(file.name);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  async UploadPost() {
    const fd = new FormData();
    this.showLoading = true;
    if (this.postForm.valid) {
      this.postForm.controls['mediaTitle'].setValue(
        this.postForm.value.mediaUrl
      );
      const post = (await this.socialService.UploadPost(
        this.postForm.value
      )) as any;
      this.showLoading = false;
      this.dialogRef.close(post.data);
    }
  }
}
