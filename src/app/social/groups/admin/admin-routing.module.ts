import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AdminComponent } from './admin.component';
import { EventsComponent } from './events/events.component';
import { FeedComponent } from './feed/feed.component';
import { MembersComponent } from './members/members.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'feed' },
      { path: ':id/feed', component: FeedComponent },
      { path: 'feed', component: FeedComponent },
      { path: ':id/about', component: AboutComponent },
      { path: ':id/members', component: MembersComponent },
      { path: ':id/events', component: EventsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
