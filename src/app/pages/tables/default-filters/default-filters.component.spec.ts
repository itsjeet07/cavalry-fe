import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultFiltersComponent } from './default-filters.component';

describe('DefaultFiltersComponent', () => {
  let component: DefaultFiltersComponent;
  let fixture: ComponentFixture<DefaultFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
