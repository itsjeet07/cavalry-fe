import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReminderAlertComponent } from './reminder-alert.component';

describe('ReminderAlertComponent', () => {
  let component: ReminderAlertComponent;
  let fixture: ComponentFixture<ReminderAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReminderAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReminderAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
