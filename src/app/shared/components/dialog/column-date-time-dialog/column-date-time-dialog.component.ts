import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-column-date-time-dialog',
  templateUrl: './column-date-time-dialog.component.html',
  styleUrls: ['./column-date-time-dialog.component.scss']
})
export class ColumnDateTimeDialogComponent implements OnInit {
  @Input() dateTimeOptions: any;
  @Input() recordType: any;

  dateTimeList = [
    {
      recordType: '',
      numberOfDays: 0,
    },
  ];

  constructor(
    protected ref: NbDialogRef<ColumnDateTimeDialogComponent>,
    private cdr: ChangeDetectorRef,
  ) { }

  addNewRow() {
    const arr = {
      recordType: '',
      numberOfDays: 0,
    };
    this.dateTimeList.push(arr);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.dateTimeOptions && this.dateTimeOptions.length) {
      this.dateTimeList = this.dateTimeOptions;
    }
    this.cdr.detectChanges();
  }

  showAddButton(i) {
    if (i + 1 < this.dateTimeList.length) { return false; }
    if(this.recordType){
    if (this.dateTimeList[i].recordType.length) { return true; }
    }
  }

  getFormDateTime() {
    return this.dateTimeList.filter(x => x.recordType == '').length;
  }

  removeRow(i) {
    this.dateTimeList.splice(i, 1);
  }

  cancel() {
    this.ref.close();
  }

  submit() {
    this.ref.close(this.dateTimeList);

  }

}
