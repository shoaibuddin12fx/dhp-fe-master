import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss'],
})
export class WorkComponent implements OnInit {
  fromDate: any;
  toDate: any;
  isNew = true;
  name = '';
  position = '';
  isCurrentlyEmployed = false;
  yearList: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<WorkComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.yearList = this.data.yearArr;
    this.name = this.data.work.name;
    this.position = this.data.work.position;
    this.isCurrentlyEmployed = this.data.work.isCurrentlyEmployed
      ? this.data.work.isCurrentlyEmployed
      : false;
    if (this.data && this.data.work.fromDate) {
      this.fromDate = this.data.work.fromDate;
      this.isNew = false;
    }
    if (this.data && this.data.work.toDate) {
      this.toDate = this.data.work.toDate;
    }
  }
  add(): void {
    const data = {
      name: this.name,
      position: this.position,
      isCurrentlyEmployed: this.isCurrentlyEmployed,
      fromDate: this.fromDate,
      toDate: this.isCurrentlyEmployed ? undefined : this.toDate,
    };

    this.dialogRef.close(data);
  }
  check(args) {
    this.isCurrentlyEmployed = args;
  }
}
