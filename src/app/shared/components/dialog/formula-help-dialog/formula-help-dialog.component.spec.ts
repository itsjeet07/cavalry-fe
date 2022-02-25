import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaHelpDialogComponent } from './formula-help-dialog.component';

describe('FormulaHelpDialogComponent', () => {
  let component: FormulaHelpDialogComponent;
  let fixture: ComponentFixture<FormulaHelpDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormulaHelpDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaHelpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
