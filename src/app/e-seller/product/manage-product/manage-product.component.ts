import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { ShopService } from 'src/app/services/shop.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss'],
})
export class ManageProductComponent implements OnInit {
  productList: any[] = [];
  type = 2;
  shopId: any;
  shopData: any;
  length = 0;
  categoryList: any[] = [];
  statusList = [
    { name: 'Active', value: true },
    { name: 'In Active', value: false },
  ];
  searchableData = {
    selectedCategory: null,
    name: '',
    sku: '',
    isActive: true,
  };
  pageData = {
    limit: 10,
    offset: 0,
  };
  pageEvent: PageEvent;
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private shopService: ShopService,
    private toastr: ToastrService,
    private categoryService: CategoryService
  ) {
    this.shopId = this.route.snapshot.params['shopId'];
  }

  async ngOnInit() {
    this.getCategory();
    if (this.shopId) {
      console.log(this.shopId);
      this.shopData = await this.getShopById(this.shopId);
      this.getProductList();
    }
  }

  async getProductList(data?, pageData?) {
    if (this.shopData.type === 1) {
      let res: any = await this.productService.getRetailerProducts(
        this.shopId,
        data ? data : this.searchableData,
        pageData ? pageData : this.pageData
      );
      this.productList = res.data?.data;
      this.length = +res.data?.count?.count;
    } else {
      let res: any = await this.productService.getWholeSellerProducts(
        this.shopId,
        data ? data : this.searchableData,
        pageData ? pageData : this.pageData
      );
      this.productList = res.data?.data;
      this.length = +res.data?.count?.count;
    }
  }

  async getCategory() {
    const res: any = await this.categoryService.getAllCategory();
    this.categoryList = res.data;
  }

  async getShopById(shopId) {
    const res: any = await this.shopService.getById(shopId);
    return res.data;
  }

  deleteProductById(id) {
    swal
      .fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.productService
            .deleteProductById(id, this.shopData.type)
            .then((res: any) => {
              if (res.data.success) {
                const index = this.productList.findIndex((x) => x.id === id);
                if (index > -1) {
                  this.productList.splice(index, 1);
                }
                swal.fire('Deleted!', 'Product has been deleted.', 'success');
              } else {
                this.toastr.error('Error', `Something went wrong`);
              }
            });
        }
      });
  }

  selectCategory(event) {
    this.searchableData.selectedCategory = event.id;
  }

  search(event?) {
    const data = {
      selectedCategory: this.searchableData.selectedCategory,
      name: this.searchableData.name,
      isActive: this.searchableData.isActive,
      sku: this.searchableData.sku,
    };
    const pageData = {
      offset: event ? event.pageIndex : this.pageData.offset,
      limit: event ? event.pageSize : this.pageData.limit,
    };
    this.getProductList(data, pageData);
  }
}
