import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportInboxComponent } from './support-inbox.component';

describe('SupportInboxComponent', () => {
  let component: SupportInboxComponent;
  let fixture: ComponentFixture<SupportInboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SupportInboxComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportInboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
