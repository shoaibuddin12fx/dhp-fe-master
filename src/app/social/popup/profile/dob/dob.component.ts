import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dob',
  templateUrl: './dob.component.html',
  styleUrls: ['./dob.component.scss'],
})
export class DOBComponent implements OnInit {
  dateOfBirth: any;
  isNew = true;
  constructor(
    public dialogRef: MatDialogRef<DOBComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.dateOfBirth) {
      const aaa = Date.now();
      const dob = new Date(this.data.dateOfBirth);
      var timeZoneDifference = (dob.getTimezoneOffset() / 60) * -1; //convert to positive value.
      dob.setTime(dob.getTime() + timeZoneDifference * 60 * 60 * 1000);
      this.dateOfBirth = dob.toISOString().split('T')[0];
      this.isNew = false;
    }
  }
  add(): void {
    this.dialogRef.close(this.dateOfBirth);
  }
}
