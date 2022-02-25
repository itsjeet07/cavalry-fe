import { DatePipe, DOCUMENT, Location } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteDialogComponent } from '@app/shared/components/delete-dialog/delete-dialog.component';
import {
  ViewLookupInDialogComponent,
} from '@app/shared/components/dialog/view-lookup-in-dialog/view-lookup-in-dialog.component';
import {
  DynamicFormDialogNewDesignComponent,
} from '@app/shared/components/dynamic-form-dialog-new-design/dynamic-form-dialog-new-design.component';
import { DynamicFormDialogComponent } from '@app/shared/components/dynamic-form-dialog/dynamic-form-dialog.component';
import { FilePreviewDialogComponent } from '@app/shared/components/file-preview-dialog/file-preview-dialog.component';
import { FilterDataSaveComponent } from '@app/shared/components/filter-data-save/filter-data-save.component';
import { ChatSubscriptionService } from '@app/shared/services/chat-subscription.service';
import { HelperService } from '@app/shared/services/helper.service';
import { MessageService } from '@app/shared/services/message.service';
import { SocketService } from '@app/shared/services/socket.service';
import { TableService } from '@app/shared/services/table.service';
import { NbDialogService, NbMenuService, NbPopoverDirective, NbSidebarService, NbToastrService } from '@nebular/theme';
import { iconList } from '@shared/iconData/iconList';
import { cloneDeep } from 'lodash';
import { NgPluralizeService } from 'ng-pluralize';
import { NgxLinkifyjsService } from 'ngx-linkifyjs';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { DynamicTableViewComponent } from '../dynamic-table-view/dynamic-table-view.component';
import { ExportTableDataComponent } from '../export-table-data/export-table-data.component';
import { Filter } from '../filter/filter.component';

@Component({
  selector: 'ngx-dynamic-tree-table',
  templateUrl: './dynamic-tree-table.component.html',
  styleUrls: ['./dynamic-tree-table.component.scss'],
})
export class DynamicTreeTableComponent implements OnInit, OnChanges, OnDestroy {

  private destroy$ = new Subject();
  thWidth = [];
  searchString: string = null;
  sortObject: object = null;
  tableNameWithoutS: string;
  @Input() tableName: string;
  @Input() count = 0;
  tempParentTableHeader = [];
  parentTableHeader = [];
  parentTableData = [];
  filteredStatus = [];
  storeTreeDataForURL: any;
  pager: any = {};
  loading = false;
  taskedRecordsOnly = false;
  tableId: string;
  isPopupOpen = false;
  resColData = {};
  resultData = {};
  dynamicFilterData: any;
  inputFields: string[] = ['password', 'text', 'email', 'currency', 'area', 'richTextArea'];
  filterFields: string[] = ['file', 'currency'];
  unwantedFieldsInOptions = ['displayInTree', 'lookups', '_id'];
  canAddNewRecord = false;
  lookTable: any;
  lookupName: any;
  tableData: any = [];
  showAutocomplete = {};
  lookupData: any = [];
  lookupValue = {};
  lookupObj = {};
  isDefaultValueEnable: boolean = false;
  filteredOptions = {};
  search: any;
  demoData: [];
  checkboxArray = [];
  showFilterBox = {};
  hideColumn = {};
  textValue = {};
  showArea: boolean;
  filterDisplay = [];
  noDataFound = false;
  filterDefaultList;
  tutorial = '';
  condition = [false];
  taskStatus = [];
  taskData = [];
  actionItems = [
    // -- { icon: { icon: 'python', pack: 'edit' } },
    // -- { icon: { icon: 'python', pack: 'view' } },
    { icon: { icon: 'python', pack: 'delete' } },
  ];
  audioSource: string =
    'assets/new_record.wav';
  audioFile: HTMLAudioElement;
  recordTypes = [];
  recordType: string = null;
  recordTypeFieldName: string = null;
  recordTypeFilter;
  headerObj = {};
  actionSubscription: Subscription = new Subscription();
  threeDotSubscription: Subscription;
  searchSubscription: Subscription;
  formHeight;
  formWidth;
  fieldAlignment;
  accessTableName = [];
  dependsFields = [];
  allParentTableHeader;
  statuses = [];
  chartFilter = [];
  taskRecordTypes: any = [];
  tableRecordTypes: any = [];
  dataForLookupDetail;
  currentUser;
  headerWidth = 0;
  subFormLookupIds: any;
  watchedIssue = false;
  canShowEyeToolTip = true;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  DateTimerange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  viewCompletedRecords = false;
  searchMode = 'no';
  viewAllRecords = false;
  tableIcon = '';
  filterList = [];
  statusFilter = [];
  finalList = [];
  dropdownValue = [];
  dropdownWithImageValue = [];
  check = [];
  actions = [];
  newViewFlag = false;
  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;
  public formGroup = new FormGroup({
    date: new FormControl(new Date(), [Validators.required]),
  });
  recordGadgets;
  showChats;
  customValidations;
  public masterSearchTab: any[] = [];
  public isSearchPage: boolean = false;
  public srcTxt: string = '';

  tagList = [];
  allFilters = [];
  users = [];
  usersWithIds = [];

  hideFilters = true;
  viewInModal = false;
  pageOfItems = [];
  showLookupDetail = {};
  lookupDetailClicked = [];
  lookupDetailDisplayCount = null;
  lookupDetailItem = null;
  tableForLookupDetail = '';
  filterObject: Filter;
  fromOverview = false;
  fromDashboard = false;
  @Input() directViewFlag;
  @Input() directTableName;
  @Input() rowId;
  @Input() renderAt;
  @Input() fromRecordPage = false;
  @Output() treeUpdated = new EventEmitter();
  @Input() getTableByNameObject = {};
  relatedTableList = [];
  allUsers = [];
  constructor(
    @Inject(DOCUMENT) private document: Document,
    public route: ActivatedRoute,
    private tableService: TableService,
    private router: Router,
    private dialogService: NbDialogService,
    private nbMenuService: NbMenuService,
    private service: NgPluralizeService,
    private cdr: ChangeDetectorRef,
    private location: Location,
    public linkifyService: NgxLinkifyjsService,
    private chatSubscriptionService: ChatSubscriptionService,
    private datePipe: DatePipe,
    private toastrService: NbToastrService,
    private helperService: HelperService,
    private socketService: SocketService,
    private sidebarService: NbSidebarService,
    private messageService: MessageService) {
    console.log('this.renderAt ', this.renderAt)
    this.currentUser = JSON.parse(localStorage.getItem('userData'));

  }

  // -- Handle back button
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.route.queryParams.subscribe(params => {
      this.getTableDataByName(params.page);
    });
  }

  hideFilterData(val) {
    this.hideFilters = val;
  }

  getUrl(item, column) {
    if (item != null) {
      if (!(typeof item == 'number') && column.type != 'number' && column.type != 'area' && (column.type == 'text')) {
        if (item) {
          return this.linkifyService.linkify(item);
        } else {
          return item;
        }
      } else {
        let fractionPoint = column.fraction;
        if (item > 0) {
          if (fractionPoint > 0 || (fractionPoint === 0 && column.isCurrency)) {
            if (column.isCurrency) {
              return '$ ' + Number(item).toFixed(fractionPoint);
            } else {
              return Number(item).toFixed(fractionPoint);
            }
          } else {
            if (column.isCurrency) {
              if (!(Number(item) % 1 != 0)) {
                fractionPoint = 2;
                return '$ ' + Number(item).toFixed(fractionPoint);
              }
            } else {
              if (!(Number(item) % 1 != 0)) {
                fractionPoint = column.type === 'autoNumber' ? 0 : fractionPoint === 0 ? 0 : 2;
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
  }

  // -- Open view mode of record
  openViewModal(data, id) {

    this.newViewFlag = true;
    let title: string;
    if (this.recordTypeFieldName && this.recordType) {
      title = this.recordType;
    } else {
      title = this.tableNameWithoutS;
    }

    this.dialogService.open(DynamicFormDialogNewDesignComponent, {
      closeOnEsc: true,
      context: {
        title: title,
        subFormLookupIds: this.subFormLookupIds,
        form: this.tempParentTableHeader,
        button: { text: 'Update' },
        tableName: this.tableName,
        Data: data,
        recordTypeFieldName: this.recordTypeFieldName,
        action: 'Edit',
        tableRecordTypes: this.tableRecordTypes,
        tableDataForForms: this.tableData,
        tableIcon: this.tableIcon,
        viewFlag: this.newViewFlag,
        recordGadgets: this.recordGadgets,
        showChats: this.showChats,
        customValidations: this.customValidations,
        formHeight: this.formHeight,
        formWidth: this.formWidth,
        fieldAlignment: this.fieldAlignment,
        id: id,
        tableId: this.tableId,
      },
    }).onClose.subscribe(name => {
      if (name && name.id) {
        this.loading = true;
        this.getTableDataByName(this.pager.currentPage, this.searchString, this.sortObject, this.filterObject.filterKey, '',
          this.viewCompletedRecords);
        this.tableService.getDynamicTreeDataById(this.tableName, name.id).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
          if (res.statusCode == 200) {

            this.isPopupOpen = true;
            this.location.replaceState('pages/tables/dynamic/' + this.tableId + '/' + this.tableName + '/' + name.id);
            this.openViewModal(res.data, name.id);
            this.isPopupOpen = false;
            this.actionSubscription.unsubscribe();
            if (this.actions && this.actions.length) {
              this.actions.forEach(element => {
                if (element.onSave == 'yes') {
                  const obj = new DynamicTableViewComponent(this.chatSubscriptionService, this.route, this.dialogService,
                    this.tableService, this.service, this.helperService, this.toastrService, this.nbMenuService,
                    null, this.router, null, null, null, this.sidebarService, this.messageService);
                  obj.oldData = data;
                  obj.newData = res.data;
                  obj.onActionsClick('', element);
                }
              });
            }
            this.loading = false;
          }
        });
      } else {
        let url = `/pages/tables/${this.tableName.replace(/ /g, '_')}`;
        if (this.pager && this.pager.currentPage > 1) {
          url += `?page=${this.pager.currentPage}`;
        }
        this.location.replaceState(url);
      }
    });
  }

  ngOnInit() {

    this.filterObject = new Filter();
    if (!this.directViewFlag || this.directViewFlag == undefined) {

      this.route.url.subscribe(params => {
        if (params[0].path) {
          if (params[0].path === 'master-search') {
            this.masterSearchTab = [];
            const tables = ['Addresses', 'Projects', 'Users', 'Invoices',
              'Credit_Cards', 'tables', 'Orders', 'Api', 'Order_Lines',
              'Invoice_Lines', 'Payments', 'Files', 'Roles', 'Permissions'];
            if (this.route.queryParams) {
              const masterSearchPromise = [];
              this.searchSubscription = this.route.queryParams.subscribe(queryParam => {
                this.srcTxt = queryParam.search;
                this.loading = true;
                for (let i = 0; i < tables.length; i++) {
                  masterSearchPromise.push(this.insertSearchResults(tables[i], this.srcTxt));
                }
                Promise.all(masterSearchPromise).then(result => {
                  console.log('masterSearchTab', this.masterSearchTab);
                  this.isSearchPage = true;
                  this.searchSubscription.unsubscribe();
                  this.loading = false;
                }).catch(err => {
                  console.log(err);
                  this.loading = false;
                });
              });
            }
          } else {
            this.showLookupDetail = {};
            this.fromOverview = false;
            this.chartFilter = [];
            this.relatedTableList = [];
            this.noDataFound = false;
            this.isSearchPage = false;
            this.lookupDetailClicked = [];
            this.filteredStatus = [];
            this.tagList = [];
            this.lookupDetailDisplayCount = null;
            this.lookupDetailItem = null;
            this.tableForLookupDetail = '';
            this.pager = {};
            this.watchedIssue = false;
            this.recordTypes = [];
            this.recordType = '';
            this.recordTypeFilter = {};
            this.tutorial = '';
            if (this.fromRecordPage) {
              this.tableName = this.tableName;
            } else {
              this.tableName = params[0].path;
              if (this.tableName == "dynamic") {
                this.tableName = decodeURI(params[2].path);
              }
            }
            this.getTableByName();
            // -- this.getFilterSaveData();
            this.taskedRecordsOnly = false;
            this.loadTutorial();
            this.canAddNewRecord = false;
            this.filterList = [];
            this.statusFilter = [];
            this.hideFilters = true;
            this.viewInModal = false;
            this.newViewFlag = false;
            this.sortObject = null;
            this.searchString = '';
            this.bufferAudioFile();
          }

          // -- Get FilterObject back from cache storage
          const filterdata = this.tableService.getFilterObject();
          this.filterObject = filterdata ? filterdata : this.filterObject;
          if (this.filterObject.tableName == this.tableName) {
            this.filterObject = this.filterObject;
          } else {
            this.filterObject = this.tableService.getFilterObject("empty", "empty");
          }

          if (this.route.queryParams) {
            this.route.queryParams.subscribe(queryParam => {
              if (Object.keys(queryParam).length !== 0) {
                if (queryParam.fromOverview) {
                  this.fromOverview = true;
                  let table;
                  if (this.getTableByNameFlagCalled) {
                    table = this.tableData.filter(v => v.tableName == this.tableName);
                    let lookups = table[0].columns.filter(v => v.type == 'lookup');
                    let oneLookup = lookups.filter(v => v.lookupTableName == queryParam.lookupTableName);
                    this.dynamicSearch(oneLookup[0]);
                  } else {
                    this.tableService.getTablesForMenu().subscribe((res: any) => {
                      table = res.data.filter(v => v.tableName == this.tableName);
                      let lookups = table[0].columns.filter(v => v.type == 'lookup');
                      let oneLookup = lookups.filter(v => v.lookupTableName == queryParam.lookupTableName);
                      this.dynamicSearch(oneLookup[0]);
                    });
                  }
                } else {
                  this.fromOverview = false;
                }

                if (queryParam.fromDashboard) {
                  this.fromDashboard = true;
                }

                if (!this.fromDashboard) {
                  for (const [key, value] of Object.entries(queryParam)) {
                    if (key !== 'search' && key !== 'page' && key !== 'fromOverview' && key !== 'lookupTableName') {
                      let val;
                      if (this.fromOverview) {
                        val = [value]
                      } else {
                        val = value;
                      }
                      this.chartFilter.push({ [key]: val });
                      this.filterObject.filterKey = this.chartFilter;

                    }
                  }
                } else {
                  let obj = JSON.parse(queryParam.filterKey);
                  let keys = Object.keys(obj);
                  keys.forEach(item => {
                    let temp = [];
                    let tempObj = {};
                    temp.push(obj[item]);
                    tempObj[item] = temp;
                    this.filterObject.filterKey.push(tempObj);
                  });
                }
                if (this.tableName === 'Tasks') {
                  const url = `pages/tables/${this.tableName}`;
                  this.router.navigate([url], { queryParams: queryParam });
                }
              }
            });
          }
          const that = this;
          if (this.actionSubscription) {
            this.actionSubscription.unsubscribe();
          }
          this.actionSubscription = this.nbMenuService.onItemClick().subscribe(function (event) {
            that.recordTypes.forEach(function (rc) {
              if (rc.title == event.item.title) {
                that.recordType = rc.title;
                that.onAddUpdate();
              }
            });
          });
        }

        // -- Get viewAll data from cache
        this.storeTreeDataForURL = {
          viewCompletedRecords: false,
          tableName: '',
        };
        const data = this.tableService.getStoreDataFromTree();
        this.storeTreeDataForURL = data ? data : this.storeTreeDataForURL;
        if (this.storeTreeDataForURL.tableName == this.tableName) {
          this.viewAllRecords = this.storeTreeDataForURL.viewCompletedRecords ?
            this.storeTreeDataForURL.viewCompletedRecords : false;
        }

        // -- Get list of users which are Online or Away to display in options
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

        // -- Get list of all users
        this.tableService.$users.subscribe((res: any) => {
          if (res.length) {
            this.allUsers = res;
          }
        });

      });
    }

    // -- For help button design
    const element = document.getElementById('main_body');
    element.classList.add('add-edit-client-form');
    element.classList.add('nb-select-opened');

    // -- CA-730 (implement socket to fetch new records)
    this.socketService.listen('new_record_created').subscribe((data: any) => {
      const IDs = [];
      const filterKey = [];
      const tableName = data.tableName;
      const creator = data.creator;

      if (tableName == this.tableName) {
        const destroy = this.tableService.lastAccessedPage.subscribe((page: number) => {
          if (page == 1 || page == 0) {
            const destroyURL = this.tableService.lastSearchedURL.subscribe((url: string) => {
              this.tableService.getDynamicTreeData('', '', '', '', '', '', '', '', '', '', '', '', '', '', '', url, this.renderAt).pipe(takeUntil(this.destroy$))
                .subscribe((response: any) => {
                  const prevData = this.tableService.allAPIobject;
                  if (prevData.data.pager.totalItems !== response.data.pager.totalItems) {
                    this.handleAPIResponse(IDs, response, filterKey);
                    this.emitMessageSound();
                    destroyURL.unsubscribe();
                    destroy.unsubscribe();
                  }
                });
            });
          }
        });
      }
    });
  }

  private bufferAudioFile(): void {
    this.audioFile = new Audio();
    this.audioFile.src = this.audioSource;
    this.audioFile.load();
  }

  emitMessageSound(): void {
    this.audioFile.play();
  }

  viewClosedEvent($e: MatSlideToggleChange) {
    this.viewCompletedRecords = $e.checked ? true : false;
    this.tableService.getStoreDataFromTree(this.tableName, this.viewCompletedRecords, "viewCompletedRecords")
    this.getTableDataByName(1, this.searchString, this.sortObject, this.filterObject.filterKey, this.searchMode,
      this.viewCompletedRecords);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.recordType = '';
    this.currentUser = JSON.parse(localStorage.getItem('userData'));
    this.route.url.subscribe(params => {

      if (this.directViewFlag) {
        this.isSearchPage = false;
        this.pager = {};
        this.watchedIssue = false;
        this.recordTypes = [];
        this.recordType = '';
        this.recordTypeFilter = {};
        this.tutorial = '';
        if (this.fromRecordPage) {
          this.tableName = this.tableName;
        } else {
          this.tableName = params[2].path;
          if (!this.getTableByNameFlagCalled)
            this.getTableByName();
        }

        // this.getFilterSaveData();
        this.taskedRecordsOnly = false;
        this.loadTutorial();
        this.canAddNewRecord = false;
        this.filterList = [];
        this.statusFilter = [];
        this.hideFilters = true;
        this.tagList = [];
        this.viewInModal = false;
        this.newViewFlag = false;
      }
    });
  }

  loadTutorial() {
    const query = `tutorialFor=Table&tableName=${this.tableName}`;
    this.tableService.getTutorials(query).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      if (res.data) {
        this.tutorial = res.data;
      }
    });
  }

  toggel() {
    this.showArea = !this.showArea;
  }

  getFileExtension(filename) {
    const ext = filename.split('.').pop();
    const obj = iconList.filter(row => {
      if (row.type === ext) {
        return true;
      }
    });
    if (obj.length > 0) {
      const icon = obj[0].icon;
      return icon;
    } else {
      return 'fiv-cla fiv-icon-blank fiv-size-md';
    }
  }

  getFileName(filename) {
    filename = decodeURI(filename);
    return filename.match(/.*\/(.*)$/)[1];
  }

  onMyWatchedIssues(e) {
    this.canShowEyeToolTip = false;
    setTimeout(() => {
      this.canShowEyeToolTip = true;
    }, 0);
    this.watchedIssue = e;
    this.getTableDataByName(this.pager.currentPage, this.searchString, this.sortObject, this.filterObject.filterKey, '', this.viewCompletedRecords);
  }

  onFilePreivew(filename, item) {
    const fileDialog = this.dialogService.open(FilePreviewDialogComponent, {
      context: {
        Data: filename,
        Ext: filename.split('.').pop(),
      },
    });
    fileDialog.componentRef.instance.saveTo.subscribe((data: any) => {
      this.tableService.getDynamicTreeDataById(this.tableName, item._id).subscribe((res: any) => {
        if (res.statusCode == 200) {

          res.data.relatedTo = data;
          res.data.lookup = [];
          delete res.data._id;
          let title: string;

          if (this.recordTypeFieldName && this.recordType) {
            title = 'Add New ' + this.recordType;
          } else {
            title = 'Add New ' + this.tableNameWithoutS;
          }

          if (this.subFormLookupIds && this.subFormLookupIds.length) {
            const ref = this.dialogService.open(DynamicFormDialogComponent, {
              closeOnEsc: false,
              context: {
                title: title,
                isForceSave: true,
                subFormLookupIds: this.subFormLookupIds,
                form: this.tempParentTableHeader,
                button: { text: 'Save' },
                tableName: this.tableName,
                Data: res.data,
                recordType: this.recordType,
                recordTypeFieldName: this.recordTypeFieldName,
                action: 'Add',
                mainTableData: this.tableData,
                tableRecordTypes: this.tableRecordTypes,
                tableDataForForms: this.tableData,
                actions: this.actions,
                customValidations: this.customValidations,
              },
            }).onClose.subscribe(name => {
              if (name && name.close == 'yes') {
                this.isPopupOpen = false;
                this.getTableDataByName(this.pager.currentPage, this.searchString, this.sortObject,
                  this.filterObject.filterKey, '', this.viewCompletedRecords);
              }
            });
          } else {

            const ref = this.dialogService.open(DynamicFormDialogNewDesignComponent, {
              closeOnEsc: true,
              context: {
                title: title,
                isForceSave: true,
                subFormLookupIds: this.subFormLookupIds,
                form: this.tempParentTableHeader,
                button: { text: 'Save' },
                tableName: this.tableName,
                Data: res.data,
                recordType: this.recordType,
                recordTypeFieldName: this.recordTypeFieldName,
                action: 'Add',
                tableRecordTypes: this.tableRecordTypes,
                tableDataForForms: this.tableData,
                tableIcon: this.tableIcon,
                recordGadgets: this.recordGadgets,
                showChats: this.showChats,
                customValidations: this.customValidations,
                formHeight: this.formHeight,
                formWidth: this.formWidth,
                fieldAlignment: this.fieldAlignment,
              },
            }).onClose.subscribe(name => {
              if (name && name.close == 'yes') {
                this.isPopupOpen = false;
                this.getTableDataByName(this.pager.currentPage, this.searchString, this.sortObject,
                  this.filterObject.filterKey, '', this.viewCompletedRecords);
              }
            });
          }
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.actionSubscription) {
      this.actionSubscription.unsubscribe();
    }
    this.filterObject.filterKey = [];

    this.destroy$.next();
    this.destroy$.complete();
  }

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + (nextColumnStep * index);
  }

  onPage(page) {
    if (this.isSearchPage) {
      this.getTableDataByName(page, this.srcTxt, this.sortObject, this.filterObject.filterKey, '', this.viewCompletedRecords);
    } else {
      const url = `/#/pages/tables/${this.tableName.replace(/ /g, '_')}`;
      this.getTableDataByName(page, this.searchString, this.sortObject, this.filterObject.filterKey, '', this.viewCompletedRecords);
      history.pushState(null, null, url + '?page=' + page);
    }
  }

  // -- remove filter and tag from tagList for particular field
  removeText(value, type?, remove = false) {

    if (type === 'lookup') {
      this.filterObject.lookupValue[value] = null;
      this.lookupObj[value] = '';
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
      this.filterObject.numberOperation = null;
      this.filterObject.textValue[value] = '';
    } else if (type === 'formula') {
      this.filterObject.formulaOperation = null;
      this.filterObject.textValue[value] = '';
    } else if (type === 'status') {
      this.filteredStatus = [];
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

    const index = this.filterObject.filterKey.findIndex((v: any) => v.hasOwnProperty(value));
    if (index > -1) {
      this.filterObject.filterKey.splice(index, 1);
      this.tagList.splice(index, 1);
      if (this.filterObject.filterKey.length > 0) {
        this.getTableDataByName(1, this.searchString, this.sortObject, this.filterObject.filterKey, '', this.viewCompletedRecords);
      } else if (!remove) {
        this.getTableDataByName(1, this.searchString, this.sortObject, '', '', this.viewCompletedRecords);
      }
    }
    this.isDefaultValueEnable = false;
  }

  getTaskStatus(data) {
    const taskTable = data.find(x => x.tableName == 'Tasks');
    if (taskTable) {
      const taskColumns = taskTable.columns;
      if (taskColumns && taskColumns.length) {
        const statusData = taskColumns.find(x => x.type == 'status');
        if (statusData && statusData.statusOptions && statusData.statusOptions.length) {
          this.taskStatus = statusData.statusOptions;
        }
      }
    }
  }

  getTableByNameFlagCalled = false;
  datafetched = false;
  getTableByName() {
    this.headerObj = {};
    this.loading = true;
    this.parentTableHeader = [];
    this.tableName = this.tableName.replace(/_/g, ' ').split('?')[0];
    this.tableService.getTablesForMenu().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      if (res.statusCode === 200) {

        this.tableData = res.data;
        this.getTableByNameFlagCalled = true;
        let data = res.data;
        data = data.filter(item => item.tableName == this.tableName);
        this.subFormLookupIds = data[0]?.subFormLookups;
        if (data[0]?.masterDetail) {
          const id = data[0].masterDetail.lookupId;
          data = data[0].columns.filter(item => item.type == 'lookup' && item._id == id);
          this.headerObj = {
            name: data[0]?.lookupTableName,
            fieldName: data[0]?.lookupTableFieldNames,
          };
        }
        this.getTaskStatus(res.data);
        if (this.tableData && this.tableData.length) {
          this.tableData.forEach(ele => {
            if (ele && ele.columns && ele.columns.length) {
              this.getRecordType(Object.assign([], ele.columns), ele.tableName);
            } else {
              this.tableRecordTypes[ele.tableName] = [];
            }
          });
        }
        this.accessTableName = res.data.map(d => d.tableName);
        let tableAccessed = this.accessTableName.includes(this.tableName);
        if (tableAccessed) {
          this.getSavedHeaderWidth();
          if (this.tableName.endsWith('s' || 'S')) {
            this.tableNameWithoutS = this.service.singularize(this.tableName);
          } else {
            this.tableNameWithoutS = this.tableName;
          }

          if (this.fromRecordPage) {
            if (this.getTableByNameObject[this.tableName]) {
              let res = this.getTableByNameObject[this.tableName];
              this.getTableByNameFnCode(res);
            } else {
              this.tableService.getTableByName(this.tableName).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
                this.getTableByNameObject[this.tableName] = res;
                this.getTableByNameFnCode(res);
              });
            }
          } else {
            this.tableService.getTableByName(this.tableName).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
              this.getTableByNameFnCode(res);
            });
          }
        } else {
          console.log(56)
          //-- Redirect to dashboard
          //this.tableService.redirectToHomePage();
        }
      }
    });
  }

  getTableByNameFnCode(res) {
    if (res && res.data && res.data[0].columns) {

      this.actions = res.data[0].actions ? res.data[0].actions : [];
      this.recordGadgets = res.data[0].recordGadgets ? res.data[0].recordGadgets : [];
      if (res.data[0].hasOwnProperty('showChats')) {
        this.showChats = res.data[0].showChats;
      }
      this.customValidations = res.data[0].customValidations ? res.data[0].customValidations : [];
      if (res.data[0].iconLocation) {
        this.tableIcon = res.data[0].iconLocation;
      }
      if (res.data[0].formHeight) {
        this.formHeight = res.data[0].formHeight;
      }
      if (res.data[0].formWidth) {
        this.formWidth = res.data[0].formWidth;
      }
      if (res.data[0].fieldAlignment) {
        this.fieldAlignment = res.data[0].fieldAlignment;
      }
      if (res.data[0].viewInModal) {
        this.viewInModal = res.data[0].viewInModal;
      }
      this.resultData = res.data[0].columns;
      this.resColData = res.data;

      this.canAddNewRecord = res.data[0].hasOwnProperty('addRecordFromMainListing') ?
        res.data[0].addRecordFromMainListing :
        true;
      this.dynamicFilterData = res.data[0].columns;

      if (this.tableName === 'tables') {
        this.canAddNewRecord = false;
      }

      if (this.dynamicFilterData) {
        for (const data of this.dynamicFilterData) {
          this.hideColumn[data.name] = true;
          this.showFilterBox[data.name] = false;
          if (data.type === 'lookup') {

            this.lookTable = data.lookupTableName;
            this.lookupName = data.name;
            this.filterObject.lookupValue[data.name] = null;
            this.filterObject.filteredOptions[data.name] = [];
            this.showAutocomplete[data.name] = false;

            const lookUpArray = [];
            data.options.forEach((el) => {
              const temp: [] = Object.assign([], el);
              temp.shift();
              if (data.loadAsDropDown) {
                if (el.length > 1) {
                  this.filterObject.filteredOptions[data.name] = [
                    ...this.filterObject.filteredOptions[data.name],
                    {
                      id: el[0],
                      value: temp.toString().replace(/,/g, ' '),
                    },
                  ];
                }
              }
              if (data.name == this.lookupName) {
                lookUpArray.push({
                  id: el[0],
                  value: temp.toString().replace(/,/g, ' '),
                });
              }
            });

            if (data.lookupTableName === 'Users') {
              this.filterObject.filteredOptions[data.name].push({ id: '', value: 'Me' });
            }

            this.demoData = data;
            this.lookupData.push(this.demoData);
          }

          if (data.type == 'status') {
            if (data.statusOptions) {
              this.statuses = data.statusOptions.map(m => {
                return m.status;
              });
            }
          }
          if (data.type == 'checkbox') {
            data.options.forEach(element => {
              this.filterObject.check.push(false);
            });
          }
          if (data.isVisibilityOn && data.fieldValuesData && data.fieldValuesData.length > 0) {
            this.dependsFields.push(data);
          }
        }
      }
    }
    if (res && res.statusCode == 404) {
      console.log(55)
      //-- Redirect to dashboard
      this.tableService.redirectToHomePage();
      return;
    }

    if (res && res.data && res.data[0] && res.data[0].columns && res.data[0].columns.length) {
      this.tableId = res.data[0]._id;
      this.datafetched = true;
      this.tempParentTableHeader = Object.assign([], res.data[0].columns);
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

      let page = 1;
      if (this.route.snapshot.queryParamMap.get('page')) {
        page = parseInt(this.route.snapshot.queryParamMap.get('page'));
      }

      this.parentTableHeader = Object.assign([], res.data[0].columns.filter(data => data.displayInList == true));
      this.finalList = res.data[0].columns.filter(ele => {
        if (ele.isSearchable == true) {
          return true;
        }
      });
      if (this.finalList && this.finalList.length) {
        this.finalList = this.finalList;
      } else {
        this.finalList = [];
      }
      this.tableService.getFilterObject(this.filterObject, this.tableName)
      this.allParentTableHeader = res.data[0].columns.filter(data => data.displayInList == true);
      this.parentTableHeader.map(data => data.direction = '');

      this.tableService.defaultFilterSelected(this.tableId).pipe(takeUntil(this.destroy$)).subscribe((tableRe: any) => {
        if (tableRe.statusCode == 200) {

          this.allFilters = cloneDeep([...tableRe.data]);
          const defaultFilter = this.allFilters.filter(v => v.isDefault == true)[0];
          const index = this.allFilters.findIndex(v => v._id == defaultFilter?._id);
          this.defaultStyleFlag = index;
          if (defaultFilter?.tableId === this.tableId && !this.fromOverview && !this.fromDashboard) {

            this.viewAllRecords = defaultFilter?.viewCompletedRecords;
            this.tagList = defaultFilter?.tagList;

            const filterKeyRetrieved = (defaultFilter?.filterObject.filterKey &&
              defaultFilter?.filterObject.filterKey.length > 0) ?
              defaultFilter.filterObject.filterKey : [];
            filterKeyRetrieved.forEach(element => {
              let statusField = Object.keys(element)[0];
              if (statusField == 'status') {
                this.filteredStatus = element[statusField];
              }
            });

            this.tagList.forEach(element => {
              if (element.type === 'lookup') {
                let temp = [];
                element.value.forEach((item, i) => {
                  temp.push({
                    id: element.id[i],
                    value: item.trim().endsWith(',') ? item.trim().substr(0, item.trim().length - 1) : item.trim()
                  });
                });
                this.filterObject.lookupValue[element.name] = temp;
              } else if (element.type === 'watchedBy') {
                let temp = [];
                element.value.forEach((item, i) => {
                  temp.push({
                    _id: element.id[i],
                    value: item.trim().endsWith(',') ? item.trim().substr(0, item.trim().length - 1) : item.trim()
                  });
                });
                this.filterObject.users = temp;
              } else if (element.type === 'date') {
                this.filterObject.range.start = new Date(element.value.split('-')[0].trim());
                this.filterObject.range.end = new Date(element.value.split('-')[1].trim());
              } else if (element.type === 'dateTime') {
                this.filterObject.DateTimerange.start = new Date(element.value.split('-')[0].trim());
                this.filterObject.DateTimerange.end = new Date(element.value.split('-')[1].trim());
              } else if (element.type === 'dropdown') {
                this.filterObject.dropdownValue = element.value;
              } else if (element.type === 'dropdownWithImage') {
                this.filterObject.dropdownWithImageValue = element.value;
              } else if (element.type === 'number') {
                this.filterObject.numberOperation = element.value;
                this.filterObject.textValue[element.name] = element.value;
              } else if (element.type === 'formula') {
                this.filterObject.formulaOperation = element.value;
                this.filterObject.textValue[element.name] = element.value;
              } else if (element.type === 'status') {
                this.filteredStatus = element.value;
              } else if (element.type === 'checkbox') {
                let checkboxcheck = [];
                checkboxcheck = element.value.split(',');
                let dataCheck = this.finalList.filter(v => v.name == element.name)[0];
                checkboxcheck.forEach((ele) => {
                  this.filterObject.checkboxArray.push(ele);
                  dataCheck.options.forEach((element, i) => {
                    if (element == ele)
                      this.filterObject.check[i] = true;
                  });
                })
              } else if (element.type === 'radio') {
                this.filterObject.radio = element.value;
              }
            });

            this.filterObject.filterKey = filterKeyRetrieved.concat(this.filterObject.filterKey);
            this.tableService.getFilterObject(this.filterObject, this.tableName);
            if (this.fromRecordPage) {
              if (this.count > 0) {
                if (this.filterObject.filterKey && this.filterObject.filterKey.length) {
                  this.createTagList();
                  this.getTableDataByName(page, this.searchString, this.sortObject, this.filterObject.filterKey,
                    this.searchMode, this.viewCompletedRecords);
                }
              }
            } else {
              if (this.filterObject.filterKey && this.filterObject.filterKey.length) {
                this.createTagList();
                this.getTableDataByName(page, this.searchString, this.sortObject, this.filterObject.filterKey,
                  this.searchMode, this.viewCompletedRecords);
              }
            }
          } else {
            this.getAllApiCallFromGetTableByNameFn(page);
          }
        } else {
          this.toastrService.danger(tableRe.message);
        }
      });
      this.parentTableHeader = Object.assign([], res.data[0].columns.filter(data => data.displayInList == true));
      if (this.fromOverview || this.fromDashboard) {
        this.finalList = res.data[0].columns;
      } else {
        this.finalList = res.data[0].columns.filter(ele => {
          if (ele.isSearchable == true) {
            return true;
          }
        });
      }
      if (this.finalList && this.finalList.length) {
        this.finalList = this.finalList;
      } else {
        this.finalList = [];
      }
      this.tableService.getFilterObject(this.filterObject, this.tableName);
      if (this.directViewFlag) {
        this.directViewFlag = false;
        this.tableService.getDynamicTreeDataById(this.directTableName, this.rowId).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
          if (res.statusCode == 200) {
            this.location.replaceState('pages/tables/dynamic/' + this.tableId + '/' + this.tableName + '/' + this.rowId);
            this.openViewModal(res.data, this.rowId);
            this.isPopupOpen = false;
          }
        });
      }
    }
  }

  getAllApiCallFromGetTableByNameFn(page) {
    if (this.fromRecordPage) {
      if (this.count > 0) {
        if (this.fromOverview) {
          if (this.chartFilter.length > 0) {
            this.getTableDataByName(page, this.searchString, this.sortObject, this.chartFilter);
          }
        } else {
          if (this.recordTypes && this.recordTypes.length === 0) {
            if (this.chartFilter.length > 0) {
              this.getTableDataByName(page, this.searchString, this.sortObject, this.chartFilter);
              this.createTagList();
            } else if (this.filterDefaultList) {
              this.getTableDataByName(page, this.searchString, this.sortObject, this.filterDefaultList['filterList'], '', this.viewCompletedRecords);
            } else {
              this.getTableDataByName(page, this.searchString, this.sortObject);
            }
          }
        }
      }
    } else if(this.fromDashboard){
      if (this.filterObject.filterKey && this.filterObject.filterKey.length) {
        this.createTagList();
        this.getTableDataByName(page, this.searchString, this.sortObject, this.filterObject.filterKey,
          this.searchMode, this.viewCompletedRecords);
      }
    } else {
      if (this.fromOverview) {
        if (this.chartFilter.length > 0) {
          this.getTableDataByName(page, this.searchString, this.sortObject, this.chartFilter);
        }
      } else {
        if (this.recordTypes && this.recordTypes.length === 0) {
          if (this.chartFilter.length > 0) {
            this.getTableDataByName(page, this.searchString, this.sortObject, this.chartFilter);
            this.createTagList();
          } else if (this.filterDefaultList) {
            this.getTableDataByName(page, this.searchString, this.sortObject, this.filterDefaultList['filterList'], '', this.viewCompletedRecords);
          } else {
            this.getTableDataByName(page, this.searchString, this.sortObject);
          }
        }
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

  getStatusColor(status) {
    let color = '';
    this.pageOfItems.forEach(element => {
      this.parentTableHeader.map((r) => {
        if (r.type == 'status') {
          r.statusOptions.map((it) => {
            if (it.status == status) {
              color = it.color;
            }
          });
        }
      });
    });
    return color;
  }

  handleAPIResponse(IDs, response, filterKey) {

    if (response && response.data && response.data.pageOfItems && response.data.pageOfItems.length) {
      this.parentTableData = [];
      this.pager = response.data.pager;
      this.pageOfItems = response.data.pageOfItems;

      response.data.pageOfItems.forEach(element => {
        IDs.push(element._id);
        if (this.resColData && this.resColData[0] && this.resColData[0].columns) {

          for (const col of this.resColData[0].columns) {
            this.hideColumn[col.name] = true;
            if (filterKey) {
              filterKey.forEach(e => {
                if (col.name === Object.keys(e)[0]) {
                  this.filterObject.filterKey[col.name] = Object.values(e)[0];
                }
              });
            }
            if (col.type === 'file') {
              if ((typeof element[col.name]) == 'string') {
                element[col.name] = element[col.name];
              } else {
                if (element[col.name]) {
                  element[col.name] = element[col.name];
                }
              }
            }
          }
        }
      });

      this.parentTableData = Object.assign([], response.data.pageOfItems);
      this.parentTableData.forEach((element, i) => {
        element.expand = false;

        const phoneCheck = this.parentTableHeader.filter(v => v.name == 'phoneNumber');
        if (phoneCheck && phoneCheck[0] && phoneCheck[0].isPhone) {
          element.phoneNumber = this.changesPhoneDashes(element.phoneNumber);
        }
        // -- set lookup data...
        if (element.lookups && element.lookups.length) {
          element.lookups.forEach(lookup => {
            const inde = this.lookupData.findIndex(f => f.name == lookup.lookupName);
            if (inde > -1) {
              if (this.lookupData[inde].isReference) {
                const col = this.parentTableHeader.filter(v => v.type == 'refButton');
                if (col && col.length) {
                  if (!element[col[0].label])
                    element[col[0].label] = [];
                  element[col[0].label].push(lookup);
                }
              }
              if (!element[lookup.lookupName])
                element[lookup.lookupName] = [];
              element[lookup.lookupName].push(lookup);
            }
          });
        };
        this.getRecordGadgets(element, i);
      });
      if (IDs.length > 0) {
        this.getTasksCount(IDs);
      }
      if (this.isSearchPage) {
        this.setSearchItemTabCount();
      }
    } else {
      this.noDataFound = true;
      this.parentTableData = [];
    }
    this.loading = false;
  }

  changesPhoneDashes(phone) {
    const phoneVal = phone.replace(/\D[^\.]/g, '');
    return phoneVal.slice(0, 3) + '-' + phoneVal.slice(3, 6) + '-' + phoneVal.slice(6);
  }

  getTableDataByName(page, search?, sort?, filterKey?, searchMode?, viewCompletedRecords?, statusFilter?) {

    this.loading = true;
    const IDs = [];

    let filterArray = (filterKey && filterKey.length) ? cloneDeep([...filterKey]) : [];
    if (filterArray && filterArray.length) {
      filterArray.forEach(item => {
        let objKeys = Object.keys(item);
        let temp = [];
        if (item[objKeys[0]] && (typeof (item[objKeys[0]]) == 'object') && item[objKeys[0]].length) {
          item[objKeys[0]].forEach(val => {
            if (val == '' || val == null)
              val = this.currentUser._id;

            temp.push(val);
          });
          item[objKeys[0]] = temp;
        }
      });
    }

    this.tableService.getDynamicTreeData(this.tableName, page, search, sort, cloneDeep(filterArray),
      this.recordTypeFilter, this.taskedRecordsOnly,
      this.watchedIssue ? this.watchedIssue : { watchedIssue: true, noFilter: true }, '', '', '', '',
      searchMode,
      viewCompletedRecords, statusFilter, '', this.renderAt
    ).pipe(takeUntil(this.destroy$)).subscribe(((response: any) => {
      this.tableService.getStoreDataFromTree(this.tableName, response, 'allApi');
      this.handleAPIResponse(IDs, response, filterKey);
    }));
  }

  setSearchItemTabCount() {
    this.masterSearchTab.forEach(data => {
      if (data.title === this.tableName) {
        data.parentTableData = this.parentTableData;
      }
    });
  }

  getTasksCount(IDs) {
    this.tableService.getTasksCount(this.tableName, JSON.stringify(IDs)).pipe(takeUntil(this.destroy$)).subscribe(((response: any) => {
      if (response.statusCode == 200) {
        this.taskData = response.data;
      }
    }));
  }

  onAction(row) {
    this.threeDotSubscription = this.nbMenuService.onItemClick().pipe(takeUntil(this.destroy$)).subscribe((event) => {
      console.log(event);
      // -- Do not proceed on record Type action
      if (this.recordTypes.includes(event.item.title)) {
        return false;
      }

      if (event.item.icon['pack'] == 'delete') {
        this.onDeleteConfirm(row);
        this.threeDotSubscription.unsubscribe();
      } else {
        this.isPopupOpen = false;
        if (this.isPopupOpen === false) {
          if (event.item.icon['pack'] == 'edit') {
            try {
              this.isPopupOpen = true;
              this.tableService.getDynamicTreeDataById(this.tableName, row._id).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
                if (res.statusCode == 200) {
                  this.onAddUpdate(res.data, row._id);
                  this.isPopupOpen = false;
                  this.threeDotSubscription.unsubscribe();
                }
              });
            } catch (error) {

            }
          }
        }
        if (event.item.icon['pack'] == 'view') {
          if (this.viewInModal) {
            try {
              this.isPopupOpen = true;
              this.tableService.getDynamicTreeDataById(this.tableName, row._id).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
                if (res.statusCode == 200) {
                  this.location.replaceState('pages/tables/dynamic/' + this.tableId + '/' + this.tableName + '/' + row._id);
                  this.openViewModal(res.data, row._id);
                  this.isPopupOpen = false;
                  this.threeDotSubscription.unsubscribe();
                }
              });
            } catch (error) {

            }
          } else {
            try {
              this.router.navigate(['pages/tables/dynamic/' + this.tableId + '/' + this.tableName + '/' + row._id]);
              this.threeDotSubscription.unsubscribe();
              this.isPopupOpen = false;
            } catch (error) {

            }
          }
        }
      }
    });
  }

  openEditCallLog(id) {
    this.isPopupOpen = true;
    this.tableService.getDynamicTreeDataById(this.tableName, id).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.onAddUpdate(res.data, id);
        this.isPopupOpen = false;
        this.actionSubscription.unsubscribe();
      }
    });
  }

  createSubscription() {
    this.httpSubscriber = new Subscription();
  }

  recordItem;
  private httpSubscriber = new Subscription();
  onShowLookupDetail(event, index, lookupData, columnName, item) {

    let dataForLookupDetail;
    this.recordItem = item;
    this.lookupDetailClicked[index] = false;
    this.lookupDetailDisplayCount = null;
    this.lookupDetailItem = null;
    this.tableForLookupDetail = '';
    this.httpSubscriber.unsubscribe();

    if (this.showLookupDetail[lookupData._id]) {
      dataForLookupDetail = this.showLookupDetail[lookupData._id];
    } else {
      this.httpSubscriber = this.tableService.getDynamicTreeDataById(lookupData.table, lookupData._id).pipe(debounceTime(2000)).subscribe((res: any) => {
        if (res.statusCode == 200) {
          dataForLookupDetail = res.data;
          this.showLookupDetail[lookupData._id] = res.data;
        }
      }, (err) => {
        this.httpSubscriber = null;
      });
    }
    this.lookupDetailClicked[index] = true;
    this.lookupDetailDisplayCount = index;
    this.lookupDetailItem = lookupData;
    this.tableForLookupDetail = lookupData.table;
    this.cdr.detectChanges();
    event.stopPropagation();
  }

  onAddUpdate(data?, id?) {

    let title: string;
    if (this.recordTypeFieldName && this.recordType) {
      title = 'Add New ' + this.recordType;
    } else {
      title = 'Add New ' + this.tableNameWithoutS;
    }
    if (!data) {

      if (this.subFormLookupIds && this.subFormLookupIds.length) {
        const ref = this.dialogService.open(DynamicFormDialogComponent, {
          closeOnEsc: false,
          context: {
            title: title,
            subFormLookupIds: this.subFormLookupIds,
            form: this.tempParentTableHeader,
            button: { text: 'Save' },
            tableName: this.tableName,
            Data: null,
            recordType: this.recordType,
            recordTypeFieldName: this.recordTypeFieldName,
            action: 'Add',
            mainTableData: this.tableData,
            tableRecordTypes: this.tableRecordTypes,
            tableDataForForms: this.tableData,
            actions: this.actions,
            customValidations: this.customValidations,
          },
        }).onClose.subscribe(name => {
          if (name && name.close == 'yes') {
            this.isPopupOpen = false;
            this.getTableDataByName(this.pager.currentPage, this.searchString, this.sortObject, this.filterObject.filterKey);
          }
        });
      } else {
        const ref = this.dialogService.open(DynamicFormDialogNewDesignComponent, {
          closeOnEsc: true,
          context: {
            title: title,
            form: this.tempParentTableHeader,
            button: { text: 'Save' },
            tableName: this.tableName,
            Data: null,
            recordType: this.recordType,
            recordTypeFieldName: this.recordTypeFieldName,
            action: 'Add',
            tableRecordTypes: this.tableRecordTypes,
            tableDataForForms: this.tableData,
            tableIcon: this.tableIcon,
            actions: this.actions,
            customValidations: this.customValidations,
            recordGadgets: this.recordGadgets,
            showChats: this.showChats,
            tableId: this.tableId,
            formHeight: this.formHeight,
            formWidth: this.formWidth,
            fieldAlignment: this.fieldAlignment,
            fromRecordPage: this.fromRecordPage
          },
        }).onClose.subscribe(name => {
          if (name && name.close == 'yes') {
            if (name.continue) {

              this.getTableDataByName(this.pager.currentPage, this.searchString, this.sortObject, this.filterObject.filterKey);
              this.tableService.getDynamicTreeDataById(this.tableName, name.data._id).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
                if (res.statusCode == 200) {
                  this.isPopupOpen = true;
                  this.location.replaceState('pages/tables/dynamic/' + this.tableId + '/' + this.tableName + '/' + name.data._id);
                  this.openViewModal(res.data, name.data._id);
                  this.isPopupOpen = false;
                  this.actionSubscription.unsubscribe();
                  if (this.actions && this.actions.length) {
                    this.actions.forEach(element => {
                      if (element.onSave == 'yes') {
                        const obj = new DynamicTableViewComponent(this.chatSubscriptionService, this.route, this.dialogService,
                          this.tableService, this.service, this.helperService, this.toastrService, this.nbMenuService, null,
                          this.router, null, null, null, this.sidebarService, this.messageService);
                        obj.oldData = res.data;
                        obj.newData = res.data;
                        obj.onActionsClick('', element);
                      }
                    });
                  }
                  this.loading = false;
                }
              });
            } else {
              this.isPopupOpen = false;
              this.getTableDataByName(this.pager.currentPage, this.searchString, this.sortObject, this.filterObject.filterKey);
            }
          }
        });
      }
    } else {
      if (this.recordTypeFieldName && data.hasOwnProperty([this.recordTypeFieldName])) {
        title = 'Edit ' + data[this.recordTypeFieldName];
      } else {
        title = 'Edit ' + this.tableNameWithoutS;
      }

      if (this.subFormLookupIds && this.subFormLookupIds.length) {
        this.dialogService.open(DynamicFormDialogComponent, {
          closeOnEsc: false,
          context: {
            title: title,
            subFormLookupIds: this.subFormLookupIds,
            form: this.tempParentTableHeader,
            button: { text: 'Update' },
            tableName: this.tableName,
            Data: data,
            recordTypeFieldName: this.recordTypeFieldName,
            action: 'Edit',
            mainTableData: this.tableData,
            tableRecordTypes: this.tableRecordTypes,
            tableDataForForms: this.tableData,
            actions: this.actions,
            customValidations: this.customValidations,
          },
        }).onClose.subscribe(name => {
          if (name && name.close == 'yes') {
            this.isPopupOpen = false;
            this.getTableDataByName(this.pager.currentPage, this.searchString, this.sortObject, this.filterObject.filterKey);
          }
        });
      } else {
        this.dialogService.open(DynamicFormDialogNewDesignComponent, {
          closeOnEsc: true,
          context: {
            title: title,
            subFormLookupIds: this.subFormLookupIds,
            form: this.tempParentTableHeader,
            button: { text: 'Update' },
            tableName: this.tableName,
            Data: data,
            recordTypeFieldName: this.recordTypeFieldName,
            action: 'Edit',
            tableRecordTypes: this.tableRecordTypes,
            tableDataForForms: this.tableData,
            tableIcon: this.tableIcon,
            id: id,
            actions: this.actions,
            recordGadgets: this.recordGadgets,
            showChats: this.showChats,
            customValidations: this.customValidations,
            tableId: this.tableId,
            formHeight: this.formHeight,
            formWidth: this.formWidth,
            fieldAlignment: this.fieldAlignment,
            fromRecordPage: this.fromRecordPage
          },
        }).onClose.subscribe(name => {
          if (name && name.close == 'yes') {
            if (name.continue) {
              this.getTableDataByName(this.pager.currentPage, this.searchString, this.sortObject, this.filterObject.filterKey);
              this.tableService.getDynamicTreeDataById(this.tableName, name.id).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
                if (res.statusCode == 200) {
                  this.isPopupOpen = true;
                  this.location.replaceState('pages/tables/dynamic/' + this.tableId + '/' + this.tableName + '/' + name.id);
                  this.openViewModal(res.data, name.id);
                  this.isPopupOpen = false;
                  this.actionSubscription.unsubscribe();
                  if (this.actions && this.actions.length) {
                    this.actions.forEach(element => {
                      if (element.onSave == 'yes') {
                        const obj = new DynamicTableViewComponent(this.chatSubscriptionService, this.route, this.dialogService,
                          this.tableService, this.service, this.helperService, this.toastrService, this.nbMenuService, null,
                          this.router, null, null, null, this.sidebarService, this.messageService);
                        obj.oldData = data;
                        obj.newData = res.data;
                        obj.onActionsClick('', element);
                      }
                    });
                  }
                  this.loading = false;
                }
              });
            } else {
              this.isPopupOpen = false;
              this.getTableDataByName(this.pager.currentPage, this.searchString, this.sortObject, this.filterObject.filterKey);
            }
          }
        });
      }
    }
  }

  onDeleteConfirm(data): void {
    this.dialogService.open(DeleteDialogComponent)
      .onClose.subscribe(name => {
        if (name) {
          this.tableService.deleteDynamicFormData(data._id, this.tableName).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
            if (res.statusCode === 200) {
              this.treeUpdated.emit();
              this.getTableDataByName(this.pager.currentPage, this.searchString, this.sortObject, this.filterObject.filterKey);
            }
          });

        }
      });
  }

  onSearch(data, type) {
    this.searchString = data;
    this.searchMode = 'yes';
    if (this.filterObject.filterKey.length > 0) {
      this.getTableDataByName(1, data, this.sortObject, this.filterObject.filterKey, this.searchMode, this.viewCompletedRecords);
    } else {
      this.getTableDataByName(1, data, this.sortObject, '', this.searchMode, this.viewCompletedRecords);
    }
  }

  // -- Create Tags based on Filters applied.
  createTagList() {

    this.tagList = [];
    if (this.filterObject.filterKey && this.filterObject.filterKey.length) {
      this.filterObject.filterKey.forEach(ele => {
        let keys = [];
        keys = Object.keys(ele);
        if (keys && keys.length) {
          keys.forEach(item => {
            const obj = {
              name: '',
              type: '',
              value: null,
            };
            if (item == 'watchedBy') {
              obj.name = 'Watched By';
              obj.type = 'watchedBy';
              obj.value = [];
              ele[item].forEach((value, i) => {
                if (value == '' || value == null) {
                  if (i == 0 && i == ele[item].length - 1) {
                    obj.value.push('  ' + 'Me');
                  } else if (i == ele[item].length - 1) {
                    obj.value.push('  ' + 'Me');
                  } else {
                    obj.value.push('  ' + 'Me' + ',');
                  }
                } else {
                  if (this.allUsers && this.allUsers.length) {
                    this.allUsers.forEach(element => {
                      if (value == element._id) {
                        if (i == 0 && i == ele[item].length - 1) {
                          obj.value.push('  ' + element.firstName + ' ' + element.lastName);
                        } else if (i == ele[item].length - 1) {
                          obj.value.push('  ' + element.firstName + ' ' + element.lastName);
                        } else {
                          obj.value.push('  ' + element.firstName + ' ' + element.lastName + ',');
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
                  if (obj.type == 'lookup') {
                    obj.value = [];
                    ele[item].forEach((value, ind) => {

                      if (value == '') {
                        if (ind == 0 && ind == ele[item].length - 1) {
                          obj.value.push('  ' + 'Me');
                        } else if (ind == ele[item].length - 1) {
                          obj.value.push('  ' + 'Me');
                        } else {
                          obj.value.push('  ' + 'Me' + ',');
                        }
                      } else {
                        if (this.filterObject.filteredOptions[obj.name] && this.filterObject.filteredOptions[obj.name].length) {
                          this.filterObject.filteredOptions[obj.name].forEach((element, i) => {
                            if (value == element.id) {
                              if (ind == 0 && ind == ele[item].length - 1) {
                                obj.value.push('  ' + element.value);
                              } else if (ind == ele[item].length - 1) {
                                obj.value.push('  ' + element.value);
                              } else {
                                obj.value.push('  ' + element.value + ',');
                              }
                            }
                          });
                        }
                      }
                    });
                  } else if (obj.type == 'dateTime') {
                    const start = this.datePipe.transform(this.filterObject.DateTimerange.start, 'shortDate');
                    const end = this.datePipe.transform(this.filterObject.DateTimerange.end, 'shortDate');
                    obj.value = start + ' - ' + end;
                  } else if (obj.type == 'date') {
                    const start = this.datePipe.transform(new Date(this.filterObject.range.start), 'shortDate');
                    const end = this.datePipe.transform(new Date(this.filterObject.range.end), 'shortDate');
                    obj.value = start + ' - ' + end;
                  } else {
                    obj.value = ele[item];
                  }
                }
              });
            }
            if (obj.value && obj.name)
              this.tagList.push(obj);
          });
        }
      });
    }
  }

  onSort(event) {

    this.sortObject = null;
    if (event.direction == '') {
      event.direction = 'asc';
      this.sortObject = {
        direction: 'asc',
        column: event.name,
      };
      this.getTableDataByName(1, this.searchString, this.sortObject, this.filterObject.filterKey, '', this.viewCompletedRecords);
    } else if (event.direction == 'asc') {
      this.sortObject = {
        direction: 'desc',
        column: event.name,
      },
        event.direction = 'desc';
      this.getTableDataByName(1, this.searchString, this.sortObject, this.filterObject.filterKey, '', this.viewCompletedRecords);
    } else {
      event.direction = 'asc';
      this.sortObject = {
        direction: 'asc',
        column: event.name,
      };
      this.getTableDataByName(1, this.searchString, this.sortObject, this.filterObject.filterKey, '', this.viewCompletedRecords);
    }
  }

  getLink(resourceId) {
    return '#/pages/tables/dynamic/' + this.tableId + '/' + this.tableName + '/' + resourceId;
  }

  onExport() {
    const columns = this.resColData[0].columns.map((c) => ({ ...c, selected: true }));
    this.dialogService.open(ExportTableDataComponent, {
      context: {
        columnList: columns,
        tableName: this.tableName,
        recordTypes: this.recordTypeFilter,
      },
    });
  }

  openDialogForView(value, resourceLink) {
    this.dialogService.open(ViewLookupInDialogComponent, {
      context: {
        value: value,
        resourceLink: resourceLink,
      },
    });
  }

  onSaveFilterValue() {
    this.dialogService.open(FilterDataSaveComponent, {
      context: {
        tableName: this.tableName,
        filerDataSend: this.filterObject.filterKey,
      },
    }).onClose.subscribe(name => {
      if (name == 'yes') {
        this.getFilterSaveData();
      }
    });
  }

  onCheckFilter(event, fList) {
    const checkFilter = event.target.checked;
    fList.isDefaultList = checkFilter;
    if (this.filterDefaultList) {
      this.filterDefaultList.isDefaultList = false;
      this.tableService.updateDynamicFormData(this.filterDefaultList._id, 'filterList',
        this.filterDefaultList).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        });
      const index = this.filterDisplay.findIndex(f => f._id === this.filterDefaultList._id);
      this.filterDisplay[index].isDefaultList = false;
    } else {
      fList.isDefaultList = true;
      this.tableService.updateDynamicFormData(fList._id, 'filterList', fList).pipe(takeUntil(this.destroy$))
        .subscribe((res: any) => {
        });
    }
    if (checkFilter === false) {
      this.getTableDataByName(1, this.searchString, this.sortObject);
      this.filterDefaultList = undefined;
    } else {
      this.searchOnFilter(fList['filterList']);
      this.filterDefaultList = fList;
    }
  }

  getFilterSaveData() {
    this.tableService.getFilterSaveData(this.tableName).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.filterDisplay = res.data;
      this.filterDefaultList = this.filterDisplay.find(x => x.isDefaultList == true);
    });
  }

  searchOnFilter(filterKey) {
    this.getTableDataByName(1, this.searchString, this.sortObject, filterKey, '', this.viewCompletedRecords);
  }

  onDeleteFList(data): void {
    this.dialogService.open(DeleteDialogComponent)
      .onClose.subscribe(name => {
        if (name) {
          this.tableService.deleteDynamicFormData(data._id, 'filterList').pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
            if (res.statusCode === 200) {
              this.getFilterSaveData();
            }
          });
        }
      });
  }

  cancelSubscription(resourceId: string): void {
    this.chatSubscriptionService
      .cancelSubscription({
        resourceId: resourceId,
        userId: this.currentUser,
      }).pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data.statusCode == 200) {
          this.getTableDataByName(this.pager.currentPage, this.searchString, this.sortObject, this.filterObject.filterKey, '', this.viewCompletedRecords);
          this.toastrService.success(data.message, 'Action was  completed!');
        }
      });
  }

  activateSubscription(resourceId) {
    const data = {
      resourceId: resourceId,
      userId: this.currentUser,
      tableName: this.tableName,
      invitedBy: this.currentUser,
    };

    this.chatSubscriptionService.watch(data).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        if (res.statusCode === 201) {
          this.getTableDataByName(this.pager.currentPage, this.searchString, this.sortObject, this.filterObject.filterKey, '', this.viewCompletedRecords);
          this.toastrService.success(res.message, 'Success');
        } else {
          this.loading = false;
          this.toastrService.danger(res.message, 'Error');
        }
      },
      (error) => {
        this.toastrService.danger(
          `${error.error && error.error.message}`,
          'Error',
        );
        this.loading = false;
      },
      () => {
      },
    );
  }

  // -- Open record for view in modal or old view mode
  tdClick(tableId, tableName, _id, type, fieldValue) {
    if (type != 'file') {
      let link = '';
      if (type == 'lookup') {
        if (fieldValue)
          link = fieldValue.length ? fieldValue[0].link : fieldValue;
      } else {
        link = fieldValue;
      }

      if (this.viewInModal) {
        this.tableService.getDynamicTreeDataById(this.tableName, _id).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
          if (res.statusCode == 200) {
            this.location.replaceState('pages/tables/dynamic/' + tableId + '/' + tableName + '/' + _id);
            this.openViewModal(res.data, _id);
            this.isPopupOpen = false;
            this.actionSubscription.unsubscribe();
          }
        });
      } else {
        this.router.navigate(['/pages/tables/dynamic/' + tableId + '/' + tableName + '/' + _id]);
      }
    }
  }

  onSearchtabChanged(event) {
    this.masterSearchTab.forEach(data => {
      if (data.title === event.tabTitle) {
        this.tableName = data.tableName;
        this.recordTypes = data.recordTypes;
        this.tempParentTableHeader = data.tempParentTableHeader;
        this.parentTableHeader = data.parentTableHeader;
        this.dynamicFilterData = data.dynamicFilterData;
        this.hideColumn = data.hideColumn;
        this.showFilterBox = data.showFilterBox;
        this.parentTableData = data.parentTableData;
        this.pager = data.pager;
        this.headerObj = data.headerObj;
        this.taskStatus = data.taskStatus;
        this.accessTableName = data.accessTableName;
        this.statuses = data.statuses;
        this.dependsFields = data.dependsFields;
        this.headerWidth = data.headerWidth;
        this.tableNameWithoutS = data.tableNameWithoutS;
        this.canAddNewRecord = data.canAddNewRecord;
        this.recordTypeFieldName = data.recordTypeFieldName;
        this.lookupData = data.lookupData;
      }
    });
  }

  ontabChanged(event) {

    this.parentTableHeader = this.allParentTableHeader;
    this.recordTypeFilter = { [this.recordTypeFieldName]: (event.tabTitle) };

    this.dependsFields.forEach(element => {
      if (!(element.fieldValuesData.length > 0 && element.fieldValuesData.includes(this.service.singularize(event.tabTitle)))) {
        this.parentTableHeader = this.parentTableHeader.filter(x => x.name !== element.name);
      }
    });
    if (!this.fromOverview && !this.fromDashboard) {
      if (this.filterDefaultList) {
        this.getTableDataByName(1, this.searchString, this.sortObject, this.filterDefaultList['filterList']);
      } else {
        this.getTableDataByName(1, this.searchString, this.sortObject);
      }
    }

  }

  onWidthChange(i, id) {

    let headerWidth;
    headerWidth = document.getElementById(id);
    headerWidth = headerWidth.style.minWidth;
    this.parentTableHeader.forEach((ele, index) => {
      if (i !== index)
        this.condition[index] = false;
    });
    const foundIndex = this.thWidth.findIndex(x => x.index === i && x.tableName === this.tableName);
    if (foundIndex != -1) {
      this.thWidth[foundIndex].headerWidth = headerWidth;
    } else {
      this.thWidth.push({
        index: i,
        headerWidth: headerWidth,
        'tableName': this.tableName,
      });
    }
    localStorage.setItem('col-size', JSON.stringify(this.thWidth));
  }

  getSavedHeaderWidth() {
    const headerColumnsWidth = JSON.parse(localStorage.getItem('col-size'));
    headerColumnsWidth && headerColumnsWidth.forEach(col => {
      if (col.tableName === this.tableName) {
        this.condition[col.index] = true;
        this.headerWidth = col.headerWidth;
      }
    });
  }

  insertSearchResults(tblName, srcTxt) {
    return new Promise((resolve, reject) => {
      const serachItem: any = {
        title: tblName,
        tempParentTableHeader: [],
        parentTableHeader: [],
        dynamicFilterData: [],
        parentTableData: [],
        lookupData: [],
        dependsFields: [],
        tableRecordTypes: [],
        showFilterBox: {},
        hideColumn: {},
        recordTypes: [],
        filteredOptions: {},
        tableName: '',
      };
      this.tableService.getTablesForMenu().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        if (res.statusCode === 200) {
          serachItem.tableData = res.data;
          let data = res.data;
          data = data.filter(item => item.tableName == tblName);
          this.subFormLookupIds = data[0]?.subFormLookups;
          if (data[0]?.masterDetail) {
            const id = data[0].masterDetail.lookupId;
            data = data[0].columns.filter(item => item.type == 'lookup' && item._id == id);
            serachItem.headerObj = {
              name: data[0]?.lookupTableName,
              fieldName: data[0]?.lookupTableFieldNames,
            };
          }
          const taskTable = data.find(x => x.tableName == 'Tasks');
          if (taskTable) {
            const taskColumns = taskTable.columns;
            if (taskColumns && taskColumns.length) {
              const statusData = taskColumns.find(x => x.type == 'status');
              if (statusData && statusData.statusOptions && statusData.statusOptions.length) {
                serachItem.taskStatus = statusData.statusOptions;
              }
            }
          }

          if (serachItem.tableData && serachItem.tableData.length) {
            this.tableData.forEach(ele => {
              if (ele && ele.columns && ele.columns.length) {
                const cols = Object.assign([], ele.columns);
                const tableName = ele.tableName;
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
                  serachItem.tableRecordTypes[tableName] = recordArray;
                }
              } else {
                serachItem.tableRecordTypes[ele.tableName] = [];
              }
            });
          }

          serachItem.accessTableName = res.data.map(d => d.tableName);
          if (serachItem.accessTableName.includes(tblName)) {
            const headerColumnsWidth = JSON.parse(localStorage.getItem('col-size'));
            headerColumnsWidth && headerColumnsWidth.forEach(col => {
              if (col.tableName === this.tableName) {
                serachItem.condition[col.index] = true;
                serachItem.headerWidth = col.headerWidth;
              }
            });
            if (tblName.endsWith('s' || 'S')) {
              serachItem.tableNameWithoutS = this.service.singularize(tblName);
            } else {
              serachItem.tableNameWithoutS = tblName;
            }

            this.tableService.getTableByName(tblName).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
              if (res && res.data && res.data[0].columns) {
                this.resultData = res.data[0].columns;
                serachItem.resColData = res.data;
                debugger
                serachItem.canAddNewRecord = res.data[0].hasOwnProperty('addRecordFromMainListing') ?
                  res.data[0].addRecordFromMainListing :
                  true;
                serachItem.dynamicFilterData = res.data[0].columns;
                if (serachItem.dynamicFilterData) {
                  for (const data of serachItem.dynamicFilterData) {
                    serachItem.hideColumn[data.name] = true;
                    serachItem.showFilterBox[data.name] = false;
                    if (data.type === 'lookup') {
                      this.lookTable = data.lookupTableName;
                      this.lookupName = data.name;
                      this.filterObject.lookupValue[data.name] = null;
                      serachItem.filteredOptions[data.name] = [];
                      this.showAutocomplete[data.name] = false;

                      const lookUpArray = [];
                      data.options.forEach((el) => {
                        const temp: [] = Object.assign([], el);
                        temp.shift();
                        if (data.loadAsDropDown) {
                          serachItem.filteredOptions[data.name].push({
                            id: el[0],
                            value: temp.toString().replace(/,/g, ' '),
                          });
                        }
                        if (data.name == this.lookupName) {
                          lookUpArray.push({
                            id: el[0],
                            value: temp.toString().replace(/,/g, ' '),
                          });
                        }
                      });
                      if (data.lookupTableName === 'Users') {
                        serachItem.filteredOptions[data.name].push({ id: '', value: 'Me' });
                      }
                      serachItem.demoData = data;
                      serachItem.lookupData.push(serachItem.demoData);
                    }

                    if (data.type == 'status') {
                      serachItem.statuses = data.statusOptions.map(m => m.status);
                    }

                    if (data.isVisibilityOn && data.fieldValuesData && data.fieldValuesData.length > 0) {
                      serachItem.dependsFields.push(data);
                    }
                  }
                }
              }
              if (res && res.statusCode == 404) {
                resolve('404' + tblName);
                return;
              }

              if (res && res.data && res.data[0] && res.data[0].columns && res.data[0].columns.length) {
                serachItem.tableId = res.data[0]._id;
                serachItem.tempParentTableHeader = Object.assign([], res.data[0].columns);
                serachItem.tempParentTableHeader.map((column) => {

                  if (column.type == 'recordType') {
                    serachItem.recordTypeFieldName = column.name;
                    column.options.forEach(element => {
                      const obj = {
                        title: element,
                      };
                      serachItem.recordTypes.push(obj);
                    });
                  }
                });

                let page = 1;
                if (this.route.snapshot.queryParamMap.get('page')) {
                  page = parseInt(this.route.snapshot.queryParamMap.get('page'));
                }
                serachItem.parentTableHeader = Object.assign([], res.data[0].columns.filter(data => data.displayInList == true));
                serachItem.allParentTableHeader = res.data[0].columns.filter(data => data.displayInList == true);
                serachItem.parentTableHeader.map(data => data.direction = '');

                if (this.recordTypes && this.recordTypes.length === 0) {
                  const IDs = [];
                  this.tableService.getDynamicTreeData(tblName, page, srcTxt, undefined, undefined,
                    this.recordTypeFilter, this.taskedRecordsOnly,
                    this.watchedIssue ? this.watchedIssue : { watchedIssue: true, noFilter: true }, '', '', '', '',
                    true,
                    undefined,
                    '',
                    '',
                    this.renderAt
                  ).pipe(takeUntil(this.destroy$)).subscribe(((response: any) => {

                    if (response && response.data && response.data.pageOfItems && response.data.pageOfItems.length) {
                      serachItem.parentTableData = [];
                      serachItem.pager = response.data.pager;
                      response.data.pageOfItems.forEach(element => {
                        IDs.push(element._id);
                        if (serachItem.resColData && serachItem.resColData[0] && serachItem.resColData[0].columns) {
                          for (const col of serachItem.resColData[0].columns) {
                            if (col.type === 'file') {
                              if ((typeof element[col.name]) == 'string') {
                                element[col.name] = element[col.name];
                              } else {
                                if (element[col.name]) {
                                  element[col.name] = element[col.name];
                                }
                              }
                            }
                          }
                        }
                      });
                      serachItem.parentTableData = Object.assign([], response.data.pageOfItems);
                      serachItem.parentTableData.forEach(element => {
                        element.expand = false;

                        if (element.lookups && element.lookups.length) {
                          element.lookups.forEach(lookup => {
                            if (serachItem.lookupData.findIndex(f => f.name == lookup.lookupName) > -1) {

                              if (!element[lookup.lookupName])
                                element[lookup.lookupName] = [];

                              element[lookup.lookupName].push(lookup);
                            }
                          });
                        }
                      });

                      resolve(serachItem);
                      if (serachItem.parentTableData.length) {
                        serachItem.tableName = tblName;
                        this.masterSearchTab.push(serachItem);
                      }
                    } else {
                      serachItem.noDataFound = true;
                      serachItem.parentTableData = [];
                      resolve(serachItem);
                    }
                  }));
                }
              }
            });
          } else {
            resolve('error');
          }
        }
      });
    });
  }

  statusSelected(data, name) {
    this.filteredStatus = data;
    const index = this.filterObject.filterKey.findIndex(v => v.hasOwnProperty(name));
    if (index > -1) {
      if (data && data.length) {
        this.filterObject.filterKey.forEach(ele => {
          if (ele[name]) {
            ele[name] = data;
          }
        });
      } else {
        this.filterObject.filterKey.splice(index, 1);
      }
    } else {
      this.filterObject.filterKey.push({ [name]: data });
    }
    this.createTagList();
    this.getTableDataByName(this.pager.currentPage, this.searchString, this.sortObject,
      this.filterObject.filterKey, '', this.viewCompletedRecords, this.statusFilter);
  }

  clearAll(value?) {

    this.filterObject.filterKey = [];
    this.filterObject.users = [];
    this.tagList = [];
    this.filterObject.lookupValue = [];
    this.lookupObj = [];
    this.isDefaultValueEnable = false;
    this.filterObject.range.start = null;
    this.filterObject.range.end = null;
    this.filterObject.DateTimerange.start = null;
    this.filterObject.DateTimerange.end = null;
    this.filterObject.dropdownValue = [];
    this.filterObject.dropdownWithImageValue = [];
    this.filterObject.numberOperation = null;
    this.filterObject.formulaOperation = null;
    this.filterObject.textValue = {};
    this.filteredStatus = [];
    this.filterObject.check = [];
    this.filterObject.checkboxArray = [];
    if (!value) {
      this.getTableDataByName(1, this.searchString, this.sortObject);
      this.tableService.getFilterObject('empty', 'empty');
      this.usersWithIds = this.usersWithIds;
    }

    let url = '/pages/tables/' + this.tableName
    this.location.replaceState(url);
  }

  defaultStyleFlag = null;
  defaultFilterSelection(data) {

    let filterKeyRetrieved = [];
    this.tableService.defaultFilterSelected(this.tableId).pipe(takeUntil(this.destroy$)).subscribe((tableRe: any) => {
      if (tableRe.statusCode == 200) {

        this.allFilters = cloneDeep([...tableRe.data]);
        const index = this.allFilters.findIndex(v => v._id == data._id);
        if (index > -1) {
          const currentFilter = this.allFilters[index];
          if (currentFilter?.tableId === this.tableId) {
            filterKeyRetrieved = (currentFilter?.filterObject.filterKey &&
              currentFilter?.filterObject.filterKey.length > 0) ? currentFilter.filterObject.filterKey : [];

            this.filterObject.lookupValue = {};
            this.filterObject.users = [];
            this.filterObject.DateTimerange.start = null;
            this.filterObject.DateTimerange.end = null;
            this.filterObject.check = [];
            this.filterObject.dropdownValue = [];
            this.filterObject.dropdownWithImageValue = [];
            this.filterObject.numberOperation = null;
            this.filterObject.textValue = {};
            this.filterObject.filterKey = [];
            this.filterObject.formulaOperation = null;

            if (filterKeyRetrieved && filterKeyRetrieved.length) {
              this.filterObject.filterKey = [...filterKeyRetrieved];
              let statusChanged = false;
              for (const element of this.filterObject.filterKey) {
                let statusField = Object.keys(element)[0];
                if (statusField == 'status') {
                  this.filteredStatus = element[statusField];
                  statusChanged = true;
                }
              }
              if (!statusChanged)
                this.filteredStatus = [];
            }
            else {
              this.filterObject.filterKey = [];
              this.filteredStatus = [];
            }

            if (currentFilter?.tagList) {
              currentFilter?.tagList.forEach(element => {
                if (element.type === 'lookup') {
                  let temp = [];
                  element.value.forEach((item, i) => {
                    temp.push({
                      id: element.id[i],
                      value: item.trim().endsWith(',') ? item.trim().substr(0, item.trim().length - 1) : item.trim()
                    });
                  });
                  this.filterObject.lookupValue[element.name] = temp;
                } else if (element.type === 'watchedBy') {
                  let temp = [];
                  element.value.forEach((item, i) => {
                    temp.push({
                      _id: element.id[i],
                      value: item.trim().endsWith(',') ? item.trim().substr(0, item.trim().length - 1) : item.trim()
                    });
                  });
                  this.filterObject.users = temp;
                } else if (element.type === 'date') {
                  this.filterObject.range.start = new Date(element.value.split('-')[0].trim());
                  this.filterObject.range.end = new Date(element.value.split('-')[1].trim());
                } else if (element.type === 'dateTime') {
                  this.filterObject.DateTimerange.start = new Date(element.value.split('-')[0].trim());
                  this.filterObject.DateTimerange.end = new Date(element.value.split('-')[1].trim());
                } else if (element.type === 'dropdown') {
                  this.filterObject.dropdownValue = element.value;
                } else if (element.type === 'dropdownWithImage') {
                  this.filterObject.dropdownWithImageValue = element.value;
                } else if (element.type === 'number') {
                  this.filterObject.numberOperation = element.value;
                  this.filterObject.textValue[element.name] = element.value;
                } else if (element.type === 'formula') {
                  this.filterObject.formulaOperation = element.value;
                  this.filterObject.textValue[element.name] = element.value;
                } else if (element.type === 'checkbox') {
                  let checkboxcheck = [];
                  checkboxcheck = element.value.split(',');
                  let dataCheck = this.finalList.filter(v => v.name == element.name)[0];
                  checkboxcheck.forEach((ele) => {
                    this.filterObject.checkboxArray.push(ele);
                    dataCheck.options.forEach((element, i) => {
                      if (element == ele)
                        this.filterObject.check[i] = true;
                    });
                  })
                } else if (element.type === 'radio') {
                  this.filterObject.radio = element.value;
                }
              });
            }
            if (data?.viewCompletedRecords) {
              this.viewAllRecords = true;
            }
            if (!data?.viewCompletedRecords) {
              this.viewAllRecords = false;
            }
            this.createTagList();
            this.getTableDataByName(1, this.searchString, this.sortObject,
              this.filterObject.filterKey, '', this.viewAllRecords);
          }
          this.defaultStyleFlag = index;
        }
      }
    });
  }

  getDataForFilterObject(event) {
    this.defaultStyleFlag = null;
    this.filterObject = event;
    this.createTagList();
    this.getTableDataByName(this.pager.currentPage, this.searchString, this.sortObject,
      this.filterObject.filterKey, '', '', this.statusFilter);
  }

  gadgetFieldValue = [];
  getRecordGadgets(item, index) {

    let $Table = this.parentTableData;
    if (this.recordGadgets && this.recordGadgets.length) {
      if (item.gadget) {
        let currentGadget = this.recordGadgets.filter(v => v.name == item.gadget)[0];
        this.gadgetFieldValue[index] = eval(currentGadget.logic);
      } else {
        this.gadgetFieldValue[index] = '';
      }
      return this.gadgetFieldValue[index];
    }
  }

  dynamicSearch(field) {

    let lookupVal = this.filterObject.lookupValue;
    this.tableService
      .getDynamicTreeData(
        field.lookupTableName,
        1,
        "",
        0,
        0,
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
        this.createTagList();
      });
    this.tableService.getFilterObject(this.filterObject, this.tableName);
  }
}
