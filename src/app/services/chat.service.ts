import { Injectable } from '@angular/core';
import { IGroupChatRoom } from '../interfaces/shared.interface';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private firebaseService: FirebaseService) {}

  getDocId(users: string[]) {
    return users.sort().join(':');
  }

  async createGroupChat(
    groupUsers: string[],
    groupName: string,
    groupAdminId: string
  ) {
    const chatRoomRef = this.firebaseService.getChatRoomCollectionRef();
    await chatRoomRef.add({
      members: groupUsers,
      name: groupName,
      isGroup: true,
      createdDate: new Date().toISOString(),
      adminId: groupAdminId,
      usersOnlineStatus: {
        [groupUsers[0]]: true,
        ...groupUsers.slice(1).reduce((obj, curUs) => {
          obj[curUs] = false;
          return obj;
        }, {}),
      },
      messages: [],
    });
  }

  async getUserGroupChatRooms(userId: string, callBack: (userGroups: IGroupChatRoom[]) => void) {
    const chatRoomRef = this.firebaseService.getChatRoomCollectionRef();
    const groupDocsFoundRef = await chatRoomRef
      .where('isGroup', '==', true)
      .where('members', 'array-contains', userId);
    const ref = groupDocsFoundRef.onSnapshot(snapshot => {
      const userGroups: IGroupChatRoom[] = [];
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        userGroups.push({ ...data, groupId: doc.id } as IGroupChatRoom);
      });
      callBack(userGroups);
    });
    return ref;
  }

  async createChatRoom(users: string[]) {
    const chatRoomRef = this.firebaseService.getChatRoomCollectionRef();
    await chatRoomRef.doc(this.getDocId(users)).set({
      members: users,
      name: '',
      isGroup: false,
      adminId: '',
      createdDate: new Date().toISOString(),
      // {1: true, 2: false}
      usersOnlineStatus: {
        [users[0]]: true,
        ...users.slice(1).reduce((obj, curUs) => {
          obj[curUs] = false;
          return obj;
        }, {}),
      },
      messages: [],
    });
    return this.getDocId(users);
  }

  async setOnlineStatus(chatRoomId: string, userId: string, status: boolean) {
    const chatCollectionRef = this.firebaseService.getChatRoomCollectionRef();
    const roomDoc = chatCollectionRef.doc(chatRoomId);
    const roomData = (await roomDoc.get()).data();
    await roomDoc.update({
      usersOnlineStatus: { ...roomData.usersOnlineStatus, [userId]: status },
    });
  }

  /**
   * @param fieldValue 'senderId' | 'groupId'
   */
  async setUnreadMessagesCount(
    userIds: { memberId: string, status: boolean }[],
    senderId: string,
    message: string = '',
    removeCount = false,
    fieldValue: string = 'senderId'
  ) {
    const userCollectionRef = this.firebaseService.getUsersCollectionRef();
    for (const userId of userIds) {
      const usersDocRef = await userCollectionRef
        .where('userId', '==', userId?.memberId)
        .get();
      const userDocRef = usersDocRef.docs[0];
      const userData = userDocRef.data();
      const unReadMessageObj = userData?.unread_messages?.find(
        (un) => un[fieldValue] === senderId
      ) || {
        groupId: null,
        senderId: null,
        message,
        [fieldValue]: senderId,
        count: 0,
      };
      if(!removeCount) {
        unReadMessageObj.lastMessageDate = new Date().toISOString();
      }
      const index = userData?.unread_messages?.findIndex(
        (un) => {
          return `${un[fieldValue]}` === `${senderId}`
        }
      ) ?? -1;
      const messages = [...(userData?.unread_messages || [])];
      index > -1 &&
        messages.splice(index, 1, {
          ...unReadMessageObj,
          count: removeCount ? 0 : (!userId?.status?unReadMessageObj?.count + 1:0),
          message: message || unReadMessageObj.message,
        });
      index == -1 &&
        messages.push({
          ...unReadMessageObj,
          count: removeCount ? 0 : (!userId?.status?unReadMessageObj?.count + 1:0),
          message: message || unReadMessageObj.message,
        });
      await userDocRef.ref.update({
        unread_messages: [...messages],
      });
    }
  }

  async getUnreadCountListener(
    userEmail: string,
    callback: (userData: any) => void
  ) {
    const userCollectionRef = this.firebaseService.getUsersCollectionRef();
    const usersDocRef = await userCollectionRef
      .where('email', '==', userEmail)
      .get();
    if (!usersDocRef) {
      return () => {};
    }
    const userDocRef = usersDocRef?.docs[0];
    if (!userDocRef) {
      return () => {};
    }
    const listener = userDocRef.ref.onSnapshot((snapshot) => {
      if (snapshot.exists && snapshot.data()) {
        callback(snapshot.data());
      }
    });
    return listener;
  }

  async getChatRoomDocument(users: string[]) {
    const chatCollectionRef = this.firebaseService.getChatRoomCollectionRef();
    const chatSnapShot =
      (await chatCollectionRef.doc(this.getDocId(users)).get()) || null;
    return chatSnapShot;
  }

  async initChatRoom(users: string[]) {
    const chatRoomDoc = await this.getChatRoomDocument(users);
    let docId = chatRoomDoc.id;
    if (!chatRoomDoc.exists) {
      docId = await this.createChatRoom(users);
    }
    return docId;
  }

  getChatRoomListener(users: string[], callBack: (chatRoomData: any) => void) {
    const chatCollectionRef = this.firebaseService.getChatRoomCollectionRef();
    const docId = chatCollectionRef.doc(this.getDocId(users)).id;
    const listener = chatCollectionRef.doc(docId).onSnapshot((snapshot) => {
      if (snapshot.exists && snapshot.data()) {
        const chatRoomData = snapshot.data();
        callBack(chatRoomData);
      }
    });
    return listener;
  }

  getGroupChatRoomListener(groupId: string, callBack: (chatRoomData: any) => void) {
    const chatCollectionRef = this.firebaseService.getChatRoomCollectionRef();
    const docId = chatCollectionRef.doc(groupId).id;
    const listener = chatCollectionRef.doc(docId).onSnapshot((snapshot) => {
      const data = snapshot.data();
      if (snapshot.exists && data) {
        const chatRoomData = data;
        callBack(chatRoomData);
      }
    });
    return listener;
  }


  async onSendMessage(chatRoomId: string, messageBody: any) {
    const chatCollectionRef = this.firebaseService.getChatRoomCollectionRef();
    const roomDoc = chatCollectionRef.doc(chatRoomId);
    const roomData = (await roomDoc.get()).data();
    await roomDoc.update({
      messages: this.firebaseService.findValueInFireStore().arrayUnion({
        id:
          (roomData?.messages?.length
            ? roomData?.messages[roomData?.messages.length - 1]?.id
            : 0) + 1,
        isImage: messageBody?.isImage,
        message: messageBody?.messageItem,
        sender: messageBody?.userId + '',
        createdDate: new Date().toISOString(),
      }),
    });
  }
}
