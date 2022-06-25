import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ShopService } from 'src/app/services/shop.service';
import { untilDestroyed } from 'src/app/services/until-destroy';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  shopId: any;
  user: any;
  shops: any = [];
  shop: any = {};
  subscriptions: Subscription;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private service: ShopService
  ) {
    this.getShopDataAndId();
  }
  navigate(item) {
    //[routerLink]="['/e-seller', 'main', item.id, 'dashboard']"
    this.shopId = item.id;
    this.getCurrentShop();
    this.router.navigate(['/e-seller', 'main', item.id, 'dashboard']);
  }
  getShopDataAndId() {
    this.subscriptions = new Subscription();
    this.route.firstChild.params
      .pipe(untilDestroyed(this))
      .subscribe((params) => {
        if (+params['shopId']) {
          this.shopId = +params['shopId'];
          this.getCurrentShop();
        }
      });
  }

  async ngOnInit() {
    if (this.shopId) {
      this.shopId = this.shopId;
      this.user = this.authService.getUser();
      this.getCurrentShop();
      const res: any = await this.service.getShopByUserId(this.user.id);
      this.shops = res.data;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getCurrentShop() {
    this.service.getById(this.shopId).then((res: any) => {
      this.shop = res.data;
    });
  }
}
