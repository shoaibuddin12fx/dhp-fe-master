import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  IChatRoom,
  IGroupChatRoom,
  IMessage,
  IUserProfile,
  IUserProfileContact,
  UnreadMessagesItem,
} from 'src/app/interfaces/shared.interface';
import { LoaderService } from 'src/app/services/loader.service';
import { ChatService } from 'src/app/services/chat.service';
import { ChatCountService } from 'src/app/services/chat-count.service';

@Component({
  selector: 'app-contact-popup',
  templateUrl: './contact-popup.component.html',
  styleUrls: ['./contact-popup.component.scss'],

  animations: [
    trigger('slideToLeft', [
      state(
        'open',
        style({
          transform: 'translateX(0%)',
          right: '65px',
        })
      ),
      state(
        'close',
        style({
          transform: 'translateX(100%)',
          right: '-65px',
        })
      ),
      transition('open => close', animate('0.6s ease-out')),
      transition('close => open', animate('0.6s ease-out')),
    ]),
  ],
})
export class ContactPopupComponent implements OnInit, OnChanges {
  @Input() isOpened: boolean = false;
  @Input() userProfiles: IUserProfileContact[] = [];
  @Input() unreadMessages: UnreadMessagesItem[] = [];
  @Input() userChatGroups: IGroupChatRoom[] = [];

  showMessageBox = false;
  showChatBox = [false, false];
  currentUser: IUserProfile = null;
  useChatProfiles: IUserProfileContact[] = [];
  // search

  // chat box
  recipient: IUserProfileContact[] = [null, null];
  messages: IMessage[] = [];
  chatData: IChatRoom = null;
  message = '';
  chatRoomId = '';

  // group chat
  selectedMembers: IUserProfileContact[] = [];
  groupNameInput = '';
  groupChatRoom: IGroupChatRoom[] = [null, null];
  showOnlyGroupChats = false;
  concatArr: any[] = [];
  chatList: any[] = [];
  groupList: any[] = [];

  constructor(
    private loaderService: LoaderService,
    private chatService: ChatService,
    private chatCountService: ChatCountService
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (let propName in changes) {
      if (
        propName === 'userProfiles' ||
        propName === 'unreadMessages' ||
        propName === 'userChatGroups'
      ) {
        this.useChatProfiles = this.userProfiles
          .map((profile) => {
            const unread = this.unreadMessages.find(
              (un) => un.senderId.toString() === profile?.id.toString()
            );
            profile.unreadMessagesCount = unread?.count || 0;
            profile.lastMessage = unread?.message || '';
            profile.lastMessageDate = unread?.lastMessageDate;
            return profile;
          })
          .filter((profile) => {
            return profile.isFriend || !!profile?.lastMessage;
          });
        // .sort((a, b) => {
        //   if (!a?.lastMessageDate || !b?.lastMessageDate) {
        //     return -1;
        //   } else if (a.lastMessageDate < b.lastMessageDate) {
        //     return 1;
        //   } else if (a.lastMessageDate > b.lastMessageDate) {
        //     return -1;
        //   }
        //   return 0;
        // });
        this.userChatGroups = this.userChatGroups.map((group) => {
          const unread = this.unreadMessages.find(
            (un) => un.senderId.toString() === group?.groupId
          );
          group.unreadMessagesCount = unread?.count || 0;
          group.lastMessage = unread?.message || '';
          group.lastMessageDate = unread?.lastMessageDate;
          return group;
        });
        // .sort((a, b) => {
        //   if (!a?.lastMessageDate || !b?.lastMessageDate) {
        //     return -1;
        //   } else if (a.lastMessageDate < b.lastMessageDate) {
        //     return 1;
        //   } else if (a.lastMessageDate > b.lastMessageDate) {
        //     return -1;
        //   }
        //   return 0;
        // });
        this.concatArr = [...this.useChatProfiles, ...this.userChatGroups].sort(
          (a: any, b: any) => {
            if (
              (a?.lastMessageDate || a?.createdDate) <
              (b?.lastMessageDate || b?.createdDate)
            ) {
              return 1;
            } else if (
              (a?.lastMessageDate || a?.createdDate) >
              (b?.lastMessageDate || b?.createdDate)
            ) {
              return -1;
            }
            return 0;
          }
        );
        this.chatList = Object.assign([], this.concatArr);
        this.groupList = Object.assign([], this.userChatGroups);

        console.log('useChatProfiles', this.concatArr);
      }
    }
  }

  getCurrentUser() {
    try {
      const userString = localStorage.getItem('User');
      const user = JSON.parse(userString);
      this.currentUser = user;
    } catch (error) {}
  }

  closeChatBox(index: number) {
    this.destroyChatData(index);
    this.setShowChatBox(false, index);
  }

  destroyChatData(index: number) {
    this.recipient[index] = null;
    this.groupChatRoom[index] = null;
    this.messages = [];
  }

  async openChatBox(item: IUserProfile | IGroupChatRoom, isGroup = false) {
    let index = 0;
    index = +this.showChatBox[0];
    if (isGroup) {
      this.recipient[index] = null;
      this.groupChatRoom[index] = item as IGroupChatRoom;
    } else {
      this.groupChatRoom[index] = null;
      this.recipient[index] = item as IUserProfile;
    }
    this.setShowChatBox(true, index);
  }

  openCreateGroup() {
    this.setShowMessageBox(true);
  }

  onSelectMember(member: IUserProfileContact) {
    console.log('member', member);
    member.selectedMember = !member.selectedMember;
    const index = this.selectedMembers.findIndex((m) => m.id === member.id);
    if (index > -1) {
      this.selectedMembers.splice(index, 1);
    } else {
      this.selectedMembers.push(member);
    }
  }

  async onCreateGroup() {
    try {
      const groupUsers = this.selectedMembers.map((m) => m?.id + '');
      const adminId = this.currentUser?.id + '';
      await this.chatService.createGroupChat(
        [adminId, ...groupUsers],
        this.groupNameInput,
        adminId
      );
    } catch (error) {
    } finally {
      this.userProfiles.forEach((profile) => {
        profile.selectedMember = false;
      });
      this.selectedMembers = [];
      this.groupNameInput = '';
    }
  }

  onToggleShowGroupChats() {
    this.showOnlyGroupChats = !this.showOnlyGroupChats;
  }

  setShowChatBox(value: boolean, index: number) {
    this.showChatBox[index] = value;
  }

  setShowMessageBox(value: boolean) {
    this.showMessageBox = value;
  }
  chatSearchTerm(value) {
    if (value === '') {
      this.concatArr = this.chatList;
    } else {
      this.concatArr = this.chatList.filter((x) =>
        x.fullName
          ? x.fullName.toLowerCase().includes(value.toLowerCase())
          : x.name.toLowerCase().includes(value.toLowerCase())
      );
    }
  }
  groupSearchTerm(value) {
    if (value === '') {
      this.userChatGroups = this.groupList;
    } else {
      this.userChatGroups = this.groupList.filter((x) =>
        x.fullName
          ? x.fullName.toLowerCase().includes(value.toLowerCase())
          : x.name.toLowerCase().includes(value.toLowerCase())
      );
    }
  }
}
