import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TriggerTableComponent } from './trigger-table.component';

describe('TriggerTableComponent', () => {
  let component: TriggerTableComponent;
  let fixture: ComponentFixture<TriggerTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TriggerTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TriggerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
