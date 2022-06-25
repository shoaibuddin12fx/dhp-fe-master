import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './header/header.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { ActiveBarComponent } from './active-bar/active-bar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SharedModule } from '../shared/shared.module';
import { ContactPopupComponent } from '../shared/contact-popup/contact-popup.component';
import { AuthService } from '../services/auth.service';
@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    SideMenuComponent,
    ActiveBarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    LayoutRoutingModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatMenuModule,
    MatSlideToggleModule,
    SharedModule,
  ],
  providers: [AuthService],
})
export class LayoutModule {}
