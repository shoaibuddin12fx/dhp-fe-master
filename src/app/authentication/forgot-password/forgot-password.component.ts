import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  registerForm: FormGroup;
  resetPasswordForm: FormGroup;
  submitted = false;
  showLoading = false;
  param: any = [];
  passwordNotMatched = false;
  showPassword = false;
  showPasswordC = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private loaderService: LoaderService
  ) {}

  async ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.route.queryParams.subscribe((params) => {
      if (params && params['user'] && params['key']) {
        this.param.push({
          userHash: decodeURIComponent(params['user']),
          forgetHash: decodeURIComponent(params['key']),
        });
      }
    });
    if (this.param && this.param.length > 0) {
      this.resetPasswordForm = this.formBuilder.group({
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z]).{8,30}$/),
          ],
        ],
        confirmPassword: ['', Validators.required],
      });
      await this.VerifyForgetHash();
      this.resetPasswordForm = this.formBuilder.group({
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z]).{8,30}$/),
          ],
        ],
        confirmPassword: ['', Validators.required],
      });
    }
  }

  get f() {
    return this.registerForm.controls;
  }

  get f2() {
    return this.resetPasswordForm.controls;
  }

  async ForgetPassword() {
    try {
      this.submitted = true;
      if (this.registerForm.invalid) {
        return;
      }
      this.showLoading = true;
      let res = await this.authService.ForgetPassword(this.registerForm.value);
      this.showLoading = false;
      if (!res.data.success) {
        this.toastr.error(res.data.message);
      } else {
        this.toastr.success(res.data.message);
      }
    } catch (e) {}
  }

  async ResetPassword() {
    try {
      this.submitted = true;
      if (this.resetPasswordForm.invalid) {
        return;
      }
      if (
        this.resetPasswordForm.value.password !==
        this.resetPasswordForm.value.confirmPassword
      ) {
        this.passwordNotMatched = true;
        return;
      }
      this.showLoading = true;
      this.resetPasswordForm.value.userHash = this.param[0].userHash;
      let res = await this.authService.ResetPassword(
        this.resetPasswordForm.value
      );
      this.showLoading = false;
      if (!res.data.success) {
        this.toastr.error(res.data.message);
      } else {
        this.toastr.success(res.data.message);
      }
    } catch (e) {}
  }

  async VerifyForgetHash() {
    try {
      this.loaderService.PresentLoading();
      let res = await this.authService.VerifyForgetHash(this.param[0]);
      this.loaderService.PresentLoading();
      if (!res.data.success) {
        this.toastr.error(res.data.message);
      }
      // else {
      //   this.toastr.success(res.data.message);
      // }
    } catch (e) {}
  }
}
