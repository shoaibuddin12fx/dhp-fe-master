import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreatePollComponent } from './popup/create-poll/create-poll.component';

@Component({
  selector: 'app-polling',
  templateUrl: './polling.component.html',
  styleUrls: ['./polling.component.scss'],
})
export class PollingComponent implements OnInit {
  constructor(public Dialog: MatDialog) {}

  ngOnInit(): void {}
  createPollDialog() {
    const DialogRef = this.Dialog.open(CreatePollComponent, {
      width: '35%',
      height: '90vh',
      disableClose: true,
      data: {},
    });
  }
}
