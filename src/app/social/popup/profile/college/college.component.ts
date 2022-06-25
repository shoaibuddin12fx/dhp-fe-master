import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-college',
  templateUrl: './college.component.html',
  styleUrls: ['./college.component.scss'],
})
export class CollegeComponent implements OnInit {
  fromDate: any;
  toDate: any;
  isNew = true;
  name = '';
  degree = '';
  isCurrentlyEmployed = false;
  yearList: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<CollegeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.yearList = this.data.yearArr;
    this.name = this.data.college.name;
    this.degree = this.data.college.degree;
    this.isCurrentlyEmployed = this.data.college.isCurrentlyEmployed
      ? this.data.college.isCurrentlyEmployed
      : false;
    if (this.data && this.data.college.fromDate) {
      this.fromDate = this.data.college.fromDate;
      this.isNew = false;
    }
    if (this.data && this.data.college.toDate) {
      this.toDate = this.data.college.toDate;
    }
  }
  add(): void {
    const data = {
      name: this.name,
      degree: this.degree,
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
