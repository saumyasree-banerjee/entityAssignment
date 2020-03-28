import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomEntityAttributeComponent } from './add-custom-entity-attribute.component';

describe('AddCustomEntityAttributeComponent', () => {
  let component: AddCustomEntityAttributeComponent;
  let fixture: ComponentFixture<AddCustomEntityAttributeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCustomEntityAttributeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomEntityAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
