import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterFormulaPopupComponent } from './filter-formula-popup.component';

describe('FilterFormulaPopupComponent', () => {
  let component: FilterFormulaPopupComponent;
  let fixture: ComponentFixture<FilterFormulaPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterFormulaPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterFormulaPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
