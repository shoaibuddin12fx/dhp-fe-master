import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss'],
})
export class CityComponent implements OnInit {
  address: any;
  isNew = true;
  constructor(
    public dialogRef: MatDialogRef<CityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.address) {
      this.address = this.data.address;
      this.isNew = false;
    }
  }
  add(): void {
    this.dialogRef.close(this.address);
  }
}
