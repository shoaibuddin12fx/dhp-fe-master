import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PollingRoutingModule } from './polling-routing.module';
import { PollsComponent } from './polls/polls.component';
import { MyPollsComponent } from './my-polls/my-polls.component';
import { CreatePollComponent } from './popup/create-poll/create-poll.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { PollingComponent } from './polling.component';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModule } from '../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
  declarations: [
    PollsComponent,
    PollingComponent,
    MyPollsComponent,
    CreatePollComponent,
  ],
  imports: [
    CommonModule,
    PollingRoutingModule,
    MatExpansionModule,
    MatMenuModule,
    SharedModule,
    MatDialogModule,
    MatRadioModule,
  ],
})
export class PollingModule {}
