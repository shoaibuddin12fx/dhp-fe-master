import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneralComponent } from './general/general.component';
import { LanguageRegionComponent } from './language-region/language-region.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SecurityPrivacyComponent } from './security-privacy/security-privacy.component';
import { SettingComponent } from './setting.component';

const routes: Routes = [
  {
    path: '',
    component: SettingComponent,
    children: [
      { path: '', redirectTo: 'general' },
      { path: 'general', component: GeneralComponent },
      { path: 'security-privacy', component: SecurityPrivacyComponent },
      { path: 'language-region', component: LanguageRegionComponent },
      { path: 'notification', component: NotificationsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingRoutingModule {}
