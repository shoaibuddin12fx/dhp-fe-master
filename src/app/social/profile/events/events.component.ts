import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocialService } from 'src/app/services/social.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit, OnDestroy {
  constructor(private socialService: SocialService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('User'));
    this.socialService.isProfile.next({ isProfile: true, profileId: user.id });
  }
  ngOnDestroy(): void {}
}
