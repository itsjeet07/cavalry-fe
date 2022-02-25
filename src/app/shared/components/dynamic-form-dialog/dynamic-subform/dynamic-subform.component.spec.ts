import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicSubformComponent } from './dynamic-subform.component';

describe('DynamicSubformComponent', () => {
  let component: DynamicSubformComponent;
  let fixture: ComponentFixture<DynamicSubformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicSubformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicSubformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
