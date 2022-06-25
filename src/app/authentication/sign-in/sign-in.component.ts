import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { ToastrService } from 'ngx-toastr';
import { GoogleLoginProvider } from 'angularx-social-login';

import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { UserService } from 'src/app/services/user.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { IUser } from 'src/app/interfaces/shared.interface';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  model = {
    email: '',
    password: '',
  };
  showPassword = false;
  errorMessage: string;
  showLoading = false;
  param: any = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private authService2: SocialAuthService,
    private route: ActivatedRoute,
    private firebaseService: FirebaseService
  ) {}

  async ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params && params['user'] && params['key']) {
        this.param.push({
          userHash: decodeURIComponent(params['user']),
          verifyHash: decodeURIComponent(params['key']),
        });
      }
    });
    if (this.param && this.param.length > 0) {
      await this.VerifyUserHash();
    }
  }

  async checkAndAddUserToFirestore(userData: IUser) {
    const userCollection = this.firebaseService.getUsersCollectionRef();
    const snapshot = await userCollection
      .where('email', '==', userData?.email)
      .get();
    if (snapshot.empty) {
      userCollection.doc().set(userData);
    }
  }

  async Login(f) {
    try {
      if (f.valid) {
        this.showLoading = true;
        let res: any = await this.authService.Login(this.model);
        console.log(res);
        const user = res?.data?.data;
        // await this.checkAndAddUserToFirestore({
        //   email: user?.email,
        //   userId: user?.id+'',
        //   userName: user?.firstName
        // });
        this.showLoading = false;
        if (!res.success) {
          this.toastr.error(res.data.message);
          return;
        }
        if (!res.verified) {
          this.toastr.success(res.data.message);
          return;
        }
        if (res.success) {
          localStorage.clear();
          // const use: any = await this.userService.getById(res.data.id);
          localStorage.setItem('User', JSON.stringify(res.data));
          this.router.navigate(['social']);
        }
      }
    } catch (e) {
      this.showLoading = false;
      return e;
    }
  }

  signInWithGoogle() {
    const googleLoginOptions = {
      scope: 'profile email',
    };
    let that = this;
    this.authService2
      .signIn(GoogleLoginProvider.PROVIDER_ID, googleLoginOptions)
      .then(async (x: any) => {
        let obj = {
          socialId: x.id,
          firstName: x.name,
          email: x.email,
        };
        let res: any = await that.authService.SocialLogin(obj);
        const user = res.data.data;
        console.log('user', user);
        // this.checkAndAddUserToFirestore({
        //   email: user?.email,
        //   userId: user?.id+'',
        //   userName: user?.userName
        // });
        if (!res.data.success) {
          that.toastr.error(res.data.message);
        } else {
          localStorage.clear();
          localStorage.setItem('User', JSON.stringify(res.data.data));
          that.router.navigate(['social']);
        }
      })
      .catch((error) => {
        console.log('Promise rejected with ' + JSON.stringify(error));
      });
  }

  async VerifyUserHash() {
    try {
      this.loaderService.PresentLoading();
      let res: any = await this.authService.VerifyUserHash(this.param[0]);
      this.loaderService.PresentLoading();
      if (!res.data.success) {
        this.toastr.error(res.data.message);
        this.loaderService.DissmissLoading();
      } else {
        this.toastr.success(res.data.message);
        this.loaderService.DissmissLoading();
      }
    } catch (e) {}
  }
}
