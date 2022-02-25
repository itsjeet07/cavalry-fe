import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from '@app/shared/services/helper.service';
import { MessageService } from '@app/shared/services/message.service';
import { TableService } from '@app/shared/services/table.service';
import { NgPluralizeService } from 'ng-pluralize';

@Component({
  selector: 'ngx-lookup-modal-detail',
  templateUrl: './lookup-modal-detail.component.html',
  styleUrls: ['./lookup-modal-detail.component.scss']
})
export class LookupModalDetailComponent implements OnInit {

  loading = true;
  @Input() viewInModal;
  @Output() viewEmit = new EventEmitter();
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
  @Input() tableData = [];
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
  viewIcon = true;
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
  currentUser;
  constructor(
    private tableService: TableService,
    private helperService: HelperService,
    private pluralizeService: NgPluralizeService,
    private messageService: MessageService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    if (this.fromRecord) {
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

    this.viewIcon = this.tableData.map(ele=>ele.tableName).includes(this.tableInfo.tableName);
  }

  getTableData() {
    this.tableService.getRelatedDataById(this.tableInfo.tableName, this.tableInfo.tableId, this.tableInfo.resourceId).subscribe(
      (res: any) => {
        if (res.statusCode == 200 && res.data) {
          this.clientData = res.data;
          this.orderedArray = this.helperService.sortObject(res.data.tableColumns, 'displayPriority');
          this.setProfileData(res.data);
          this.loading = false;
        }
      },
    );
  }

  setProfileData(data) {
    this.profileData = [];
    this.orderedArray.forEach(ele => {
      let dataName = '';

      if (ele.type == 'lookup') {
        let r = data.lookup.find(lk => lk.lookupDataName === ele.name);
        dataName = r ? r.lookupName : '';
      } else {
        dataName = data[ele.name];
      }

      if (dataName && this.isNotObject(dataName) && ele.idField) {
        if (ele.name !== "firstName" && ele.name !== "lastName") {

          const arr = {
            label: ele.label,
            name: ele.name,
            value: ele.type == 'lookup' ? dataName : data[ele.name],
            type: ele.type,
            icon: ele.icon
          };
          if(this.matchPattern(arr.value)){
            arr.type = "email";
          }
          this.profileData.push(arr);
        }
      }
    });
  }

  matchPattern(value): boolean{
    const pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !!pattern.test(value);
  }

  isNotObject(val) {
    return typeof (val) !== 'object';
  }


  mentionRedirect() { 
    if (this.clientData) {
      let user_id = this.clientData._id;
      let user_name = this.clientData.firstName + '' + this.clientData.lastName;
      const redirectFromMentionObj = {
        avatar: null,
        displayName: user_name,
        email: "",
        id: user_id,
        participantType: 0,
        status: 3,
        totalUnreadCount: 0,
      };

      this.messageService.redirectionFromMentionObj.next(
        redirectFromMentionObj
      );
    }
  }

  onShowLookupDetail() {

      this.router.navigate(['pages/tables/dynamic/' + this.tableInfo.tableId + '/' + this.tableInfo.tableName + '/' + this.tableInfo.resourceId]);

  }
}
