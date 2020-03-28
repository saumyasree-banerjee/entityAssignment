import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEntityAssignmentComponent } from './edit-entity-assignment.component';

describe('EditEntityAssignmentComponent', () => {
  let component: EditEntityAssignmentComponent;
  let fixture: ComponentFixture<EditEntityAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEntityAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEntityAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
