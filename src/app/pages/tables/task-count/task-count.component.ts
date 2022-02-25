import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-task-count',
  templateUrl: './task-count.component.html',
  styleUrls: ['./task-count.component.scss']
})
export class TaskCountComponent implements OnInit {

  @Input() taskStatus = [];
  @Input() taskData = [];
  @Input() resId = "";

  data;
  status: any = [];
  color;

  constructor() {
  }

  ngOnChanges(): void {
    this.data = this.taskData.find(x => x._id == this.resId);
    if (this.data) {
      this.status = this.data.status;
    }

  }

  ngOnInit(): void {

  }

  getColor(stat) {
    const data = this.taskStatus.find(x => x.status == stat);
    return data ? data.color : 'black';
  }
}
