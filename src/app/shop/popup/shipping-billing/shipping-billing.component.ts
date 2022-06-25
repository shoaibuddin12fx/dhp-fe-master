import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { cityArr, countryArr } from 'src/app/helpers/array-helper';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-shipping-billing',
  templateUrl: './shipping-billing.component.html',
  styleUrls: ['./shipping-billing.component.scss'],
})
export class ShippingBillingComponent implements OnInit {
  type = 'shipping';
  changeState = 0;
  isVisible: boolean = true;
  shippingForm: FormGroup;
  billingForm: FormGroup;
  user: any;
  shippingData: any;
  billingData: any;
  countryList = countryArr;
  cityList = cityArr;
  constructor(
    public dialogRef: MatDialogRef<ShippingBillingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.type = data.type;
    this.shippingData =
      data?.data && data?.data.find((x) => x.type === 'shipping');
    this.billingData =
      data?.data && data?.data.find((x) => x.type === 'billing');
  }
  ngOnInit(): void {
    this.user = this.authService.getUser();
    if (this.type === 'shipping') {
      this.createShippingForm();
      this.createBillingForm();
    } else {
      this.createBillingForm();
    }
  }

  createShippingForm() {
    this.shippingForm = this.fb.group({
      fullName: [
        this.shippingData ? this.shippingData.fullName : '',
        Validators.compose([Validators.required]),
      ],
      phoneNumber: [
        this.shippingData ? this.shippingData.phoneNumber : '',
        Validators.compose([Validators.required]),
      ],
      email: [
        this.shippingData ? this.shippingData.email : '',
        Validators.compose([Validators.required]),
      ],
      country: [
        this.shippingData ? this.shippingData.country : '',
        Validators.compose([Validators.required]),
      ],
      city: [
        this.shippingData ? this.shippingData.city : '',
        Validators.compose([Validators.required]),
      ],
      area: [
        this.shippingData ? this.shippingData.area : '',
        Validators.compose([Validators.required]),
      ],
      address: [
        this.shippingData ? this.shippingData.address : '',
        Validators.compose([Validators.required]),
      ],
      type: ['shipping', Validators.compose([Validators.required])],
      customerId: [this.user.id, Validators.compose([Validators.required])],
    });
  }

  createBillingForm() {
    this.billingForm = this.fb.group({
      fullName: [
        this.billingData ? this.billingData.fullName : '',
        Validators.compose([Validators.required]),
      ],
      phoneNumber: [
        this.billingData ? this.billingData.phoneNumber : '',
        Validators.compose([Validators.required]),
      ],
      email: [
        this.billingData ? this.billingData.email : '',
        Validators.compose([Validators.required]),
      ],
      country: [
        this.billingData ? this.billingData.country : '',
        Validators.compose([Validators.required]),
      ],
      city: [
        this.billingData ? this.billingData.city : '',
        Validators.compose([Validators.required]),
      ],
      area: [
        this.billingData ? this.billingData.area : '',
        Validators.compose([Validators.required]),
      ],
      address: [
        this.billingData ? this.billingData.address : '',
        Validators.compose([Validators.required]),
      ],
      type: ['billing', Validators.compose([Validators.required])],
      customerId: [this.user.id, Validators.compose([Validators.required])],
    });
  }
  checkState(event, el) {
    event.preventDefault();
    if (this.changeState && this.changeState === el.value) {
      this.changeState = 0;
      this.isVisible = true;
    } else {
      this.changeState = el.value;
      this.isVisible = false;
    }
  }

  add(): void {
    if (this.type === 'shipping') {
      if (this.changeState !== 1) {
        this.billingForm.controls['fullName'].setValue(
          this.shippingForm.value.fullName
        );
        this.billingForm.controls['phoneNumber'].setValue(
          this.shippingForm.value.phoneNumber
        );
        this.billingForm.controls['email'].setValue(
          this.shippingForm.value.email
        );
        this.billingForm.controls['country'].setValue(
          this.shippingForm.value.country
        );
        this.billingForm.controls['city'].setValue(
          this.shippingForm.value.city
        );
        this.billingForm.controls['area'].setValue(
          this.shippingForm.value.area
        );
        this.billingForm.controls['address'].setValue(
          this.shippingForm.value.address
        );
      }

      let shipping = this.shippingForm.value;
      let billing = this.billingForm.value;
      if (this.shippingData?.id) {
        shipping.id = this.shippingData.id;
      }
      if (this.billingData?.id) {
        billing.id = this.billingData.id;
      }
      const data = [shipping, billing];
      this.dialogRef.close(data);
    } else {
      let billing = this.billingForm.value;
      if (this.billingData.id) {
        billing.id = this.billingData.id;
      }
      this.dialogRef.close([billing]);
    }
  }
}
