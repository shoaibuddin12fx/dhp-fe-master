import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from 'src/app/services/loader.service';
import { SocialService } from 'src/app/services/social.service';

@Component({
  selector: 'app-create-post-modal',
  templateUrl: './create-post-modal.component.html',
  styleUrls: ['./create-post-modal.component.scss'],
})
export class CreatePostModalComponent implements OnInit {
  @Output() clickevent = new EventEmitter<string>();
  description;
  selectedFile: File = null;
  currentUser;
  showLoading = false;
  postData: any;
  postForm: FormGroup;

  constructor(
    // public activeModal: NgbActiveModal,
    private socialService: SocialService,
    private loaderService: LoaderService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreatePostModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.postData = this.data;
  }

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
        console.log(event.target.result);
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
      await this.socialService.UploadPost(this.postForm.value);
      this.showLoading = false;
      this.clickevent.emit('complete');
      this.dialogRef.close('saved');
      // this.activeModal.dismiss('Close click');
    }
  }
}
