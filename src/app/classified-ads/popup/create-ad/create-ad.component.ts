import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PackagesComponent } from '../packages/packages.component';

@Component({
  selector: 'app-create-ad',
  templateUrl: './create-ad.component.html',
  styleUrls: ['./create-ad.component.scss'],
})
export class CreateAdComponent implements OnInit {
  constructor(public Dialog: MatDialog) {}

  ngOnInit(): void {}
  openPackageDialog() {
    const DialogRef = this.Dialog.open(PackagesComponent, {
      width: '75%',
      height: '70vh',
      data: {},
    });
  }
}
