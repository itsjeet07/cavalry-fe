import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnDropdownImageComponent } from './column-dropdown-image.component';

describe('ColumnDropdownImageComponent', () => {
  let component: ColumnDropdownImageComponent;
  let fixture: ComponentFixture<ColumnDropdownImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnDropdownImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnDropdownImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
