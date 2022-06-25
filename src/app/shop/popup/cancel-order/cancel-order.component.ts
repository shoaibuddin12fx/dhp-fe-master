import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { ReviewsService } from 'src/app/services/reviews.service';

@Component({
  selector: 'app-cancel-order',
  templateUrl: './cancel-order.component.html',
  styleUrls: ['./cancel-order.component.scss'],
})
export class CancelOrderComponent implements OnInit {
  description: string = '';
  constructor(
    private toastr: ToastrService,
    private orderService: OrderService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<CancelOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}
  async cancelOrder() {
    const obj = {
      id: this.data.id,
      description: this.description,
    };
    const res: any = await this.orderService.cancelOrder(obj);
    if (res.data) {
      this.toastr.success('Order cancelled successfully.');
    } else {
      this.toastr.error('Something Went Wrong!');
    }
    this.dialogRef.close();
  }
}
