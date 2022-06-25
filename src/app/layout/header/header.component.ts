import { UserService } from 'src/app/services/user.service';
import { FriendService } from 'src/app/services/friend.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ContactService } from 'src/app/services/contact.service';
import { Observable, Subscription } from 'rxjs';
import { untilDestroyed } from 'src/app/services/until-destroy';
import { filter } from 'rxjs/operators';
import { CartService } from 'src/app/services/cart.service';
import { ChatCountService } from 'src/app/services/chat-count.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  user: any;
  status: boolean = false;
  isShowBox = false;
  shopType: any;
  subscriptions: Subscription;
  retailCartData: any;
  wholesaleCartData: any;
  cartCount = 0;
  chatCount = 0;
  friendRequestCount = 0;
  sub: Subscription;
  @Output() openSearchBar: EventEmitter<boolean> = new EventEmitter<any>();
  @Input() isSearchActive = false;

  constructor(
    private authService: AuthService,
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private chatCountService: ChatCountService,
    private friendService: FriendService,
    private userService: UserService
  ) {
    this.subscriptions = new Subscription();
    const routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.route.snapshot.firstChild.routeConfig.path === 'shop') {
          if (
            this.route.snapshot.firstChild.firstChild.children[0].params['type']
          ) {
            this.shopType =
              this.route.snapshot.firstChild.firstChild.children[0].params[
                'type'
              ];
            this.getCartData();
          }
        } else {
          this.shopType = undefined;
        }
      });

    this.subscriptions.add(routerSubscription);
  }

  async getCartData() {
    if (this.shopType == 1) {
      const res: any = await this.cartService.getCartCountByUser(
        this.authService.getUser().id
      );
      if (res.data) {
        // this.cartCount = res.data;
        this.cartService.setCartDataCount(res.data.count);
      }
    } else {
      const res: any = await this.cartService.getWholesaleCartCountByUser(
        this.authService.getUser().id
      );
      if (res.data) {
        // this.cartCount = res.data;
        this.cartService.setCartDataCount(res.data.count);
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.cartService.getCartDataCount().subscribe((x) => {
      this.cartCount = x;
    });
    const chatCountSubscription = this.chatCountService
      .getChatCount()
      .subscribe((count) => {
        this.chatCount = count;
      });
    this.subscriptions.add(chatCountSubscription);
    this.friendService
      .getRequestCount()
      .pipe(untilDestroyed(this))
      .subscribe((g) => {
        this.friendRequestCount = g;
      });
    this.sub = interval(20000).subscribe((val) => {
      if (this.user?.id) {
        this.getFriendRequestCount();
      }
    });
  }

  async getFriendRequestCount() {
    const res: any = await this.friendService.getFriendRequestCount(
      this.user?.id
    );
    this.friendRequestCount = res.data.count;
    this.friendService.setRequestCount(this.friendRequestCount);
  }

  logout() {
    this.authService.logout(this.user?.id);
  }

  toggleContactPopup() {
    this.isShowBox = !this.isShowBox;
    this.contactService.toggleContactPopup(this.isShowBox);
  }

  activeSearchBar() {
    this.isSearchActive = !this.isSearchActive;
    this.openSearchBar.emit(this.isSearchActive);
  }
}
