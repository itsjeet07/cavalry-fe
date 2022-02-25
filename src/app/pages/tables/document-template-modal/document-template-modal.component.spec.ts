import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTemplateModalComponent } from './document-template-modal.component';

describe('DocumentTemplateModalComponent', () => {
  let component: DocumentTemplateModalComponent;
  let fixture: ComponentFixture<DocumentTemplateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentTemplateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentTemplateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
