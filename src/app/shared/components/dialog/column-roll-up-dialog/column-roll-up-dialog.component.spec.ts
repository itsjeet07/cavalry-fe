import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnRollUpDialogComponent } from './column-roll-up-dialog.component';

describe('ColumnRollUpDialogComponent', () => {
  let component: ColumnRollUpDialogComponent;
  let fixture: ComponentFixture<ColumnRollUpDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnRollUpDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnRollUpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
