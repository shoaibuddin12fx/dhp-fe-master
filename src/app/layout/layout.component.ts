import { Router } from '@angular/router';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Observable } from 'rxjs';
import {
  IGroupChatRoom,
  IUserProfile,
  UnreadMessagesItem,
} from '../interfaces/shared.interface';
import { ChatCountService } from '../services/chat-count.service';
import { ChatService } from '../services/chat.service';
import { ContactService } from '../services/contact.service';
import { FriendService } from '../services/friend.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  // @Input() isSearch: boolean = false;
  showContactPopup$: Observable<boolean>;

  userProfiles: IUserProfile[] = [];
  userFriends: IUserProfile[] = [];
  user: any;

  // chat listener
  userChatGroups: IGroupChatRoom[] = [];
  unreadMessages: UnreadMessagesItem[] = [];
  unreadMessageListener: () => void;
  userGroupsListener: () => void;

  searchSubscription: any;
  searchResults: any[] = [];
  searchValue = '';
  isSearch = false;

  constructor(
    private contactService: ContactService,
    private userService: UserService,
    private friendService: FriendService,
    private chatService: ChatService,
    private chatCountService: ChatCountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
    this.setShowContactPopup();
    this.getAllUsers();
    this.listenToUnreadChatCount();
    this.getUserChatGroups();
  }

  async listenToUnreadChatCount() {
    this.unreadMessageListener = await this.chatService.getUnreadCountListener(
      this.user.email,
      (userData: any) => {
        console.log('unread userData', userData);
        this.unreadMessages = [...(userData?.unread_messages || [])];
        this.chatCountService.setCount(this.unreadMessages);
      }
    );
  }

  async getUserChatGroups() {
    this.userGroupsListener = await this.chatService.getUserGroupChatRooms(
      this.user?.id + '',
      (userGroups) => {
        this.userChatGroups = [...(userGroups || [])];
        console.log('userChatGroups', this.userChatGroups);
      }
    );
  }

  setShowContactPopup() {
    this.showContactPopup$ = this.contactService.contactPopupObservable();
  }

  getCurrentUser() {
    try {
      const userString = localStorage.getItem('User');
      const user = JSON.parse(userString);
      this.user = user;
    } catch (error) {}
  }

  async getAllUsers() {
    try {
      const response = await this.userService.getAllUsers().toPromise();
      const userProfiles = [...((response?.data as IUserProfile[]) || [])];
      const friends = await this.getUserFriends();
      console.log('friends', friends);
      this.userProfiles = [...userProfiles]
        .filter((x) => x?.id != this.user?.id)
        .map((profile) => {
          profile.isFriend = !!friends.find((friend) =>
            friend?.friendId === this.user?.id
              ? profile?.id === friend?.userId
              : profile?.id === friend?.friendId
          );
          return profile;
        });
      this.userFriends = friends.map((friend) => {
        return userProfiles.find((profile) =>
          friend?.friendId === this.user?.id
            ? profile?.id === friend?.userId
            : profile?.id === friend?.friendId
        );
      });
      console.log('userProfiles', this.userProfiles);
    } catch (error) {}
  }

  async getUserFriends() {
    try {
      const res: any = await this.friendService.GetFriends(this.user.id, null);
      if (!res.data.success) {
        return;
      }
      const friends = [...(res?.data?.data || [])];
      return friends;
    } catch (error) {}
  }

  ngOnDestroy(): void {
    this.unreadMessageListener && this.unreadMessageListener();
    this.userGroupsListener && this.userGroupsListener();
  }

  searchText(e) {
    this.searchValue = e;
  }

  Search(type) {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    const value = type === 1 ? this.searchValue : '';
    this.searchSubscription = this.userService
      .Search(value, this.user.id.toString())
      .subscribe((res: any) => {
        if (!res.data.success) {
          return;
        }
        this.searchResults = res.data.data;
        if (this.searchResults.length <= 0) {
        }
      });
  }
  openSearchBar(event) {
    this.isSearch = event;
  }

  goToRoute(id) {
    this.isSearch = false;
    this.router.navigateByUrl(`/social/profile/${id}/user-feed`);
  }
}
