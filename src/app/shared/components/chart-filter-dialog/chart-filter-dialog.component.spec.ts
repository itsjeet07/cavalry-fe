import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartFilterDialogComponent } from './chart-filter-dialog.component';

describe('ChatFilterDialogComponent', () => {
  let component: ChartFilterDialogComponent;
  let fixture: ComponentFixture<ChartFilterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartFilterDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
