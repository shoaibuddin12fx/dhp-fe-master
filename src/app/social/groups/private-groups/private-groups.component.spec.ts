import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateGroupsComponent } from './private-groups.component';

describe('PrivateGroupsComponent', () => {
  let component: PrivateGroupsComponent;
  let fixture: ComponentFixture<PrivateGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrivateGroupsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
