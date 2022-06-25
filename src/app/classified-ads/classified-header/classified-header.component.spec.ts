import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassifiedHeaderComponent } from './classified-header.component';

describe('ClassifiedHeaderComponent', () => {
  let component: ClassifiedHeaderComponent;
  let fixture: ComponentFixture<ClassifiedHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClassifiedHeaderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassifiedHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
