import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventRoutingModule } from './event-routing.module';
import { EventComponent } from './event.component';
import { HomeComponent } from './home/home.component';
import { NotificationComponent } from './notification/notification.component';
import { EventViewComponent } from './event-view/event-view.component';
import { HeaderComponent } from './sub-section/header/header.component';
import { RightBarComponent } from './sub-section/right-bar/right-bar.component';
import { MatMenuModule } from '@angular/material/menu';
import { MyEventsComponent } from './my-events/my-events.component';
import { SharedModule } from '../shared/shared.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { CreateEventComponent } from './popup/create-event/create-event.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
  declarations: [
    EventComponent,
    HomeComponent,
    NotificationComponent,
    EventViewComponent,
    HeaderComponent,
    RightBarComponent,
    MyEventsComponent,
    CreateEventComponent,
  ],
  imports: [
    CommonModule,
    EventRoutingModule,
    MatMenuModule,
    SharedModule,
    MatExpansionModule,
    MatDialogModule,
    MatRadioModule,
  ],
})
export class EventModule {}
