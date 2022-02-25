import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-formula-help-dialog',
  templateUrl: './formula-help-dialog.component.html',
  styleUrls: ['./formula-help-dialog.component.scss']
})
export class FormulaHelpDialogComponent implements OnInit {

  constructor(
    protected ref: NbDialogRef<FormulaHelpDialogComponent>,
  ) { }

  ngOnInit(): void {
  }

  closeModal(){
    this.ref.close();
  }
}
