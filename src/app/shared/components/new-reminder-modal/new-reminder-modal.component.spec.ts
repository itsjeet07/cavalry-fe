import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewReminderModalComponent } from './new-reminder-modal.component';

describe('NewReminderModalComponent', () => {
  let component: NewReminderModalComponent;
  let fixture: ComponentFixture<NewReminderModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewReminderModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewReminderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
