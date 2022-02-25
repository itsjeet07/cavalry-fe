import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsTemplateConfigComponent } from './actions-template-config.component';

describe('ActionsTemplateConfigComponent', () => {
  let component: ActionsTemplateConfigComponent;
  let fixture: ComponentFixture<ActionsTemplateConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionsTemplateConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionsTemplateConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
