import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-snooze-time',
  templateUrl: './snooze-time.component.html',
  styleUrls: ['./snooze-time.component.scss']
})
export class SnoozeTimeComponent implements OnInit {


  @Input("times") times = [];
  snoozeTime;
  constructor( public ref: NbDialogRef<SnoozeTimeComponent>) { }

  ngOnInit(): void {
  }

  selectedTime(value){
    this.snoozeTime = value;
    this.ref.close(this.snoozeTime);
  }

  close(){
    this.ref.close();
  }

}
