import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url: string = `${environment.serverUrl}/auth`;
  constructor(
    private http: HttpClient,
    private router: Router,
    private firebaseService: FirebaseService
  ) {}

  Login(obj) {
    return this.http.post(`${this.url}/login`, obj).toPromise();
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

  async logout(userId?: string) {
    const userCollection = this.firebaseService.getUsersCollectionRef();
    const snapshot = await userCollection
      .where('userId', '==', `${userId}`)
      .get();
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      await doc.ref.update({
        isOnline: false,
      });
    }
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['login']);
  }

  getUser() {
    return JSON.parse(localStorage.getItem('User'));
  }
}
