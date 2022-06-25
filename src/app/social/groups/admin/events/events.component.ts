import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReportComponent } from 'src/app/social/popup/activity-box/report/report.component';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  constructor(public Dialog: MatDialog) {}

  ngOnInit(): void {}
  openReportDialog() {
    const DialogRef = this.Dialog.open(ReportComponent, {
      width: '35%',
      height: 'auto',
      disableClose: true,
      data: {},
    });
  }
}
