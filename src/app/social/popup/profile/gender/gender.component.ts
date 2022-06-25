import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-gender',
  templateUrl: './gender.component.html',
  styleUrls: ['./gender.component.scss'],
})
export class GenderComponent implements OnInit {
  gender: any;
  isNew = true;
  constructor(
    public dialogRef: MatDialogRef<GenderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.gender) {
      this.gender = this.data.gender;
      this.isNew = false;
    }
  }
  add(): void {
    this.dialogRef.close(this.gender);
  }
}
