import { FriendService } from 'src/app/services/friend.service';
import { Component, Inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { GroupService } from 'src/app/services/groups.service';
import { ShopService } from 'src/app/services/shop.service';
import { Router } from '@angular/router';
import { countryArr } from 'src/app/helpers/array-helper';

@Component({
  selector: 'app-create-shop',
  templateUrl: './create-shop.component.html',
  styleUrls: ['./create-shop.component.scss'],
})
export class CreateShopComponent implements OnInit {
  user: any;
  friends: any[] = [];
  selectedFriends: '';
  form: FormGroup;
  profilePhoto = '';
  coverPhoto = '';
  group: any = {};
  isFriendShow = true;
  showLoading = false;
  countryList = countryArr;
  shopType = [
    { value: 1, name: 'Retail' },
    { value: 2, name: 'Wholesale' },
  ];
  isError = false;
  invalidEmail = false;

  constructor(
    private route: Router,
    private toastr: ToastrService,
    private service: ShopService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  async ngOnInit() {
    this.user = this.authService.getUser();
    this.createForm();
  }

  async save() {
    this.isError = false;
    this.invalidEmail = false;
    if (this.form.valid) {
      this.showLoading = true;
      try {
        this.form.value.country = this.form.value.country.toString();
        const res = await this.service.addShopData(this.form.value);
        this.showLoading = false;
        this.toastr.success('Created Successfully');
        this.route.navigateByUrl('e-seller/shops');
      } catch (error) {
        this.showLoading = false;
        this.toastr.error(error.error.meta.message);
      }
    } else {
      if (this.form.controls.email.status === 'INVALID') {
        this.invalidEmail = true;
      }
      this.isError = true;
    }
  }
  get getCoverPhoto() {
    const user = this.authService.getUser();
    return user;
  }
  createForm() {
    this.form = this.fb.group({
      id: [0],
      name: ['', Validators.compose([Validators.required])],
      userId: [this.user.id],
      email: [
        this.user ? this.user.email : '',
        Validators.compose([Validators.required, Validators.email]),
      ],
      contactNo: [''],
      type: ['', Validators.compose([Validators.required])],
      country: ['', Validators.compose([Validators.required])],
      logo: [''],
    });
  }
}
