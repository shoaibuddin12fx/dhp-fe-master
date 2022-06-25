import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-relationship',
  templateUrl: './relationship.component.html',
  styleUrls: ['./relationship.component.scss'],
})
export class RelationshipComponent implements OnInit {
  relationship: any;
  isNew = true;
  constructor(
    public dialogRef: MatDialogRef<RelationshipComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    if (this.data && this.data.relationship) {
      this.relationship = this.data.relationship;
      this.isNew = false;
    }
  }
  add(): void {
    this.dialogRef.close(this.relationship);
  }
}
