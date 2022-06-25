import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateProfileComponent } from '../create-profile/create-profile.component';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss'],
})
export class TermsConditionsComponent implements OnInit {
  constructor(public Dialog: MatDialog) {}

  ngOnInit(): void {}
  createProfileDialog() {
    const DialogRef = this.Dialog.open(CreateProfileComponent, {
      width: '35%',
      height: '80vh',
      disableClose: true,
      data: {},
    });
  }
}
