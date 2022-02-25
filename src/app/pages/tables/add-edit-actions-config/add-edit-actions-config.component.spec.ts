import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditActionsConfigComponent } from './add-edit-actions-config.component';

describe('AddEditActionsConfigComponent', () => {
  let component: AddEditActionsConfigComponent;
  let fixture: ComponentFixture<AddEditActionsConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditActionsConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditActionsConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
