import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDataSaveComponent } from './filter-data-save.component';

describe('FilterDataSaveComponent', () => {
  let component: FilterDataSaveComponent;
  let fixture: ComponentFixture<FilterDataSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterDataSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterDataSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
