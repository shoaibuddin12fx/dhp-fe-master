import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingBillingComponent } from './shipping-billing.component';

describe('ShippingBillingComponent', () => {
  let component: ShippingBillingComponent;
  let fixture: ComponentFixture<ShippingBillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShippingBillingComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
