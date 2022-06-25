import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ProductService } from 'src/app/services/product.service';
import { ShopService } from 'src/app/services/shop.service';

@Component({
  selector: 'app-add-voucher',
  templateUrl: './add-voucher.component.html',
  styleUrls: ['./add-voucher.component.scss'],
})
export class AddVoucherComponent implements OnInit {
  discountType: number = 1;
  applyVoucher: number = 0;
  id: any;
  shopId: any = -1;
  user: any = {};
  myForm: any;
  sku: any = [];
  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private productService: ProductService,
    private service: ShopService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  async ngOnInit() {
    this.shopId = this.route.snapshot.params['shopId'];
    this.id = this.route.snapshot.params['id'];
    this.user = this.authService.getUser();
    const res: any = await this.service.getById(this.shopId);
    if (this.id) {
      const data: any = await this.service.getVoucherById(this.id);
      this.createVoucherForm(data.data);
    } else {
      this.createVoucherForm();
    }
    this.productService.getSKUByShopId(this.shopId).then((x: any) => {
      this.sku = x.data;
    });
  }
  async save() {
    if (this.myForm.valid) {
      try {
        if (this.applyVoucher === 0) {
          this.myForm.controls['productSku'].setValue('');
        } else {
          const sku = this.myForm.value.productSku.toString();
          this.myForm.controls['productSku'].setValue(sku);
        }
        const res = await this.service.updateVoucherData(this.myForm.value);
        this.router.navigate([
          '/e-seller',
          'main',
          this.shopId,
          'manage-voucher',
        ]);
        this.toastr.success('Updated Successfully');
      } catch (error) {
        this.toastr.error(error.error.meta.message);
      }
    }
  }
  createVoucherForm(res: any = null) {
    this.myForm = this.fb.group({
      id: [res ? res.id : 0],
      productSku: [res ? res.productSku.split(',') : ''],
      userId: [this.user.id],
      voucherName: [
        res ? res.voucherName : '',
        Validators.compose([Validators.required]),
      ],
      voucherCode: [
        res ? res.voucherCode : '',
        Validators.compose([Validators.required]),
      ],
      selectDate: [
        res
          ? res.selectDate?.split('T')[0]
          : new Date().toISOString().split('T')[0],
        Validators.compose([Validators.required]),
      ],
      endDate: [
        res
          ? res.endDate?.split('T')[0]
          : new Date().toISOString().split('T')[0],
        Validators.compose([Validators.required]),
      ],
      discountType: [
        res ? res.discountType : 1,
        Validators.compose([Validators.required]),
      ],
      discountValue: [res ? res.discountValue : ''],
      minValueOrder: [res ? res.minValueOrder : ''],
      totalVoucher: [res ? res.totalVoucher : ''],
      usageLimitPerCustomer: [res ? res.usageLimitPerCustomer : ''],
      discountPercentageValue: [res ? res.discountPercentageValue : ''],
      maximumDiscount: [res ? res.maximumDiscount : ''],
      shopId: [this.shopId],
    });
    this.applyVoucher = res && res.productSku ? 1 : 0;
  }
}
