import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  passwordNotMatched = false;
  showPassword = false;
  showPasswordC = false;
  showLoading = false;
  errorMessage: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      contactNo: ['', Validators.required],
      // validates date format yyyy-mm-dd
      dateOfBirth: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/
          ),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z]).{8,30}$/),
        ],
      ],
      confirmPassword: ['', Validators.required],
      gender: ['', Validators.required],
      userTypeId: [1],
    });
  }
  checkError(errors) {}
  get f() {
    return this.registerForm.controls;
  }
  AgeCheck(dob, age) {
    // dates are all converted to date objects
    var my_dob = new Date(dob);
    var today = new Date();
    var max_dob = new Date(
      today.getFullYear() - age,
      today.getMonth(),
      today.getDate()
    );
    return max_dob.getTime() > my_dob.getTime();
  }

  async Register(f) {
    try {
      this.submitted = true;
      if (this.registerForm.invalid) {
        return;
      }
      this.passwordNotMatched = false;
      if (
        this.registerForm.value.password !==
        this.registerForm.value.confirmPassword
      ) {
        this.passwordNotMatched = true;
        return;
      }
      if (!this.AgeCheck(this.registerForm.value.dateOfBirth, 13)) {
        this.toastr.error('Age must greater then 13.');
        return;
      }

      this.showLoading = true;
      let res = await this.authService.Register(this.registerForm.value);
      this.registerForm.reset();
      this.showLoading = false;
      if (!res.data.success) this.toastr.error(res.data.message);
      else this.toastr.success(res.data.message);
      this.registerForm.reset();
      this.submitted = false;
    } catch (e) {
      this.showLoading = true;
    }
  }
}
