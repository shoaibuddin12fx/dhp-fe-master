import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-groups-widget',
  templateUrl: './groups-widget.component.html',
  styleUrls: ['./groups-widget.component.scss'],
})
export class GroupsWidgetComponent implements OnInit {
  @Input() title = 'Groups you manage';
  @Input() groupList: any[] = [];
  constructor() {}

  ngOnInit() {}
}
