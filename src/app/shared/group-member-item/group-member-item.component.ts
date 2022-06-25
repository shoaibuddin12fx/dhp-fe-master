import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FriendService } from 'src/app/services/friend.service';
import { GroupService } from 'src/app/services/groups.service';

@Component({
  selector: 'app-group-member-item',
  templateUrl: './group-member-item.component.html',
  styleUrls: ['./group-member-item.component.scss'],
})
export class GroupMemberItemComponent implements OnInit {
  @Input() memberList: any[] = [];
  @Input() item: any = {};
  @Input() isAbout: boolean = false;

  @Output() onSuccess: EventEmitter<any> = new EventEmitter();
  constructor(
    private groupService: GroupService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    console.log('member item init');
  }

  async onPostApproval(item, event) {
    try {
      const res = await this.groupService.onPostApproval(
        item.id,
        event.checked
      );
      if (res) {
        this.toastr.success('Updated Successfully!!');
        this.onSuccess.emit(true);
      }
    } catch (error) {
      this.toastr.error('Something went wrong!!');
    }
  }
  async removeAsAdmin(item) {
    try {
      const res = await this.groupService.removeAsAdmin(item.id);
      if (res) {
        this.toastr.success('Updated Successfully!!');
        this.onSuccess.emit(true);
      }
    } catch (error) {
      this.toastr.error('Something went wrong!!');
    }
  }
  async blockFromGroup(item) {
    try {
      const res = await this.groupService.blockFromGroup(item.id);
      if (res) {
        this.toastr.success('Updated Successfully!!');
        this.onSuccess.emit(true);
      }
    } catch (error) {
      this.toastr.error('Something went wrong!!');
    }
  }
  async removeMember(item) {
    try {
      const res = await this.groupService.removeMember(item.id);
      if (res) {
        this.toastr.success('Updated Successfully!!');
        this.onSuccess.emit(true);
      }
    } catch (error) {
      this.toastr.error('Something went wrong!!');
    }
  }
  async addAsAdmin(item) {
    try {
      const res = await this.groupService.addAsAdmin(item.id);
      if (res) {
        this.toastr.success('Updated Successfully!!');
        this.onSuccess.emit(true);
      }
    } catch (error) {
      this.toastr.error('Something went wrong!!');
    }
  }
}
