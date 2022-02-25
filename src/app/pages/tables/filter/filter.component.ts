import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TableService } from '@app/shared/services/table.service';
import { NbToastrService } from '@nebular/theme';
import { NgPluralizeService } from 'ng-pluralize';

@Component({
  selector: 'ngx-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  @Input() filterObject;
  @Input() searchFlag;
  @Input() hideFilters;
  @Input() tableName;
  @Input() usersWithIds
  @Input() finalList;
  @Output() emitFilterObject = new EventEmitter();
  @Output() emitHideFilter = new EventEmitter();
  @Input() dynamicFilterData: any;
  inputFields: string[] = ['password', 'text', 'email', 'currency', 'area', 'richTextArea'];
  filterFields: string[] = ['file', 'currency'];
  unwantedFieldsInOptions = ['displayInTree', 'lookups', '_id'];
  operations = [
    // { name: 'None', val: 'none' },
    { name: 'equals', val: '$eq' },
    { name: 'not equal to', val: '$ne' },
    { name: 'less than', val: '$lt' },
    { name: 'greater than', val: '$gt' },
    { name: 'less or equal', val: '$lte' },
    { name: 'greater or equal', val: '$gte' },
  ];
  currentUser;
  constructor(
    private toastrService: NbToastrService,
    public route: ActivatedRoute,
    private tableService: TableService,
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('userData'));
  }

  ngOnInit(): void {

    let filter = new Filter();
    let dummy = new Filter();
    filter.DateTimerange = this.filterObject.DateTimerange ? this.filterObject.DateTimerange : dummy.DateTimerange;
    filter.check = this.filterObject.check ? this.filterObject.check : dummy.check;
    filter.checkboxArray = this.filterObject.checkboxArray ? this.filterObject.checkboxArray : dummy.checkboxArray;
    filter.dropdownValue = this.filterObject.dropdownValue ? this.filterObject.dropdownValue : dummy.dropdownValue;
    filter.dropdownWithImageValue = this.filterObject.dropdownWithImageValue ? this.filterObject.dropdownWithImageValue : dummy.dropdownWithImageValue;
    filter.filterKey = this.filterObject.filterKey ? this.filterObject.filterKey : dummy.filterKey;
    filter.filteredOptions = this.filterObject.filteredOptions ? this.filterObject.filteredOptions : dummy.filteredOptions;
    filter.filteredStatus = this.filterObject.filteredStatus ? this.filterObject.filteredStatus : dummy.filteredStatus;
    filter.formulaOperation = this.filterObject.formulaOperation ? this.filterObject.formulaOperation : dummy.formulaOperation;
    filter.lookupValue = this.filterObject.lookupValue ? this.filterObject.lookupValue : dummy.lookupValue;
    filter.numberOperation = this.filterObject.numberOperation ? this.filterObject.numberOperation : dummy.numberOperation;
    filter.range = this.filterObject.range ? this.filterObject.range : dummy.range;
    filter.showAutocomplete = this.filterObject.showAutocomplete ? this.filterObject.showAutocomplete : dummy.showAutocomplete;
    filter.tableName = this.filterObject.tableName ? this.filterObject.tableName : dummy.tableName;
    filter.textValue = this.filterObject.textValue ? this.filterObject.textValue : dummy.textValue;
    filter.users = this.filterObject.users ? this.filterObject.users : dummy.users;
    filter.radio = this.filterObject.radio ? this.filterObject.radio : dummy.radio;
    this.filterObject = filter;
    this.tableService.getFilterObject(this.filterObject);
  }

  removeText(value, type?, remove = false) {

    if (type === 'lookup') {
      this.filterObject.lookupValue[value] = null;
    } else if (type === 'date') {
      this.filterObject.range.start = null;
      this.filterObject.range.end = null;
    } else if (type === 'dateTime') {
      this.filterObject.DateTimerange.start = null;
      this.filterObject.DateTimerange.end = null;
    } else if (type === 'dropdown') {
      this.filterObject.dropdownValue = null;
    } else if (type === 'dropdownWithImage') {
      this.filterObject.dropdownWithImageValue = null;
    } else if (type === 'number') {
      this.filterObject.numberOperation = '';
      this.filterObject.textValue[value] = '';
    } else if (type === 'formula') {
      this.filterObject.formulaOperation = '';
      this.filterObject.textValue[value] = '';
    } else if (type == 'watchedBy') {
      this.filterObject.users = [];
    } else if (type === 'checkbox') {
      this.filterObject.checkboxArray = [];
      this.filterObject.check = [];
    } else {
      this.filterObject.textValue = {};
    }

    if (type == 'watchedBy')
      value = 'watchedBy';

    const index = this.filterObject.filterKey.findIndex(v => v.hasOwnProperty(value));
    if (index > -1) {
      this.filterObject.filterKey.splice(index, 1);
      this.tableService.getFilterObject(this.filterObject, this.tableName);
    }
    this.emitFilterObject.emit(this.filterObject);
  }

  onFilterSearch(data, filterDataKey, type?, val?, i?) {
    if ((type == 'number' || type == 'autoNumber') && !val) {
      this.toastrService.warning('Please choose operator', 'Operator missing!');
      return false;
    }
    if (type == 'checkbox') {
      if (data.target.checked) {
        this.filterObject.check[i] = true;
        this.filterObject.checkboxArray.push(data.currentTarget.textContent.trim());
      } else {
        const index = this.filterObject.checkboxArray.indexOf(data.currentTarget.textContent.trim());
        this.filterObject.check[i] = false;
        this.filterObject.checkboxArray.splice(index, 1);
      }
      data = this.filterObject.checkboxArray.join(',');
    }
    if (filterDataKey != 'tasksRecordsOnly') {
      if (this.filterObject.filterKey.length > 0) {
        const index = this.filterObject.filterKey.findIndex(v => v.hasOwnProperty(filterDataKey));

        if (index >= 0) {
          this.filterObject.filterKey.forEach(e => {
            if (type == 'lookup') {
              const arr = [];
              if (data && data.length > 0) {
                data.forEach(element => {
                  arr.push(element.id);
                });
                if (e[filterDataKey])
                  e[filterDataKey] = arr;
              } else {
                this.filterObject.filterKey.splice(index, 1);
              }
            } else {
              if (data && data.length > 0) {
                if (e[filterDataKey]) {
                  e[filterDataKey] = data;
                }
              } else {
                this.filterObject.filterKey.splice(index, 1);
              }
            }
          });
        } else if (data) {
          if (type == 'number') {
            this.filterObject.filterKey.push({ [filterDataKey]: Number(data), operation: val });
          }
          else if (type == 'lookup') {
            const temp = [];
            data.forEach(element => {
              temp.push(element.id);
            });
            data = temp;
            this.filterObject.filterKey.push({ [filterDataKey]: data });
          } else {
            this.filterObject.filterKey.push({ [filterDataKey]: data });
          }
        }

      } else if (data && data.length > 0) {
        if (type == 'number' || type == 'formula') {
          this.filterObject.filterKey.push({ [filterDataKey]: Number(data), operation: val });
        }
        else if (type == 'lookup') {
          const temp = [];
          data.forEach(element => {
            temp.push(element.id);
          });
          data = temp;
          this.filterObject.filterKey.push({ [filterDataKey]: data });
        } else {
          this.filterObject.filterKey.push({ [filterDataKey]: data });
        }

      } else if (type == 'date') {
        this.filterObject.filterKey.push({ [filterDataKey]: data });
      } else if (type == 'dateTime') {
        this.filterObject.filterKey.push({ [filterDataKey]: data });
      }
    }
    this.tableService.getFilterObject(this.filterObject, this.tableName);
    this.emitFilterObject.emit(this.filterObject);
  }

  dynamicSearch(e, field) {
    if (e && e.length >= 0) {
      this.filterObject.showAutocomplete[field.name] = true;
    } else {
      this.filterObject.showAutocomplete[field.name] = false;
    }
    let filterKey;
    if (field.name === 'dependentTask' && field.lookupTableName === 'Tasks') {
      filterKey = [{ isSubtask: 'No' }];
    } else {
      filterKey = 0;
    }
    if (!e.target.value) {
      this.filterObject.filteredOptions[field.name] = [];
    } else {
      let lookupVal = this.filterObject.lookupValue;
      this.tableService
        .getDynamicTreeData(
          field.lookupTableName,
          1,
          e.target.value,
          0,
          filterKey,
          "",
          "",
          "",
          this.tableName,
          field.name,
          "",
          lookupVal
        )
        .subscribe((res: any) => {
          this.filterObject.filteredOptions[field.name] = [];
          if (res && res.data && res.data.pageOfItems) {
            res.data.pageOfItems.forEach((data) => {
              let val = "";
              Object.keys(data).forEach((lookupele) => {
                if (!!data[lookupele] && !this.unwantedFieldsInOptions.includes(lookupele)) {
                  val = val + " " + data[lookupele];
                }
              });

              const obj = {
                id: data._id,
                value: val,
              };
              this.filterObject.filteredOptions[field.name] = [
                ...this.filterObject.filteredOptions[field.name],
                obj,
              ];
            });
          }
        });
    }
    this.tableService.getFilterObject(this.filterObject, this.tableName)
    this.emitFilterObject.emit(this.filterObject);
  }

  dateRangeChange(dateType, event, filterDataKey, type) {
    if (event.value) {
      const dateStart = new Date(this.filterObject.range.start);
      const dateEnd = new Date(this.filterObject.range.end);

      let dateObject = {
        fromDate: new Date(dateStart),
        toDate: new Date(dateEnd)
      }
      this.filterObject.range.start = dateObject.fromDate;
      this.filterObject.range.end = dateObject.toDate;

      this.onFilterSearch(dateObject, filterDataKey, type);
    }
  }

  dateTimeRangeChange(dateType, event, filterDataKey, type) {
    if (event.value) {
      const dateStart = new Date(this.filterObject.DateTimerange.start);
      const dateEnd = new Date(this.filterObject.DateTimerange.end);

      let dateObject = {
        fromDate: new Date(dateStart),
        toDate: new Date(dateEnd)
      }
      this.filterObject.DateTimerange.start = dateObject.fromDate;
      this.filterObject.DateTimerange.end = dateObject.toDate;

      this.onFilterSearch(dateObject, filterDataKey, type);
    }
  }


  tempUser = [];
  usersSelected(data) {

    this.filterObject.users = [...data];
    if (data && data.length)
      this.tempUser = data.map(item => item._id);
    else
      this.tempUser = [];

    const index = this.filterObject.filterKey.findIndex(v => v.hasOwnProperty('watchedBy'));
    if (index > -1) {
      if (data && data.length) {
        this.filterObject.filterKey.forEach(ele => {
          if (ele['watchedBy']) {
            ele['watchedBy'] = this.tempUser;
          }
        });
      } else {
        this.filterObject.filterKey.splice(index, 1);
      }
    } else {
      if (data && data.length)
        this.filterObject.filterKey.push({ ['watchedBy']: this.tempUser });
    }
    this.tableService.getFilterObject(this.filterObject, this.tableName);
    this.emitFilterObject.emit(this.filterObject);

  }


  onSelectionChange(data1, name, type) {
    data1.forEach(data => {
      if (data && data.id && data.value) {

        //this.filterObject.lookupValue[name][index] = data.value;
        for (const d of this.dynamicFilterData) {
          if (d.type === "lookup" && name === d.name) {
            if (d.loadAsDropDown) {
              const displayValue = d.IdFieldValue.filter(
                (f) => f[0] === data.id
              );
              if (displayValue.length > 0) {
                const temp: [] = Object.assign([], displayValue[0]);
                temp.shift();
                this.filterObject.lookupValue[name] = [
                  ...this.filterObject.lookupValue[name],
                  {
                    id: data.id,
                    value: temp.toString().replace(/,/g, " "),
                  },
                ];
              } else {
                d.options.forEach((el) => {
                  if (data.id === el[0]) {
                    this.filterObject.lookupValue[name] = [
                      ...this.filterObject.lookupValue[name],
                      {
                        id: data.id,
                        value: el[1],
                      },
                    ];
                  }
                });
              }
            } else {
              if (
                this.filterObject.lookupValue[name].findIndex((f) => f.id == data.id) == -1
              ) {
                this.filterObject.lookupValue[name] = [
                  ...this.filterObject.lookupValue[name],
                  { id: data.id, value: data.value },
                ];
              }
            }
            // Filterout only unique values
            this.filterObject.lookupValue[name] = this.filterObject.lookupValue[name].filter(
              (ob, i, arr) => arr.findIndex((t) => t.id === ob.id) === i
            );
            this.filterObject.lookupValue[name] = [...this.filterObject.lookupValue[name]];
          }
        }
      }
    });
    this.tableService.getFilterObject(this.filterObject, this.tableName);
    this.onFilterSearch(data1, name, type);
  }

  updatedVal(e, value) {
    if (e && e.length >= 0) {
      this.filterObject.showAutocomplete[value] = true;
    } else {
      this.filterObject.showAutocomplete[value] = false;
    }

  }

  compareFn(c11: any, c22: any): boolean {
    return c11 && c22 ? c11.id === c22.id : c11 === c22;
  }

  handleOutSideClick() {
    this.hideFilters = true;
    this.emitHideFilter.emit(this.hideFilters);
  }
}
export class Filter {
  tableName: string;
  filterKey:any [];
  numberOperation: null;
  formulaOperation: null;
  textValue: {};
  dropdownValue: [];
  dropdownWithImageValue: [];
  users:any [];
  filteredOptions: {};
  lookupValue: {};
  showAutocomplete: {};
  check:boolean [];
  checkboxArray:any [];
  filteredStatus: [];
  range: {
    start: Date,
    end: Date,
  };
  DateTimerange: {
    start: Date,
    end: Date,
  };
  radio: null;

  constructor(){
      this.tableName = '';
      this.filterKey = [];
      this.numberOperation = null;
      this.formulaOperation = null;
      this.textValue = {};
      this.dropdownValue = [];
      this.dropdownWithImageValue = [];
      this.users = [];
      this.filteredOptions = {};
      this.lookupValue = {};
      this.showAutocomplete = {};
      this.check = [];
      this.checkboxArray = [];
      this.filteredStatus = [];
      this.range = {
        start:null,
        end:null,
      };
      this.DateTimerange = {
        start:null,
        end:null,
      };
      this.radio = null;
  }
}