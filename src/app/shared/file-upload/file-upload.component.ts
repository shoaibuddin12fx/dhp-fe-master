import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  @Input() images: any[] = [];
  @Input() dataId = '';
  @Input() isMultiple = false;
  @Input() maxLength = 1;
  @Input() isFileType = false;
  @Output() imageDataEmitter = new EventEmitter();
  @Output() fileEmitter = new EventEmitter();
  imageData: any[] = [];
  file: any;

  constructor(private toastr: ToastrService) {}

  ngOnInit(): void {
    console.log(this.images, this.dataId);
  }
  changeImage(className) {
    let element: HTMLElement = document.getElementsByClassName(
      className
    )[0] as HTMLElement;
    element.click();
  }
  onFileChange(event) {
    if (event.target.files.length > this.maxLength) {
      this.toastr.error(
        'Error',
        `Selected Images should not be more than ${this.maxLength}.`
      );
      return null;
    }
    if (event.target.files && event.target.files[0]) {
      this.imageData = event.target.files;
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        let This = this;
        reader.onload = (event: any) => {
          let imageData = this.imageData[i];
          const image = imageData.name.split('.');
          const name = image[0];
          const ext = image[1];
          This.images.push({
            contentType: imageData.type,
            data: event.target.result,
            fileSize: imageData.size,
            displayName: name,
            description: name,
            fileExtension: ext,
            fileName: imageData.name,
          });
        };
        reader.readAsDataURL(event.target.files[i]);
      }
      this.imageDataEmitter.emit(this.imageData);
    }
  }
  deleteImage(i) {
    this.images.splice(i, 1);
    const imageData = [];
    for (let index = 0; index < this.imageData.length; index++) {
      if (index !== i) {
        imageData.push(this.imageData[i]);
      }
    }
    this.imageDataEmitter.emit(imageData);
  }
  makeTrustedImage(item) {
    const style = 'url(' + item + ')';
    return style;
  }

  upload(event) {
    this.file = event.target.files[0];
    this.fileEmitter.emit(this.file);
    console.log(this.file);
  }
}
