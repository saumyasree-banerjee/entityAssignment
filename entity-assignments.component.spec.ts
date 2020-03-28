import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityAssignmentsComponent } from './entity-assignments.component';

describe('ReportingObligationsPerEntityComponent', () => {
  let component: EntityAssignmentsComponent;
  let fixture: ComponentFixture<EntityAssignmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityAssignmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityAssignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
