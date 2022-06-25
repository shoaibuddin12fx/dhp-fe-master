import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import { SettingComponent } from './setting.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { GeneralComponent } from './general/general.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { LanguageRegionComponent } from './language-region/language-region.component';
import { SecurityPrivacyComponent } from './security-privacy/security-privacy.component';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
  declarations: [
    SettingComponent,
    GeneralComponent,
    NotificationsComponent,
    LanguageRegionComponent,
    SecurityPrivacyComponent,
  ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    MatMenuModule,
    MatExpansionModule,
    MatRadioModule,
  ],
})
export class SettingModule {}
