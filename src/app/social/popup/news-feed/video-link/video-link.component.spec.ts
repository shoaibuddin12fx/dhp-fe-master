import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoLinkComponent } from './video-link.component';

describe('VideoLinkComponent', () => {
  let component: VideoLinkComponent;
  let fixture: ComponentFixture<VideoLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VideoLinkComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
