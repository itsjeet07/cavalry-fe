import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTableComponent } from './add-edit-table.component';

describe('AddEditTableComponent', () => {
  let component: AddEditTableComponent;
  let fixture: ComponentFixture<AddEditTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
