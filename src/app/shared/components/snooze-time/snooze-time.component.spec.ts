import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnoozeTimeComponent } from './snooze-time.component';

describe('SnoozeTimeComponent', () => {
  let component: SnoozeTimeComponent;
  let fixture: ComponentFixture<SnoozeTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnoozeTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnoozeTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
