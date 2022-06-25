import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FriendService {
  private friendRequestCount$: BehaviorSubject<number> = new BehaviorSubject(0);

  url: string = `${environment.serverUrl}/friends`;

  constructor(private http: HttpClient) {}

  GetFriends(id, me) {
    return this.http
      .post(`${this.url}/getfriends`, { userId: id, me: me })
      .toPromise();
  }
  GetFollowers(id) {
    return this.http
      .post(`${this.url}/get-followers`, { userId: id })
      .toPromise();
  }
  GetFollowing(id) {
    return this.http
      .post(`${this.url}/get-followings`, { userId: id })
      .toPromise();
  }

  getMyfriendIds(id: number) {
    return this.http.get(`${this.url}/get-friend-ids/${id}`);
  }

  followUser(id: any, friendId: any) {
    return this.http
      .post(`${this.url}/follow-user`, { userId: id, friendId: friendId })
      .toPromise();
  }

  unfollowUser(id: any, friendId: any) {
    return this.http
      .post(`${this.url}/unfollow-user`, { userId: id, friendId: friendId })
      .toPromise();
  }
  unFriendUser(id: any, friendId: any) {
    return this.http
      .post(`${this.url}/unFriend-user`, { userId: id, friendId: friendId })
      .toPromise();
  }
  GetRequestedFriends(id) {
    return this.http
      .post(`${this.url}/getrequests`, { userId: id })
      .toPromise();
  }

  getFriendRequestCount(id) {
    return this.http
      .post(`${this.url}/getFriendRequestCount`, { userId: id })
      .toPromise();
  }

  AddFriend(obj) {
    return this.http.post(`${this.url}/addfriend`, obj).toPromise();
  }

  UnFriend(obj) {
    return this.http.post(`${this.url}/unfriends`, obj).toPromise();
  }

  Follow(obj) {
    return this.http.post(`${this.url}/follow`, obj).toPromise();
  }

  UnFollow(obj) {
    return this.http.post(`${this.url}/unfollow`, obj).toPromise();
  }

  AcceptDeclineRequest(obj) {
    return this.http.post(`${this.url}/acceptdeclinerequest`, obj).toPromise();
  }

  GetPendingRequests(id) {
    return this.http
      .post(`${this.url}/getpendingrequests`, { userId: id })
      .toPromise();
  }

  getSuggestedFriends(id: number): Observable<any> {
    return this.http.get(`${this.url}/suggested-friends/${id}`);
  }

  checkIsFriends(id: number, friendId: number): Observable<any> {
    return this.http.get(`${this.url}/check-user-friend/${id}/${friendId}`);
  }

  Search(text, userId) {
    return this.http.post(`${this.url}/search`, { text: text, userId: userId });
  }

  setRequestCount(message: number) {
    this.friendRequestCount$.next(message);
  }

  getRequestCount() {
    return this.friendRequestCount$.asObservable();
  }
}
