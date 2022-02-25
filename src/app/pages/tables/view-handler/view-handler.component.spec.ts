import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHandlerComponent } from './view-handler.component';

describe('ViewHandlerComponent', () => {
  let component: ViewHandlerComponent;
  let fixture: ComponentFixture<ViewHandlerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewHandlerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
