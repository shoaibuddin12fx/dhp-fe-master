import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ESellerComponent } from './e-seller.component';

describe('ESellerComponent', () => {
  let component: ESellerComponent;
  let fixture: ComponentFixture<ESellerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ESellerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ESellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
