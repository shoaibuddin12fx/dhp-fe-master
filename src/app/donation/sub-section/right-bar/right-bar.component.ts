import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateCampaignComponent } from '../../popup/create-campaign/create-campaign.component';

@Component({
  selector: 'app-right-bar',
  templateUrl: './right-bar.component.html',
  styleUrls: ['./right-bar.component.scss'],
})
export class RightBarComponent implements OnInit {
  constructor(public Dialog: MatDialog) {}

  ngOnInit(): void {}
  openCompaignDialog() {
    const DialogRef = this.Dialog.open(CreateCampaignComponent, {
      width: '35%',
      height: '90vh',
      disableClose: true,
      data: {},
    });
  }
}
