import { Component, Input, OnInit, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { DynamicFormDialogComponent } from '@app/shared/components/dynamic-form-dialog/dynamic-form-dialog.component';
import { DynamicFormDialogNewDesignComponent } from '@app/shared/components/dynamic-form-dialog-new-design/dynamic-form-dialog-new-design.component';
import { NbDialogService } from '@nebular/theme';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'ngx-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit,OnChanges {

  @Input() lookupRelateData;
  @Input() overview;
  @Input() tableDataFromViewToForm;
  @Input() tableName;
  @Input() tempParentTableHeader;
  @Input() clientData;
  @Input() tableInfo;
  @Input() showChats;
  @Input() subscriptionText;
  @Input() subscribers;
  @Input() isSelfSubscribed;
  @Input() renderAt;
  @Output() emitLookupId = new EventEmitter();
  lookupArray = [];
  otherDataKeys = [];
  constructor(private router: Router, private dialogService: NbDialogService, private datePipe: DatePipe) { }

  ngOnChanges(simpleChanges:SimpleChanges){

    if(simpleChanges.lookupRelateData && simpleChanges.lookupRelateData.currentValue){
      this.lookupRelateData = simpleChanges.lookupRelateData.currentValue;
    }
    
    this.ngOnInit();

  }


  ngOnInit(): void {

    if (this.overview && this.overview.length) {
      this.overview.forEach(element => {
        let table = this.tableDataFromViewToForm.filter(v => v.tableName == element.tableName);
        if (table && table.length) {
          let mainTable = this.lookupRelateData.filter(a => a[0] == table[0].tableName);

          if (mainTable && mainTable.length) {
            element["tableName"] = table[0].tableName;

            let idFields = table[0].columns.filter(val => val.idField ? val.name : '');
            let displayInListFields = table[0].columns.filter(val => !val.idField && val.displayInList ? val.name : '');
            let statusField = table[0].columns.find(val => val.type == 'status' ? val.name : '');
            let statusColors = [];

            if (statusField) {
              statusColors = statusField.statusOptions;
              statusField = statusField.name;

            }

            if (idFields && idFields.length) {
              idFields = idFields.map(v => v.name);
            }

            if (displayInListFields && displayInListFields.length) {
              displayInListFields = displayInListFields.map(v => v.name);
            }

            let finalObject = [];
            if (mainTable && mainTable.length && mainTable[0][1].getRecords && mainTable[0][1].getRecords.length) {
              mainTable[0][1].getRecords.forEach(item => {
                let valueObj = {
                  idField: [],
                  others: [],
                  status: '',
                  statusColor: ''
                }
                let idFieldValue = [];
                let otherFieldValue = [];
                let statusVal = '';
                let statusColor = '';

                let keys = Object.keys(item);
                if (keys) {
                  keys.forEach(val => {
                    if (idFields.includes(val)) {
                      if (item[val] && typeof (item[val]) !== 'object') {
                        let field = table[0].columns.filter(ant => val == ant.name);
                        if (field[0].type == 'date') {
                          item[val] = this.datePipe.transform(item[val], "short");
                        }
                        idFieldValue.push(' ' + item[val]);
                      }
                    } else if (displayInListFields.includes(val)) {
                      if (item[val] && typeof (item[val]) !== 'object') {
                        let field = table[0].columns.filter(ant => val == ant.name);
                        if (field[0].type == 'date') {
                          item[val] = this.datePipe.transform(item[val], "short");
                        }
                        otherFieldValue.push(' ' + item[val]);
                      }
                    }

                    if (statusField == val) {
                      statusVal = item[val]
                      statusColor = statusColors.find(s => s.status = item[val]).color
                    }
                  })
                }

                valueObj.idField = idFieldValue;
                valueObj.others = otherFieldValue;
                valueObj.status = statusVal;
                valueObj.statusColor = statusColor ? statusColor : '';
                finalObject.push(valueObj);
              });
            }
            element["value"] = finalObject;
          }
        }
      });
    }


  }


  redirectToListing(tableName) {

    let table = this.tableDataFromViewToForm.filter(v => v.tableName == tableName);
    let lookups = table[0].columns.filter(v => v.type == 'lookup');

    let oneLookup = lookups.filter(v => v.lookupTableName == this.tableName)

    let navigationExtras: NavigationExtras = {
      queryParams: { [oneLookup[0].name]: this.renderAt, fromOverview: true, lookupTableName: this.tableName },
    };

    // Navigate to the login page with extras
    this.router.navigate(['/pages/tables/' + tableName], navigationExtras);
  }


  actions = [];
  recordGadgets = [];
  customValidations = [];
  formHeight;
  formWidth;
  fieldAlignment;
  subFormLookupIds = [];
  tableRecordTypes = [];
  taskRecordTypes = [];
  recordTypeFieldName;
  recordTypes = [];
  recordType = '';

  openForm(tableName) {

    let table = this.tableDataFromViewToForm.filter(v => v.tableName == tableName)[0];
    if (this.tableDataFromViewToForm && this.tableDataFromViewToForm.length) {
      this.tableDataFromViewToForm.forEach(ele => {
        if (ele && ele.columns && ele.columns.length) {
          this.getRecordType(Object.assign([], ele.columns), ele.tableName);
        } else {
          this.tableRecordTypes[ele.tableName] = [];
        }
      });
    }

    let copytempParentTableHeader = Object.assign([], table.columns);
    copytempParentTableHeader.map((column) => {
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
      // this.tableIcon = table.iconLocation;
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
        closeOnEsc: true,
        context: {
          title: tableName,
          form: table.columns,
          button: { text: 'Save' },
          tableName: table.tableName,
          Data: null,
          action: 'Add',
          tableDataForForms: this.tableDataFromViewToForm,
          recordType: this.recordType,
          recordTypeFieldName: this.recordTypeFieldName,
          // tableIcon: this.tableIcon,
          actions: this.actions,
          customValidations: this.customValidations,
          // parentSourceId: this.renderAt,
          parentTableName: this.tableName,
          parentTableData: this.clientData,
          lookUpNameId: this.renderAt,
          lookUpName: this.tableName.slice(0, -1).toLowerCase(),
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
            this.emitLookupId.emit();
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
          tableDataForForms: this.tableDataFromViewToForm,
          tableRecordTypes: this.tableRecordTypes,
          actions: this.actions,
          customValidations: this.customValidations,
        },
      }).onClose.subscribe(name => {

      });
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
