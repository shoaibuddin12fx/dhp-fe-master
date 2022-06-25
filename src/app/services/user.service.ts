import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { IEditCoverPhoto } from '../interfaces/shared.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url: string = `${environment.serverUrl}/user`;
  constructor(private http: HttpClient, private authService: AuthService) {}

  getAboutData(id) {
    return this.http.get(`${this.url}/about-us/getdata/${id}`).toPromise();
  }

  addAboutData(data) {
    return this.http.put(`${this.url}/about`, data).toPromise();
  }

  addWorkData(data) {
    return this.http.put(`${this.url}/work-educations`, data).toPromise();
  }

  editProfile(data) {
    return this.http.post(`${this.url}/edit-profile`, data).toPromise();
  }

  editCoverPhoto(data: IEditCoverPhoto) {
    return this.http.post(`${this.url}/edit-cover-photo`, data).toPromise();
  }

  GetUserphoto(id: number, type: number) {
    return this.http
      .post(`${this.url}/photos`, { userId: id, type: type })
      .toPromise();
  }

  getAllUsers(): Observable<any> {
    return this.http.get(this.url);
  }

  getById(id) {
    return this.http.get(`${this.url}/${id}`).toPromise();
  }
  getByProfileId(userId, profileId) {
    return this.http.get(`${this.url}/${userId}/${profileId}`).toPromise();
  }
  VerifyUserHash(obj) {
    return this.http.post(`${this.url}/verifyuserhash`, obj).toPromise();
  }

  SocialLogin(obj) {
    return this.http.post(`${this.url}/sociallogin`, obj).toPromise();
  }

  Register(obj): any {
    return this.http.post(`${this.url}/signup`, obj).toPromise();
  }

  Verify(obj): any {
    return this.http.post(`${this.url}/verify`, obj).toPromise();
  }

  ForgetPassword(obj): any {
    return this.http.post(`${this.url}/forgetpassword`, obj).toPromise();
  }

  VerifyForgetHash(obj): any {
    return this.http.post(`${this.url}/verifyforgethash`, obj).toPromise();
  }

  ResetPassword(obj): any {
    return this.http.post(`${this.url}/resetpassword`, obj).toPromise();
  }
  savePermission(obj): any {
    return this.http.post(`${this.url}/user-permission`, obj).toPromise();
  }
  getUserPermission(id): any {
    return this.http
      .get(`${this.url}/user-permission/getdata/${id}`)
      .toPromise();
  }

  updateUserData() {
    this.getById(this.authService.getUser().id).then((use: any) => {
      localStorage.setItem('User', JSON.stringify(use.data));
    });
  }

  Search(text, userId) {
    return this.http.post(`${environment.serverUrl}/User/search/data`, {
      text: text,
      userId: userId,
    });
  }
}
