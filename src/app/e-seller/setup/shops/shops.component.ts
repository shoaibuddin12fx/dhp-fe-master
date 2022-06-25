import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ShopService } from 'src/app/services/shop.service';

@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.scss'],
})
export class ShopsComponent implements OnInit {
  user: any;
  shops: any[] = [];
  constructor(private service: ShopService, private authService: AuthService) {}

  async ngOnInit() {
    this.user = this.authService.getUser();
    const res: any = await this.service.getShopByUserId(this.user.id);
    this.shops = res.data;
    console.log(res);
  }
}
