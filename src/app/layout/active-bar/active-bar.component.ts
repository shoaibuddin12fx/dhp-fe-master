import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { IMessage, IUserProfile } from 'src/app/interfaces/shared.interface';
import { ChatService } from 'src/app/services/chat.service';
import { ContactService } from 'src/app/services/contact.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-active-bar',
  templateUrl: './active-bar.component.html',
  styleUrls: ['./active-bar.component.scss'],
})
export class ActiveBarComponent implements OnInit, OnChanges {
  showContactPopup$: Observable<boolean>;
  @Input() isOpened: boolean = false;
  @Input() userProfiles: IUserProfile[] = [];

  userFriends: IUserProfile[] = []
  currentUser: IUserProfile = null;
  chatUser: any;
  showChatBox = false;
  chatUserProfile = null;

  // users ref
  userRefObserver: () => void;
  constructor(private contactService: ContactService, private firebaseService: FirebaseService) {}
  isShowBox = false;

  ngOnInit(): void {
    this.getCurrentUser();
    this.setShowContactPopup();
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (let propName in changes) {
      if (propName === 'userProfiles' && this.userProfiles?.length) {
        this.filterActiveFriends();
      }
    }
  }

  filterActiveFriends() {
    const usersRef = this.firebaseService.getUsersCollectionRef();
    const userIds = this.userProfiles.map(user => user?.id+'');
    console.log('friends ids', userIds);
    this.userRefObserver = usersRef.where('userId', 'in', userIds).onSnapshot(snapshot => {
      const onlineFriends = [];
      snapshot.docs.forEach(doc => {
        const user = doc.data();
        user?.isOnline && onlineFriends.push(user?.userId);
      });
      this.userFriends = this.userProfiles.filter(user => onlineFriends?.find(friend => friend === `${user?.id}`));
    });
  }

  getCurrentUser() {
    try {
      const userString = localStorage.getItem('User');
      const user = JSON.parse(userString);
      this.currentUser = user;
    } catch (error) {}
  }
  setShowContactPopup() {
    this.showContactPopup$ = this.contactService.contactPopupObservable();
  }
  toggleContactPopup() {
    this.isShowBox = !this.isShowBox;
    this.contactService.toggleContactPopup(this.isShowBox);
  }

  openChatBox(user, isOpen) {
    this.chatUserProfile = user;
    this.showChatBox = isOpen;
  }

  closeChatBox(value) {
    this.showChatBox = value;
  }
}
