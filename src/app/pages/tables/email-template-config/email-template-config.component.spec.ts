import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTemplateConfigComponent } from './email-template-config.component';

describe('EmailTemplateConfigComponent', () => {
  let component: EmailTemplateConfigComponent;
  let fixture: ComponentFixture<EmailTemplateConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailTemplateConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTemplateConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
