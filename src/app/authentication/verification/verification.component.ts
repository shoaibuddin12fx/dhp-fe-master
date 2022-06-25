import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss'],
})
export class VerificationComponent implements OnInit {
  verificationForm: FormGroup;
  submitted: true;
  errorMessage: string;

  get f() {
    return this.verificationForm.controls;
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.verificationForm = this.formBuilder.group({
      accountVerificationHash: ['', Validators.required],
    });
  }

  async Verify(f) {
    try {
      this.submitted = true;
      if (this.verificationForm.invalid) {
        return;
      }
      this.loaderService.PresentLoading();
      let obj = this.verificationForm.value;
      obj.email = localStorage.getItem('email');
      let res = await this.authService.Verify(obj);
      this.loaderService.DissmissLoading();
      if (res.data && res.data.success == false) {
        this.toastr.error(res.data.message);
      } else {
        localStorage.clear();
        localStorage.setItem('User', JSON.stringify(res.data.data));
        this.router.navigate(['social']);
      }
    } catch (e) {}
  }
}
