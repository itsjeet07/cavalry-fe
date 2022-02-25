import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailConfigHelpComponent } from './email-config-help.component';

describe('EmailConfigHelpComponent', () => {
  let component: EmailConfigHelpComponent;
  let fixture: ComponentFixture<EmailConfigHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailConfigHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailConfigHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
