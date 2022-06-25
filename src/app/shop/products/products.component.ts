import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  convertArrToCommaSepNumber,
  convertArrToCommaSepString,
  countryArr,
} from 'src/app/helpers/array-helper';
import { CategoryService } from 'src/app/services/category.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ProductService } from 'src/app/services/product.service';
import { ReportComponent } from 'src/app/social/popup/activity-box/report/report.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  mainCategoryId: any;
  productLimit = 10;
  productData: any;
  brandArr = [];
  brand = null;
  minPrice = null;
  maxPrice = null;
  location = null;
  countrys = countryArr;
  brands: any = [];
  pageData = {
    limit: 10,
    offset: 0,
  };
  breadcrumb: any = [];
  length = 0;
  shopType: any;
  prodCategoryId: any;
  prodSubCategoryId: any;
  categories: any = [];
  mainCategories: any = [];
  constructor(
    public Dialog: MatDialog,
    private route: ActivatedRoute,
    private productService: ProductService,
    private catService: CategoryService,
    private loaderService: LoaderService,
    private toastr: ToastrService
  ) {
    this.shopType = this.route.snapshot.params['type'];
    this.mainCategoryId = this.route.snapshot.params['cat'];
    this.prodCategoryId = this.route.snapshot.params['prodCat'];
    this.prodSubCategoryId = this.route.snapshot.params['prodSubCat'];
    if (this.mainCategoryId) {
      this.gethomePageData();
    }
  }

  async ngOnInit() {
    const res: any = await this.catService.getSubCategoryByMainCat(
      this.mainCategoryId
    );
    this.brands = res.data;
    this.catService.getCategory().then((x: any) => {
      this.categories = x.data;
      let breadcrumbArr = [];
      if (this.mainCategoryId) {
        breadcrumbArr.push(
          this.categories.find((x) => x.id == this.mainCategoryId).name
        );
        this.mainCategories = this.categories.filter(
          (x) => x.id == this.mainCategoryId
        );
      }
      if (this.prodCategoryId) {
        const mainCat = this.categories.find(
          (x) => x.id == this.mainCategoryId
        );
        const prodCat = mainCat.prodCat.find(
          (x) => x.id == this.prodCategoryId
        );
        breadcrumbArr.push(prodCat.name);
      }
      if (this.prodSubCategoryId) {
        const mainCat = this.categories.find(
          (x) => x.id == this.mainCategoryId
        );
        const prodCat = mainCat.prodCat.find(
          (x) => x.id == this.prodCategoryId
        );
        const last = prodCat.subCat.find((x) => x.id == this.prodSubCategoryId);
        breadcrumbArr.push(last.name);
      }
      this.breadcrumb = breadcrumbArr;
    });
  }
  checkBrandExsist(item) {
    const data = this.brandArr.find((x) => x == item.id);
    if (data) {
      return true;
    } else {
      return false;
    }
  }

  getBrandName(item) {
    return this.brands.find((x) => x.id == item)?.name;
  }
  async addBrandItem(item) {
    if (this.brandArr.find((x) => x == item)) {
      const index = this.brandArr.indexOf(item);
      this.brandArr.splice(index, 1);
    } else {
      this.brandArr.push(item);
    }
    await this.gethomePageData(this.pageData);
  }
  async gethomePageData(pageData?) {
    this.loaderService.PresentLoading();
    try {
      const obj = {
        catId: this.mainCategoryId,
        prodCatId: this.prodCategoryId,
        subCatId: this.prodSubCategoryId,
        brand: convertArrToCommaSepNumber(this.brandArr),
        type: this.shopType,
        location: this.location
          ? convertArrToCommaSepString(this.location)
          : null,
        minPrice: this.minPrice,
        maxPrice: this.maxPrice,
      };
      const res: any = await this.productService.getfilterProducts(
        obj,
        pageData ? pageData : this.pageData
      );
      this.productData = res.data.data;
      this.length = res.data.count;
      console.log(this.productData);
      this.loaderService.DissmissLoading();
    } catch (error) {
      this.toastr.error('Something went wrong');
      this.loaderService.DissmissLoading();
    }
  }
  panelOpenState = false;
  openReportDialog() {
    const DialogRef = this.Dialog.open(ReportComponent, {
      width: '35%',
      height: 'auto',
      disableClose: true,
      data: {},
    });
  }

  search(event?) {
    const pageData = {
      offset: event ? event.pageIndex : this.pageData.offset,
      limit: event ? event.pageSize : this.pageData.limit,
    };
    this.gethomePageData(pageData);
  }
}
