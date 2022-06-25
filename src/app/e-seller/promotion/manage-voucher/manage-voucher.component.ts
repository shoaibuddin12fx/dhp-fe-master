import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ShopService } from 'src/app/services/shop.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-manage-voucher',
  templateUrl: './manage-voucher.component.html',
  styleUrls: ['./manage-voucher.component.scss'],
})
export class ManageVoucherComponent implements OnInit {
  shopId: number = 1;
  user: any;
  data: any[] = [];
  searchData = [
    {
      key: 'voucherName',
      value: null,
      sign: 'ILIKE',
    },
    {
      key: 'voucherCode',
      value: null,
      sign: 'ILIKE',
    },
  ];
  pageData = {
    limit: 10,
    offset: 0,
  };
  length: any;
  constructor(
    private authService: AuthService,
    private service: ShopService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  async ngOnInit() {
    this.shopId = this.route.snapshot.params['shopId'];
    this.user = this.authService.getUser();
    await this.filterSearch();
  }
  async getData(data?, pageData?) {
    const res: any = await this.service.getVouchersByUserIdShopId(
      this.shopId,
      this.user.id,
      data,
      pageData ? pageData : this.pageData
    );
    this.data = res.data?.data;
    this.length = res.data?.count;
  }

  deleteVoucher(id) {
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
          this.service.deleteVoucher(id).then((res: any) => {
            if (res.data.success) {
              const index = this.data.findIndex((x) => x.id === id);
              if (index > -1) {
                this.data.splice(index, 1);
              }
              swal.fire('Deleted!', 'Voucher has been deleted.', 'success');
            } else {
              this.toastr.error('Error', `Something went wrong`);
            }
          });
        }
      });
  }

  filterSearch(event?) {
    const data = this.searchData.filter(
      (x: any) => x.value !== null && x.value !== undefined
    );
    const pageData = {
      offset: event ? event.pageIndex : this.pageData.offset,
      limit: event ? event.pageSize : this.pageData.limit,
    };
    this.getData(data, pageData);
  }
}
