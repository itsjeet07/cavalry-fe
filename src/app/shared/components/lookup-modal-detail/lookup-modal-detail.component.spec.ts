import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupModalDetailComponent } from './lookup-modal-detail.component';

describe('LookupModalDetailComponent', () => {
  let component: LookupModalDetailComponent;
  let fixture: ComponentFixture<LookupModalDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LookupModalDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LookupModalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
