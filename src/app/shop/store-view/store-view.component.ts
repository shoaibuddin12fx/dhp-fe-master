import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/services/loader.service';
import { ProductService } from 'src/app/services/product.service';
import { ReportComponent } from 'src/app/social/popup/activity-box/report/report.component';

@Component({
  selector: 'app-store-view',
  templateUrl: './store-view.component.html',
  styleUrls: ['./store-view.component.scss'],
})
export class StoreViewComponent implements OnInit {
  productLimit = 4;
  shopId: any;
  homePageData: any;
  shopData: any;
  products: any;
  constructor(
    public Dialog: MatDialog,
    private productService: ProductService,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((params) => {
      if (params['shopId']) {
        this.shopId = params['shopId'];
        this.getShopData();
      }
    });
  }

  ngOnInit(): void {}
  async getShopData() {
    this.loaderService.PresentLoading();
    try {
      const res: any = await this.productService.getProductsByShop(
        this.productLimit,
        this.shopId
      );
      this.shopData = res.data?.shop;
      this.products = res.data?.products;
      this.loaderService.DissmissLoading();
    } catch (error) {
      this.toastr.error('Something went wrong');
      this.loaderService.DissmissLoading();
    }
  }
  openReportDialog() {
    const DialogRef = this.Dialog.open(ReportComponent, {
      width: '35%',
      height: 'auto',
      disableClose: true,
      data: {},
    });
  }
}
