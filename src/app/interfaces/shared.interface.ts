export interface IUser {
  email: string;
  userId: string;
  userName: string;
}

export interface IUserProfile {
  id: number;
  userTypeId: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  contactNo: string;
  genderId: string;
  countryId: string;
  cityId: string;
  stateId: string;
  address: string;
  accountVerificationHash: string;
  forgotPasswordHash: string;
  socialLoginId: number;
  isActive: boolean;
  isLocked: boolean;
  isVerified: boolean;
  lockedReason: string;
  fullName: string;
  timezoneId: string;
  currencyId: string;
  originAddress: string;
  description: string;
  relationship: string;
  bio: string;
  profileImage: string;
  coverImage: string;
  isFriend?: boolean;
}

export interface IUserProfileContact extends IUserProfile {
  unreadMessagesCount?: number;
  lastMessage?: string;
  lastMessageDate?: string;
  selectedMember?: boolean;
}

export interface IMessage {
  id: number;
  isImage: boolean;
  message: string;
  sender: number;
  createdDate: string;
  userImage?: string;
}

export interface IChatRoom {
  createDate: string;
  members: string[];
  isGroup: boolean;
  messages: IMessage[];
  usersOnlineStatus: Record<string, boolean>;
  name: string;
}

export interface IGroupChatRoom extends IChatRoom {
  adminId?: string;
  groupId?: string;
  unreadMessagesCount?: number;
  lastMessage?: string;
  lastMessageDate?: string;
}

export interface UnreadMessagesItem {
  senderId: string | null;
  count: number;
  groupId?: string | null;
  message: string;
  lastMessageDate?: string;
}

export interface IEditCoverPhoto {
  userId: string;
  coverPhoto: string;
}

export interface IFriend {
  addedDate: string;
  bio: string;
  deletedDate: string;
  followers: string;
  friendId: number;
  friends: string;
  fullname: string;
  id: number;
  isActive: boolean;
  isDeclined: boolean;
  isFollow: boolean;
  isFreind: boolean;
  isRequest: boolean;
  isfollow: boolean;
  isfollowedbyyou: boolean;
  profileimage: string;
  userId: number;
}
