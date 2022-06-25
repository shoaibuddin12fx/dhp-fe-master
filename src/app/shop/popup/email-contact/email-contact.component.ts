import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { cityArr, countryArr } from 'src/app/helpers/array-helper';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-email-contact',
  templateUrl: './email-contact.component.html',
  styleUrls: ['./email-contact.component.scss'],
})
export class EmailContactComponent implements OnInit {
  type = 'email';
  user: any;
  form: FormGroup;
  orderData: any;

  constructor(
    public dialogRef: MatDialogRef<EmailContactComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.type = data.type;
    this.orderData = data.data;
  }
  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      phoneNumber: [
        this.orderData ? this.orderData : '',
        Validators.compose([Validators.required]),
      ],
      email: [
        this.orderData ? this.orderData : '',
        Validators.compose([Validators.required]),
      ],
    });
  }

  add(): void {
    if (this.type === 'email') {
      // this.form.controls['email'].setValue(this.form.value.email);
      this.dialogRef.close(this.form.value.email);
    } else {
      // this.form.controls['phoneNumber'].setValue(this.form.value.phoneNumber);
      this.dialogRef.close(this.form.value.phoneNumber);
    }
  }
}
