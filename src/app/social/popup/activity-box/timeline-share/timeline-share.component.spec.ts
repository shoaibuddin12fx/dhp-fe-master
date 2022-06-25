import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineShareComponent } from './timeline-share.component';

describe('TimelineShareComponent', () => {
  let component: TimelineShareComponent;
  let fixture: ComponentFixture<TimelineShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimelineShareComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
