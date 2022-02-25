import { FormGroup } from '@angular/forms';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { columnRequest } from '@app/shared/interfaces/table';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-additional-form-dialog',
  templateUrl: './additional-form-dialog.component.html',
  styleUrls: ['./additional-form-dialog.component.scss'],
})
export class AdditionalFormDialogComponent {
  @Input() tableform;
  formModel = {
    isSearchable: false,
    displayInList: false,
    displayInTreeTable: false,
    allowMultipleValues: false,
    idField: false,
    isWorkFlowField: false,
    isReadOnly: false,
    isVisibilityOn: false,
    isReference:false,
    loadAsDropDown:false,
    recordHistory:false
  };



  constructor(protected ref: NbDialogRef<AdditionalFormDialogComponent>) {
  }

  ngOnInit(): void {
    this.formModel.isSearchable = this.tableform.get('isSearchable').value;
    this.formModel.displayInList = this.tableform.get('displayInList').value;
    this.formModel.displayInTreeTable = this.tableform.get('displayInTreeTable').value;
    this.formModel.allowMultipleValues = this.tableform.get('allowMultipleValues').value;
    this.formModel.idField = this.tableform.get('idField').value;
    this.formModel.isWorkFlowField = this.tableform.get('isWorkFlowField').value;
    this.formModel.isReadOnly = this.tableform.get('isReadOnly').value;
    this.formModel.isVisibilityOn = this.tableform.get('isVisibilityOn').value;
    this.formModel.isReference = this.tableform.get('isReference').value;
    this.formModel.loadAsDropDown = this.tableform.get('loadAsDropDown').value;
    this.formModel.recordHistory = this.tableform.get('recordHistory').value;
  }

  // onCheck(evt) {
  //   if (!this.selectedColumnId.includes(evt)) {
  //     this.selectedColumnId.push(evt);
  //   } else {
  //     const index = this.selectedColumnId.indexOf(evt);
  //     if (index > -1) {
  //       this.selectedColumnId.splice(index, 1);
  //     }
  //   }
  // }

  // onChange(event) {
  //   this.tableId = event;
  //   this.selectedColumnId = [];
  //   this.columnList = this.tableData.find(x => x._id == event).columns;
  //   this.tableName = this.tableData.find(x => x._id == event).tableName;
  // }

  cancel() {
    this.ref.close();
  }

  submit() {
    this.ref.close(this.formModel);
  }
}
