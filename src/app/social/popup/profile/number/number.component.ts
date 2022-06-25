import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-number',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.scss'],
})
export class NumberComponent implements OnInit {
  contactNo: any;
  isNew = true;
  constructor(
    public dialogRef: MatDialogRef<NumberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    if (this.data && this.data.contactNo) {
      this.contactNo = this.data.contactNo;
      this.isNew = false;
    }
  }
  add(): void {
    this.dialogRef.close(this.contactNo);
  }
}
