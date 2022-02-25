import { DatePipe, Location } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { DeleteDialogComponent } from '@app/shared/components/delete-dialog/delete-dialog.component';
import { InfoDialogComponent } from '@app/shared/components/dialog/info-dialog/info-dialog.component';
import {
  LookupDetailDialogComponent,
} from '@app/shared/components/dialog/lookup-detail-dialog/lookup-detail-dialog.component';
import {
  DynamicFormDialogNewDesignComponent,
} from '@app/shared/components/dynamic-form-dialog-new-design/dynamic-form-dialog-new-design.component';
import { DynamicFormDialogComponent } from '@app/shared/components/dynamic-form-dialog/dynamic-form-dialog.component';
import { NewReminderModalComponent } from '@app/shared/components/new-reminder-modal/new-reminder-modal.component';
import { MessageService } from '@app/shared/services/message.service';
import { TableService } from '@app/shared/services/table.service';
import { environment } from '@env/environment';
import { NbDialogService, NbMenuService, NbSidebarService, NbToastrService } from '@nebular/theme';
import { FilePreviewDialogComponent } from '@shared/components/file-preview-dialog/file-preview-dialog.component';
import { iconList } from '@shared/iconData/iconList';
import { jsPDF } from 'jspdf';
import * as _ from 'lodash';
import { NgPluralizeService } from 'ng-pluralize';
import { NgxLinkifyjsService } from 'ngx-linkifyjs';
import { Subject, Subscription } from 'rxjs';

import { RemindersComponent } from '../reminders/reminders.component';
import { ChatSubscriptionService } from './../../../shared/services/chat-subscription.service';
import { HelperService } from './../../../shared/services/helper.service';

@Component({
  selector: "ngx-dynamic-table-view",
  templateUrl: "./dynamic-table-view.component.html",
  styleUrls: ["./dynamic-table-view.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DynamicTableViewComponent implements OnInit, OnDestroy {
  tableId;
  page = 0;
  tableName;
  tabTitle = "Overview";
  clientData;
  loading = false;
  id;
  singularTableName;
  breadcrumbs = [];
  orderedArray = [];
  profileData = [];
  status = "";
  profileImage;
  profileImagePath = "assets/images/cv-placeholder.png";
  profileImageColor = "";
  showProfileImage = true;
  profileImageData;
  upLoadingImage = false;
  inputFields: string[] = ["password", "number", "text", "email", "currency"];
  doNotRenderFields: string[] = ["_id", "__v", "isActive", "file"];
  tempParentTableHeader = [];
  tempParentTableHeaders = [];
  tableColumnsForView = {};
  parentTableHeader = [];
  documentTemplateList = [];
  recordTypeFieldName: string = '';
  parentTableData = [];
  taskColumns = [];
  canAddNewRecord = true;
  enableEdit: boolean = false;
  singularTab: any;
  droppedFilesOuter: {};
  editRecordType: boolean = false;
  isActive: boolean;
  onDragData: any;
  droppedFiles: string[] = [];
  uploadProgress = 0;
  fileFormData: any = [];
  showArrayData: {};
  taskData: any;
  recordTypes = [];
  recordType: string = '';
  primaryLink: string = null;
  actionSubscription: Subscription;
  taskRecordTypes = [];
  taskRecordType: string = null;
  relatedTableRecordTypes = [];
  isActiveTable = "";
  tableRecordTypes = [];
  pageLoaded = false;
  isDocumentTemplate = false;
  includeTasks = false;
  private routeSub: any;
  tableInfo: any;
  chatOpened = false;
  groupChatTitle = "";
  startPage: Number;
  paginationLimit: any;
  showLess: boolean;
  showMore: boolean;
  lookupRelateData: any = [];
  dataForLookupDetail;
  lookupWithTaskData: [];
  firstTimeRender = true;
  pageRefreshed = true;
  tutorial = "";
  messageCount;
  subscribers = [];
  currentUser = null;
  @Input() uiColor = "#598bff";
  isWatcherOpened = false;
  isSelfSubscribed = false;
  subscriptionText = "Start watching the issue";
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  childResourceId = "";
  statusColorArray = [];
  actionItems = [
    { icon: { icon: "python", pack: "edit" } },
    { icon: { icon: "python", pack: "view" } },
    { icon: { icon: "python", pack: "delete" } },
  ];
  statusOption;
  isPopupOpen = false;
  tableData;
  loadChat = false;
  isTabClick = false;
  parentMessage = true;
  dynamicData: any;
  form: any;
  isDraggedFromParent = false;
  openTasked = [];
  subFormLookupIds: any;
  recordGadgets;
  customValidations;
  showChats;
  lookupData: any = {};
  public actions = [];
  public actionsMenu = [];
  actionsTriggerSubscription: Subscription;
  private destroy$: Subject<void> = new Subject<void>();
  pager: any = {};
  isTodoFlag: boolean = false;
  refreshPageActive = '';
  filterFields: string[] = ['autoNumber', 'file', 'area', 'richTextArea', 'currency'];
  taskedRecordsOnly = false;
  checkboxArray = [];
  showFilterBox = {};
  hideColumn = {};
  filterHide = {};
  filterKey = [];
  searchString: string = null;
  sortObject: any = null;
  showAutocomplete = {};
  canShowClearFilter = {};
  lookupValue = {};
  filteredOptions = {};
  textValue = {};
  model = {};
  isActionRunning = false;
  showNotesTab: boolean = false;
  pageUrlReset: boolean = false;
  relatedFieldObject = {};
  rollUpFields = [];
  selectedListCardId;
  tableDataFromViewToForm;
  tableIcon = "";
  formHeight;
  formWidth;
  fieldAlignment
  customLabelForAddForm = '';
  customLabelForEditForm = '';
  oldData;
  newData;
  parentTableIcon;
  getTableByNameObject = {};
  constructor(
    private chatSubscriptionService: ChatSubscriptionService,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private tableService: TableService,
    private service: NgPluralizeService,
    private helperService: HelperService,
    private toastrService: NbToastrService,
    private nbMenuService: NbMenuService,
    private datePipe: DatePipe,
    private router: Router,
    public linkifyService: NgxLinkifyjsService,
    private changeDetector: ChangeDetectorRef,
    private location: Location,
    private sidebarService: NbSidebarService,
    private messageService: MessageService,
  ) {
    this.currentUser = JSON.parse(localStorage.getItem("userData"));
    // this.tableId = this.route.snapshot.paramMap.get('tableId');
    // this.tableName = this.route.snapshot.paramMap.get('tableName');
    // this.id = this.route.snapshot.paramMap.get('id');

    this.actionsTriggerSubscription = this.nbMenuService
      .onItemClick()
      .subscribe((event) => {
        if (event)
          this.onActionsClick(event);
      });

  }

  checkFlag = false;
  ngOnInit(): void {
    this.dynamicData = this.form;
    this.sidebarService.compact("menu-sidebar");
    this.tableService.getTablesForMenu().subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.tableDataFromViewToForm = res.data;
      }
    });
    this.routeSub = this.route.params.subscribe((params) => {
      if (Object.keys(params).length) {
        this.id = params.id;
        const page = this.route.snapshot.queryParamMap.get('page');
        this.page = (page && Number(page)) || 0;
        this.tableId = params.tableId;
        this.tableName = params.tableName;
        if (params.tabTitle) {
          this.tabTitle = params.tabTitle;
          this.refreshPageActive = params.tabTitle;
        }

        this.pageUrlReset = true;
        if (this.id) {
          this.getTableByName(this.tableName, true);
          this.getTableData();
        }

        if (params.childResourceId) {
          this.childResourceId = params.childResourceId;
        }


        if (this.tableName.endsWith("s" || "S")) {
          this.singularTableName = this.service.singularize(this.tableName);
          //  this.tableNameWithoutS = this.tableName.slice(0, -1);
        } else {
          this.singularTableName = this.tableName;
        }
      }


      this.getTableRecords();
      this.startPage = 0;
      this.paginationLimit = 5;
      this.showMore = true;
      this.isActiveTab(0, "To Do");
      this.loadTutorial();
    });
  }

  ngAfterContentChecked() {
    this.changeDetector.detectChanges();
  }

  getHeaders(value) {
    return value[0]
  }

  testLinkify(item) {
    try {
      this.linkifyService.test(item);
      return true;
    } catch (_e) {
      return false;
    }
  }

  getUrl(item, column) {
    if (!(typeof item == "number") && column.type != "number" && column.type != "richTextArea" && this.testLinkify(item)) {
      return this.linkifyService.linkify(item);
    } else {
      let fractionPoint = column.fraction;
      if (item > 0) {
        if (fractionPoint > 0 || (fractionPoint === 0 && column.isCurrency)) {
          if (column.isCurrency) {
            return "$ " + Number(item).toFixed(fractionPoint);
          } else {
            return Number(item).toFixed(fractionPoint);
          }
        } else {
          if (column.isCurrency) {
            if (!(Number(item) % 1 != 0)) {
              fractionPoint = 2;
              return "$ " + Number(item).toFixed(fractionPoint);
            }
          } else {
            if (!(Number(item) % 1 != 0)) {
              fractionPoint = column.type === "autoNumber" ? 0 : fractionPoint === 0 ? 0 : 2;
              if (fractionPoint === 0) {
                return item;
              }
              return Number(item).toFixed(fractionPoint);
            }
          }
        }
      } else {
        return item;
      }
    }
  }

  loadTutorial() {
    const query = `tutorialFor=Record&tableName=${this.tableName}`;
    this.tableService.getTutorials(query).subscribe((res: any) => {
      if (res.data) {
        this.tutorial = res.data;
      }
    });
  }

  setTableInfo() {
    let clientName = "";
    if (this.clientData && this.clientData.name) {
      clientName = this.clientData.name;
    }
    this.tableInfo = {
      resourceId: this.id,
      tableId: this.tableId,
      tableName: this.tableName,
      resourceName: this.groupChatTitle,
    };
    this.loadSubscribers();
  }

  getTableRecords() {
    const that = this;
    this.actionSubscription = this.nbMenuService
      .onItemClick()
      .subscribe(function (event) {
        if (
          event &&
          event.item &&
          event.item.data &&
          that.tableRecordTypes[event.item.data.menu]
        ) {
          that.tableRecordTypes[event.item.data.menu].forEach(function (rc) {
            if (rc.title == event.item.title) {
              that.taskRecordType = rc.title;
              that.addNewLookUp(event.item.data);
            }
          });
        }
      });
  }

  isActiveChatTab() {
    return false;
  }

  onActionsClick(event, actionObj?) {


    let action1;
    if (actionObj) {
      action1 = actionObj;
    }
    else {
      if (event.item.title) {
        action1 = this.actions.find(

          (f) => f.actionName == event.item.title.toString()
        );
      }
    }



    if (!action1) return;

    let $Table = this.clientData ? this.clientData : this.oldData ? this.oldData : '';
    let $Form = this.newData ? this.newData : '';
    let $Token = localStorage.getItem("userToken");
    let $api = `${environment.apiUrl}`

    if (!eval(action1.displayCondition)) {

      if (action1.onSave == 'yes') {
        return;
      }

      let notAvilableMessage = 'This action is not available on this record';
      let notAvilableMessageColr = '';

      if (Array.isArray(action1.actionNotAvailable)) {
        action1.actionNotAvailable.forEach((action) => {
          if (eval(action.condition)) {
            notAvilableMessage = action.message;
            notAvilableMessageColr = action.color;
          }
        });
      } else {
        notAvilableMessage = action1.actionNotAvailable;
      }

      this.dialogService.open(InfoDialogComponent, {
        context: {
          text: notAvilableMessage,
          title: 'Action not available',
        },
      });
      return;
    }

    if (action1.warningMessage) {
      this.dialogService
        .open(ConfirmDialogComponent, {
          context: {
            actionObj: action1,
            title: action1.actionName,
            warningMessage: action1.warningMessage,
            text: "",
            actionFlag: true,
            warningColor: action1.warningMessageColor,
          },
        })
        .onClose.subscribe((column) => {
          if (column) {
            this.isActionRunning = true;
            this.pageLoaded = false;
            let that = this;

            //-- Perform action
            this.tableService
              .actionPerform(eval(action1.actionUrl))
              .subscribe(
                (res) => {
                  if (res) { }
                  (error) => { }
                });

            //-- Set timeout according to waitTime field
            setTimeout(() => {
              //-- Refresh page..

              that.ngOnInit();

              setTimeout(() => {

                let $Table = that.clientData ? that.clientData : that.oldData ? that.oldData : '';
                let $Form = that.newData ? that.newData : '';
                this.pageLoaded = true;

                if (action1.messageList && action1.messageList.length > 0) {
                  for (let k = 0; k < action1.messageList.length; k++) {
                    if (eval(action1.messageList[k].condition)) {
                      this.loading = false;

                      if (action1.messageList[k].message) {
                        this.toastrService.show(action1.messageList[k].message,
                          action1.actionName,
                          { status: action1.messageList[k].color.toLowerCase() }
                        );
                      }

                      this.isActionRunning = false
                    }
                  }
                }

              }, action1.waitTime + 3000);


            }, action1.waitTime);

          }

        });

    } else {

      this.isActionRunning = true;
      this.pageLoaded = false;
      let that = this;

      //-- Perform action
      this.tableService
        .actionPerform(eval(action1.actionUrl))
        .subscribe(
          (res) => {
            if (res) { }
            (error) => { }
          });

      //-- Set timeout according to waitTime field
      setTimeout(() => {
        //-- Refresh page..

        that.ngOnInit();

        setTimeout(() => {

          let $Table = that.clientData ? that.clientData : that.oldData ? that.oldData : '';
          let $Form = that.newData ? that.newData : '';
          this.pageLoaded = true;

          if (action1.messageList && action1.messageList.length > 0) {
            for (let k = 0; k < action1.messageList.length; k++) {
              if (eval(action1.messageList[k].condition)) {
                this.loading = false;

                if (action1.messageList[k].message) {
                  this.toastrService.show(action1.messageList[k].message,
                    action1.actionName,
                    { status: action1.messageList[k].color.toLowerCase() }
                  );
                }

                this.isActionRunning = false
              }
            }
          }


        }, action1.waitTime + 3000);

      }, action1.waitTime);

    }

  }

  viewDocument(col) {
    const doc: any = new jsPDF("p", "pt", "letter");

    doc.html(col.event.body, {
      filename: col.event.name,
      callback: (doc) => {
        const fileDialog = this.dialogService.open(FilePreviewDialogComponent, {
          context: {
            Data: doc.output("bloburi"),
            Ext: "bloblUrl",
            filename: col.event.name,
          },
        });

        const formData = new FormData();
        formData.append("file", doc.output("blob"), col.event.name + ".pdf");

        this.tableService.formFileUpload(formData).subscribe((resp: any) => {
          if (resp && resp.body && resp.body.data && resp.body.data[0]) {
            fileDialog.componentRef.instance.saveTo.subscribe((data: any) => {
              this.tableService
                .getTableByName("Files")
                .subscribe((tableres: any) => {
                  const tempParentTableHeader = Object.assign(
                    [],
                    tableres.data[0].columns
                  );
                  const fileType = tableres.data[0].columns.find(
                    ({ type }) => type === "file"
                  );
                  let type = "file";
                  if (fileType && fileType.name) {
                    type = fileType.name;
                  }
                  const res = {
                    data: {
                      relatedTo: data,
                      lookup: [],
                      [type]: [],
                    },
                  };
                  res.data[type].push(resp.body.data[0]);
                  const ref = this.dialogService
                    .open(DynamicFormDialogNewDesignComponent, {
                      closeOnEsc: false,
                      context: {
                        title: "Add New File",
                        //headerDetail: this.headerObj,
                        isForceSave: true,
                        subFormLookupIds: "",
                        form: tempParentTableHeader,
                        button: { text: "Save" },
                        tableName: "Files",
                        Data: res.data,
                        recordType: '',
                        recordTypeFieldName: '',
                        action: "Add",
                        // allow_conditional_commentsmainTableData: [],
                        tableRecordTypes: [],
                        tableIcon: this.tableIcon,
                      },
                    })
                    .onClose.subscribe((name) => { });
                });
            });
          }
        });
      },
    });
  }
  onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.isActive = true;
    console.log("Drag over");
  }
  onDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.isActive = false;
    console.log("Drag leave");
  }
  onDrop(event: any, fieldName) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.droppedFilesOuter) this.droppedFilesOuter = {};
    if (!this.droppedFilesOuter[fieldName])
      this.droppedFilesOuter[fieldName] = [];
    for (let i = 0; i < event.dataTransfer.files.length; i++) {
      this.droppedFilesOuter[fieldName].push(event.dataTransfer.files[i]);
    }
    this.isActive = false;
    this.isDraggedFromParent = true;
    this.addNewLookUp("Files");
  }

  isActiveTab(i, tableName) {
    if (this.isActiveTable.toLowerCase() == tableName.toLowerCase()) {
      return true;
    } else if (i == 0 && this.isActiveTable == "") {
      return true;
    } else {
      return false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.actionSubscription) {
      this.actionSubscription.unsubscribe();
    }
    if (this.routeSub) {
      this.parentMessage = false;
      this.routeSub.unsubscribe();
    }

    if (this.actionsTriggerSubscription) {
      this.actionsTriggerSubscription.unsubscribe();
    }
  }

  showMoreItems() {
    this.paginationLimit = Number(this.paginationLimit) + 10;
    this.showLess = true;
  }
  showLessItems() {
    this.paginationLimit = Number(this.paginationLimit) - 10;
    this.showMore = true;
  }

  toEdit(lookup, id) {
    if (!this.pageLoaded) {
      return;
    }

    const column = this.taskColumns.find((x) => x.name == lookup.key);
    if (column) {
      if (column.type == "date") {
        if (lookup.value) {
          lookup.date = new Date(lookup.value);
        } else {
          lookup.date = lookup.value;
        }
      }
      lookup["id"] = id;
      lookup["edit"] = true;
      lookup[lookup.key] = lookup.value;
      lookup["column"] = column;
      lookup["dupValue"] = lookup.value;
    }
  }

  onCancel(lookup) {
    lookup["edit"] = false;
    lookup["value"] = lookup.dupValue;
  }

  onSave(lookup) {
    const data = {};
    if (lookup.column.type != "date") {
      data[lookup.key] = lookup.value;
    } else {
      data[lookup.key] = lookup.date;
      lookup.value = this.datePipe.transform(lookup.date);
    }
    if (!lookup.value && lookup.column.isRequired) {
      this.toastrService.danger("The field is required");
    } else {
      lookup["edit"] = false;
      this.tableService
        .updateDynamicFormData(lookup.id, "Tasks", data)
        .subscribe((res: any) => {
          if (res.statusCode == 200) {
            this.toastrService.success(res.message, "Action was  completed!");
          }
        });
    }
  }

  isProjectable(itemName) {
    const ignoreFields = [
      "lookupTableName",
      "lookupTableId",
      "_id",
      "__v",
      "isActive",
    ];
    if (ignoreFields.includes(itemName)) {
      return false;
    }
    if (itemName.indexOf("Image") > -1) {
      return false;
    }
    return true;
  }

  editDynamicTable() {
    this.tableService
      .getDynamicTreeDataById(this.tableName, this.id)
      .subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.onUpdate(res.data);
          this.actionSubscription.unsubscribe();
        }
      });
  }

  onUpdate(data) {

    let title = '';
    if (this.customLabelForEditForm) {
      title = this.customLabelForEditForm;
    }
    else {
      title = this.recordType
        ? "Edit " + this.recordType
        : "Edit " + this.tableName;
    }

    if (this.subFormLookupIds && this.subFormLookupIds.length) {
      this.dialogService
        .open(DynamicFormDialogComponent, {
          closeOnEsc: false,
          context: {
            title: title,
            form: this.tempParentTableHeader[this.tableName],
            button: { text: "Update" },
            subFormLookupIds: this.subFormLookupIds,
            tableName: this.tableName,
            Data: data,
            recordTypeFieldName: this.recordTypeFieldName,
            tableDataForForms: this.tableDataFromViewToForm,
            action: "Edit",
            actions: this.actions,
            customValidations: this.customValidations

          },
          autoFocus: true,

        })
        .onClose.subscribe((name) => {
          if (name) {
            if (name.close && name.close == "yes") {
              this.getAllEmailEvents();
              this.getTableDataForProfile();
              this.getRelatedLookupData(this.tableName, this.id);
              this.getTableData();
              this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/pages/tables/dynamic/' + this.tableId + '/' + this.tableName + '/' + this.id]);
              });
              // this.router.navigate(['/pages/tables/dynamic/' + this.tableId + '/' + this.tableName + '/' + this.id]);
              // this.ngOnInit();
              // this.actionSubscription.unsubscribe();
            }
          }
        });
    }
    else {
      this.dialogService
        .open(DynamicFormDialogNewDesignComponent, {
          closeOnEsc: false,
          context: {
            title: title,
            form: this.tempParentTableHeader[this.tableName],
            button: { text: "Update" },
            subFormLookupIds: this.subFormLookupIds,
            tableName: this.tableName,
            Data: data,
            recordTypeFieldName: this.recordTypeFieldName,
            tableDataForForms: this.tableDataFromViewToForm,
            action: "Edit",
            tableIcon: this.tableIcon,
            fromOldView: true,
            actions: this.actions,
            customValidations: this.customValidations,
            recordGadgets: this.recordGadgets,
            formHeight: this.formHeight,
            formWidth: this.formWidth,
            fieldAlignment: this.fieldAlignment
          },
          autoFocus: true,
        })
        .onClose.subscribe((name) => {
          if (name) {
            if (name.close && name.close == "yes") {
              this.getAllEmailEvents();
              this.getTableDataForProfile();
              this.getRelatedLookupData(this.tableName, this.id);
              this.getTableData();
            }
          }
        });
    }

  }

  getAllEmailEvents() {
    this.tableService
      .getAllDocumentsEvents(this.tableId, this.clientData)
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.documentTemplateList = res["data"];
        } else {
        }
      });
  }
  dataFetched = false;
  overview = {};


  getTableByNameFunctionForCode(tableName, res) {
    this.form = res.data[0].columns
    //-- Manage Add button for lookup tabs
    this.relatedFieldObject[tableName] = res.data[0].hasOwnProperty('addRecordFromRelatedListing') ?
      res.data[0].addRecordFromRelatedListing :
      true;

    if (res.data[0].hasOwnProperty('showChats') && tableName == this.tableName) {
      this.showChats = res.data[0].showChats; console.log('this.showChats ', this.showChats)
    }

    if (res && res.data && res.data[0] && res.data[0].isDocumentTemplate) {
      this.isDocumentTemplate = true;
      setTimeout(() => this.getAllEmailEvents(), 2000);
    }

    if (res.data[0].iconLocation) {
      this.tableIcon = res.data[0].iconLocation;
    }

    if (res.data[0].overview) {
      this.overview[tableName] = res.data[0].overview;
    }

    if (res.data[0].customLabelForAddForm) {
      this.customLabelForAddForm = res.data[0].customLabelForAddForm;
    }
    else {
      this.customLabelForAddForm = '';
    }

    if (res.data[0].customLabelForEditForm) {
      this.customLabelForEditForm = res.data[0].customLabelForEditForm;
    } else {
      this.customLabelForEditForm = '';
    }

    if (
      res &&
      res.data &&
      res.data[0] &&
      res.data[0].columns &&
      res.data[0].columns.length
    ) {
      //this.tableId = res.data[0]._id;

      if (res.data[0].tableName == this.tableName) {
        this.includeTasks = !!res.data[0].includeTasks;
        this.actions = res.data[0].actions ? res.data[0].actions : [];
        this.recordGadgets = res.data[0].recordGadgets ? res.data[0].recordGadgets : [];
        this.customValidations = res.data[0].customValidations ? res.data[0].customValidations : [];
        this.formHeight = res.data[0].formHeight ? res.data[0].formHeight : null;
        this.formWidth = res.data[0].formWidth ? res.data[0].formWidth : null;
        this.fieldAlignment = res.data[0].fieldAlignment ? res.data[0].fieldAlignment : null;
        this.subFormLookupIds = res.data[0].subFormLookups;
        this.parentTableIcon = res.data[0].iconLocation;

        if (this.actions && this.actions.length) {
          this.actionsMenu = [];
          this.actions.forEach((e) => {
            this.actionsMenu.push(e);
          });
        }
        console.log(this.actionsMenu)
        this.tableColumnsForView = res.data[0].columns.filter(({ type, displayInRelatedPageView }) => type === "lookup" && displayInRelatedPageView).reduce((t, c) => {
          return t = {
            ...t,
            [c.lookupTableName]: {
              isLookUpList: c.isLookUpList,
            }
          }
        }, {})

        this.rollUpFields = res.data[0].columns.filter(column => column.type == 'rollUp');
        // console.log('this.rollUpFields =>', this.rollUpFields);
      }

      let columns = res.data[0].columns.filter(({ lookupTableName, type }) => type === "lookup" && lookupTableName === this.tableName)
      if (columns && columns.length > 0) {
        columns = columns.reduce((t, c) => {
          return t = {
            ...t,
            [c.tableName]: this.tableColumnsForView[c.tableName] || {
              isLookUpList: c.isLookUpList,
            }
          }
        }, {});
        this.tableColumnsForView = {
          ...this.tableColumnsForView,
          ...columns
        }
      }
      // if (isNotRelatedTable) {
      //   this.subFormLookupIds = res.data[0].subFormLookups;
      // }

      this.tempParentTableHeader[tableName] = Object.assign(
        [],
        res.data[0].columns
      );

      this.tempParentTableHeaders[tableName] = Object.assign(
        [],
        res.data[0].columns.reduce((t, c) => {
          // if (c.type === 'lookup') {
          //   const displayValue = c.IdFieldValue;
          //   if (displayValue.length > 0) {
          //     const temp: [] = Object.assign([], displayValue[0]);
          //     temp.shift();
          //     this.lookupValue[c.name] = temp.toString().replace(/,/g, ' ');
          //   } else {
          //     c.options.forEach((el) => {
          //       if (el[0]) {
          //         this.lookupValue[c.name] = el[1];
          //       }
          //     });
          //   }
          // }
          this.showFilterBox[c.name] = false;
          this.hideColumn[c.name] = true;
          this.filteredOptions[c.name] = [];
          if (c.options) {
            c.options.forEach((el) => {
              const temp: [] = Object.assign([], el);
              temp.shift();
              this.filteredOptions[c.name].push({ id: el[0], value: temp.toString().replace(/,/g, ' ') });
            });
          }

          return t = {
            ...t,
            [c.label]: c,
          }
        }, {})
      );

      this.getRecordType(this.tempParentTableHeader[tableName], tableName);

      this.parentTableHeader[tableName].map((data) => (data.direction = ""));
      if (tableName == "Tasks") {
        this.taskColumns = res.data[0].columns;
      }
      this.loading = false;
    }
  }

  getTableByName(tableName = "Tasks", isNotRelatedTable?) {
    this.loading = true;
    this.parentTableHeader[tableName] = [];
    if (this.getTableByNameObject[tableName]) {

      let res = this.getTableByNameObject[tableName];
      this.getTableByNameFunctionForCode(tableName, res);

    } else {
      this.tableService.getTableByName(tableName).subscribe((res: any) => {
        this.getTableByNameObject[tableName] = res;
        this.getTableByNameFunctionForCode(tableName, res);
      });
    }

  }

  getRecordType(cols, tableName) {
    let findRecordType = cols.find((x) => x.type == "recordType");
    if (typeof findRecordType != "undefined" && findRecordType != "undefined") {
      const name = findRecordType.name;
      findRecordType = findRecordType.options;
      const recordArray = [];
      if (findRecordType) {
        findRecordType.forEach((element) => {
          const obj = {
            title: element,
            data: {
              menu: tableName,
              name: name,
            },
          };
          recordArray.push(obj);
          if (tableName == "Tasks") {
            this.taskRecordTypes.push(obj);
          }
        });
      }
      this.tableRecordTypes[tableName] = recordArray;
    }
  }

  onSelectedFile(event: any) {
    this.upLoadingImage = true;
    const formData = new FormData();
    const file = event.target.files[0];
    formData.append("file", file);
    this.tableService.uploadProfileImage(formData).subscribe((res: any) => {
      if (res.statusCode == 201) {
        this.profileImagePath = res.data[0];
        const data = {};
        data[this.profileImageData.name] = res.data[0];
        this.tableService
          .updateDynamicFormData(this.id, this.tableName, data)
          .subscribe((response: any) => {
            this.upLoadingImage = false;
          });
      }
    });
  }

  addNewLookUp(data, recordType = true) {

    let ids;
    let tableName = data;
    if (this.tableDataFromViewToForm && this.tableDataFromViewToForm.length) {
      this.tableDataFromViewToForm.forEach(ele => {
        if (ele && ele.columns && ele.columns.length) {
          this.getRecordType(Object.assign([], ele.columns), ele.tableName);
        } else {
          this.tableRecordTypes[ele.tableName] = [];
        }
      });
    }

    this.tableService.getTableByName(data).subscribe((res: any) => {
      if (
        res &&
        res.data &&
        res.data[0] &&
        res.data[0].columns &&
        res.data[0].columns.length
      ) {
        let table = res.data[0];
        ids = res.data[0].subFormLookups;
        this.tempParentTableHeader[tableName] = Object.assign([], res.data[0].columns);
        this.tempParentTableHeader[tableName].map((column) => {
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

        let title = '';
        if (this.customLabelForAddForm) {
          title = this.customLabelForAddForm;
        }
        else {
          title = this.taskRecordType
            ? `Add New ${this.taskRecordType}`
            : `Add New ${tableName}`;
        }



        if (ids && ids.length) {
          this.dialogService
            .open(DynamicFormDialogComponent, {
              closeOnEsc: false,
              context: {
                title: title,
                form: this.tempParentTableHeader[tableName],
                button: { text: "Save" },
                tableName: tableName,
                parentTableName: this.tableName,
                subFormLookupIds: ids,
                parentSourceId: this.id,
                parentTableData: this.clientData,
                tableDataForForms: this.tableDataFromViewToForm,
                Data: null,
                lookUpNameId: this.id,
                lookUpName: this.tableName.slice(0, -1).toLowerCase(),
                recordType: this.recordType,
                recordTypeFieldName: this.recordTypeFieldName,
                isDraggedFromParent: this.isDraggedFromParent,
                droppedFiles:
                  this.droppedFilesOuter && Object.keys(this.droppedFilesOuter).length
                    ? this.droppedFilesOuter
                    : {},
                tableRecordTypes: this.tableRecordTypes,
                actions: this.actions,
                customValidations: this.customValidations,
                recordTypeFlagFromAddNew: true,
              },

              autoFocus: true,
            })
            .onClose.subscribe((name) => {
              if (name.close == "yes") {
                this.isDraggedFromParent = false;
                this.droppedFilesOuter = {};
                this.getRelatedData();
                this.getRelatedLookupData(this.tableName, this.id);
                if (tableName === "Tasks") {
                  this.isActiveTable = "To Do";
                } else {
                  this.isActiveTable = tableName;
                }
              } else {
                this.isDraggedFromParent = false;
                this.droppedFilesOuter = {};
              }
            });

        }
        else {
          this.dialogService
            .open(DynamicFormDialogNewDesignComponent, {
              closeOnEsc: false,
              context: {
                title: title,
                form: this.tempParentTableHeader[tableName],
                button: { text: "Save" },
                tableName: tableName,
                parentTableName: this.tableName,
                subFormLookupIds: ids,
                parentTableData: this.clientData,
                Data: null,
                lookUpNameId: this.id,
                lookUpName: this.tableName.slice(0, -1).toLowerCase(),
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
                optionRecordType: this.tableRecordTypes[table.tableName],
                tableDataForForms: this.tableDataFromViewToForm,
                droppedFiles:
                  this.droppedFilesOuter && Object.keys(this.droppedFilesOuter).length
                    ? this.droppedFilesOuter
                    : {},
              },
              autoFocus: true,
            })
            .onClose.subscribe((name) => {
              if (name.close == "yes") {
                this.isDraggedFromParent = false;
                this.droppedFilesOuter = {};
                this.getRelatedData();
                this.getRelatedLookupData(this.tableName, this.id);
                if (tableName === "Tasks") {
                  this.isActiveTable = "To Do";
                } else {
                  this.isActiveTable = tableName;
                }
              } else {
                this.isDraggedFromParent = false;
                this.droppedFilesOuter = {};
              }
            });

        }

      }

    });
  }

  getTableData() {
    this.loading = true;
    if (!this.tableName || !this.tableId || !this.id) {
      return;
    }

    this.tableService
      .getRelatedDataById(this.tableName, this.tableId, this.id)
      .subscribe((res: any) => {
        this.lookupData = {};
        if (res.statusCode == 200 && res.data) {
          this.loading = false;
          this.setBreadCrumb(res.data);
          this.clientData = res.data;
          this.changeDetector.detectChanges();
          this.setProfileData(res.data);
          this.dataFetched = true;

          //Set lookup values list
          if (this.clientData.lookup && this.clientData.lookup.length) {
            this.clientData.lookup.forEach((lookup) => {
              if (typeof (lookup.lookupName) !== "object") {
                if (!this.lookupData[lookup.lookupFieldName])
                  this.lookupData[lookup.lookupFieldName] = [];

                this.lookupData[lookup.lookupFieldName].push(lookup);
              }
            });
          }

          if (res.data && res.data.tableColumns) {
            const recordTypes = res.data.tableColumns.find(
              (x) => x.type == "recordType"
            );
            if (recordTypes != undefined && recordTypes.options.length != 0) {
              this.recordTypes = recordTypes.options;
              this.recordTypeFieldName = recordTypes.name;
              this.recordType = res.data[this.recordTypeFieldName];
            }
          }

          this.setProfileImage(res.data);

          const relatedData = res.data.relatedData;

          if (relatedData) {
            Object.keys(relatedData).forEach((key) => {
              if (key.toLowerCase() == "tasks") {
                this.isTodoFlag = true;
              }
              this.getTableByName(key);
            });
            // this.setRecordTypesForRelatedTables(res.data.relatedData);

            if (relatedData.Tasks) {
              relatedData.Tasks.reverse();
            }

            if (!this.isActionRunning) {
              setTimeout(() => {
                this.pageLoaded = true;
              }, 500);
            }
          }

          // if(!this.isActionRunning){
          this.loading = false;
          // }

          // -- Set Group chat title
          this.setGroupChatTitle(res);
          this.setTableInfo();
        }
      });
  }

  setGroupChatTitle(res) {
    if (res.data.IDField && res.data.IDField.length > 0) {
      let tempName = "";
      res.data.IDField.map((data) => {
        if (tempName == "") {
          tempName = res.data[data];
        } else {
          if (res.data[data] && res.data[data] != this.recordType) {
            tempName = `${tempName} - ${res.data[data]}`;
          }
        }
      });

      this.groupChatTitle = this.singularTableName + " - " + tempName;

      if (this.recordType) {
        this.groupChatTitle = this.recordType + " - " + tempName;
      } else {
        this.groupChatTitle = this.singularTableName + " - " + tempName;
      }
    }
  }

  getTableDataForProfile() {
    this.loading = true;
    this.tableService
      .getRelatedDataById(this.tableName, this.tableId, this.id)
      .subscribe((res: any) => {
        if (res.statusCode == 200 && res.data) {
          this.clientData = res.data;
          this.setProfileData(res.data);
          this.loading = false;
          this.changeDetector.detectChanges();
          this.dataFetched = true;
        }
      });
  }

  showContextMenu(tableName) {
    this.singularTab = this.service.singularize(tableName);
    if (this.tableRecordTypes && this.tableRecordTypes[tableName]) {
      return this.tableRecordTypes[tableName].length > 0;
    }
    return false;
  }

  getRelatedData() {
    this.loading = true;
    this.tableService
      .getRelatedDataById(this.tableName, this.tableId, this.id)
      .subscribe((res: any) => {
        if (res.statusCode == 200) this.clientData = res.data;
        if (res.data.relatedData && res.data.relatedData.Tasks) {
          this.taskData = res.data.relatedData.Tasks.reverse();
        }
        this.loading = false;
      });
  }

  updateRecordType() {
    const id = this.id;
    const temp = { [this.recordTypeFieldName]: this.recordType };
    this.tableService.updateDynamicFormData(id, this.tableName, temp).subscribe(
      (res: any) => {
        if (res.statusCode === 200) {
          this.toastrService.success(res.message, "Success");

          this.loading = false;
        } else {
          this.loading = false;
          this.toastrService.danger(res.message, "Error");
        }
      },
      (error) => {
        this.toastrService.danger(
          `${error.error && error.error.message}`,
          "Error"
        );
        this.loading = false;
      }
    );
    this.editRecordType = false;
  }

  setProfileData(data) {
    this.profileData = [];
    this.orderedArray.forEach((ele) => {
      const dataName = data[ele.name];
      if (dataName && this.isObject(dataName)) {
        const arr = {
          label: ele.label,
          name: ele.name,
          value: data[ele.name],
          type: ele.type,
          isCurrency: ele.isCurrency,
          fraction: ele.fraction,
        };
        this.profileData.push(arr);
      }
    }
    );
    this.getRelatedLookupData(this.tableName, this.id);
  }

  setProfileImage(data) {
    if (data && data.tableColumns) {
      this.profileImageData = data.tableColumns.find(
        (x) => x.type == "file" && x.isProfileImage
      );
    }
    if (this.profileImageData) {
      if (
        data[this.profileImageData.name] != null &&
        data[this.profileImageData.name] !== ""
      ) {
        this.profileImagePath = data[this.profileImageData.name];
      }
    } else if (data.userColor) {
      this.profileImageColor = data.userColor;
    }
  }

  setBreadCrumb(data) {
    this.breadcrumbs = [];
    if (data && data.tableColumns) {
      this.orderedArray = this.helperService.sortObject(
        data.tableColumns,
        "displayPriority"
      );

      const workflowData = data.tableColumns.find(
        (x) => x.isWorkFlowField && x.type === "status"
      );

      if (
        workflowData &&
        workflowData.statusOptions &&
        workflowData.statusOptions.length
      ) {
        workflowData.statusOptions.forEach((ele) => {
          const arr = [];

          if (data[workflowData.name] == ele.status) {
            this.status = ele.status;
            arr["active"] = true;
          } else {
            arr["active"] = false;
          }
          arr["color"] = ele.color;
          arr["label"] = ele.status;
          arr["name"] = workflowData.name;
          this.breadcrumbs.push(arr);
        });
      }
    }
  }

  setLookUpValues(res) {
    // this.res.data.lookups
  }

  isObject(val) {
    return typeof val !== "object";
  }

  clickTableLabel() {
    if (this.recordTypes.length) {
      this.editRecordType = true;
    }
  }

  showRecordEdit() {
    if (this.recordTypes.length && !this.editRecordType) {
      this.enableEdit = true;
    }
  }

  getPrimaryLink(obj) {
    const tableId = obj["lookupTableId"];
    const tableName = obj["lookupTableName"];
    const resourceId = obj["_id"];

    this.primaryLink =
      "/pages/tables/dynamic/" + tableId + "/" + tableName + "/" + resourceId;
  }

  onAction(row, table) {
    this.actionSubscription = this.nbMenuService
      .onItemClick()
      .subscribe((event) => {
        let currentTable = this.tempParentTableHeader[table][0]["tableId"];
        // -- Do not proceed on record Type action
        if (this.recordTypes.includes(event.item.title)) {
          return false;
        }
        if (event.item.icon["pack"] == "delete") {
          this.onDeleteConfirm(row, table);
          this.actionSubscription.unsubscribe();
        } else if (event.item.icon["pack"] == "view") {
          this.router.navigate([
            "pages/tables/dynamic/" +
            currentTable +
            "/" +
            table +
            "/" +
            row._id +
            "/" +
            "/To Do",
          ]);
          this.actionSubscription.unsubscribe();
          this.isPopupOpen = false;
        }
        if (this.isPopupOpen === false) {
          if (event.item.icon["pack"] == "edit") {
            try {
              this.isPopupOpen = true;
              this.tableService
                .getDynamicTreeDataById(table, row._id)
                .subscribe((res: any) => {
                  if (res.statusCode == 200) {
                    this.isPopupOpen = false;
                    this.onTableUpdate(res.data, table);
                    this.actionSubscription.unsubscribe();
                  }
                });
            } catch (error) { }
          }
        }
      });
  }

  // onEditData(row, table) {
  //   try {
  //     this.tableService.getDynamicTreeDataById(table, row._id).subscribe((res: any) => {
  //       if (res.statusCode == 200) {
  //         this.isPopupOpen = false;
  //         this.onTableUpdate(res.data, table);
  //       }
  //     });
  //   } catch (error) {
  //   }
  // }

  // onDeleteData(row, table) {
  //   this.onDeleteConfirm(row, table);
  // }

  onTableUpdate(data, table) {
    if (!this.pageLoaded) {
      return;
    }
    this.taskRecordType = null;
    let tableName;
    tableName = table;
    let title = '';
    if (this.customLabelForEditForm) {
      title = this.customLabelForEditForm;
    }
    else {
      title = `Edit ${tableName}`;
    }



    if (this.subFormLookupIds && this.subFormLookupIds.length) {
      this.dialogService
        .open(DynamicFormDialogComponent, {
          closeOnEsc: false,
          context: {
            title: title,
            form: this.tempParentTableHeader[tableName],
            button: { text: "Update" },
            tableName: tableName,
            parentTableName: this.tableName,
            subFormLookupIds: this.subFormLookupIds,
            parentSourceId: this.id,
            Data: data,
            lookUpNameId: this.id,
            lookUpName: this.tableName.slice(0, -1).toLowerCase(),
            recordType: this.taskRecordType,
            actions: this.actions,
            customValidations: this.customValidations
          },
          autoFocus: true,
        })
        .onClose.subscribe((name) => {
          if (name == "yes") {
            this.getRelatedData();
            this.ngOnInit();
            this.actionSubscription.unsubscribe();
            this.isActiveTable = tableName;
          }
        });
    }
    else {
      this.dialogService
        .open(DynamicFormDialogNewDesignComponent, {
          closeOnEsc: false,
          context: {
            title: title,
            form: this.tempParentTableHeader[tableName],
            button: { text: "Update" },
            tableName: tableName,
            parentTableName: this.tableName,
            subFormLookupIds: this.subFormLookupIds,
            Data: data,
            lookUpNameId: this.id,
            lookUpName: this.tableName.slice(0, -1).toLowerCase(),
            recordType: this.taskRecordType,
            tableIcon: this.tableIcon,
            formHeight: this.formHeight,
            formWidth: this.formWidth,
            fieldAlignment: this.fieldAlignment,
            fromOldView: true
          },
          autoFocus: true,
        })
        .onClose.subscribe((name) => {
          if (name == "yes") {
            this.getRelatedData();
            this.ngOnInit();
            this.actionSubscription.unsubscribe();
            this.isActiveTable = tableName;
            if (this.actions && this.actions.length) {
              this.actions.forEach(element => {
                if (element.onSave == "yes") {
                  this.onActionsClick('', element);
                }
              });
            }
          }
        });
    }

  }

  onDeleteConfirm(data, table): void {
    this.dialogService.open(DeleteDialogComponent).onClose.subscribe((name) => {
      if (name) {
        this.tableService
          .deleteDynamicFormData(data._id, table)
          .subscribe((res: any) => {
            if (res.statusCode === 200) {
              this.getRelatedData();
              this.getRelatedLookupData(this.tableName, this.id);
              this.actionSubscription.unsubscribe();
            }
          });
      }
    });
  }

  clearTabVariables() {
    this.childResourceId = null;
    this.pageRefreshed = false;
    if (this.lookupRelateData && this.lookupRelateData.length > 0) {
      this.page = 0;
    }
  }

  selectTab(event) {
    if (this.refreshPageActive || this.pageUrlReset) {
      return;
    }
    let url = `/pages/tables/dynamic/${this.tableId}/${this.tableName}/${this.id}`;
    if (event?.tabTitle) {
      this.tabTitle = event.tabTitle;
    }
    if (this.pageRefreshed) {
      if (!this.tabTitle) {
        this.tabTitle = "To Do";
        this.page = 0;
        this.location.replaceState(url + "/" + `${this.tabTitle}`);
        this.clearTabVariables();
        return;
      }

      if (this.tableName === "Tasks") {
        url += `/taskType/${this.recordType}`;
        this.router.navigate([url]);
        this.clearTabVariables();
        return;
      }
    }

    if (event.tabTitle == "Notes" || this.tabTitle == "Notes") {
      this.isActiveTable = "Notes";
      this.chatOpened = true;
    }

    if (this.childResourceId && event.tabTitle == "To Do") {
      this.clearTabVariables();
      return;
    }

    if (event.tabTitle) {
      this.tabTitle = event.tabTitle;
      this.isActiveTable = this.tabTitle;
      this.location.replaceState(url + "/" + `${event.tabTitle}`);
    }

    this.clearTabVariables();
  }

  getTaskCounts(value) {
    const array = value.reduce((t, o) => t = t + o.totalInCompleteTasks, 0);
    this.openTasked = [...Array(array).keys()];
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.route.queryParams.subscribe(params => {
      this.page = params.page || 0;
      this.getRelatedLookupData(this.tableName, this.id);
    });
  }
  tempLookupRelateData;
  getRelatedLookupData(tableName, resourceId) {
    this.loading = true;
    this.tableService
      .getRelatedLookupData(tableName, resourceId, this.page)
      .subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.lookupWithTaskData = res.data["Tasks"];
          if (this.lookupWithTaskData && this.lookupWithTaskData.length > 0) {
            this.openTasked = this.lookupWithTaskData.filter(
              (task) => task["closed"] != true && task["isSubtask"] != "Yes"
            );
          }

          let copylookupRelateData = res.data;
          let val: any[] = Object.entries(copylookupRelateData);
          val.sort((a, b) => b[1].length - a[1].length);
          this.lookupRelateData = [...val];
          // if (this.includeTasks) {
          //   this.lookupRelateData = this.lookupRelateData.filter(([tableName]) => tableName !== "Tasks");
          // }
          this.lookupRelateData = this.lookupRelateData.map(([tableName, { getRecords, pager }]) => {
            const isTaskTab = tableName === "Tasks"
            if (!pager) {
              return [tableName, { getRecords, pager, tempRecords: 0, isTaskTab, headers: [] }];
            }
            getRecords = [...getRecords] || [];
            const headers = {}
            getRecords.forEach((r) => {
              Object.keys(r).forEach((k) => {
                headers[k] = r[k];
              })
            });
            getRecords = getRecords.map((r) => {
              Object.keys(headers).forEach((k) => {
                r[k] = r[k] || '';
              })
              return r;
            })
            const tempRecords = [...getRecords];
            const records = [...getRecords];
            getRecords = pager.pages.length === 1 || pager.pages.length === 0 ? records : [...Array(Math.ceil([...records].length / (pager.pages.length - 1)))].map(_ => records.splice(0, pager.pageSize))[pager.currentPage - 1]
            return [tableName, { getRecords, pager, tempRecords, isTaskTab, headers }]
          });
          this.lookupRelateData = [...this.lookupRelateData]

          //-- sorting based on subForms
          if (this.subFormLookupIds) {
            let copy = [];
            this.lookupRelateData.forEach(ele => {
              let idx = this.subFormLookupIds.findIndex(f => f.tableName == ele[0]);
              if (idx > -1) {
                copy.unshift(ele)
              }
              else {
                copy.push(ele)
              }

              //-- Handle rollup fields

              this.rollUpFields.forEach(ru => {
                if (ru.options[0].rollUptable == ele[0] && ele[1].getRecords && ele[1].getRecords.length > 0) {
                  let invalid = false;

                  this.profileData.forEach(item => {
                    if (item.name == ru.name) {
                      invalid = true;
                      return;
                    }
                  })
                  if (invalid) {

                  }
                  else {
                    let newObj = {
                      fraction: (ru.isCurrency && ru.isCurrency === true) ? 2 : null,
                      isCurrency: ru.isCurrency,
                      label: ru.label,
                      name: ru.name,
                      type: "rollUp"
                    }

                    let currency = (ru.isCurrency && ru.isCurrency === true) ? '$ ' : '';

                    if (ru.options[0].aggregation == 'sum') {
                      newObj['value'] = currency + parseInt(ele[1].getRecords.reduce((accu, val) => accu + val[ru.options[0].numberField], 0))
                    } else if (ru.options[0].aggregation == 'count') {
                      newObj['value'] = currency + ele[1].getRecords.reduce((accu, val) => accu + val.ru.options[0].numberField, 0)
                    }
                    this.profileData.push(newObj);
                  }
                }
              })

            })
            this.lookupRelateData = [...copy];
            if (this.overview[tableName] && this.overview[tableName].length) {
              let name = this.overview[tableName].map(v => v.tableName);
              if (name && name.length) {
                this.tempLookupRelateData = this.lookupRelateData.filter(item => {
                  if (name.includes(item[0])) {
                    return false;
                  } else {
                    return true;
                  }
                })
              } else {
                this.tempLookupRelateData = [...this.lookupRelateData];
              }
            } else {
              this.tempLookupRelateData = [...this.lookupRelateData];
            }

            this.changeDetector.detectChanges();

          }

          if (this.refreshPageActive) {
            setTimeout(() => {
              const hasQuery = this.refreshPageActive.split('?')
              let page = this.page
              if (hasQuery && hasQuery.length > 0) {
                this.refreshPageActive = hasQuery[0]
                if (hasQuery[1]) {
                  page = Number(hasQuery[1].split("=") && hasQuery[1].split("=")[1] || 0)
                }
              }
              this.tabTitle = this.refreshPageActive || this.tabTitle;
              const tabTitle = this.refreshPageActive || this.tabTitle;
              this.isActiveTable = this.refreshPageActive || this.isActiveTable;
              this.chatOpened = false;
              this.refreshPageActive = '';
              if (page) {
                this.page = page;
                setTimeout(() => {
                  this.onPage(page, false, tabTitle)
                  this.tabTitle = tabTitle;
                  this.isActiveTable = null;
                  this.isActiveTable = tabTitle;
                }, 500);
              } else {
                this.loading = false;
              }
            }, 1000);
          } else {
            this.loading = false;
          }
        }
        if (this.lookupRelateData.length === 0) {
          this.showNotesTab = true;
        }
        this.pageUrlReset = false;
        // console.log("lookupRelateData", this.lookupRelateData);

        if (this.rollUpFields.length > 0) {

        }
      });

    this.checkFlag = true;
  }

  getPaginationData(page) {
    this.lookupRelateData = this.lookupRelateData.map(([tableName, { getRecords, pager, tempRecords, headers }]) => {
      const isTaskTab = tableName === "Tasks"
      if (!pager) {
        return [tableName, { getRecords, pager, tempRecords: [], isTaskTab, headers }];
      }
      getRecords = [...tempRecords] || [];
      tempRecords = [...tempRecords];
      const records = [...getRecords];
      pager.currentPage = page
      getRecords = pager.pages.length === 1 || pager.pages.length === 0 ? records : [...Array(Math.ceil([...records].length / (pager.pages.length - 1)))].map(_ => records.splice(0, pager.pageSize))[page === 0 ? 0 : page - 1]
      return [tableName, { getRecords, pager, tempRecords, isTaskTab, headers }]
    });
    this.page = page
  }

  onShowLookupDetail(lookupData, columnData, tableInfo?) {

    this.tableService.getTablesForMenu().subscribe((res: any) => {
      if (res.statusCode === 200) {


        if (tableInfo) {
          let tableDataForLookupView = res.data;

          let data = res.data;
          data = data.filter(item => item.tableName == tableInfo.tableName);
          let subFormLookupIdsForLookupView = data[0]?.subFormLookups;

          this.tableService.getTableByName(tableInfo.tableName).subscribe((res: any) => {
            if (res && res.data && res.data[0].columns) {

            }
            if (res && res.statusCode == 404) {
              this.tableService.redirectToHomePage();
              return;
            }

            if (res && res.data && res.data[0] && res.data[0].columns && res.data[0].columns.length) {
              let tempParentTableHeaderForLookup = Object.assign([], res.data[0].columns);
              let recordTypeFieldNameforlookup;
              tempParentTableHeaderForLookup.map((column) => {

                if (column.type == 'recordType') {
                  recordTypeFieldNameforlookup = column.name;
                  column.options.forEach(element => {
                    const obj = {
                      title: element,
                    };
                    this.recordTypes.push(obj);
                  });
                }
              });

              let page = 1;

              if (this.route.snapshot.queryParamMap.get('page')) {
                page = parseInt(this.route.snapshot.queryParamMap.get('page'));
              }

              this.tableService.getDynamicTreeDataById(tableInfo.tableName, tableInfo.resourceId).subscribe((res: any) => {
                if (res.statusCode == 200) {
                  this.dataForLookupDetail = res.data;

                  const ref = this.dialogService.open(LookupDetailDialogComponent, {
                    context: {
                      // data: {
                      data: tableInfo,
                      name: tableInfo.tableName,
                      subFormLookupIds: subFormLookupIdsForLookupView,
                      tempParentTableHeader: tempParentTableHeaderForLookup,
                      recordTypeFieldName: recordTypeFieldNameforlookup,
                      tableData: tableDataForLookupView,
                      tableRecordTypes: this.tableRecordTypes,
                      dataForLookupDetail: this.dataForLookupDetail,
                      tableName: tableInfo.tableName,
                      fromRecord: true,

                      // }
                    },
                  })
                    .onClose.subscribe(name => {

                      if (name && name.close == 'yes') {
                        // alert('great');
                        this.ngOnInit();
                      }
                    });
                }
              });

            }

          });
        }
        else {

          let tableDataForLookupView = res.data;

          let data = res.data;
          data = data.filter(item => item.tableName == lookupData.lookupTableName);
          let subFormLookupIdsForLookupView = data[0]?.subFormLookups;
          let tableId;
          this.tableService.getTableByName(lookupData.lookupTableName).subscribe((res: any) => {
            if (res && res.data && res.data[0].columns) {

              tableId = res.data[0]._id;

            }
            if (res && res.statusCode == 404) {
              this.tableService.redirectToHomePage();
              return;
            }

            if (res && res.data && res.data[0] && res.data[0].columns && res.data[0].columns.length) {
              let tempParentTableHeaderForLookup = Object.assign([], res.data[0].columns);
              let recordTypeFieldNameforlookup;
              tempParentTableHeaderForLookup.map((column) => {

                if (column.type == 'recordType') {
                  recordTypeFieldNameforlookup = column.name;
                  column.options.forEach(element => {
                    const obj = {
                      title: element,
                    };
                    this.recordTypes.push(obj);
                  });
                }
              });

              let page = 1;

              if (this.route.snapshot.queryParamMap.get('page')) {
                page = parseInt(this.route.snapshot.queryParamMap.get('page'));
              }

              this.tableService.getDynamicTreeDataById(lookupData.lookupTableName, lookupData.lookupId).subscribe((res: any) => {
                if (res.statusCode == 200) {
                  this.dataForLookupDetail = res.data;

                  const ref = this.dialogService.open(LookupDetailDialogComponent, {
                    context: {
                      // data: {
                      data: lookupData,
                      name: columnData,
                      subFormLookupIds: subFormLookupIdsForLookupView,
                      tempParentTableHeader: tempParentTableHeaderForLookup,
                      recordTypeFieldName: recordTypeFieldNameforlookup,
                      tableData: tableDataForLookupView,
                      tableRecordTypes: this.tableRecordTypes,
                      dataForLookupDetail: this.dataForLookupDetail,
                      tableName: lookupData.lookupTableName,
                      tableIdFromView: tableId,
                      fromView: true,

                      // }
                    },
                  })
                    .onClose.subscribe(name => {

                      if (name && name.close == 'yes') {
                        // alert('great');
                        this.ngOnInit();
                      }
                    });
                }
              });

            }
          });
        }
      }
    });
  }

  getFileExtension(filename) {
    const ext = filename.split(".").pop();
    const obj = iconList.filter((row) => {
      if (row.type === ext) {
        return true;
      }
    });
    if (obj.length > 0) {
      const icon = obj[0].icon;
      return icon;
    } else {
      return "fiv-cla fiv-icon-blank fiv-size-md";
    }
  }

  getFileName(filename) {
    filename = decodeURI(filename);
    return filename.match(/.*\/(.*)$/)[1];
  }

  onFilePreivew(filename) {
    this.dialogService.open(FilePreviewDialogComponent, {
      context: {
        Data: filename,
        Ext: filename.split(".").pop(),
      },
    });
  }

  selfSubsription(): void {
    if (this.isSelfSubscribed == true) {
      this.subscriptionText = "Start watching";
      this.isSelfSubscribed = false;
      this.cancelSubscription(this.currentUser);
    } else {
      this.subscriptionText = "Stop watching";
      this.isSelfSubscribed = true;
      this.activateSubscription();
    }
  }

  activateSubscription(showToaster = true) {
    const data = {
      resourceId: this.tableInfo.resourceId,
      userId: this.currentUser,
      tableName: this.tableInfo.tableName,
      invitedBy: this.currentUser,
    };

    this.chatSubscriptionService.watch(data).subscribe(
      (res: any) => {
        if (res.statusCode === 201) {
          this.loadSubscribers();
          if (showToaster) {
            this.toastrService.success(res.message, "Success");
            this.loading = false;
          }
        } else {
          this.loading = false;
          this.toastrService.danger(res.message, "Error");
        }
      },
      (error) => {
        this.toastrService.danger(
          `${error.error && error.error.message}`,
          "Error"
        );
        this.loading = false;
      },
      () => { }
    );
  }

  loadSubscribers() {
    this.chatSubscriptionService
      .getSubscribers(this.tableInfo.resourceId)
      .subscribe((res: any) => {
        if (res.data) {
          this.subscribers = res.data;
          if (res.data.length > 0) {
            res.data.map((data) => {
              if (data._id == this.currentUser._id) {
                this.subscriptionText = "Stop watching";
                this.isSelfSubscribed = true;
              }
            });
          }
        }
        this.getResourceChatHistory();
      });
  }

  getResourceChatHistory() {
    this.messageService.getResourceChatHistory(this.id).subscribe(({ data }: any) => {
      this.messageCount = data && data.pageOfItems && data.pageOfItems.length || 0;
    })
  }

  watcherMenuOpened() {
    this.isWatcherOpened = true;
  }

  watcherMenuClosed() {
    this.isWatcherOpened = false;
  }

  cancelSubscription(user: string): void {
    this.chatSubscriptionService
      .cancelSubscription({
        resourceId: this.tableInfo.resourceId,
        userId: user,
      })
      .subscribe((data: any) => {
        if (data.statusCode == 200) {
          //this.loadSubscribers();
          this.toastrService.success(data.message, "Action was  completed!");
        }
      });
    const itemToRemoveIndex = this.subscribers.findIndex(function (item) {
      return item._id === user;
    });

    if (itemToRemoveIndex !== -1) {
      this.subscribers.splice(itemToRemoveIndex, 1);
    }
  }

  openReminderModal() {
    let temp = [];
    this.clientData["IDField"].forEach(element => {
      let IDElement = this.clientData["tableColumns"].filter(v => v.name == element)[0];
      if (IDElement.type == "date" || IDElement.type == "dateTime") {
        if (this.clientData[element] && typeof this.clientData[element] !== 'object') {
          let val = this.datePipe.transform(this.clientData[element], "M/d/yy")
          temp.push(' ' + val);
        }
      } else {
        if (this.clientData[element] && typeof this.clientData[element] !== 'object') {
          temp.push(' ' + this.clientData[element]);
        }
      }
    });

    this.dialogService
      .open(NewReminderModalComponent, {
        context: {
          tableId: this.tableId,
          tableName: this.tableName,
          resourceId: this.tableInfo.resourceId,
          IdFieldData: temp,
          fromViewPage: true,
          tableIcon: this.tableIcon
        },
        autoFocus: true,
      })
      .onClose.subscribe((res) => {
        if (res) {
          this.ngOnInit();
        }
      });
  }

  onPage(page, callAPi = true, tabTitle?) {
    const url = `/#/pages/tables/dynamic/${this.tableId}/${this.tableName}/${this.id}/${tabTitle || this.tabTitle}`;
    this.page = page;
    if (callAPi) {
      this.getPaginationData(page)
    } else {
      this.getPaginationData(page)
    }
    this.isActiveTable = tabTitle || this.tabTitle;
    history.pushState(null, null, url + '?page=' + page);
  }

  filterTable() {
    const tabTItle = this.tabTitle;
    console.log(this.lookupRelateData[this.tabTitle], this.page, this.filterKey, this.sortObject, this.searchString)
    const tableIndex = this.lookupRelateData.findIndex(([tableName]) => tableName === this.tabTitle);
    if (tableIndex > -1) {
      let data = this.lookupRelateData[tableIndex][1].tempRecords;
      const headers = data[0];
      if (this.sortObject) {
        if (this.sortObject.type === "date" || this.sortObject.type === "dateTime") {
          data = _.orderBy(data, (obj) => obj[this.sortObject.column] ? new Date(obj[this.sortObject.column]) : new Date(-1), [this.sortObject.direction]);
        } else {
          data = _.orderBy(data, [this.sortObject.column], [this.sortObject.direction]);
        }
      }
      if (this.filterKey && this.filterKey.length > 0) {
        this.filterKey.forEach((obj) => {
          data = _.filter(data, obj);
        })
      }
      this.lookupRelateData[tableIndex][1].getRecords = data.slice(0, 10);
      this.lookupRelateData = [...this.lookupRelateData]
      this.tabTitle = tabTItle;
      this.isActiveTable = tabTItle;
    }
  }

  onFilterSearch(data, filterDataKey, type?) {
    if (filterDataKey == 'tasksRecordsOnly') {
      this.taskedRecordsOnly = data == true;
    }
    if (type == 'date') {
      const Datedata = new Date(new Date(data).setHours(0, 0, 0));
      data = new Date(Datedata).toUTCString();
    }
    if (type == 'checkbox') {
      if (data.target.checked && !this.checkboxArray.includes(data.currentTarget.textContent.trim())) {
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
            this.filterKey.push({ [filterDataKey]: data });
          }
        });
      } else if (data && data.length > 0) {
        this.filterKey.push({ [filterDataKey]: data });
      }
    }

    if (filterDataKey != 'tasksRecordsOnly') {
      if (data && data.length > 0) {
        this.filterHide[filterDataKey] = true;
        this.hideColumn[filterDataKey] = false;
        this.showFilterBox[filterDataKey] = false;
      } else {
        this.filterHide[filterDataKey] = false;
        this.hideColumn[filterDataKey] = true;
      }
    }
    this.filterTable()
    // this.getTableDataByName(1, this.searchString, this.sortObject, this.filterKey);
    this.hideColumn[filterDataKey] = true;
  }

  onSort(sortObject, event, column) {
    this.sortObject = sortObject;
    if (!sortObject || event.direction == '' || event.direction == 'desc') {
      event.direction = 'asc';
      this.sortObject = {
        direction: 'asc',
        column,
        type: event.type
      };
      this.filterTable()
      // this.getTableDataByName(1, this.searchString, this.sortObject, this.filterKey);
    } else if (event.direction == 'asc') {
      this.sortObject = {
        direction: 'desc',
        column,
        type: event.type
      },
        event.direction = 'desc';
      this.filterTable()
      // this.getTableDataByName(1, this.searchString, this.sortObject, this.filterKey);
    } else {
      event.direction = '';
      this.filterTable()
      // this.getTableDataByName(1, this.searchString, this.filterKey);
    }

  }

  updatedVal(e, value) {
    if (e && e.length >= 0) {
      this.showAutocomplete[value] = true;
    } else {
      this.showAutocomplete[value] = false;
    }
  }

  clearFilter(label) {
    const index = this.filterKey.findIndex((obj) => Object.keys(obj).map(i => i.toLowerCase()).includes(label.toLowerCase()))
    if (index > -1) {
      this.filterKey.splice(index, 1);
      this.filterTable()
      // this.getTableDataByName(1, this.searchString, this.sortObject, this.filterKey);
    }
  }

  removeText(value, type?) {
    const index = this.filterKey.findIndex(v => v.hasOwnProperty(value));
    this.filterKey.splice(index, 1);
    this.searchString = '';
    if (type === 'lookup') {
      this.lookupValue[value] = '';
    } else if (type === 'date') {
      this.model = '';
    } else {
      this.textValue = {};
    }

    this.filterHide[value] = false;
    this.hideColumn[value] = true;

    if (this.filterKey.length > 0) {
      this.filterTable()
      // this.getTableDataByName(1, this.searchString, this.sortObject, this.filterKey);
    } else {
      this.filterTable()
      // this.getTableDataByName(1, this.searchString, this.sortObject);
    }
  }

  onSelectionChange(data, name, dynamicFilterData) {
    if (data.id && data.value) {
      this.lookupValue[name] = data.value;
      for (const d of dynamicFilterData) {
        if (d.type === 'lookup' && name.toLowerCase() === d.name.toLowerCase()) {
          const displayValue = d.IdFieldValue.filter(f => f[0] === data.id);
          if (displayValue.length > 0) {
            const temp: [] = Object.assign([], displayValue[0]);
            temp.shift();
            this.lookupValue[name] = temp.toString().replace(/,/g, ' ');
          } else {
            d.options.forEach((el) => {
              if (data.id === el[0]) {
                this.lookupValue[name] = el[1];
              }
            });
          }
          this.onFilterSearch(data.id, name);
        }
      }
    }
  }

  viewMoreData(lookupData) {
    if (this.selectedListCardId === lookupData._id) {
      this.selectedListCardId = undefined;
      return false;
    }
    this.selectedListCardId = lookupData._id;
  }

  treeUpdated($e) {
    this.getRelatedLookupData(this.tableName, this.id);
  }

  callRelatedLookup() {
    this.getRelatedLookupData(this.tableName, this.id);

  }

}
