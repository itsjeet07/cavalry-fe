import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRefComponent } from './add-ref.component';

describe('AddRefComponent', () => {
  let component: AddRefComponent;
  let fixture: ComponentFixture<AddRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
