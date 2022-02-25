import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordGadgetsComponent } from './record-gadgets.component';

describe('RecordGadgetsComponent', () => {
  let component: RecordGadgetsComponent;
  let fixture: ComponentFixture<RecordGadgetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordGadgetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordGadgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
