import { DatePipe, DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, Input, OnInit, Optional, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbMenuService, NbSelectComponent, NbToastrService } from '@nebular/theme';
import { TableService } from '@shared/services/table.service';
import { Filter } from '../filter/filter.component';
@Component({
  selector: 'ngx-add-edit-default-filters',
  templateUrl: './add-edit-default-filters.component.html',
  styleUrls: ['./add-edit-default-filters.component.scss']
})
export class AddEditDefaultFiltersComponent implements OnInit {
  filterObject = new Filter();
  @Input() tableData;
  @Input() addFlag;
  @Input() editFlag;
  @Input() itemData;
  @Input() actionData;
  parentTableHeader = [];
  filteredStatus = [];
  @ViewChild('statusSelect') select: NbSelectComponent;
  finalList = [];
  inputFields: string[] = ['password', 'text', 'email', 'currency', 'area', 'richTextArea'];
  textValue = {};
  dropdownValue = [];
  canShowClearFilter = {};
  dropdownWithImageValue = [];
  check = [];
  actions = [];
  newViewFlag = false;
  numberOperation;
  operations = [
    // { name: 'None', val: 'none' },
    { name: 'equals', val: '$eq' },
    { name: 'not equal to', val: '$ne' },
    { name: 'less than', val: '$lt' },
    { name: 'greater than', val: '$gt' },
    { name: 'less or equal', val: '$lte' },
    { name: 'greater or equal', val: '$gte' },
  ];
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  formulaOperation;
  dynamicFilterData: any = [];
  lookTable: any;
  lookupName: any;
  lookupData: any = [];
  lookupValue = {};
  lookupValue1 = { id: '', value: 'Me' };
  lookupObj = {};
  usersWithIds = [];
  users = [];
  filteredOptions = {};
  statusForm: FormControl;
  showFilterBox = {};
  hideColumn = {};
  filterHide = {};
  dependsFields = [];
  statuses = [];
  showAutocomplete = {};
  currentUser;
  demoData: [];
  unwantedFieldsInOptions = ["displayInTree", "lookups", "_id"];
  DateTimerange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  viewAllRecords = false;
  viewCompletedRecords = false;
  hideFilters = true;
  hideStatus = true;
  filterKey = [];
  tagList = [];
  localSotrageFilterArr = [];
  taskedRecordsOnly = false;
  checkboxArray = [];
  filterName = '';
  defaultCheck = false;

  constructor(
    private toastrService: NbToastrService,
    @Inject(DOCUMENT) private document: Document,
    public route: ActivatedRoute,
    private tableService: TableService,
    private router: Router,
    private dialogService: NbDialogService,
    private nbMenuService: NbMenuService,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe,
    @Optional() public dialogRef?: NbDialogRef<AddEditDefaultFiltersComponent>,
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('userData'));
    this.tableService.$users.subscribe((res: any) => {
      if (res.length) {
        this.usersWithIds = res.filter(v => !!v._id);
        let obj = {
          _id: "",
          value: ''
        }
        this.usersWithIds.forEach(ele => {

          if (ele._id == this.currentUser._id) {
            if (ele.value !== "Me")
              obj.value = "Me";
          }
          ele['value'] = ele.firstName + ' ' + ele.lastName;
        });
        if (obj.value)
          this.usersWithIds.unshift(obj);
      }
    });
  }

  ngOnInit(): void {
    console.log(this.itemData);
    if (this.editFlag) {
      this.tagList = this.itemData?.tagList;
      this.filterObject = this.itemData?.filterObject ? this.itemData?.filterObject : this.tableService.getFilterObject();
      this.filteredStatus = this.filterObject.filteredStatus;
      this.filterName = this.itemData?.name;
      this.viewAllRecords = this.itemData?.viewCompletedRecords;
      this.defaultCheck = this.itemData?.isDefault;

    }
    this.filterObject = this.tableService.getFilterObject(this.filterObject, this.filterName);
    this.cdr.detectChanges();
    this.getTableByName();
  }


  getTableByName() {
    if (this.tableData) {
      this.parentTableHeader = this.tableData.columns;

      if (this.parentTableHeader?.length > 0) {
        for (const data of this.parentTableHeader) {
          this.hideColumn[data.name] = true;
          this.showFilterBox[data.name] = false;
          if (data.type === 'lookup') {
            // this.isInputDisable = false;
            this.lookTable = data.lookupTableName;
            this.lookupName = data.name;
            // this.filterObject.lookupValue[data.name] = null;
            this.filterObject.filteredOptions[data.name] = [];
            this.filterObject.showAutocomplete[data.name] = false;

            const lookUpArray = [];
            data.options.forEach((el) => {

              const temp: [] = Object.assign([], el);
              temp.shift();
              if (data.loadAsDropDown) {
                if (el.length > 1) {
                  this.filterObject.filteredOptions[data.name].push({
                    id: el[0],
                    value: temp.toString().replace(/,/g, " "),
                  });
                }
              }
              if (data.name == this.lookupName) {
                lookUpArray.push({
                  id: el[0],
                  value: temp.toString().replace(/,/g, " "),
                });
              }
            });
            // this.lookUpOptions = lookUpArray;
            if (data.lookupTableName === 'Users') {
              this.filterObject.filteredOptions[data.name].push({ id: '', value: 'Me' });
            }

            this.demoData = data;
            this.lookupData.push(this.demoData);
          }
          if (data.type == 'status') {
            this.statusForm = new FormControl();
            if (data.statusOptions) {
              data.statusOptions.map(m => {
                return this.statuses.push(m.status);
              });
              console.log(this.statuses);
            }
          }
          if (data.type == "checkbox") {
            data.options.forEach(element => {
              this.filterObject.check.push(false);
            });
          }

          if (data.isVisibilityOn && data.fieldValuesData && data.fieldValuesData.length > 0) {
            this.dependsFields.push(data);
          }
        }
      }

      this.finalList = this.tableData.columns.filter(ele => {
        if (ele.isSearchable == true) {

          return true;
        }
      });
      if (this.finalList && this.finalList.length) {
        if (this.editFlag) {
          this.getFiltersDetails(this.editFlag);
        }
        return this.finalList;
      } else {
        this.finalList = [];
      }


    }

    this.filterObject = this.tableService.getFilterObject(this.filterObject, this.filterName);
  }

  statusSelected(data, name) {
    this.filterObject.filteredStatus = data;
    this.filteredStatus = data;
    console.log(data);
    this.hideStatus = !this.hideStatus;
    const index = this.filterObject.filterKey.findIndex(v => v.hasOwnProperty(name));
    if (index > -1) {
      if (data && data.length) {
        this.filterObject.filterKey.forEach(ele => {
          if (ele[name]) {
            ele[name] = data;
          }
        })
      } else {
        this.filterObject.filterKey.splice(index, 1);
      }
    } else {
      this.filterObject.filterKey.push({ [name]: data });
    }
    this.filterObject = this.tableService.getFilterObject(this.filterObject, this.filterName);
    this.createTagList();
  }

  createTagList() {
    this.tagList = [];
    if (this.filterObject.filterKey && this.filterObject.filterKey.length) {
      this.filterObject.filterKey.forEach(ele => {
        let keys = [];
        keys = Object.keys(ele);
        if (keys && keys.length) {
          keys.forEach(item => {
            let obj = {
              id: null,
              name: '',
              type: '',
              value: null,
            }
            if (item == 'watchedBy') {
              obj.name = 'Watched By';
              obj.type = 'watchedBy';
              obj.value = [];
              obj.id = [];
              ele[item].forEach((value, i) => {
                if (value == '' || value == null) {
                  obj.value.push('  ' + 'Me');
                } else {
                  if (this.usersWithIds && this.usersWithIds.length) {
                    this.usersWithIds.forEach(element => {
                      if (value == element._id) {
                        if (i == 0 && i == this.filterObject.users.length - 1) {
                          obj.value.push('  ' + element.firstName + ' ' + element.lastName);
                          obj.id.push(element._id);
                        } else if (i == this.filterObject.users.length - 1) {
                          obj.value.push('  ' + element.firstName + ' ' + element.lastName);
                          obj.id.push(element._id);
                        } else {
                          obj.value.push('  ' + element.firstName + ' ' + element.lastName + ',');
                          obj.id.push(element._id);
                        }

                      }
                    });
                  }
                }
              });
            } else {
              this.finalList.forEach(v => {
                if (v.name == item) {
                  obj.name = v.name;
                  obj.type = v.type;

                  if (obj.type == "lookup") {
                    obj.value = [];
                    obj.id = [];
                    ele[item].forEach(value => {
                      if (this.filterObject.lookupValue[obj.name] && this.filterObject.lookupValue[obj.name].length) {
                        this.filterObject.lookupValue[obj.name].forEach((element, i) => {
                          if (value == element.id) {
                            if (i == 0 && i == this.filterObject.lookupValue[obj.name].length - 1) {
                              obj.value.push('  ' + element.value);
                              obj.id.push(element.id);
                            } else if (i == this.filterObject.lookupValue[obj.name].length - 1) {
                              obj.value.push('  ' + element.value);
                              obj.id.push(element.id);
                            } else {
                              obj.value.push('  ' + element.value + ',');
                              obj.id.push(element.id);
                            }

                          }
                        });
                      }
                    });
                  } else if (obj.type == "dateTime") {
                    let start = this.datePipe.transform(new Date(new Date(new Date(this.filterObject.DateTimerange.start).setHours(0, 0, 0))).toUTCString(), 'shortDate');
                    let end = this.datePipe.transform(new Date(new Date(new Date(this.filterObject.DateTimerange.end).setHours(0, 0, 0))).toUTCString(), 'shortDate');
                    obj.value = start + " - " + end;
                  } else if (obj.type == "date") {
                    let start = this.datePipe.transform(new Date(new Date(new Date(this.filterObject.range.start).setHours(0, 0, 0))).toUTCString(), 'shortDate');
                    let end = this.datePipe.transform(new Date(new Date(new Date(this.filterObject.range.end).setHours(0, 0, 0))).toUTCString(), 'shortDate');
                    obj.value = start + " - " + end;
                  } else {
                    obj.value = ele[item];
                  }
                }
              });
            }
            this.tagList.push(obj);
          })
        }
      })
    }
  }

  closeModal() {
    this.dialogRef.close(false);
  }

  getFiltersDetails(id?) {
    this.tableService.defaultFilterSelected(id).subscribe((re: any) => {
      if (re.statusCode == 200) {
        console.log(re);
      } else {
        this.toastrService.danger(re.message);
      }
    })
  }

  saveActions() {
    if (this.tagList.length > 0 && this.filterName) {
      let filterObj = {
        name: this.filterName,
        // filters: this.filterObject.filterKey,
        tableId: this.tableData._id,
        tableFields: 'name',
        tagList: this.tagList,
        isDefault: this.defaultCheck,
        viewCompletedRecords: this.viewCompletedRecords,
        filterObject: this.filterObject
      };
      if (!this.editFlag) {
        this.tableService.addDefaultFilter(filterObj).subscribe((re: any) => {
          if (re.statusCode == 200) {
            this.toastrService.success(re.message);
            this.dialogRef.close();
          } else {
            this.toastrService.danger(re.message);
          }
        })
      } else {
        filterObj['id'] = this.itemData?._id
        this.tableService.updateDefaultFilter(filterObj).subscribe((re: any) => {
          if (re.statusCode == 200) {
            this.toastrService.success(re.message);
            this.dialogRef.close();
          } else {
            this.toastrService.danger(re.message);
          }
        })
      }
      // localStorage.setItem('filters', JSON.stringify(filterObj));
    }
    // this.toastrService.danger("Fill all required fields")
  }

  viewClosedEvent($e: MatSlideToggleChange) {
    this.viewCompletedRecords = $e.checked ? true : false;
  }

  changeMarkDefault(e) {
    this.defaultCheck = e;
  }

  getDataForFilterObject(event) {
    this.filterObject = event;
    this.cdr.detectChanges();
    this.createTagList();
  }
}
