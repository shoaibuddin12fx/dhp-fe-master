import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
})
export class PhotoComponent implements OnInit {
  url: any = '';
  type: any;
  id: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PhotoComponent>
  ) {
    this.url = data.url;
    this.type = data.type;
  }

  ngOnInit(): void {}
  deletePost() {
    this.dialogRef.close('delete');
  }
}
