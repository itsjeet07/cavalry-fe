import { Component, Input, OnInit } from '@angular/core';
import { TableService } from '@app/shared/services/table.service';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { DynamicFormDialogNewDesignComponent } from '../dynamic-form-dialog-new-design/dynamic-form-dialog-new-design.component'
import { DynamicFormDialogComponent } from '../dynamic-form-dialog/dynamic-form-dialog.component';

@Component({
  selector: 'ngx-add-ref',
  templateUrl: './add-ref.component.html',
  styleUrls: ['./add-ref.component.scss']
})
export class AddRefComponent implements OnInit {


  searchString;
  showDataFlag = false;
  timeout;
  finalArray = [];
  @Input() fieldsData;
  @Input() tableName;
  @Input() list = [];
  @Input() tableDataForForms;
  resData = [];
  placehold = '';
  count = 0;
  loading = false;
  lookupArray = [];
  lookupTableName = [];
  otherDataKeys = [];
  lookupList = [];
  constructor(protected ref: NbDialogRef<AddRefComponent>,
    private tableService: TableService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,) { }

  ngOnInit(): void {
    this.getTableDetails();
  }

  close() {
    this.ref.close(false);
  }

  getTableDetails() {

    let lookupfields = this.fieldsData.filter(f => f.type == "lookup");
    if (lookupfields && lookupfields.length) {
      lookupfields.forEach((element, i) => {
        if (element.isReference) {

          this.lookupArray.push(element);

          if (lookupfields.length == 1) {
            this.placehold = this.placehold + element.label;
          }
          else if (lookupfields.length != 1 && i == lookupfields.length - 1) {
            this.placehold = this.placehold + element.label;
          }
          else {
            this.placehold = this.placehold + element.label + ', ';
          }
        }
      });
    }

    if (this.lookupArray && this.lookupArray.length) {
      this.lookupArray.forEach(ele => {
        this.lookupTableName.push(ele.lookupTableName);
        this.otherDataKeys.push({ name: ele.name, value: ele.lookupTableFieldNames });
      });
    }

    // console.log(this.placehold);
  }

  getData(value, event) {

    this.count = 0;

    if (value) {
      if (event.keyCode == 13) {
        this.loading = true;

        // let val = [];
        // val = this.fieldsData.map(f => f.idField ? f.name : '');

        this.tableService.getSearchDataForRef(this.tableName, value).subscribe((res: any) => {
          if (res.data) {
            this.resData = res.data;
            console.log(this.resData);
            this.finalArray = [];
            this.resData.forEach(item => {

              let refLookupIdFields = [];
              let refLookupField = this.lookupArray.filter(f => f.name == item.name);
              if (refLookupField && refLookupField.length) {
                let refLookTable = refLookupField[0].lookupTableName;
                let response = this.tableDataForForms.filter(ele => ele.tableName == refLookTable);
                if (response && response.length) {
                  refLookupIdFields = response[0].columns.map(v => v.idField ? v.name : '');
                }

              }

              if (item.value && item.value.length) {
                let obj = {};
                obj["name"] = item.name;
                obj["value"] = [];
                obj["lookupTableName"] = refLookupField[0].lookupTableName;
                item.value.forEach(v => {
                  let valueObj = {
                    idField: [],
                    others: [],
                    id: null,
                    val:null
                  }
                  let arrayForId = [];
                  let arrForOther = [];
                  let keys = Object.keys(v);
                  let valueofOther = this.otherDataKeys.filter(valueELe => {
                    if (valueELe.name == item.name) {
                      return true;
                    }
                  });
                  if (keys) {
                    keys.forEach(element => {
                      if (refLookupIdFields.includes(element)) {
                        if (typeof (v[element]) !== 'object')
                          arrayForId.push(' ' + v[element]);
                      }
                      if (valueofOther && valueofOther.length) {
                        if (valueofOther[0].value.includes(element)) {
                          arrForOther.push(' ' + v[element]);
                        }
                      }
                    })
                  }
                  valueObj.id = v._id;
                  valueObj.idField.push(arrayForId);
                  valueObj.others.push(arrForOther);
                  valueObj.val = v;
                  obj["value"].push(valueObj);
                  this.count++;

                })
                this.finalArray.push(obj);
                this.loading = false;
              }
            })
            this.showDataFlag = true;
          }
          this.loading = false;
        });
      }
    } else {
      this.showDataFlag = false;
    }
  }

  setData(val, ele) {

    let invalid = false;
    let temp = [];
    let obj = {
      name: '',
      value: [],
      lookupTableName: ''
    }
    obj.name = ele["name"];
    obj.lookupTableName = ele["lookupTableName"];
    obj.value.push(val);
    temp.push(obj);
    if (this.list && this.list.length) {

      this.list.forEach(ele => {
        if (ele.name == obj.name) {
          let field = this.fieldsData.filter(v => v.name.toLowerCase() == obj.name.toLocaleLowerCase());
          if (field && field.length) {
            if (field[0].allowMultipleValues) {
              if (!ele.value.includes(val)) {
                ele.value.push(val);
                invalid = true;
                return;
              }
              else {
                this.toastrService.warning("Value already selected", "Exist");
                invalid = true;
              }

            }
            else {
              this.toastrService.warning("Field is not MultiSelect", "Exist");
              invalid = true;
            }
          }
        }
      })
      if (!invalid) {
        this.list.push(obj);
        this.ref.close(this.list);
      }
      else {
        this.ref.close(this.list);
      }
    }
    else {
      this.list = temp;
      this.ref.close(this.list);
    }

  }

  actions = [];
  recordGadgets = [];
  showChats;
  customValidations = [];
  formHeight;
  formWidth;
  fieldAlignment;
  subFormLookupIds = [];
  tableRecordTypes = [];
  taskRecordTypes = [];
  tempParentTableHeader;
  recordTypeFieldName;
  recordTypes = [];
  recordType = '';
  tableIcon;
  refFlag = true;
  lookupSeelcted = "1";
  selectedName;

  addRef(){
    this.refFlag = true;
  }

  setValue(val) {
    this.lookupSeelcted = val.lookupTableName;
    this.selectedName = val.name;
    this.openLookupForm();
  }
  openLookupForm() {

    if (this.lookupSeelcted) {
      let tableName = this.lookupSeelcted;
      let table = this.tableDataForForms.filter(v => v.tableName == tableName)[0];
      console.log(table);
      if (this.tableDataForForms && this.tableDataForForms.length) {
        this.tableDataForForms.forEach(ele => {
          if (ele && ele.columns && ele.columns.length) {
            this.getRecordType(Object.assign([], ele.columns), ele.tableName);
          } else {
            this.tableRecordTypes[ele.tableName] = [];
          }
        });
      }

      this.tempParentTableHeader = Object.assign([], table.columns);
      this.tempParentTableHeader.map((column) => {
        if (column.type == 'recordType') {
          this.recordTypeFieldName = column.name;
          column.options.forEach(element => {
            const obj = {
              title: element,
            };
            this.recordTypes.push(obj);
          });
        }
      });
      this.actions = table.actions ? table.actions : [];
      this.subFormLookupIds = table.subFormLookups ? table.subFormLookups : [];
      this.recordGadgets = table.recordGadgets ? table.recordGadgets : [];
      if (table.hasOwnProperty('showChats')) {
        this.showChats = table.showChats;
      }
      this.customValidations = table.customValidations ? table.customValidations : [];
      if (table.iconLocation) {
        this.tableIcon = table.iconLocation;
      }
      if (table.formHeight) {
        this.formHeight = table.formHeight;
      }
      if (table.formWidth) {
        this.formWidth = table.formWidth;
      }
      if (table.fieldAlignment) {
        this.fieldAlignment = table.fieldAlignment;
      }


      if (this.subFormLookupIds.length == 0) {
        const ref = this.dialogService.open(DynamicFormDialogNewDesignComponent, {
          closeOnEsc: false,
          context: {
            title: tableName,
            form: table.columns,
            button: { text: 'Save' },
            tableName: table.tableName,
            Data: null,
            action: 'Add',
            tableDataForForms: this.tableDataForForms,
            recordType: this.recordType,
            recordTypeFieldName: this.recordTypeFieldName,
            // tableIcon: this.tableIcon,
            actions: this.actions,
            customValidations: this.customValidations,
            tableRecordTypes: this.tableRecordTypes,
            recordGadgets: this.recordGadgets,
            showChats: this.showChats,
            tableId: table._id,
            formHeight: this.formHeight,
            formWidth: this.formWidth,
            fieldAlignment: this.fieldAlignment,
            recordTypeFlagFromAddNew: true,
            optionRecordType: this.tableRecordTypes[table.tableName]
          },
        }).onClose.subscribe(name => {
          if (name && name.close == 'yes') {
            console.log(name.data);
            let refLookupIdFields = [];
            let refLookupField = this.lookupArray.filter(f => f.name == this.selectedName);
            if (refLookupField && refLookupField.length) {
              let refLookTable = refLookupField[0].lookupTableName;
              let response = this.tableDataForForms.filter(ele => ele.tableName == refLookTable);
              if (response && response.length) {
                refLookupIdFields = response[0].columns.map(v => v.idField ? v.name : '');
              }

            }

            let obj = {};
            obj["name"] = this.selectedName;
            obj["value"] = [];
            obj["lookupTableName"] = refLookupField[0].lookupTableName;

            let valueObj = {
              idField: [],
              others: [],
              id: null
            }
            let arrayForId = [];
            let arrForOther = [];
            let keys = Object.keys(name.data);
            let valueofOther = this.otherDataKeys.filter(valueELe => {
              if (valueELe.name == this.selectedName) {
                return true;
              }
            });
            if (keys) {
              keys.forEach(element => {
                if (refLookupIdFields.includes(element)) {
                  if (typeof (name.data[element]) !== 'object')
                    arrayForId.push(' ' + name.data[element]);
                }
                if (valueofOther && valueofOther.length) {
                  if (valueofOther[0].value.includes(element)) {
                    arrForOther.push(' ' + name.data[element]);
                  }
                }
              })
            }
            valueObj.id = name.data._id;
            valueObj.idField.push(arrayForId);
            valueObj.others.push(arrForOther);
            obj["value"].push(valueObj);
            this.finalArray.push(obj);
            this.showDataFlag = true;
            this.count++;
            this.refFlag = false;
            // this.setData(valueObj,obj);
          } else{
            this.lookupSeelcted = "1";
          }
        });
      } else {
        const ref = this.dialogService.open(DynamicFormDialogComponent, {
          closeOnEsc: false,
          context: {
            title: tableName,
            subFormLookupIds: this.subFormLookupIds,
            form: table.columns,
            button: { text: 'Save' },
            tableName: table.tableName,
            Data: null,
            recordType: this.recordType,
            recordTypeFieldName: this.recordTypeFieldName,
            action: 'Add',
            tableDataForForms: this.tableDataForForms,
            tableRecordTypes: this.tableRecordTypes,
            actions: this.actions,
            customValidations: this.customValidations,
          },
        }).onClose.subscribe(name => {

        });
      }
    }

  }

  getRecordType(cols, tableName) {
    let findRecordType = cols.find(x => x.type == 'recordType');
    if (typeof findRecordType != 'undefined' && findRecordType != 'undefined' && findRecordType !== null) {
      const name = findRecordType.name;
      findRecordType = findRecordType.options;
      const recordArray = [];
      findRecordType && findRecordType.forEach(element => {
        const obj = {
          title: element,
          data: {
            menu: tableName,
            name: name,
          },
        };
        recordArray.push(obj);
        if (tableName == 'Tasks') {
          this.taskRecordTypes.push(obj);
        }
      });
      this.tableRecordTypes[tableName] = recordArray;
    }
  }
}
