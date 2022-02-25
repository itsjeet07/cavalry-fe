import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent implements OnInit {
  loading = false;
  constructor(protected ref: NbDialogRef<DeleteDialogComponent>) { }

  ngOnInit(): void {
  }

  onCancel() {
    this.ref.close();
  }

  onYes() {
    this.loading = true;
    setTimeout(() => {
      this.ref.close(true);
      this.loading = false;  
    }, 100);
  }

}
