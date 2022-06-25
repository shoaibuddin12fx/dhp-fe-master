import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DOBComponent } from './dob.component';

describe('DOBComponent', () => {
  let component: DOBComponent;
  let fixture: ComponentFixture<DOBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DOBComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DOBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
