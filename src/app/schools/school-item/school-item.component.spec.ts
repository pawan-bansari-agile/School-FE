import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolItemComponent } from './school-item.component';

describe('SchoolItemComponent', () => {
  let component: SchoolItemComponent;
  let fixture: ComponentFixture<SchoolItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
