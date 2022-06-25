import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-friend-request-widget',
  templateUrl: './friend-request-widget.component.html',
  styleUrls: ['./friend-request-widget.component.scss'],
})
export class FriendRequestWidgetComponent implements OnInit {
  @Input() title = 'Friend Requests';
  @Input() friendRequestList: any[] = [];

  @Output() approveRequest: EventEmitter<any> = new EventEmitter();
  @Output() rejectRequest: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  onApprove(friend: any) {
    this.approveRequest.emit(friend);
  }

  onReject(friend: any) {
    this.rejectRequest.emit(friend);
  }
}
