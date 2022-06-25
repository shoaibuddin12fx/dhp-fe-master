import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MatDialogModule } from '@angular/material/dialog';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
} from 'angularx-social-login';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModule } from './shared/shared.module';
import { ContactPopupComponent } from './shared/contact-popup/contact-popup.component';
import { ActivityBoxComponent } from './shared/activity-box/activity-box.component';
import { PostUploadComponent } from './shared/post-upload/post-upload.component';
import { SharePopupComponent } from './shared/share-popup/share-popup.component';
import { JobComponent } from './job/job.component';
import { SafePipe } from './pipes/safe.pipe';
import { environment } from '../environments/environment';

import { ESellerComponent } from './e-seller/e-seller.component';
import { PipesModule } from 'w-ng5';
@NgModule({
  declarations: [AppComponent, JobComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatProgressBarModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    SocialLoginModule,
    NgbModule,
    MatDialogModule,
    SweetAlert2Module.forRoot(),
    MatMenuModule,
    SharedModule,
    PipesModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            // '113487024654-cdj310cjtv5vrc5m4jkmdho6ct2lupjb.apps.googleusercontent.com'
            provider: new GoogleLoginProvider(environment.googleClientID),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  entryComponents: [
    ContactPopupComponent,
    ActivityBoxComponent,
    PostUploadComponent,
    SharePopupComponent,
    ESellerComponent,
    SafePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
