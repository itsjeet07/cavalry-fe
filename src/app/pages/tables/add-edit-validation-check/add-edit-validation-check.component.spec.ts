import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditValidationCheckComponent } from './add-edit-validation-check.component';

describe('AddEditValidationCheckComponent', () => {
  let component: AddEditValidationCheckComponent;
  let fixture: ComponentFixture<AddEditValidationCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditValidationCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditValidationCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
