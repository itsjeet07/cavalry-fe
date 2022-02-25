import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTreeTableComponent } from './dynamic-tree-table.component';

describe('DynamicTreeTableComponent', () => {
  let component: DynamicTreeTableComponent;
  let fixture: ComponentFixture<DynamicTreeTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicTreeTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicTreeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
