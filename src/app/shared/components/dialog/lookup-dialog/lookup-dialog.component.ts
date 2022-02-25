import { AfterViewInit, Component, Input, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { columnRequest } from '@app/shared/interfaces/table';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';
import { MapFieldDialogComponent } from '../map-field-dialog/map-field-dialog.component';

@Component({
  selector: 'ngx-lookup-dialog',
  templateUrl: './lookup-dialog.component.html',
  styleUrls: ['./lookup-dialog.component.scss'],
})
export class LookUpDialogComponent implements AfterViewInit {
  @Input() tableData = [];
  @Input() tableId = '';
  @Input() fields = [];
  @Input() fieldNames = [];
  @Input() isLookupRepPrimaryObject = false;
  @Input() currentTableData = [];
  @Input() mappedFields;
  @Input() filters;
  currentTable = [];
  tableName;
  options = [];
  values = [];
  columnList: columnRequest[] = [];
  selectedColumnId = [];
  selectedColumnName = [];
  mapField;
  constructor(
    protected ref: NbDialogRef<LookUpDialogComponent>,
    private cdr: ChangeDetectorRef,
    private dialogService: NbDialogService,

  ) {
  }

  ngAfterViewInit(): void {
    if (this.tableId) {
      const tableDetail = this.tableData.find(x => x._id == this.tableId);
      this.columnList = tableDetail.columns;
      this.currentTable = tableDetail.columns;
      if (this.fields) {
        this.selectedColumnId = this.fields;
      }
      this.tableName = tableDetail.tableName;
      if (this.selectedColumnName) {
        this.selectedColumnName = this.fieldNames;
      }
    }
    this.cdr.detectChanges();
  }

  onCheck(id, name) {

    if (!this.selectedColumnName) {
      this.selectedColumnName = [];
    }

    if (!this.selectedColumnId) {
      this.selectedColumnId = [];
    }

    if (this.selectedColumnId && this.selectedColumnId.includes(id)) {
      const index = this.selectedColumnId.indexOf(id);
      if (index > -1) {
        this.selectedColumnId.splice(index, 1);
      }
    } else {
      this.selectedColumnId.push(id);
    }

    if (this.selectedColumnName && this.selectedColumnName.includes(name)) {
      const index = this.selectedColumnName.indexOf(name);
      if (index > -1) {
        this.selectedColumnName.splice(index, 1);
      }
    } else {
      this.selectedColumnName.push(name);

    }

  }

  onChange(event) {
    this.tableId = event;
    this.selectedColumnId = [];
    this.selectedColumnName = [];
    this.columnList = this.tableData.find(x => x._id == event).columns;
    this.tableName = this.tableData.find(x => x._id == event).tableName;

    this.mappedFields = {};
  }

  filter(){
    const lookUpData = {
      lookupData: this.columnList,
      currentTableData: this.currentTableData,
      filters: this.filters
    };
    this.dialogService.open(FilterDialogComponent, {
      context: lookUpData,
    })
      .onClose.subscribe(data => {
        if (data) {
          this.filters = data;
        }
      })
  }

  mapFields(){
    const lookUpData = {
      lookupData: this.columnList,
      currentTableData: this.currentTableData,
      mappedFields: this.mappedFields
    };
    this.dialogService.open(MapFieldDialogComponent, {
      context: lookUpData,
    })
      .onClose.subscribe(data => {
        if (data) {
          this.mapField = data;
        }
      })
  }

  cancel() {
    this.ref.close();
  }

  submit() {
    const data = {
      tableId: this.tableId,
      columnId: this.selectedColumnId,
      columnName: this.selectedColumnName,
      tableName: this.tableName,
      isPrimary: this.isLookupRepPrimaryObject,
      mappedFields: this.mapField,
      filters: this.filters
    };
    this.ref.close(data);
  }
}
