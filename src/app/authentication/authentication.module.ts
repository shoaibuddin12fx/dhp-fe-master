import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerificationComponent } from './verification/verification.component';

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    VerificationComponent,
    ForgotPasswordComponent,
    VerificationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AuthenticationRoutingModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
  ],
})
export class AuthenticationModule {}
