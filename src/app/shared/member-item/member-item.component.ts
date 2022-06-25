import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-member-item',
  templateUrl: './member-item.component.html',
  styleUrls: ['./member-item.component.scss'],
})
export class MemberItemComponent implements OnInit {
  @Input() member: any = null;
  @Input() selectedFilterOption: any = null;

  @Output() followMember: EventEmitter<any> = new EventEmitter();
  @Output() unFollowMember: EventEmitter<any> = new EventEmitter();
  @Output() addFriend: EventEmitter<any> = new EventEmitter();
  @Output() unFriend: EventEmitter<any> = new EventEmitter();
  @Output() reportMember: EventEmitter<any> = new EventEmitter();
  user: any;
  constructor() {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('User'));
    console.log('member item init');
  }

  onFollowMember(member: any) {
    this.followMember.emit(member);
  }

  onUnFollowMember(member: any) {
    this.unFollowMember.emit(member);
  }

  onAddFriend(member: any) {
    this.addFriend.emit(member);
  }

  onUnFriendMember(member: any) {
    this.unFriend.emit(member);
  }

  onOpenReportDialog() {
    this.reportMember.emit();
  }
}
