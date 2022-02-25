import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ColumnDateTimeDialogComponent } from '@app/shared/components/dialog/column-date-time-dialog/column-date-time-dialog.component';
import { ColumnOptionDialogComponent } from '@app/shared/components/dialog/column-option-dialog/column-option-dialog.component';
import { LookUpDialogComponent } from '@app/shared/components/dialog/lookup-dialog/lookup-dialog.component';
import { tableRequest } from '@app/shared/interfaces/table';
import { MapService } from '@app/shared/services/map.service';
import { TableService } from '@app/shared/services/table.service';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import * as _ from 'lodash';
import { ColumnStatusComponent } from '../../../shared/components/dialog/column-status-dialog.component.ts/column-status-dialog.component';

@Component({
  selector: 'ngx-add-edit-column-in-dialog',
  templateUrl: './add-edit-column-in-dialog.component.html',
  styleUrls: ['./add-edit-column-in-dialog.component.scss'],
})
export class AddEditColumnInDialogComponent implements OnInit {

  @Input() items: any;
  @Input() tableName = '';
  allTableData: tableRequest[];
  myform: FormGroup;
  imageSrc: string;
  iconData: any;
  loading = false;
  tableId = '';

  constructor(
    private fb: FormBuilder,
    private dialogService: NbDialogService,
    private tableService: TableService,
    protected ref: NbDialogRef<ColumnOptionDialogComponent>,
    private toastrService: NbToastrService,
    private mapService: MapService,
  ) { }

  ngOnInit(): void {
    this.getAllTableData();
    this.setForm();
    this.getItems();
    // this.getDetails('10001');
  }

  getItems() {
    if (this.items) {
      this.patchValue(this.items);
    }
  }

  patchValue(column) {

    this.myform.patchValue({
      _id: column._id,
      label: column.label,
      type: column.type,
      isRequired: column.isRequired,
      displayPriority: column.displayPriority,
      isSearchable: column.isSearchable,
      name: column.name,
      section: column.section,
      displayInList: column.displayInList,
      options: column.options,
      statusOptions: column.statusOptions,
      dateTimeOptions: column.dateTimeOptions,
      fieldSize: column.fieldSize,
      lookupTableId: column.lookupTableId,
      lookupTableFields: column.lookupTableFields,
      tableId: column.tableId,
      lookupTableName: column.lookupTableName,
      isLookupRepPrimaryObject: column.isLookupRepPrimaryObject,
      displayInTreeTable: column.displayInTreeTable,
      allowMultipleValues: column.allowMultipleValues,
      idField: column.idField,
      isWorkFlowField: column.isWorkFlowField,
      loadAsDropDown:column.loadAsDropDown,
      recordHistory: column.recordHistory,
      lookupTableFieldNames: column.lookupTableFieldNames,
      tableName: column.tableName,
      displayInRelatedPageView: column.hasOwnProperty('displayInRelatedPageView')
        ? column.displayInRelatedPageView : true,
        defaultOptionValue:column.defaultOptionValue,
    });
  }

  getAllTableData() {
    this.tableService.getTable().subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.allTableData = res.data;
      }
    });
  }

  // getDetails(zip) {
  //   let lat;
  //   let lng;
  //   const geocoder = new google.maps.Geocoder();
  //   geocoder.geocode({ 'address': zip }, function (results, status) {
  //     if (status == google.maps.GeocoderStatus.OK) {
  //       console.log(results);
  //       // geocoder.geocode({ 'latLng': results[0].geometry.location }, function (results, status) {
  //       //   if (status == google.maps.GeocoderStatus.OK) {
  //       //     if (results[1]) {
  //       //       const loc = this.getCityState(results);
  //       //       console.log(loc);
  //       //     }
  //       //   }
  //       // });
  //     }
  //   });
  // }

  // getCityState(results) {
  //   const a = results[0].address_components;
  //   let city, state;
  //   for (let i = 0; i < a.length; ++i) {
  //     const t = a[i].types;
  //     if (this.compIsType(t, 'administrative_area_level_1'))
  //       state = a[i].long_name; // store the state
  //     else if (this.compIsType(t, 'locality'))
  //       city = a[i].long_name; // store the city
  //   }
  //   return (city + ', ' + state);
  // }

  // compIsType(t, s) {
  //   for (let z = 0; z < t.length; ++z)
  //     if (t[z] == s)
  //       return true;
  //   return false;
  // }

  onFieldLabelChange(value: string) {
    if (!this.myform.value._id) {
      const uniqueName = _.camelCase(value);
      if (this.checkDuplicateName(uniqueName)) {
        this.myform.get('name').setValue(uniqueName);
      }
    }
  }

  checkDuplicateName(value) {
    let valid = true;
    this.items.tableItems.forEach(result => {
      const name = result.name;
      if (valid && name) {
        if (value == name) {
          valid = false;
          this.myform.get('label').setErrors({ 'duplicate': true });
          this.myform.get('name').setValue('');
        }
      }
    });
    return valid;
  }

  showAddButton() {
    const value = ['dropdown', 'checkbox', 'radio', 'lookup', 'recordType', 'status'];
    const type = this.myform.controls.type.value;
    if (value.includes(type)) {
      return true;
    } else {
      return false;
    }
  }

  showAddDateButton(){
    const value = ['dateTime','date'];
    const type = this.myform.controls.type.value;
    if (value.includes(type)) {
      return true;
    } else {
      return false;
    }
  }

  setForm() {
    this.myform = this.fb.group({
      tableId: new FormControl(''),
      _id: new FormControl(''),
      label: new FormControl('', Validators.required),
      type: ['', Validators.required],
      isRequired: new FormControl(false),
      displayPriority: new FormControl(''),
      isSearchable: new FormControl(false),
      name: new FormControl('', Validators.required),
      section: new FormControl('default'),
      displayInList: new FormControl(false),
      options: new FormControl(null),
      statusOptions: new FormControl(null),
      dateTimeOptions: new FormControl(null),
      fieldSize: new FormControl('small'),
      lookupTableId: new FormControl(null),
      lookupTableFields: new FormControl(null),
      lookupTableFieldNames: new FormControl(null),
      lookupTableName: new FormControl(null),
      displayInTreeTable: new FormControl(false),
      allowMultipleValues: new FormControl(false),
      idField: new FormControl(false),
      isLookupRepPrimaryObject: new FormControl(false),
      isWorkFlowField: new FormControl(false),
      loadAsDropDown: new FormControl(false),
      recordHistory: new FormControl(false),
      tableName: new FormControl(this.tableName),
      displayInRelatedPageView: new FormControl(true, Validators.required),
      defaultOptionValue:new FormControl(null),
    });
  }

  cancel() {
    this.ref.close();

  }

  submit() {
    this.ref.close(this.myform.value);
    if (this.myform.value._id){
      console.log
      this.updateTable();
    }
    else
      this.createTable();
  }

  createTable() {
    try {
      this.tableService.saveTableColumn(this.myform.value).subscribe(
        (res: any) => {
          if (res.statusCode === 200) {
            this.toastrService.success(res.message);
            this.loading = false;
          } else {
            this.loading = false;
            this.toastrService.danger(res.message);
          }
        },
      );
    } catch (error) {
    }
  }

  updateTable() {
    try {
      this.tableService.updateTableColumn(this.myform.value).subscribe(
        (res: any) => {
          if (res.statusCode === 200) {
            this.toastrService.success(res.message);
            this.loading = false;
            // this.messageCommonService.sendMessage('table');
            // this.router.navigate(['pages/tables/list']);
          } else {
            this.loading = false;
            this.toastrService.danger(res.message);
          }
        },
      );
    } catch (error) {
    }
  }

  addOptions() {
    const type = this.myform.controls.type.value;
    if (type == 'status') {
      this.openAddStatusModal();
    } else if(type == "dateTime" || type == "date"){
      this.openAddDateTimeModal();
    }else if (type != 'lookup') {
      this.openAddOptionsModal();
    }  else {
      this.openLookUpModal();
    }
  }

  openAddStatusModal() {
    const items = this.myform.controls.statusOptions.value;
    this.dialogService.open(ColumnStatusComponent, { context: { items: items } })
      .onClose.subscribe(options => {
        if (options) {
          this.myform.controls.statusOptions.setValue(options);
        }
      });
  }

  openAddOptionsModal() {
    const items = this.myform.controls.options.value;
    this.dialogService.open(ColumnOptionDialogComponent, { context: { items: items,isSelected:this.myform.controls.defaultOptionValue.value} })
      .onClose.subscribe(res => {
        if (res) {
          console.log("rrr",res);
          // (this.myform.controls.columns as FormArray).controls[i].get('options').setValue(res.options);
          (this.myform).get('defaultOptionValue').setValue(res.defaultVal);
          this.myform.controls.options.setValue(res.options);
        }
      });
  }

  openAddDateTimeModal(){
    const dateTimeOptions = this.myform.controls.dateTimeOptions.value;
      let recordType;
      if(this.myform.controls.type.value=="recordType"){
        recordType=this.myform.controls.options.value;
      }

    this.dialogService.open(ColumnDateTimeDialogComponent, { context: {recordType:recordType, dateTimeOptions:dateTimeOptions } })
      .onClose.subscribe(options => {
        if (options) {
           this.myform.controls.dateTimeOptions.setValue(options);
        }
      });

  }



  openLookUpModal() {
    const lookUpTable = this.myform.controls.lookupTableId.value;
    const lookUpFields = this.myform.controls.lookupTableFields.value;
    const lookupTableFieldNames = this.myform.controls.lookupTableFieldNames.value;
    const isLookupRepPrimaryObject = this.myform.controls.isLookupRepPrimaryObject.value;
    this.dialogService.open(LookUpDialogComponent, {
      context:
      {
        tableData: this.allTableData,
        tableId: lookUpTable,
        fields: lookUpFields,
        fieldNames: lookupTableFieldNames,
        isLookupRepPrimaryObject: isLookupRepPrimaryObject,
      },
    })
      .onClose.subscribe(data => {
        if (data) {
          this.myform.controls.lookupTableId.setValue(data.tableId);
          this.myform.controls.lookupTableFields.setValue(data.columnId);
          this.myform.controls.lookupTableFieldNames.setValue(data.columnName);
          this.myform.controls.lookupTableName.setValue(data.tableName);
          this.myform.controls.isLookupRepPrimaryObject.setValue(data.isPrimary);
        }
      });
  }

  get f() { return this.myform.controls; }

}
