import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyPollsComponent } from './my-polls/my-polls.component';
import { PollingComponent } from './polling.component';
import { PollsComponent } from './polls/polls.component';

const routes: Routes = [
  {
    path: '',
    component: PollingComponent,
    children: [
      { path: '', redirectTo: 'polls' },
      { path: 'polls', component: PollsComponent },
      { path: 'my-polls', component: MyPollsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PollingRoutingModule {}
