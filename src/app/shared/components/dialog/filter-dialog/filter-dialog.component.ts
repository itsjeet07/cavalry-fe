import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef, NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss']
})
export class FilterDialogComponent implements OnInit {
  @Input() lookupData = [];
  @Input() currentTableData = [];
  @Input() filters = [];
  submitFlag: boolean = false;
  fieldObj = {}
  copyLookUp;
  operations = [
    { name: 'None', val: 'none' },
    { name: '<', val: '$lt' },
    { name: '>', val: '$gt' },
    { name: '<=', val: '$lte' },
    { name: '>=', val: '$gte' },
    { name: '==', val: '$eq' },
    { name: '!=', val: '$ne' },
    { name: 'Like', val: '$regex' },
  ]

  constructor(
    protected ref: NbDialogRef<FilterDialogComponent>,
    private toastrService: NbToastrService,
  ) {

  }

  ngOnInit() {
    this.copyLookUp = this.lookupData;
    if (!this.filters || !this.filters.length) {
      this.filters = [];
      this.filters.push(new FilterFieldsClass());
    }
    this.currentTableData = this.currentTableData.filter(f => f.type != 'formula' && f.type != 'injectSubForm')
  }
  addNewRow() {
    this.filters.push(new FilterFieldsClass());
  }

  removeRow(i) {
    if (i == 0 && this.filters.length == 1) {
      this.filters = [];
      this.filters.push(new FilterFieldsClass());
    }
    else {
      this.filters.splice(i, 1);
    }
  }

  baseTableByChange(value,i){
    if(value){
      this.filters[i].text = "";
      this.filters[i].operation = null;
      this.filters[i].disable = true;
    }
  }


  filterByChange(value, i) {
    this.filters[i].disable = false;
    this.lookupData.forEach(ele => {
      if (ele.name == value) {
        if (ele.type == "lookup") {
          this.filters[i].text = "";
          this.filters[i].operation = null;
          this.filters[i].disable = true;
        }
      }
    })
  }

  cancel() {
    this.ref.close();
  }

  checkChanged(value){

  }

  submit() {
    this.submitFlag = true;

    this.filters.forEach((item, i) => {
      if (item.disable) {
        if (!item.filterBy) {
          this.submitFlag = false;
        }
      }
      else if (!item.operation || !item.text || !item.filterBy){
        if(item.filterBy){
          if (!item.operation || !item.text) {
            this.submitFlag = false;
          }
        }
        else{
          if (!item.operation || !item.text || !item.filterBy) {
            this.submitFlag = false;
          }
        }
      }
    });

    if (this.filters.length == 1) {
      if (!this.filters[0].operation && !this.filters[0].text && !this.filters[0].filterBy) {
        this.submitFlag = true;
      }
    }

    if (!this.submitFlag)
      this.toastrService.warning("Enter all fields","Filters");
    else
      this.ref.close(this.filters);
  }
}

export class FilterFieldsClass {
  filterBy: string;
  operation: string;
  text: string;
  baseTableField: string;
  disable: boolean;
  showErrorMessage:any;
  errorMessageForCheckBox:string
  constructor() {
    this.filterBy = '';
    this.operation = '';
    this.text = '';
    this.baseTableField = '';
    this.disable = false;
    this.showErrorMessage = null;
    this.errorMessageForCheckBox = '';
  }
}
