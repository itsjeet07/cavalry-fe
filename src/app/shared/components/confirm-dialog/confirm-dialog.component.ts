import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  @Input() text = '';
  @Input() title = '';
  @Input() actionFlag = false;
  @Input() actionObj;
  warningmessage;
  backGroundColorClass;
  warningMessageColor;
  @Input() exportButton = false;
  @Input() warningMessage;
  @Input() warningColor;
  @Input() finalDialog = false;
  cancel = 'Cancel';

  colors = [
    {name: 'warning',color: '#ffaa00'},{name : 'danger',color: '#ff3d71'},
    {name : 'basic', color : '#edf1f7'},{name : 'primary', color : '#3366ff'},
    {name : 'success', color : '#00d68f'},{name : 'info', color : '#0095ff'},
    {name : 'control', color : '#ffffff'}
  ]

  constructor(protected ref: NbDialogRef<ConfirmDialogComponent>) { }

  ngOnInit(): void {
    if(this.actionFlag){
      this.warningColor = this.colors.find(color =>  color.name == this.warningColor.toLowerCase());
    }
    if(this.finalDialog){
      this.cancel = 'Close';
    }
  }

  onCancel() {
    this.ref.close();
  }

  onYes() {
    this.ref.close(true);
  }

  onSelect(value) {
    this.ref.close(value);
  }

}
