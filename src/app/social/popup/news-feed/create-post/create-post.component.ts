import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoaderService } from 'src/app/services/loader.service';
import { SocialService } from 'src/app/services/social.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent implements OnInit {
  currentUser: any;
  postForm: FormGroup;
  showLoading = false;
  selectedFile: File = null;
  title = 'Create Post';
  constructor(
    public dialogRef: MatDialogRef<CreatePostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private socialService: SocialService // private loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('User'));
    this.title = this.data?.title || this.title;
    this.selectedFile = this.data?.mediaUrl || null;
    this.createForm();
  }
  createForm() {
    this.postForm = this.fb.group({
      description: [
        this.data.description ? this.data.description : '',
        Validators.compose([Validators.required]),
      ],
      userId: [this.currentUser.id],
      mediaUrl: [this.data?.mediaUrl || ''],
      mediaTitle: [this.data?.mediaTitle || ''],
      mediaType: [this.data.type],
      isGroupPost: [this.data.isGroupPost],
      groupId: [this.data.groupId],
      groupPostApproval: [this.data.groupPostApproval],
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

  onSubmit() {
    if (this.data?.isEdit) {
      this.editPost();
    } else {
      this.UploadPost();
    }
  }

  editPost() {
    if (this.postForm.valid) {
      if (this.data.type === 'video') {
        this.postForm.controls['mediaTitle'].setValue(
          this.postForm.value.mediaUrl
        );
      }
      this.dialogRef.close(this.postForm?.value);
    }
  }

  async UploadPost() {
    const fd = new FormData();
    this.showLoading = true;
    if (this.postForm.valid) {
      if (this.data.type === 'video') {
        this.postForm.controls['mediaTitle'].setValue(
          this.postForm.value.mediaUrl
        );
      }
      // fd.append('userId', this.currentUser.id);
      // fd.append('description', this.description);
      // if (this.selectedFile) {
      //   console.log(this.selectedFile);
      //   console.log(this.selectedFile.name);
      //   fd.append('image', this.selectedFile, this.selectedFile.name);
      // }

      const post = (await this.socialService.UploadPost(
        this.postForm.value
      )) as any;
      this.showLoading = false;
      this.dialogRef.close(post.data);
      // this.activeModal.dismiss('Close click');
    }
  }
}
