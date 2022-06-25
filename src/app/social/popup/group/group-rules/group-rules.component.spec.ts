import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupRulesComponent } from './group-rules.component';

describe('GroupRulesComponent', () => {
  let component: GroupRulesComponent;
  let fixture: ComponentFixture<GroupRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupRulesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
