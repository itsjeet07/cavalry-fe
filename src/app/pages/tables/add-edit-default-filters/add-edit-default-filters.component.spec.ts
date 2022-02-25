import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDefaultFiltersComponent } from './add-edit-default-filters.component';

describe('AddEditDefaultFiltersComponent', () => {
  let component: AddEditDefaultFiltersComponent;
  let fixture: ComponentFixture<AddEditDefaultFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditDefaultFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditDefaultFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
