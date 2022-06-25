import { ActivatedRoute } from '@angular/router';
import { OrderService } from './../../../services/order.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss'],
})
export class ManageOrderComponent implements OnInit {
  searchableData = {
    orderNumber: '',
    sku: '',
    productName: '',
    status: '',
  };
  pageData = {
    limit: 10,
    offset: 0,
  };
  statusList = [
    { name: 'All', value: '' },
    { name: 'In Process', value: 'In Process' },
    { name: 'Ready to ship', value: 'Ready to ship' },
    { name: 'Delivered', value: 'Delivered' },
    { name: 'Cancelled', value: 'Cancelled' },
  ];
  actionList = [
    { name: 'In Process', value: 'In Process' },
    { name: 'Ready to ship', value: 'Ready to ship' },
    { name: 'Delivered', value: 'Delivered' },
    { name: 'Cancelled', value: 'Cancelled' },
  ];
  orderList: any[] = [];
  length: number;
  orderNumber: '';
  shopId: any;
  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.shopId = this.route.snapshot.params['shopId'];
  }

  ngOnInit(): void {
    this.getOrderList();
  }

  setAction(status) {
    const actionList = Object.assign([], this.actionList);
    // const index = this.actionList.findIndex((x) => x.name === status);
    // if (index > -1) {
    //   for (let i = 0; i < index; i++) {
    //     actionList.splice(i, 1);
    //   }
    // }
    return actionList;
  }

  changeAction(event, id, i) {
    console.log(event, id, i);
    this.cancelOrder(event, id, i);
  }

  async getOrderList(data?, pageData?) {
    let res: any = await this.orderService.getAllOrders(
      data ? data : this.searchableData,
      pageData ? pageData : this.pageData,
      this.shopId
    );
    this.orderList = res.data?.data;
    this.length = +res.data?.count?.count;
    console.log(res.data);
  }

  search(event?) {
    const data = {
      orderNumber: this.searchableData.orderNumber,
      sku: this.searchableData.sku,
      productName: this.searchableData.productName,
      status: this.searchableData.status,
    };
    const pageData = {
      offset: event ? event.pageIndex : this.pageData.offset,
      limit: event ? event.pageSize : this.pageData.limit,
    };
    this.getOrderList(data, pageData);
  }

  async cancelOrder(status, orderNumber, i) {
    const obj = {
      id: orderNumber,
      status: status,
    };
    const res: any = await this.orderService.changeOrderStatus(obj);
    if (res.data) {
      const orders = this.orderList.filter(
        (x) => x.orderNumber === orderNumber
      );
      orders.forEach((o) => {
        o.status = status;
      });
      this.setAction(status);
      this.toastr.success('Order status updated successfully.');
    } else {
      this.toastr.error('Something Went Wrong!');
    }
    // this.dialogRef.close();
  }
}
