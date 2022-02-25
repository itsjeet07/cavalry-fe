import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-email-dialog',
  templateUrl: './email-dialog.component.html',
  styleUrls: ['./email-dialog.component.scss'],
})
export class EmailDialogComponent implements OnInit {
  @Input() title;
  constructor(public ref: NbDialogRef<EmailDialogComponent>) { }

  ngOnInit(): void {
  }

  onClose() {
    this.ref.close('no');
  }
}
