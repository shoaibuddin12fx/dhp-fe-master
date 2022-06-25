import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewsFeedComponent } from './news-feed/news-feed.component';
import { WatchComponent } from './watch/watch.component';

const routes: Routes = [
  { path: '', redirectTo: 'news-feed' },
  { path: 'news-feed', component: NewsFeedComponent },
  { path: 'news-feed?postId=:id', component: NewsFeedComponent },
  {
    path: 'photos',
    loadChildren: () =>
      import('../../app/social/photos/photos.module').then(
        (m) => m.PhotosModule
      ),
  },
  { path: 'watch', component: WatchComponent },
  {
    path: 'profile',
    loadChildren: () =>
      import('../social/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'friends',
    loadChildren: () =>
      import('../social/friends/friends.module').then((m) => m.FriendsModule),
  },
  {
    path: 'groups',
    loadChildren: () =>
      import('../social/groups/groups.module').then((m) => m.GroupsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SocialRoutingModule {}
