import { FileUploadService } from 'src/app/services/file-upload.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { FriendService } from 'src/app/services/friend.service';
import { ShopService } from 'src/app/services/shop.service';
import { ActivatedRoute } from '@angular/router';
import { countryArr } from 'src/app/helpers/array-helper';

@Component({
  selector: 'app-shop-profile',
  templateUrl: './shop-profile.component.html',
  styleUrls: ['./shop-profile.component.scss'],
})
export class ShopProfileComponent implements OnInit {
  form: FormGroup;
  user: any;
  bankForm: FormGroup;
  warehouseForm: FormGroup;
  businessInfoForm: FormGroup;
  licenseDocFile: any;
  corpNameDocFile: any;
  countryList = countryArr;
  isError = false;
  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private service: ShopService,
    private authService: AuthService,
    private fb: FormBuilder,
    private fileUploadService: FileUploadService
  ) {}

  async ngOnInit() {
    this.shopId = this.route.snapshot.params['shopId'];
    this.currentUser = JSON.parse(localStorage.getItem('User'));
    this.user = this.authService.getUser();
    const res: any = await this.service.getById(this.shopId);
    const res1: any = await this.service.getBussinessInfoByUserIdShopId(
      this.shopId,
      this.user.id
    );
    const res2: any = await this.service.getbankAccByUserIdShopId(
      this.shopId,
      this.user.id
    );
    const res3: any = await this.service.getwarehouseByUserIdShopId(
      this.shopId,
      this.user.id
    );

    this.createForm(res.data);
    this.createBankForm(res2.data.id ? res2.data : null);
    this.createWarehouseForm(res3.data.id ? res3.data : null);
    this.createBusinessInfoForm(res1.data.id ? res1.data : null);
  }
  async save() {
    if (this.form.valid) {
      this.isError = false;
      try {
        this.form.value.country = this.form.value.country.toString();
        for (let i = 0; i < this.imageData.length; i++) {
          this.fd.append('file', this.imageData[i], this.imageData[i].name);
          const x: any = await this.fileUploadService.uploadImage(
            this.imageData[i],
            this.currentUser.id
          );
          const file = x.data.file.file;
          this.form.controls['logo'].setValue(file.fileName);
        }
        const res = await this.service.updateShopData(
          this.form.value.id,
          this.form.value
        );
        this.toastr.success('Created Successfully');
      } catch (error) {
        this.toastr.error(error.error.meta.message);
      }
    } else {
      this.isError = true;
    }
  }

  async saveBank() {
    if (this.bankForm.valid) {
      this.isError = false;
      try {
        const res = await this.service.updateBankData(this.bankForm.value);
        this.toastr.success('Updated Successfully');
      } catch (error) {
        this.toastr.error(error.error.meta.message);
      }
    } else {
      this.isError = true;
    }
  }
  async saveWarehouse() {
    if (this.warehouseForm.valid) {
      this.warehouseForm.value.country =
        this.warehouseForm.value.country.toString();
      this.isError = false;
      try {
        const res = await this.service.updateWarehouseData(
          this.warehouseForm.value
        );
        this.toastr.success('Updated Successfully');
      } catch (error) {
        this.toastr.error(error.error.meta.message);
      }
    } else {
      this.isError = true;
    }
  }
  async saveBussinessInfo() {
    this.isError = false;

    try {
      if (this.licenseDocFile) {
        this.fd.append('file', this.licenseDocFile, this.licenseDocFile?.name);
        const x: any = await this.fileUploadService.uploadImage(
          this.licenseDocFile,
          this.currentUser.id
        );
        const licenseDocFile = x.data.file.file;
        this.businessInfoForm.controls['licenseDoc'].setValue(
          licenseDocFile.fileName
        );
      } else {
        if (
          !this.businessInfoForm.value.licenseDoc ||
          this.businessInfoForm.value.licenseDoc === ''
        ) {
          this.toastr.error('No License File Uploaded');
          return false;
        }
      }
      if (this.corpNameDocFile) {
        this.fd.append(
          'file',
          this.corpNameDocFile,
          this.corpNameDocFile?.name
        );
        const y: any = await this.fileUploadService.uploadImage(
          this.corpNameDocFile,
          this.currentUser.id
        );
        const corpNameDocFile = y.data.file.file;
        this.businessInfoForm.controls['corpNameDocFile'].setValue(
          corpNameDocFile.fileName
        );
      } else {
        if (
          !this.businessInfoForm.value.corpNameDocFile ||
          this.businessInfoForm.value.corpNameDocFile === ''
        ) {
          this.toastr.error('No Corporation Document Uploaded');
          return false;
        }
      }
      if (this.businessInfoForm.valid) {
        const res = await this.service.updateBusinessInfoData(
          this.businessInfoForm.value
        );
        this.toastr.success('Updated Successfully');
      } else {
        this.isError = true;
      }
    } catch (error) {
      this.toastr.error(error.error.meta.message);
    }
  }
  createForm(res: any) {
    const country = res && res.country ? res.country.split(',') : '';
    this.form = this.fb.group({
      id: [res.id],
      name: [res.name, Validators.compose([Validators.required])],
      userId: [this.user.id.toString()],
      email: [
        res.email,
        Validators.compose([Validators.required, Validators.email]),
      ],
      contactNo: [res.contactNo, Validators.compose([Validators.required])],
      type: [res.type, Validators.compose([Validators.required])],
      country: [country, Validators.compose([Validators.required])],
      logo: [res.logo],
    });
  }
  fd = new FormData();
  shopId: any = 1;
  images: any[] = [];
  imageData: any[] = [];
  maxLength = 3;
  multiple = true;
  currentUser: any;

  async getImages(event) {
    this.imageData = event;
  }

  async getlicenseDocFile(event) {
    this.licenseDocFile = event;
  }

  async getCorpNameDocFile(event) {
    this.corpNameDocFile = event;
  }

  createBankForm(res: any) {
    this.bankForm = this.fb.group({
      id: [res ? res.id : 0],
      bankName: [
        res ? res.bankName : '',
        Validators.compose([Validators.required]),
      ],
      userId: [this.user.id],
      IBAN: [res ? res.IBAN : ''],
      accountNumber: [
        res ? res.accountNumber : '',
        Validators.compose([Validators.required]),
      ],
      accountTitle: [
        res ? res.accountTitle : '',
        Validators.compose([Validators.required]),
      ],
      branchCode: [
        res ? res.branchCode : '',
        Validators.compose([Validators.required]),
      ],
      shopId: [this.shopId],
    });
  }

  createWarehouseForm(res: any) {
    const country = res && res.country ? res.country.split(',') : '';
    this.warehouseForm = this.fb.group({
      id: [res ? res.id : 0],
      fullName: [
        res ? res.fullName : '',
        Validators.compose([Validators.required]),
      ],
      userId: [this.user.id],
      email: [res ? res.email : '', Validators.compose([Validators.required])],
      country: [country, Validators.compose([Validators.required])],
      contactNo: [
        res ? res.contactNo : '',
        Validators.compose([Validators.required]),
      ],
      state: [res ? res.state : ''],
      address: [
        res ? res.address : '',
        Validators.compose([Validators.required]),
      ],
      shopId: [this.shopId],
    });
  }
  createBusinessInfoForm(res: any) {
    this.businessInfoForm = this.fb.group({
      id: [res ? res.id : 0],
      businessAddress: [
        res ? res.businessaddress : '',
        Validators.compose([Validators.required]),
      ],
      userId: [this.user.id],
      corpNameDoc: [res ? res.corpNameDoc : ''],
      corpNameDocFile: [
        res ? res.corpNameDocFile : '',
        Validators.compose([Validators.required]),
      ],
      govtIssuedId: [
        res ? res.govtIssuedId : '',
        Validators.compose([Validators.required]),
      ],
      inChargeContactNo: [res ? res.inChargeContactNo : ''],
      personInCharge: [res ? res.personInCharge : ''],
      licenseDoc: [res ? res.licenseDoc : ''],
      license: [
        res ? res.license : '',
        Validators.compose([Validators.required]),
      ],
      shopId: [this.shopId],
    });
  }
}
