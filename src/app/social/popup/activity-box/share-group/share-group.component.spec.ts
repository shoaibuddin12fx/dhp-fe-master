import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareGroupComponent } from './share-group.component';

describe('ShareGroupComponent', () => {
  let component: ShareGroupComponent;
  let fixture: ComponentFixture<ShareGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShareGroupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
