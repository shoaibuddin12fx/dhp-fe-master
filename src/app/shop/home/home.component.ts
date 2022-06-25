import { ProductService } from 'src/app/services/product.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReportComponent } from 'src/app/social/popup/activity-box/report/report.component';
import { LoaderService } from 'src/app/services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  homePageData: any[] = [];
  productLimit = 4;
  shopType: any;
  subscriptions: Subscription;
  categories: any;
  constructor(
    public Dialog: MatDialog,
    private productService: ProductService,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private categoryService: CategoryService
  ) {
    this.route.params.subscribe((params) => {
      if (params['type']) {
        this.shopType = params['type'];
        this.gethomePageData();
      }
    });
  }

  ngOnInit(): void {
    // this.getShopType();
    this.gethomePageData();
    this.categoryService.getCategory().then((x: any) => {
      this.categories = x.data;
    });
  }

  ngOnDestroy(): void {
    // this.subscriptions.unsubscribe();
  }

  async gethomePageData() {
    this.loaderService.PresentLoading();
    try {
      const res: any = await this.productService.getHomeScreenCategoryProducts(
        this.productLimit,
        this.shopType
      );
      this.homePageData = res.data;
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
