import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { GroupService } from 'src/app/services/groups.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SocialService } from 'src/app/services/social.service';
import { GroupRulesComponent } from 'src/app/social/popup/group/group-rules/group-rules.component';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit {
  groupId: any;
  posts: any[] = [];
  groupRules: any[] = [];
  user: any;
  group: any;
  requestedGroupMembers: any[] = [];
  reportedContent: any[] = [];
  blockedGroupMembers: any[] = [];
  pageNo = 0;
  pageSize = 10;
  totalPostCount = 0;
  isGroupAdmin = false;
  pendingPosts: any[] = [];
  totalPendingPostCount = 0;
  pageData = {
    limit: 10,
    offset: 0,
  };
  // private searchSubscription: any;
  // requestedGroupMemberList: any;
  constructor(
    public Dialog: MatDialog,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private socialService: SocialService,
    private groupService: GroupService,
    private toastr: ToastrService
  ) {
    this.groupId = this.route.snapshot.params['id'];
  }

  async ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('User'));
    this.GetGroupRules();
    this.getReportedContent();
    this.getGroupData();
    await this.GetGroupFeeds();
    await this.GetGroupPendingFeeds(this.pageData);
    await this.getRequestedGroupMembers();
    await this.getBlockedGroupMembers();
  }
  getReportedContent() {
    this.groupService.getReportedContent(this.groupId).then((x: any) => {
      this.reportedContent = x.data;
    });
  }

  async getGroupData() {
    const res: any = await this.groupService.getById(
      this.groupId,
      this.user?.id
    );
    if (res) {
      this.group = res.data;
     const index = this.group?.groupFriend.findIndex(x => x.userId === this.user.id);
     if (index > -1) {
      this.isGroupAdmin = +this.group?.groupFriend[index].role === 2 ? true : false
     }
      // this.isGroupAdmin = this.group?.userId === this.user.id;
      console.log('this.group', this.group);
    }
  }
  async GetGroupFeeds(
    { pageNo, pageSize } = { pageNo: this.pageNo, pageSize: this.pageSize }
  ) {
    this.loaderService.PresentLoading();
    let res: any = await this.socialService.GetGroupFeeds(
      this.user.id,
      this.groupId,
      pageNo,
      pageSize
    );
    if (!res.data.success) {
      this.loaderService.DissmissLoading();
      return;
    }
    this.totalPostCount = res?.data?.count;
    this.posts = this.posts.concat(res?.data?.data);
    // this.pendingPosts = this.posts.filter(x => x.groupPostApproved === 0);
    // this.posts = this.posts.filter(x => x.groupPostApproved !== 0);
    this.socialService.setPostData(this.posts);
    this.loaderService.DissmissLoading();
  }
  async GetGroupPendingFeeds(pageData) {
    this.loaderService.PresentLoading();
    let res: any = await this.socialService.GetGroupPendingFeeds(
      this.user.id,
      this.groupId,
      pageData.offset,
      pageData.limit
    );
    if (!res.data.success) {
      this.loaderService.DissmissLoading();
      return;
    }
    this.totalPendingPostCount = res?.data?.count;
    this.pendingPosts = this.pendingPosts.concat(res?.data?.data);
    // this.pendingPosts = this.posts.filter(x => x.groupPostApproved === 0);
    // this.posts = this.posts.filter(x => x.groupPostApproved !== 0);
    // this.socialService.setPostData(this.posts);
    this.loaderService.DissmissLoading();
  }

  async deleteGroupRules(item) {
    try {
      const obj = {
        id: item.id,
        groupId: item.groupId,
        title: item.title,
        description: item.description,
      };
      const res = await this.groupService.deleteGroupRules(obj);
      this.toastr.success('Deleted Successfully');
      await this.GetGroupRules();
    } catch (error) {
      this.toastr.error(error.error.meta.message);
    }
  }
  async GetGroupRules() {
    let res: any = await this.groupService.getGroupRules(this.groupId);
    if (!res.data.success) {
      this.loaderService.DissmissLoading();
      return;
    }
    this.groupRules = res?.data?.data;
  }
  groupRuleDialog(data) {
    const DialogRef = this.Dialog.open(GroupRulesComponent, {
      width: '35%',
      height: '50vh',
      disableClose: true,
      data: { data: data, groupId: this.groupId },
    });
    DialogRef.afterClosed().subscribe((result) => {
      if (result !== null && result !== undefined) {
        this.GetGroupRules();
      }
    });
  }
  async updateSettings() {
    try {
      const obj = {
        id: this.group.id,
        name: this.group.name,
        privacyType: this.group.privacyType,
        visiblity: this.group.visiblity,
        postApproval: this.group.postApproval,
      };
      const res = await this.groupService.updateGroupSettings(obj);
      this.toastr.success('Updated Successfully');
      this.groupService.sendGroupUpdateMessage('updated');
      await this.getGroupData();
    } catch (error) {
      this.toastr.error(error.error.meta.message);
    }
  }
  async getRequestedGroupMembers() {
    let data: any = await this.groupService.getRequestedGroupMembers(
      this.groupId
    );
    if (data.data.length > 0) {
      this.requestedGroupMembers = data.data;
      // this.requestedGroupMemberList = this.requestedGroupMembers;
    }
  }

  async getBlockedGroupMembers() {
    let data: any = await this.groupService.getBlockedGroupMembers(
      this.groupId
    );
    if (data.data.length > 0) {
      this.blockedGroupMembers = data.data;
      // this.requestedGroupMemberList = this.requestedGroupMembers;
    }
  }

  async acceptRequestedGroupMembers(userId, status, id) {
    let data: any = await this.groupService.acceptRequestedGroupMembers(
      this.groupId,
      userId,
      status
    );
    if (data.data.success) {
      const index = this.requestedGroupMembers.findIndex((x) => x.id === id);
      if (index > -1) {
        this.requestedGroupMembers.splice(index, 1);
        if (status === 1) {
          this.groupService.updateMemberCount(1);
        }
      }
    }
  }

  async acceptAllRequestedGroupMembers(groupId, status) {
    let data: any = await this.groupService.acceptAllRequestedGroupMembers(
      groupId,
      status
    );
    if (data.data.success) {
      if (status === 1) {
        this.groupService.updateMemberCount(this.requestedGroupMembers.length);
      }
      this.requestedGroupMembers = [];
    }
  }

  async acceptPendingPost(status, id) {
    let data: any = await this.socialService.acceptPendingPost(
      this.groupId,
      id,
      status
    );
    if (data.data.success) {
      if (status === 1) {
        const post = this.pendingPosts.find((x) => x.id === id);
        post.groupPostApproved = status;
        this.posts.push(post);
        this.totalPostCount++;
      }
      const index = this.pendingPosts.findIndex((x) => x.id === id);
      if (index > -1) {
        this.pendingPosts.splice(index, 1);
        this.totalPendingPostCount--;
      }
    }
  }

  async acceptAllPendingPost(status) {
    let data: any = await this.socialService.acceptAllPendingPost(
      this.groupId,
      status
    );
    if (data.data.success) {
      const length = this.pendingPosts.length;
      for (let i = length - 1; i >= 0; i--) {
        if (status === 1) {
          const post = this.pendingPosts.find(
            (x) => x.id === this.pendingPosts[i].id
          );
          post.groupPostApproved = status;
          this.posts.push(post);
          this.totalPostCount++;
        }
        const index = this.pendingPosts.findIndex(
          (x) => x.id === this.pendingPosts[i].id
        );
        if (index > -1) {
          this.pendingPosts.splice(index, 1);
          this.totalPendingPostCount--;
        }
      }
    }
  }

  // searchGroupFriends(e) {
  //   if (this.searchSubscription) {
  //     this.searchSubscription.unsubscribe();
  //   }
  //   this.searchSubscription = this.groupService.searchGroupFriends(e)
  //     .subscribe((res: any) => {
  //       if (!res.data.success) {
  //         return;
  //       }

  //         this.requestedGroupMemberList = res.data.data.length > 0 ? res.data.data : this.requestedGroupMembers;
  //     });
  // }

  UpsertPost(post) {
    const index = this.posts.findIndex((x) => x.id === post.id);
    if (index > -1) {
      this.posts.splice(index, 1, post);
    } else {
      this.posts.push(post);
      this.totalPostCount++;
    }
    this.socialService.setPostData(this.posts);
  }

  deletedPost(post) {
    const index = this.posts.findIndex((x) => x.id === post.id);
    if (index > -1) {
      this.posts.splice(index, 1);
      this.totalPostCount--;
    }
    this.socialService.setPostData(this.posts);
  }
  async removeGroupBlockedUser(id) {
    try {
      const res: any = await this.groupService.removeGroupBlockedUser(id);
      if (res?.data?.success) {
        const index = this.blockedGroupMembers.findIndex((x) => x.id === id);
        if (index > -1) {
          this.blockedGroupMembers.splice(index, 1);
          this.toastr.success('Removed Successfully');
        }
      }
    } catch (error) {
      this.toastr.error(error);
    }
  }

  async keepReportedContent(item) {
    try {
      const res = await this.groupService.keepReportedContent(item.id);
      this.toastr.success('Updated Successfully!.');
      this.getReportedContent();
      this.posts = [];
      await this.GetGroupFeeds();
    } catch (error) {
      this.toastr.success('Something Went Wrong.');
    }
  }
  async rejectReportedContent(item) {
    try {
      const res = await this.groupService.rejectReportedContent(item.id);
      this.toastr.success('Updated Successfully!.');
      this.getReportedContent();
      this.posts = [];
      await this.GetGroupFeeds();
    } catch (error) {
      this.toastr.success('Something Went Wrong.');
    }
  }

  async rejectAllReportedContent() {
    try {
      const res = await this.groupService.rejectAllReportedContent(
        this.groupId
      );
      this.toastr.success('Updated Successfully!.');
      this.getReportedContent();
      this.posts = [];
      await this.GetGroupFeeds();
    } catch (error) {
      this.toastr.success('Something Went Wrong.');
    }
  }
  async keepAllReportedContent() {
    try {
      const res = await this.groupService.keepAllReportedContent(this.groupId);
      this.toastr.success('Updated Successfully!.');
      this.getReportedContent();
      this.posts = [];
      await this.GetGroupFeeds();
    } catch (error) {
      this.toastr.success('Something Went Wrong.');
    }
  }
  onChange(event: MatTabChangeEvent) {
    const tab = event.tab.textLabel;
    console.log(tab);
    if (tab === 'Reported Content') {
      this.getReportedContent();
    }
  }
  search(event?) {
    // const data = {
    //   selectedCategory: this.searchableData.selectedCategory,
    //   name: this.searchableData.name,
    //   isActive: this.searchableData.isActive,
    //   sku: this.searchableData.sku,
    // };
    const pageData = {
      offset: event ? event.pageIndex : this.pageData.offset,
      limit: event ? event.pageSize : this.pageData.limit,
    };
    this.GetGroupPendingFeeds(pageData);
  }
}
