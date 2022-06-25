import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor() {}

  initFirebase() {
    firebase.default.initializeApp({ ...environment.firebase });
  }

  getUsersCollectionRef() {
    return firebase.default.firestore().collection('users');
  }

  getChatRoomCollectionRef() {
    return firebase.default.firestore().collection('chat_rooms');
  }

  getUnreadMessagesCollection() {
    return firebase.default.firestore().collection('un_read_messages_count');
  }

  findValueInFireStore() {
    return firebase.default.firestore.FieldValue;
  }
}
