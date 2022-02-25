import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityWatchersComponent } from './activity-watchers.component';

describe('ActivityWatchersComponent', () => {
  let component: ActivityWatchersComponent;
  let fixture: ComponentFixture<ActivityWatchersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityWatchersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityWatchersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
