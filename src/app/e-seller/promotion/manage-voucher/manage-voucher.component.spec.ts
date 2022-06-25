import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageVoucherComponent } from './manage-voucher.component';

describe('ManageVoucherComponent', () => {
  let component: ManageVoucherComponent;
  let fixture: ComponentFixture<ManageVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageVoucherComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
