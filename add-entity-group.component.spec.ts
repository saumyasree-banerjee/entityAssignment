import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEntityGroupComponent } from './add-entity-group.component';

describe('AddEntityGroupComponent', () => {
  let component: AddEntityGroupComponent;
  let fixture: ComponentFixture<AddEntityGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEntityGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEntityGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
