import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionRendererComponent } from './action-renderer.component';

describe('ActionRendererComponent', () => {
  let component: ActionRendererComponent;
  let fixture: ComponentFixture<ActionRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionRendererComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  /* it('should Call ag init', () => {
    expect(component.agInit(null)).toBeTruthy();
  }); */
});
