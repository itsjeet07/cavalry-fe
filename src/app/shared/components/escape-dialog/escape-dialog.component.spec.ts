import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EscapeDialogComponent } from './escape-dialog.component';

describe('EscapeDialogComponent', () => {
  let component: EscapeDialogComponent;
  let fixture: ComponentFixture<EscapeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EscapeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EscapeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
