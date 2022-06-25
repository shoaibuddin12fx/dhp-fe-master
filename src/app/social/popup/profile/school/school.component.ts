import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.scss'],
})
export class SchoolComponent implements OnInit {
  fromDate: any;
  toDate: any;
  isNew = true;
  name = '';
  position = '';
  isCurrentlyEmployed = false;
  yearList: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<SchoolComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.yearList = this.data.yearArr;
    this.name = this.data.school.name;
    this.position = this.data.school.position;
    this.isCurrentlyEmployed = this.data.school.isCurrentlyEmployed
      ? this.data.school.isCurrentlyEmployed
      : false;
    if (this.data && this.data.school.fromDate) {
      this.fromDate = this.data.school.fromDate;
      this.isNew = false;
    }
    if (this.data && this.data.school.toDate) {
      this.toDate = this.data.school.toDate;
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
