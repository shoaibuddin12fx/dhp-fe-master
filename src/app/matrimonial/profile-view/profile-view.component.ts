import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProfileImageComponent } from '../popup/profile-image/profile-image.component';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss'],
})
export class ProfileViewComponent implements OnInit {
  constructor(public mehroz: MatDialog) {}

  ngOnInit(): void {}
  profileImageDialog() {
    const dialogRef = this.mehroz.open(ProfileImageComponent, {
      width: '35%',
      height: '70vh',
      disableClose: true,
      data: {},
    });
  }
}
