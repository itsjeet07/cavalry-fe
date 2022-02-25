import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { filter } from 'lodash';

@Component({
  selector: 'ngx-filter-listing',
  templateUrl: './filter-listing.component.html',
  styleUrls: ['./filter-listing.component.scss']
})
export class FilterListingComponent implements OnInit {

  @Input() filterList = [];
  @Input() filterKey;
  @Input() dynamicFilterData;
  field;
  taskedRecordsOnly = false;
  checkboxArray = [];
  fileds = [];
  inputFields: string[] = ['password', 'text', 'email', 'currency', 'area', 'richTextArea','lookup'];
  operations = [
    // { name: 'None', val: 'none' },
    { name: 'equals', val: '$eq' },
    { name: 'not equal to', val: '$ne' },
    { name: 'less than', val: '$lt' },
    { name: 'greater than', val: '$gt' },
    { name: 'less or equal', val: '$lte' },
    { name: 'greater or equal', val: '$gte' },
  ]
  numberOperation;
  formulaOperation;
  textValue = {};
  dateObject;
  dayStart;
  dayEnd;
  dateTimeObject;
  dtStart;
  dtEnd;
  constructor(private datePipe: DatePipe,
    private toasterService: NbToastrService, protected ref: NbDialogRef<FilterListingComponent>,
    private cdr: ChangeDetectorRef,) { }

  ngOnInit(): void {

    if (this.filterList && this.filterList.length) {
      this.filterList = this.filterList;
      this.filterList.forEach(ele=>{
        if(ele.type == "checkbox"){
          this.checkboxArray = ele.option.split(',');
        }
      })
      
    }
    else {
      this.filterList.push(new FilterListClass());
    }

    this.fileds = this.dynamicFilterData.filter(f => {
      if (f.type !== "injectSubForm" && f.type !== "refButton" && f.type !== "section" && f.type !== "status") {
        return true;
      }
    })

  }

  fieldSelected(value, i) {

    let fieldValue = this.dynamicFilterData.filter(f => f.name == value);
    if (fieldValue && fieldValue.length) {
      this.field = fieldValue[0];
      this.filterList[i].type = fieldValue[0].type;
      this.filterList[i].label = fieldValue[0].label;
      this.filterList[i].valueOptions = fieldValue[0].options;
    }
  }

  addNewRow() {
    this.filterList.push(new FilterListClass());
  }

  removeRow(i) {
    if (i == 0 && i == this.filterList.length - 1) {
      this.filterList = [];
      this.filterKey = [];
      this.filterList.push(new FilterListClass());
    }
    else {
      this.filterList.splice(i, 1);
      this.filterKey.splice(i, 1);
    }

  }

  filterDone() {
    this.filterKey = [];

    this.filterList.forEach(ele => {
      if (ele.type == "number" || ele.type == "autoNumber") {
        this.filterKey.push({ [ele.fieldName]: Number(ele.option), operation: this.numberOperation });
      }
      else if (ele.type == "formula"){
        this.filterKey.push({ [ele.fieldName]: Number(ele.option), operation: this.formulaOperation });
      }
      else {
        this.filterKey.push({ [ele.fieldName]: ele.option })
      }
    });

    let obj = {
      filterKey: this.filterKey,
      filterList: this.filterList
    }
    this.ref.close(obj);
  }

  clearFilter() {
    this.filterList = [];
    this.filterKey = [];
    let obj = {
      filterKey: this.filterKey,
      filterList: this.filterList
    }
    this.ref.close(obj);
  }

  addEvent(data, i) {
    this.filterList[i].option = this.datePipe.transform(data.value, 'shortDate');
  }

  onFilterSearch(data, filterDataKey, type?, val?) {
    if ((type == 'number' || type == 'autoNumber') && !val) {
      this.toasterService.warning('Please choose operator', 'Operator missing!');
      return false;
    }

    if (filterDataKey == 'tasksRecordsOnly') {
      this.taskedRecordsOnly = data == true;
    }
    // if (type == 'date') {
    //   const Datedata = new Date(new Date(data).setHours(0, 0, 0));
    //   data = new Date(Datedata).toUTCString();
    // }
    if (type == 'checkbox') {
      if (data.target.checked) {
        this.checkboxArray.push(data.currentTarget.textContent.trim());
      } else {
        const index = this.checkboxArray.indexOf(data.currentTarget.textContent.trim());
        this.checkboxArray.splice(index, 1);
      }
      data = this.checkboxArray.join(',');
    }

    if (filterDataKey != 'tasksRecordsOnly') {
      if (this.filterKey.length > 0) {
        const index = this.filterKey.findIndex(v => v.hasOwnProperty(filterDataKey));
        this.filterKey.forEach(e => {
          if (index >= 0) {
            (data && data.length > 0) ? e[filterDataKey] = data : this.filterKey.splice(index, 1);
          } else if (data) {
            if ((type == "number" || type == "autoNumber")) {
              this.filterKey.push({ [filterDataKey]: Number(data) });
            }
            else {
              this.filterKey.push({ [filterDataKey]: data });
            }
          }
        });
      } else if (data && data.length > 0) {
        if (type == "number" || type == "formula" || type == "autoNumber") {
          this.filterKey.push({ [filterDataKey]: Number(data), operation: val });
        }
        else {
          this.filterKey.push({ [filterDataKey]: data });
        }

      } else if (type == 'date') {
        this.filterKey.push({ [filterDataKey]: data });
      } else if (type == 'dateTime') {
        this.filterKey.push({ [filterDataKey]: data });
      }
    }

  }

  dateRangeChange(event, filter) {
    if (event.value) {
      const dateStart = new Date(new Date(this.dayStart).setHours(0, 0, 0));
      const dateEnd = new Date(new Date(this.dayEnd).setHours(0, 0, 0));

      this.dateObject = {
        fromDate: new Date(dateStart).toUTCString(),
        toDate: new Date(dateEnd).toUTCString(),
      }
      filter.option = this.dateObject;
    }
  }

  dateTimeRangeChange(event, filter) {
    if (event.value) {
      const dateStart = new Date(new Date(this.dtStart).setHours(0, 0, 0));
      const dateEnd = new Date(new Date(this.dtEnd).setHours(0, 0, 0));

      this.dateTimeObject = {
        fromDate: new Date(dateStart).toUTCString(),
        toDate: new Date(dateEnd).toUTCString(),
      }
      filter.option = this.dateTimeObject;
    }
  }

  checkboxChange(event, filter) {

    if (event.target.checked) {
      this.checkboxArray.push(event.currentTarget.textContent.trim());
    } else {
      const index = this.checkboxArray.indexOf(event.currentTarget.textContent.trim());
      this.checkboxArray.splice(index, 1);
    }
    filter.option = this.checkboxArray.join(',');

    this.cdr.detectChanges();
  }

  getChecked(options,filter,item){

    let arr = [];
    if(filter.option){

      arr = filter.option.split(',');
      if(arr.includes(item)){
        return true;
      }
      else{
        return false;
      }
    }
    else{
      return false;
    }
    
    

    
  }

  close(){
    this.ref.close();
  }

}

export class FilterListClass {

  fieldName: any;
  option: any;
  type;
  label;
  valueOptions;
}