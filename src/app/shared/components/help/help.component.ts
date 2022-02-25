import { Component, OnInit, Input,Inject, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NbDialogConfig, NbDialogRef, NbDialogService } from '@nebular/theme';
@Component({
  selector: 'ngx-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  @Input() tutorial:any = {};

  safeSrc: SafeResourceUrl;
  dialogRef:any;

  constructor(private sanitizer: DomSanitizer,
              @Inject(DOCUMENT) private document: Document,
              private modal: NgbModal,
              private dialogService: NbDialogService
              ) {
  }

  ngOnInit(): void {
    if(this.tutorial.videoUrl){
      this.safeSrc =  this.sanitizer.bypassSecurityTrustResourceUrl(this.tutorial.videoUrl);
    }
  }

  openVideoPopUp(tempVideoRef){
    let closeOnEsc = true;
    this.dialogRef = this.dialogService.open(tempVideoRef,{ closeOnEsc });
  }

  closeModal(){
    this.dialogRef.close();
  }
}
