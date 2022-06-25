import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerInfoComponent } from './partner-info.component';

describe('PartnerInfoComponent', () => {
  let component: PartnerInfoComponent;
  let fixture: ComponentFixture<PartnerInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PartnerInfoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
