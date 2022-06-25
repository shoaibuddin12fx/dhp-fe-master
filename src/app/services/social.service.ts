import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocialService {
  public isProfile: BehaviorSubject<any> = new BehaviorSubject(null);
  public postsData: BehaviorSubject<any[]> = new BehaviorSubject([]);
  url: string = `${environment.serverUrl}/social`;
  constructor(private http: HttpClient) {}

  getSinglePost(postId, userId) {
    return this.http
      .post(`${this.url}/get-single-post`, { postId: postId, userId: userId })
      .toPromise();
  }

  GetMyNewsFeed(id, pageNo: number, pageSize: number) {
    return this.http
      .post(`${this.url}/me/newsfeed`, { userId: id, pageNo, pageSize })
      .toPromise();
  }

  GetNewsFeed(id, pageNo: number, pageSize: number) {
    return this.http
      .post(`${this.url}/newsfeed`, { userId: id, pageNo, pageSize })
      .toPromise();
  }
  GetGroupFeeds(userId, groupId, pageNo: number, pageSize: number) {
    return this.http
      .post(`${this.url}/groupfeeds/${groupId}`, {
        userId: userId,
        pageNo,
        pageSize,
      })
      .toPromise();
  }

  GetGroupPendingFeeds(userId, groupId, pageNo: number, pageSize: number) {
    return this.http
      .post(`${this.url}/group-pending-feeds/${groupId}`, {
        userId: userId,
        pageNo,
        pageSize,
      })
      .toPromise();
  }
  GetNewsFeedVideo(id, pageNo: number, pageSize: number) {
    return this.http
      .post(`${this.url}/newsfeed/video`, { userId: id, pageNo, pageSize })
      .toPromise();
  }
  GetUserphoto(id) {
    return this.http
      .post(`${this.url}/newsfeed/photo`, { userId: id })
      .toPromise();
  }

  // UploadPost(id) {
  //   return this.http.get(`${this.url}/newsfeed?userId=${id}`).toPromise();
  // }

  UploadPost(form) {
    return this.http.post(`${this.url}/addpost`, form).toPromise();
  }

  EditPost(payload: any): Promise<any> {
    return this.http.post(`${this.url}/editpost`, payload).toPromise();
  }

  DeletePost(id) {
    return this.http.post(`${this.url}/deletepost`, { postId: id }).toPromise();
  }

  Like(obj) {
    return this.http.post(`${this.url}/likePost`, obj).toPromise();
  }

  AddComment(obj) {
    return this.http.post(`${this.url}/saveComments`, obj).toPromise();
  }

  EditComment(obj, id) {
    return this.http.post(`${this.url}/editComment/${id}`, obj).toPromise();
  }

  deleteComment(id) {
    return this.http.delete(`${this.url}/deleteComment/${id}`).toPromise();
  }

  getComment(postId, userId) {
    return this.http
      .get(`${this.url}/getComments/${postId}/userId/${userId}`)
      .toPromise();
  }

  getIsProfile(): Observable<any> {
    return this.isProfile.asObservable();
  }

  setPostData(data) {
    this.postsData.next(data);
  }
  getPostData() {
    return this.postsData.asObservable();
  }

  acceptPendingPost(groupId: number, postId: number, status: number) {
    return this.http
      .get(`${this.url}/accept-pending-post/${groupId}/${postId}/${status}`)
      .toPromise();
  }

  acceptAllPendingPost(groupId: number, status: number) {
    return this.http
      .get(`${this.url}/accept-all-pending-post/${groupId}/${status}`)
      .toPromise();
  }
}
