import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorWallComponent } from './donor-wall.component';

describe('DonorWallComponent', () => {
  let component: DonorWallComponent;
  let fixture: ComponentFixture<DonorWallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DonorWallComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorWallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
