import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.scss'],
})
export class MyOrderComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator;
  orderList: any = [];
  searchableData = {
    orderNumber: '',
    sku: '',
    productName: '',
    status: '',
    userId: this.authService.getUser().id,
  };
  shopType: any = 1;
  orderType = 0;
  allOrderList: any;
  pageData = {
    limit: 10,
    offset: 0,
  };
  length = 0;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    // this.route.params.subscribe((params) => {
    //   if (params['type']) {
    //     this.shopType = params['type'];
    //     this.getOrderList();
    //   }
    // });
    this.shopType = this.route.snapshot.params['type'];
    this.searchableData.userId = this.authService.getUser().id;
  }

  ngOnInit(): void {
    this.getOrderList();
  }
  async getOrderList() {
    let res: any = await this.orderService.getAllOrdersByUser(
      this.searchableData
    );
    this.allOrderList = Object.assign([], res.data);
    this.paginateData(this.pageData);
    // if (this.orderType === 0) {
    //   this.orderList = this.allOrderList;
    // } else {
    //   this.orderList = this.allOrderList.filter(x => +x.orderType === +this.shopType);
    // }
  }

  changeOrderType(type) {
    this.orderType = type;
    this.paginator.firstPage();
    this.paginateData(this.pageData);
  }

  search(event?) {
    const pageData = {
      offset: event ? event.pageIndex : this.pageData.offset,
      limit: event ? event.pageSize : this.pageData.limit,
    };
    this.paginateData(pageData);
  }
  paginateData(pageData) {
    let data = [];
    if (this.orderType === 0) {
      data = this.allOrderList;
      this.length = data.length;
    } else {
      data = this.allOrderList.filter((x) => +x.orderType == +this.orderType);
      this.length = data.length;
    }
    const skip = pageData.limit * pageData.offset;
    this.orderList = data.slice(skip, pageData.limit + skip);
  }
}
