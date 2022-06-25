import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import {
  IChatRoom,
  IGroupChatRoom,
  IMessage,
  IUserProfile,
  IUserProfileContact,
} from 'src/app/interfaces/shared.interface';
import { ChatService } from 'src/app/services/chat.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-chat-popup',
  templateUrl: './chat-popup.component.html',
  styleUrls: ['./chat-popup.component.scss'],
})
export class ChatPopupComponent implements OnInit, OnDestroy {
  @Input() recipient: IUserProfile = null;
  @Input() groupChatRoom: IGroupChatRoom = null;
  @Input() isMaster: boolean = false;
  @Input() userProfiles: IUserProfileContact[] = [];
  @Input() modalId = '';

  @Output() showChatBox: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() hideChatBox: EventEmitter<void> = new EventEmitter<void>();
  currentUser: IUserProfile = null;
  isLoadingMessages = false;

  messages: IMessage[] = [];
  chatData: IChatRoom = null;
  message = '';
  chatRoomId = '';
  chatListener: () => void;
  isOpened = false;
  showEmojiPicker = false;
  sets = ['native', 'google', 'twitter', 'facebook', 'messenger'];
  set = 'facebook';
  isMinimize = false;

  constructor(private chatService: ChatService) {}
  ngOnChanges(changes: SimpleChanges): void {
    for (let propName in changes) {
      if (propName === 'showChatBox' && this.recipient) {
        console.log('contact profiles', this.recipient);
      }
      if (
        (propName === 'recipient' || propName === 'groupChatRoom') &&
        this.chatRoomId
      ) {
        this.chatService.setOnlineStatus(
          this.chatRoomId,
          this.currentUser?.id + '',
          false
        );
      }
    }
    if (this.recipient) {
      this.openChatBox(this.recipient);
    } else if (this.groupChatRoom) {
      this.openGroupChatBox(this.groupChatRoom);
    }
  }

  ngOnInit(): void {
    this.getCurrentUser();
    if (this.recipient) {
      this.openChatBox(this.recipient);
    } else if (this.groupChatRoom) {
      this.openGroupChatBox(this.groupChatRoom);
    }
  }

  getCurrentUser() {
    try {
      const userString = localStorage.getItem('User');
      const user = JSON.parse(userString);
      this.currentUser = user;
    } catch (error) {}
  }

  async openChatBox(user: IUserProfile) {
    this.destroyChatData();
    this.recipient = user;
    await this.initializeChatBox(user);
  }

  async initializeChatBox(user: IUserProfile) {
    if (this.currentUser?.email) {
      this.isLoadingMessages = true;
      const [sender, recipient] = [this.currentUser?.id, user?.id];
      this.chatRoomId = await this.chatService.initChatRoom([
        `${sender}`,
        `${recipient}`,
      ]);
      this.chatService.setOnlineStatus(
        this.chatRoomId,
        this.currentUser?.id + '',
        true
      );
      const targetId = this.recipient?.id + '';
      await this.chatService.setUnreadMessagesCount(
        [{ memberId: this.currentUser?.id + '', status: true }],
        targetId,
        '',
        true
      );
      this.chatListener = this.chatService.getChatRoomListener(
        [`${sender}`, `${recipient}`],
        (chatData: any) => {
          console.log('chatData', chatData, this.currentUser);
          this.chatData = { ...chatData };
          this.messages = [...(chatData?.messages || [])];
          this.messages = this.messages.map((m) => {
            return {
              ...m,
              userImage:
                `${m.sender}` === `${this.currentUser?.id}`
                  ? this.currentUser?.profileImage
                  : this.recipient?.profileImage,
            };
          });
          setTimeout(() => {
            this.scrollToBottomOfChat();
          }, 200);
          this.isLoadingMessages = false;
        }
      );
    }
  }

  async openGroupChatBox(group: IGroupChatRoom) {
    this.destroyChatData();
    this.groupChatRoom = group;
    await this.initializeGroupChatBox(group);
  }

  async initializeGroupChatBox(group: IGroupChatRoom) {
    if (this.currentUser?.email) {
      this.isLoadingMessages = true;
      this.chatRoomId = group?.groupId;
      this.chatService.setOnlineStatus(
        group?.groupId,
        this.currentUser?.id + '',
        true
      );
      await this.chatService.setUnreadMessagesCount(
        [{ memberId: this.currentUser?.id + '', status: true }],
        group?.groupId,
        '',
        true
      );
      this.chatListener = this.chatService.getGroupChatRoomListener(
        group?.groupId,
        (chatData: any) => {
          console.log('chatData', chatData, this.currentUser);
          this.chatData = { ...chatData };
          this.messages = [...(chatData?.messages || [])];
          this.messages = this.messages.map((m) => {
            return {
              ...m,
              userImage:
                `${m.sender}` === `${this.currentUser?.id}`
                  ? this.currentUser?.profileImage
                  : this.userProfiles.find((x) => `${x?.id}` === `${m.sender}`)
                      ?.profileImage || '',
            };
          });
          setTimeout(() => {
            this.scrollToBottomOfChat();
          }, 200);
          this.isLoadingMessages = false;
        }
      );
    }
  }

  closeChatBox() {
    this.destroyChatData();
    this.hideChatBox.emit();
  }

  destroyChatData() {
    this.recipient = null;
    this.messages = [];
    // unsubscribing chat listener
    this.chatListener && this.chatListener();
  }

  async onSendMessage(event: any) {
    try {
      if (
        event.target.value !== '' &&
        event.target.value.replace(/\s/g, '') !== ''
      ) {
        await this.chatService.onSendMessage(this.chatRoomId, {
          isImage: false,
          messageItem: this.message,
          userId: this.currentUser?.id + '',
        });
        const msg = this.message;
        this.message = '';
        const offlineMembers = Object.entries(
          this.chatData.usersOnlineStatus
        ).filter(([id, st]) => id !== this.currentUser?.id + '' && !st);
        const usersIds = offlineMembers.map((ofm) => ofm[0]);
        console.log('offlineMembers', offlineMembers, { usersIds });
        const targetId =
          this.groupChatRoom?.groupId || this.currentUser?.id + '';
        const totalMembers = this.chatData?.members.map((memberId) => {
          return {
            memberId,
            status: this.chatData.usersOnlineStatus[memberId],
          };
        });
        if (totalMembers?.length) {
          await this.chatService.setUnreadMessagesCount(
            totalMembers,
            targetId,
            msg
          );
        }
      }
    } catch (error) {}
  }

  setShowChatBox(value: boolean) {
    // this.showChatBox.emit(value);
  }

  scrollToBottomOfChat() {
    const scrollContainer = document.querySelector(
      '#chat_container_div' + this.modalId
    );
    scrollContainer.scroll({
      top: scrollContainer.scrollHeight,
      behavior: 'smooth',
    });
  }

  ngOnDestroy(): void {
    this.chatService.setOnlineStatus(
      this.chatRoomId,
      this.currentUser?.id + '',
      false
    );
    this.destroyChatData();
  }
  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }
  minimize() {
    this.isMinimize = !this.isMinimize;
  }

  addEmoji(event) {
    console.log(this.message);
    const { message } = this;
    console.log(message);
    console.log(`${event.emoji.native}`);
    const text = `${message}${event.emoji.native}`;

    this.message = text;
    // this.showEmojiPicker = false;
  }

  onFocus() {
    this.showEmojiPicker = false;
  }
}
