import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditRecordGadgetComponent } from './add-edit-record-gadget.component';

describe('AddEditRecordGadgetComponent', () => {
  let component: AddEditRecordGadgetComponent;
  let fixture: ComponentFixture<AddEditRecordGadgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditRecordGadgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditRecordGadgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
