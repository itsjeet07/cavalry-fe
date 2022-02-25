import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTemplateConfigComponent } from './document-template-config.component';

describe('DocumentTemplateConfigComponent', () => {
  let component: DocumentTemplateConfigComponent;
  let fixture: ComponentFixture<DocumentTemplateConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentTemplateConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentTemplateConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
