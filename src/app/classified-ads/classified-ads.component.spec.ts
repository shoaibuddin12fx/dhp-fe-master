import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassifiedAdsComponent } from './classified-ads.component';

describe('ClassifiedAdsComponent', () => {
  let component: ClassifiedAdsComponent;
  let fixture: ComponentFixture<ClassifiedAdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClassifiedAdsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassifiedAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
