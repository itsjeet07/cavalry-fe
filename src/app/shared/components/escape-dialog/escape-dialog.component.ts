import { Component, OnInit, HostListener } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngx-escape-dialog',
  templateUrl: './escape-dialog.component.html',
  styleUrls: ['./escape-dialog.component.scss']
})
export class EscapeDialogComponent implements OnInit {

  constructor(protected ref: NgbActiveModal) { }

  ngOnInit(): void {
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    if (event.keyCode == 27) {
      if(this.ref){
        this.ref.close();
      }
    }
  }


  onCancel() {
    this.ref.close();
  }

  onYes() {
    this.ref.close(true);
  }
}
