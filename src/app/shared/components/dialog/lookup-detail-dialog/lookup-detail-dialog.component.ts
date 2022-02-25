import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { TableService } from '@app/shared/services/table.service';
import { HelperService } from '../../../services/helper.service';
import { NgPluralizeService } from 'ng-pluralize';
import { DynamicFormDialogComponent } from '../../dynamic-form-dialog/dynamic-form-dialog.component';
import { DynamicFormDialogNewDesignComponent } from '../../dynamic-form-dialog-new-design/dynamic-form-dialog-new-design.component';

@Component({
  selector: 'ngx-view-lookup-detail-dialog',
  templateUrl: './lookup-detail-dialog.component.html',
  styleUrls: ['./lookup-detail-dialog.component.scss']
})
export class LookupDetailDialogComponent implements OnInit {

  loading = true;
  @Input() data: any;
  @Input() name: any;
  @Input() tableInfo = {
    tableName: '',
    tableId: '',
    resourceId: '',
    link: ''
  };
  title = '';
  url = '';
  @Input() subFormLookupIds;
  @Input() tempParentTableHeader;
  @Input() recordTypeFieldName;
  @Input() tableData;
  @Input() fromRecord;
  @Input() tableRecordTypes;
  @Input() tableName;
  @Input() tableColumns;
  @Input() dataForLookupDetail;
  @Input() fromFormFlag;
  @Input() dataFromFormPage;
  @Input() resourceIdForForm;
  @Input() tableIdFromForm;
  @Input() tableIdFromView;
  @Input() fromView;

  clientData;
  profileData = [];
  orderedArray = [];
  profileImagePath = 'assets/images/cv-placeholder.png';
  showProfileImage = false;
  profileImageData;
  startPage: Number;
  paginationLimit = 3;
  showLess: boolean;
  showMore: boolean;
  singularTableName = '';

  showMoreItems() {
    this.paginationLimit = Number(this.paginationLimit) + 10;
    this.showLess = true;
  }
  showLessItems() {
    this.paginationLimit = Number(this.paginationLimit) - 10;
    this.showMore = true;
  }

  isProjectable(itemName) {
    const ignoreFields = ['lookupTableName', 'lookupTableId', '_id', '__v', 'isActive'];
    if (ignoreFields.includes(itemName)) {
      return false;
    }
    if (itemName.indexOf('Image') > -1) {
      return false;
    }
    return true;
  }

  constructor(private router: Router,
    protected ref: NbDialogRef<LookupDetailDialogComponent>,
    private tableService: TableService,
    private helperService: HelperService,
    private pluralizeService: NgPluralizeService,
    private dialogService: NbDialogService,

  ) { }

  ngOnInit(): void {

    if (this.fromFormFlag) {
      if (this.tableName && this.tableIdFromForm && this.resourceIdForForm) {
        this.singularTableName = this.pluralizeService.singularize(this.tableName);
        this.tableInfo.resourceId = this.resourceIdForForm;
        this.tableInfo.tableId = this.tableIdFromForm;
        this.tableInfo.tableName = this.tableName;
        this.getData();
      }
    }
    else if (this.fromRecord) {
      if (this.tableInfo && this.tableInfo.tableName) {
        this.singularTableName = this.pluralizeService.singularize(this.tableInfo.tableName);
        this.getTableData();
        return;
      }
      var result = this.name.replace(/([A-Z])/g, " $1");
      var finalResult = result.charAt(0).toUpperCase() + result.slice(1);
      this.title = finalResult.replace(/ .*/, '') + " Details";

      this.tableInfo.tableId = this.data["tableId"];
      this.tableInfo.tableName = this.data["tableName"];
      this.tableInfo.resourceId = this.data["resourceId"];
      this.singularTableName = this.pluralizeService.singularize(this.tableInfo.tableName);
      this.getTableData();
    }
    else if (this.fromView) {
      if (this.tableInfo && this.tableInfo.tableName) {
        this.singularTableName = this.pluralizeService.singularize(this.tableInfo.tableName);
        this.getTableData();
        return;
      }
      var result = this.name.replace(/([A-Z])/g, " $1");
      var finalResult = result.charAt(0).toUpperCase() + result.slice(1);
      this.title = finalResult.replace(/ .*/, '') + " Details";

      this.tableInfo.tableId = this.tableIdFromView;
      this.tableInfo.tableName = this.data["lookupTableName"];
      this.tableInfo.resourceId = this.data["lookupId"];
      this.singularTableName = this.pluralizeService.singularize(this.tableInfo.tableName);
      this.getTableData();
    }
    else {
      if (this.tableInfo && this.tableInfo.tableName) {
        this.singularTableName = this.pluralizeService.singularize(this.tableInfo.tableName);
        this.getTableData();
        return;
      }
      var result = this.name.replace(/([A-Z])/g, " $1");
      var finalResult = result.charAt(0).toUpperCase() + result.slice(1);
      this.title = finalResult.replace(/ .*/, '') + " Details";

      this.tableInfo.tableId = this.data["tableId"];
      this.tableInfo.tableName = this.data["table"];
      this.tableInfo.resourceId = this.data["_id"];
      this.singularTableName = this.pluralizeService.singularize(this.tableInfo.tableName);
      this.getTableData();

    }
  }


  getTableData() {
    this.tableService.getRelatedDataById(this.tableInfo.tableName, this.tableInfo.tableId, this.tableInfo.resourceId).subscribe(
      (res: any) => {
        if (res.statusCode == 200 && res.data) {
          console.log(res);
          this.clientData = res.data;
          this.orderedArray = this.helperService.sortObject(res.data.tableColumns, 'displayPriority');
          this.setProfileData(res.data);


          this.loading = false;

          this.setProfileImage(res.data);
          //   const relatedData = res.data.relatedData;
          // this.getTableByName(this.tableName);

          //   if (relatedData) {

          //     Object.keys(relatedData).forEach(key => {
          //       this.getTableByName(key);
          //     });
          //     // this.setRecordTypesForRelatedTables(res.data.relatedData);

          //     if (relatedData.Tasks) {
          //       relatedData.Tasks.reverse();
          //     }
          //     setTimeout(() => {
          //       this.pageLoaded = true;
          //     }, 500);
          //   }

          //   // -- Set Group chat title
          //   this.setGroupChatTitle(res);
          //   this.setTableInfo();
        }
      },
    );
  }

  setProfileData(data) {
    this.profileData = [];
    this.orderedArray.forEach(ele => {
      const dataName = data[ele.name];
      if (dataName && this.isObject(dataName) && ele.idField) {
        const arr = {
          label: ele.label,
          name: ele.name,
          value: data[ele.name],
          type: ele.type,
        };
        this.profileData.push(arr);
      }
    });
  }

  setProfileImage(data) {
    this.profileImagePath = 'assets/images/cv-placeholder.png';
    if (data && data.tableColumns) {
      this.profileImageData = data.tableColumns.find(x => x.type == 'file' && x.isProfileImage);
    }
    if (this.profileImageData) {
      if (data[this.profileImageData.name] != null) {
        this.profileImagePath = data[this.profileImageData.name];
      }
      this.showProfileImage = true;
    }
  }

  isObject(val) {
    return typeof (val) !== 'object';
  }

  cancel() {
    this.ref.close();
  }

  onItemAdded(event) {
    // this.values.push(event.value);
  }

  viewFullDetail(url) {
    this.router.navigate([url]);
    this.ref.close();
  }

  submit() {
    // this.options.forEach(elements => {
    //   this.values.push(elements.value);
    // });
    this.ref.close();
  }

  editData() {

    let title: string;

    title = 'Edit ' + this.tableName;

    // this.ref.close({ close: 'yes' });

    if (this.subFormLookupIds && this.subFormLookupIds.length) {
      this.dialogService.open(DynamicFormDialogComponent, {
        closeOnEsc: false,
        context: {
          title: title,
          subFormLookupIds: this.subFormLookupIds,
          form: this.tempParentTableHeader,
          button: { text: 'Update' },
          tableName: this.tableName,
          Data: this.dataForLookupDetail,
          recordTypeFieldName: this.recordTypeFieldName,
          action: 'Edit',
          mainTableData: this.tableData,
          tableRecordTypes: this.tableRecordTypes
        },
      })
        .onClose.subscribe(name => {
          if (name && name.close == 'yes') {
            this.ref.close({ close: "yes" });
          }
        });
    }
    else {
      this.dialogService.open(DynamicFormDialogNewDesignComponent, {
        closeOnEsc: false,
        context: {
          title: title,
          subFormLookupIds: this.subFormLookupIds,
          form: this.tempParentTableHeader,
          button: { text: 'Update' },
          tableName: this.tableName,
          Data: this.dataForLookupDetail,
          recordTypeFieldName: this.recordTypeFieldName,
          action: 'Edit',
          //mainTableData: this.tableData,
          tableRecordTypes: this.tableRecordTypes
        },
      })
        .onClose.subscribe(name => {
          if (name && name.close == 'yes') {
            this.ref.close({ close: "yes" });
          }
        });
    }


  }

  getData() {
    this.clientData = this.dataForLookupDetail;
    this.orderedArray = this.helperService.sortObject(this.tableColumns, 'displayPriority');
    this.setProfileData(this.dataForLookupDetail);


    this.loading = false;

    this.setProfileImage(this.dataForLookupDetail);
  }

}
