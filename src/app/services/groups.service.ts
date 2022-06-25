import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private AllGroupsObj$: BehaviorSubject<any> = new BehaviorSubject(null);
  private AllGroupByFriendIdObj$: BehaviorSubject<any> = new BehaviorSubject(
    null
  );
  private groupUpdateSub = new Subject<any>();
  private addMemberCount$ = new BehaviorSubject<number>(0);
  updateMemberCount$ = this.addMemberCount$.asObservable();
  url: string = `${environment.serverUrl}/groups`;
  constructor(private http: HttpClient) {}

  addGroupData(data) {
    return this.http.post(`${this.url}/`, data).toPromise();
  }
  addGroupRules(data) {
    return this.http.post(`${this.url}/add-group-rules`, data).toPromise();
  }
  deleteGroupRules(data) {
    return this.http.post(`${this.url}/delete-group-rules`, data).toPromise();
  }
  updateGroupRules(data) {
    return this.http.post(`${this.url}/update-group-rules`, data).toPromise();
  }
  updateGroupSettings(data) {
    return this.http
      .post(`${this.url}/update-group-settings`, data)
      .toPromise();
  }
  updateGroupData(id, data) {
    return this.http.put(`${this.url}/${id}`, data).toPromise();
  }
  getAllGroups(userId: number) {
    return this.http.get(`${this.url}?userId=${userId}`).toPromise();
  }

  getById(id, userId: number) {
    return this.http.get(`${this.url}/${id}?userId=${userId}`).toPromise();
  }
  getByPrivacy(type) {
    return this.http.get(`${this.url}/getByPrivacy/${type}`).toPromise();
  }
  getGroupRules(groupid) {
    return this.http.get(`${this.url}/get-group-rules/${groupid}`).toPromise();
  }

  getGroupMembers(groupId: number, role: number) {
    return this.http.get(`${this.url}/getGroupMembers/${groupId}/${role}`);
  }
  requestToJoin(groupId: number, userId: number, isRequest: boolean) {
    return this.http
      .get(`${this.url}/add-group-user/${groupId}/${userId}/${isRequest}`)
      .toPromise();
  }

  getByfriendId(friendId) {
    return this.http.get(`${this.url}/getByfriendId/${friendId}`).toPromise();
  }

  getGroupsByUserId(id) {
    return this.http.get(`${this.url}/getByUserId/${id}`).toPromise();
  }

  deleteGroupData(id) {
    return this.http.delete(`${this.url}/${id}`).toPromise();
  }

  getAllGroupsObj(): Observable<any> {
    return this.AllGroupsObj$.asObservable();
  }

  setAllGroupsObj(groups: any) {
    this.AllGroupsObj$.next(groups);
  }

  getAllGroupByFriendIdObj(): Observable<any> {
    return this.AllGroupByFriendIdObj$.asObservable();
  }

  setAllGroupByFriendIdObj(groups: any) {
    this.AllGroupByFriendIdObj$.next(groups);
  }

  clearGroupData() {
    this.AllGroupsObj$.next(null);
    this.AllGroupByFriendIdObj$.next(null);
  }

  onPostApproval(id: number, approval: boolean) {
    return this.http
      .get(`${this.url}/post-approval/${id}/${approval}`)
      .toPromise();
  }

  removeAsAdmin(id: number) {
    return this.http.get(`${this.url}/remove-as-admin/${id}`).toPromise();
  }
  addAsAdmin(id: number) {
    return this.http.get(`${this.url}/add-as-admin/${id}`).toPromise();
  }
  blockFromGroup(id: number) {
    return this.http.get(`${this.url}/block-from-group/${id}`).toPromise();
  }
  removeMember(id: number) {
    return this.http.get(`${this.url}/remove-member/${id}`).toPromise();
  }
  searchGroup(text) {
    return this.http.post(`${this.url}/searchGroup`, { text: text });
  }
  updateGroup(body) {
    return this.http.post(`${this.url}/update-group`, body).toPromise();
  }

  addGroupUser(groupId, userId, isRequest) {
    return this.http
      .get(`${this.url}/add-group-user/${groupId}/${userId}/${isRequest}`)
      .toPromise();
  }

  inviteFriends(payload: any) {
    return this.http.post(`${this.url}/inviteFriends`, payload);
  }

  getRequestedGroupMembers(groupId: number) {
    return this.http
      .get(`${this.url}/getRequestedGroupMembers/${groupId}`)
      .toPromise();
  }

  getBlockedGroupMembers(groupId: number) {
    return this.http
      .get(`${this.url}/getBlockedGroupMembers/${groupId}`)
      .toPromise();
  }

  acceptRequestedGroupMembers(groupId: number, userId: number, status: number) {
    return this.http
      .get(
        `${this.url}/acceptRequestedGroupMembers/${groupId}/${userId}/${status}`
      )
      .toPromise();
  }

  acceptAllRequestedGroupMembers(groupId: number, status: number) {
    return this.http
      .get(`${this.url}/acceptAllRequestedGroupMembers/${groupId}/${status}`)
      .toPromise();
  }

  searchGroupFriends(text) {
    return this.http.post(`${this.url}/searchGroupFriends`, { text: text });
  }
  reportContent(Payload) {
    return this.http.post(`${this.url}/report-content`, Payload).toPromise();
  }

  removeGroupBlockedUser(id) {
    return this.http
      .delete(`${this.url}/removeGroupBlockedUser/${id}`)
      .toPromise();
  }
  getReportedContent(groupId: number) {
    return this.http
      .get(`${this.url}/get-reported-content/${groupId}`)
      .toPromise();
  }

  keepReportedContent(id: number) {
    return this.http.get(`${this.url}/keep-reported-content/${id}`).toPromise();
  }
  keepAllReportedContent(groupId: number) {
    return this.http
      .get(`${this.url}/keep-all-reported-content/${groupId}`)
      .toPromise();
  }
  rejectReportedContent(id: number) {
    return this.http
      .get(`${this.url}/reject-reported-content/${id}`)
      .toPromise();
  }
  rejectAllReportedContent(groupId: number) {
    return this.http
      .get(`${this.url}/reject-all-reported-content/${groupId}`)
      .toPromise();
  }
  getMyGroups(id) {
    return this.http.get(`${this.url}/getMyGroups/${id}`).toPromise();
  }

  updateMemberCount(message: number) {
    this.addMemberCount$.next(message);
  }

  updateGroupObs(message: number) {
    this.addMemberCount$.next(message);
  }
  sendGroupUpdateMessage(message: string) {
    this.groupUpdateSub.next({ text: message });
  }

  clearGroupUpdateMessage() {
    this.groupUpdateSub.next();
  }

  getGroupUpdateMessage(): Observable<any> {
    return this.groupUpdateSub.asObservable();
  }
}
