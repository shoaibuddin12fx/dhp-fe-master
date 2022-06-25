import { ShopService } from 'src/app/services/shop.service';
import { CategoryService } from './../../../services/category.service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ColorService } from 'src/app/services/colors.service';
import { LoaderService } from 'src/app/services/loader.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ProductService } from 'src/app/services/product.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit, OnDestroy {
  @Input('hide-arrow') hideArrow: boolean = false;

  createProductForm: FormGroup;
  currentProduct: any;
  // images: any;
  // shopType: any = 'retailers';
  colorList: any[] = [];
  selectedColors: any[] = [];
  categoryList: any[] = [];
  productCategoryList: any[] = [];
  productSubCategoryList: any[] = [];
  newProductCategoryList: any[] = [];
  newProductSubCategoryList: any[] = [];
  shopId: any = null;
  multiple = true;
  maxLength = 3;
  images: any[] = [];
  imageData: any[] = [];
  fd = new FormData();
  currentUser: any;
  selectedSizes: any[] = [];
  imagUrl = environment.serverImageUrl;
  isError = false;
  shopData: any;
  productId: any;
  invalidPrice = false;
  constructor(
    private fb: FormBuilder,
    private colorService: ColorService,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private fileUploadService: FileUploadService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private shopService: ShopService,
    private router: Router
  ) {
    this.shopId = this.route.snapshot.params['shopId'];
    this.productId = this.route.snapshot.params['id'];
  }

  async ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('User'));
    await this.getAllData();
  }
  ngOnDestroy(): void {}
  async getProductbyId(productId) {
    const res: any = await this.productService.getById(productId);
    return res.data;
  }
  async getShopById(shopId) {
    const res: any = await this.shopService.getById(shopId);
    return res.data;
  }
  async getAllData() {
    this.loaderService.PresentLoading();
    try {
      const promises = [];
      promises.push(this.colorService.getAllColors());
      promises.push(this.categoryService.getAllCategory());
      promises.push(this.categoryService.getAllProductCategory());
      promises.push(this.categoryService.getAllProductSubCategory());
      // promises.push(this.shopService.getById(this.shopId));
      Promise.all(promises).then(async (x) => {
        this.colorList = x[0].data;
        this.categoryList = x[1].data;
        this.productCategoryList = x[2].data;
        this.productSubCategoryList = x[3].data;
        // this.shopData = x[4].data;
        if (this.productId) {
          console.log(this.productId);
          this.currentProduct = await this.getProductbyId(this.productId);
        }
        if (this.shopId) {
          console.log(this.shopId);
          this.shopData = await this.getShopById(this.shopId);
          this.createForm();
        }
        this.loaderService.DissmissLoading();
      });
    } catch (error) {
      this.toastr.error('Something went wrong');
      this.loaderService.DissmissLoading();
    }
  }
  createForm() {
    this.createProductForm = this.fb.group({
      name: [
        this.currentProduct ? this.currentProduct.name : '',
        Validators.compose([Validators.required]),
      ],
      mainCategoryId: [
        this.currentProduct ? this.currentProduct.mainCategoryId : '',
        Validators.compose([Validators.required]),
      ],
      productCategoryId: [
        this.currentProduct ? this.currentProduct.productCategoryId : '',
        Validators.compose([Validators.required]),
      ],
      productSubCategoryId: [
        this.currentProduct ? this.currentProduct.productSubCategoryId : '',
        Validators.compose([Validators.required]),
      ],
      price: [
        this.currentProduct ? this.currentProduct.price : 0,
        Validators.compose([Validators.required, Validators.min(1)]),
      ],
      description: [
        this.currentProduct ? this.currentProduct.description : '',
        Validators.compose([Validators.required]),
      ],
      images: [
        this.currentProduct
          ? this.currentProduct.images
          : '' /* , Validators.compose([Validators.required]) */,
      ],
      colors: [
        this.currentProduct ? this.currentProduct.colors : '',
        Validators.compose([Validators.required]),
      ],
      sizes: [
        this.currentProduct ? this.currentProduct.sizes : '',
        // Validators.compose([Validators.required]),
      ],
      productWeight: [
        this.currentProduct
          ? this.currentProduct.productWeight
          : '' /* , Validators.compose([Validators.required]) */,
      ],
      packageWeight: [
        this.currentProduct
          ? this.currentProduct.packageWeight
          : '' /* , Validators.compose([Validators.required]) */,
      ],
      type: [
        this.currentProduct
          ? this.currentProduct.type
          : this.shopData.type.toString() /* , Validators.compose([Validators.required]) */,
      ],
      shopId: [
        this.currentProduct
          ? this.currentProduct.shopId
          : this.shopData.id /* , Validators.compose([Validators.required])  */,
      ],
      isActive: [
        this.currentProduct
          ? this.currentProduct.isActive
          : true /* , Validators.compose([Validators.required]) */,
      ],
      productDetails: this.fb.array(this.createDetailForm(this.currentProduct)),
    });

    // this.images.push(`C:/Dev/ameer/dhp/dhp-api/upload/13/file/angular-1647794135809.jpg`)
    // this.images = this.currentProduct?.images;
    this.selectedColors =
      this.currentProduct && this.currentProduct.colors
        ? this.currentProduct.colors.split(',')
        : [];
    this.selectedSizes =
      this.currentProduct && this.currentProduct.sizes
        ? this.currentProduct.sizes.split(',')
        : [];
    if (this.currentProduct) {
      this.createProductForm.controls['colors'].setValue(this.selectedColors);
      this.selectCategory();
      this.selectProductCategory();
    }
  }

  productDetails(): FormArray {
    const productDetails = this.createProductForm.get(
      'productDetails'
    ) as FormArray;
    return productDetails;
  }
  removeDetails(i: number) {
    this.productDetails().removeAt(i);
    if (this.productDetails().length <= 0) {
      this.addEmptyRow();
    }
  }
  addEmptyRow() {
    const arr = this.createProductForm.get('productDetails') as FormArray;
    arr.push(
      this.shopData.type === 1
        ? this.createRetailerEmptyDetails()
        : this.createEmptyDetails()
    );
  }

  createDetailForm(editDetails) {
    const arr = [];

    if (
      editDetails &&
      editDetails.id &&
      editDetails.productDetails &&
      editDetails.productDetails.length
    ) {
      editDetails.productDetails.forEach((x) => {
        arr.push(
          this.shopData.type === 1
            ? this.createRetailerEmptyDetails(x)
            : this.createEmptyDetails(x)
        );
      });
    } else {
      arr.push(
        this.shopData.type === 1
          ? this.createRetailerEmptyDetails()
          : this.createEmptyDetails()
      );
    }
    return arr;
  }

  createRetailerEmptyDetails(detail = null): FormGroup {
    return this.fb.group({
      productId: [detail ? detail.productId : ''],
      sku: [
        detail ? detail.sku : '',
        Validators.compose([Validators.required]),
      ],
      color: [
        detail ? detail.color : '',
        Validators.compose([Validators.required]),
      ],
      size: [detail ? detail.size : ''],
      quantity: [detail ? detail.quantity : 0],
      price: [detail ? detail.price : 0],
      isActive: [detail ? detail.isActive : true],
    });
  }

  createEmptyDetails(detail = null): FormGroup {
    return this.fb.group({
      productId: [detail ? detail.productId : ''],
      sku: [
        detail ? detail.sku : '',
        Validators.compose([Validators.required]),
      ],
      color: [
        detail ? detail.color : '',
        Validators.compose([Validators.required]),
      ],
      size: [detail ? detail.size : ''],
      quantity: [detail ? detail.quantity : 0],
      price: [detail ? detail.price : 0],
      isActive: [detail ? detail.isActive : true],
      productDetailDetails: this.fb.array(this.createDetailDetailForm(detail)),
    });
  }

  productDetailDetails(details): FormArray {
    const productDetailDetails = details.get(
      'productDetailDetails'
    ) as FormArray;
    return productDetailDetails;
  }
  removeDetailDetails(i: number, details) {
    this.productDetailDetails(details).removeAt(i);
    if (this.productDetailDetails(details).length <= 0) {
      this.addDetailDetailEmptyRow(details);
    }
  }
  addDetailDetailEmptyRow(details) {
    const arr = details.get('productDetailDetails') as FormArray;
    arr.push(this.createEmptyDetailDetails());
  }

  createDetailDetailForm(editDetails) {
    const arr = [];

    if (
      editDetails &&
      editDetails.id &&
      editDetails.productDetailDetails &&
      editDetails.productDetailDetails.length
    ) {
      editDetails.productDetailDetails.forEach((x) => {
        arr.push(this.createEmptyDetailDetails(x));
      });
    } else {
      arr.push(this.createEmptyDetailDetails());
    }
    return arr;
  }

  createEmptyDetailDetails(detail = null): FormGroup {
    return this.fb.group({
      productDetailsId: [detail ? detail.productDetailsId : ''],
      sku: [detail ? detail.sku : ''],
      min: [detail ? detail.min : 0],
      max: [detail ? detail.max : 0],
      price: [detail ? detail.price : 0],
      // isActive: [detail ? detail.isActive : false],
    });
  }

  async save() {
    this.isError = false;
    this.invalidPrice = false;
    if (!this.createProductForm.invalid) {
      if (
        this.shopData.type === 1 &&
        this.createProductForm.value.productDetails.filter(
          (x) => x.price <= 0 || !x.price
        ).length > 0
      ) {
        this.toastr.error('SKU price can not be smaller than or equal to 0.');
        return;
      }
      if (this.shopData.type !== 1) {
        let isZeroFound = false;
        this.createProductForm.value.productDetails.forEach((element) => {
          if (
            element.productDetailDetails.filter(
              (x) => +x.price <= 0 || !+x.price
            ).length > 0
          ) {
            isZeroFound = true;
            return;
          }
        });
        if (isZeroFound) {
          this.toastr.error('SKU price can not be smaller than or equal to 0.');
          return;
        }
      }

      if (this.selectedColors.length > 0) {
        const colors = Object.assign([], this.selectedColors);
        this.createProductForm.controls['colors'].setValue(colors.toString());
      }
      if (this.selectedSizes.length > 0) {
        const sizes = Object.assign([], this.selectedSizes);
        this.createProductForm.controls['sizes'].setValue(sizes.toString());
      }
      const images = [];
      for (let i = 0; i < this.imageData.length; i++) {
        this.fd.append('file', this.imageData[i], this.imageData[i].name);
        const x: any = await this.fileUploadService.uploadImage(
          this.imageData[i],
          this.currentUser.id
        );
        const file = x.data.file.file;
        const value = file.fileName;
        images.push(value);
        console.log(file);
      }

      this.createProductForm.controls['images'].setValue(images.toString());
      if (this.productId) {
        try {
          const res: any = await this.productService.updateProduct(
            this.createProductForm.value,
            this.productId
          );
          if (res.data) {
            this.router.navigate([
              '/e-seller',
              'main',
              this.shopId,
              'manage-product',
            ]);
            this.toastr.success(
              `${this.createProductForm.value.name} updated successfully`
            );
          }
        } catch (error) {
          this.toastr.error(error.error.meta.message);
        }
      } else {
        try {
          const res: any = await this.productService.addProduct(
            this.createProductForm.value
          );
          if (res.data.success) {
            this.router.navigate([
              '/e-seller',
              'main',
              this.shopId,
              'manage-product',
            ]);
            this.toastr.success(
              `${this.createProductForm.value.name} created successfully`
            );
          }
        } catch (error) {
          this.toastr.error(error.error.meta.message);
        }
      }
    } else {
      // if (this.createProductForm.controls.price.status === 'INVALID') {
      this.invalidPrice = true;
      // }
      this.isError = true;
    }
  }

  selectColors(event) {
    this.selectedColors = [];
    event.forEach((x) => {
      this.selectedColors.push(x.name);
    });
    // this.selectedColors.push(event);
    // console.log(this.selectedColors);
    // console.log((this.createProductForm.value.colors).toString());
  }

  removeColor(i) {
    this.selectedColors.splice(i, 1);
  }

  selectSize(event) {
    if (event.target.value !== '') {
      this.selectedSizes.push(event.target.value);
      event.target.value = '';
    }
  }

  removeSize(i) {
    this.selectedSizes.splice(i, 1);
  }
  selectCategory() {
    console.log(this.createProductForm.value.mainCategoryId);
    this.newProductCategoryList = this.productCategoryList.filter(
      (x) => x.parentId === this.createProductForm.value.mainCategoryId
    );
  }

  selectProductCategory() {
    console.log(this.createProductForm.value.productCategoryId);
    this.newProductSubCategoryList = this.productSubCategoryList.filter(
      (x) => x.parentId === this.createProductForm.value.productCategoryId
    );
  }

  async getImages(event) {
    this.imageData = event;
  }
  setPrice(detaildetails: any, event: any) {
    detaildetails.controls['price'].setValue(event.target.value);
  }

  checkIsActive(details) {
    return details.controls['isActive'].value;
  }
  changeBasePrice(value) {
    setTimeout(() => {
      if (+this.createProductForm.get('price').value > 0) {
        this.invalidPrice = false;
      } else {
        this.invalidPrice = true;
      }
    }, 200);
  }

  checkDetailPrice(value, i) {
    // setTimeout(() => {
    if (+this.productDetails().controls[i].get('price').value + +value > 0) {
      this.invalidPrice = false;
    } else {
      this.invalidPrice = true;
    }
    // }, 100);
  }
}
