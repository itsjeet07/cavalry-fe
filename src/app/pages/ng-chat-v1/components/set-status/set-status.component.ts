import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-set-status',
  templateUrl: './set-status.component.html',
  styleUrls: ['./set-status.component.scss']
})
export class SetStatusComponent implements OnInit {

  constructor(protected ref: NbDialogRef<SetStatusComponent>) { }
  @Input('statusOptionsArray') statusOptionsArray;
  copyStatusOptions = [];
  ngOnInit(): void {
    this.copyStatusOptions = [...this.statusOptionsArray];
  }
  onCancel(){
    this.ref.close();
  }
  onDone(status){
    this.ref.close(status);
  }

  onChange(input) {
    if (input != '') {
      this.statusOptionsArray = this.copyStatusOptions.filter((item: any) => {
        return (item.status.toUpperCase().indexOf(input.toUpperCase()) != -1);
      });
    } else {
      // return this.copyStatusOptions;
      this.statusOptionsArray = [...this.copyStatusOptions];
    }
  }
}
