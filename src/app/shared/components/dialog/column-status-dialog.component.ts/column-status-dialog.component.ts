import { CdkDragDrop,moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-column-status-dialog',
  templateUrl: 'column-status-dialog.component.html',
  styleUrls: ['column-status-dialog.component.scss'],
})
export class ColumnStatusComponent {
  @Input() items: any;
  options = [];
  values = [];
  statusList = [
    {
      status: '',
      color: '',
      labelColor: '',
      default:'',
      closed: false,
    },
  ];

  constructor(
    protected ref: NbDialogRef<ColumnStatusComponent>,
    private cdr: ChangeDetectorRef,
  ) {

  }

  addNewRow() {
    const arr = {
      status: '',
      color: '#000000',
      labelColor: '#000000',
      closed: false,
      default:'',
    };
    this.statusList.push(arr);
  }

  ngAfterViewInit(): void {
    if (this.items) {
      this.statusList = this.items;
    }
    this.cdr.detectChanges();
  }


  cancel() {
    this.ref.close();
  }

  onItemAdded(event) {
    // this.values.push(event.value);
  }

  removeRow(i) {
    this.statusList.splice(i, 1);
  }

  showAddButton(i) {
    if (i + 1 < this.statusList.length) { return false; }
    if (this.statusList[i].status.length) { return true; }
  }

  getFormStatus() {
    return this.statusList.filter(x => x.status == '').length;
  }

  submit() {

    let obj = {
      statusList : this.statusList,
      defaultVal : ''
    }
    let def = this.statusList.filter(f => f.default);
    if(def && def.length){
      obj.defaultVal = def[0].status;
      this.ref.close(obj);
    }
    else{
      this.ref.close(obj);
    }
  }

  onChange(event, i, status) {
    const newStatus = {
      closed: event,
      status: status.status,
      color: status.color,
      default: status.default,
      labelColor: status.labelColor
    };
    this.statusList[i] = newStatus;

  }

  radioChange(status){
    
    this.statusList.forEach(ele=>{
      ele.default = '';
    });
    status.default = status.status;
  }
  drop(event: CdkDragDrop<string[]>){
    moveItemInArray(this.statusList, event.previousIndex, event.currentIndex);
  }
  trackByField (index,item){
    return item._id
  }
}
