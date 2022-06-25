import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityBoxComponent } from './activity-box.component';

describe('ActivityBoxComponent', () => {
  let component: ActivityBoxComponent;
  let fixture: ComponentFixture<ActivityBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityBoxComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
