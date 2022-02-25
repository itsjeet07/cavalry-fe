import { Output, Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TableService } from '@app/shared/services/table.service';
import { DynamicFormDialogComponent } from '@app/shared/components/dynamic-form-dialog/dynamic-form-dialog.component';
import { DeleteDialogComponent } from '@app/shared/components/delete-dialog/delete-dialog.component';
import {
  NbDialogService, NbMenuService, NbToastrService,
} from '@nebular/theme';
import { combineLatest, of, Subscription } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { LookupModalComponent } from '@app/shared/components/lookup-modal/lookup-modal.component';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import { DescriptionDialogComponent } from '@app/shared/components/description-dialog/description-dialog.component';
import { TaskCommentComponent } from '@shared/components/task-comment/task-comment.component';
import { SocketService } from '@app/shared/services/socket.service';
import { ChatSubscriptionService } from '@app/shared/services/chat-subscription.service';
import { isObject } from 'lodash';
import { isSameDay, isSameMonth } from 'date-fns';
import { CalendarMonthViewDay, CalendarView } from 'angular-calendar';
import { InfoDialogComponent } from '@app/shared/components/dialog/info-dialog/info-dialog.component';
import { MessageService } from '@app/shared/services/message.service';
import { map, switchMap, take } from 'rxjs/operators'
import { NgPluralizeService } from 'ng-pluralize';
import { RemindersComponent } from '../reminders/reminders.component';
import { DatePipe } from '@angular/common';
import { DynamicFormDialogNewDesignComponent } from '@app/shared/components/dynamic-form-dialog-new-design/dynamic-form-dialog-new-design.component';
@Component({
  selector: 'ngx-new-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class TaskComponent implements OnInit, OnDestroy {
  @Input() isDynamicTable: boolean;
  @Input() lookupTableId;
  @Input() lookupTableName: string;
  @Input() fromDashboard: boolean = false;
  @Input() parentFormData: any;
  @Input() parentTableName: string = '';
  @Output() getTaskCounts = new EventEmitter();
  @ViewChild('select') mySelector: MatSelect;
  @ViewChild('desContent') elementView: ElementRef;
  showSubtask = [false]
  showMenu = false;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  calendarTasks = [];
  activeDayIsOpen: boolean = false;
  selected = 'date';
  selectedStatus = 'hide';
  tableName;
  tableNameWithoutS;
  accessTableName;
  allTaskData;
  tempParentTableHeader;
  recordTypes = [];
  recordType: string = null;
  recordTypeFieldName: string = null;
  dynamicFormData: any;
  tableId;
  loading = false;
  activeHeader = false;
  actionSubscription: Subscription;
  chatOpened = true;
  assignedUser = [];
  displayIcon = [false];
  onHoverId;
  openInputBox = [false];
  tempArray = [];
  statusColorArray = [];
  statusColor = {};
  showChatWidget = false;
  idFields = [];
  oldAssignedUser = '';
  searchedTask = '';
  searchedTaskDetail: any = '';
  autoForm: any;
  assignedUserArray = [];
  createdByUserArray = [];
  tableData;
  closeUser;
  assignee = [];
  showStatusId;
  allSelectedCheck: any;
  noneSelectedCheck: any;
  private routeSub: any;
  currentParentTable = 'Tasks';
  currentParentTableId = '5fa8d9cd4bd42011ac55f2a7';
  currentParentResourceId = '';
  tabTitle = '';
  childResourceId = '';
  type;
  taskStatusComment: any;
  communicationRef: any;
  tableInfo = {
    // resourceId: '5fa8d9cd4bd42011ac55f2a7',
    // tableName: 'Tasks',
    // resourceName: 'First task with lookup',
    // tableId: '5f85df5050e26c156730bdd7',
  };
  selectedMonthViewDay: any;
  selectedDayViewDate: Date;
  actionItems = [
    { icon: { icon: 'python', pack: 'edit' } },
    { icon: { icon: 'python', pack: 'delete' } },
  ];
  groupChatTitle: string;
  showCompletedTasks: boolean = false;
  tasks;
  specificTask;
  createdBy;
  lightColor;
  currentUser;
  taskType;
  statusFilter = [];
  statuses = [];
  groupByDatesArray = ['Today', 'This Week', 'This Month', 'Last 3 Months', 'Older than 3 Months'];
  groupByDates = this.groupByDatesArray;
  pageLoaded = true;
  taskTypeExist = false;
  closedStatus;
  skipTasks = {};
  filterKey = {};
  headerObj = {};
  lookupName;
  subTasks;
  lightColors = [];
  showCalendar: boolean = false;
  activeTab;
  sidebarToggle = false;
  groupBy = 'status';
  watchedIssue = false;
  showFutureTasks = false;
  currentAssignedUser;
  createdByUser;
  createdByUsers = [];
  allCreatedByUserSelected;
  createdByMeSelected;
  pageLoad = true;
  selectedDays: any = [];
  showAlert = false;
  dateObj: object = {
    badgeTotal: 0,
    cssClass: 'cal-day-selected',
    events: [],
    inMonth: true,
    isFuture: false,
    isPast: true,
    isToday: false,
    isWeekend: false,
  };
  dateQueryParam = null;
  dependencies = [];
  refreshCounter = 0;
  searchValue;
  query: any;
  subFormLookupIds: any;
  public subs = [];
  public currentDate = new Date();
  hideFilters = true;
  showMoreDesc: boolean = false;
  isDescEditable: boolean = false;
  editDescription: FormControl;
  descHtml;
  descriptionHeight = 0;
  weekCalendarViewEvents = [];
  dayCalendarViewEvents = [];
  tableIcon = '';

  customLabelForAddForm = '';
  customLabelForEditForm = '';

  constructor(private service: TableService,
    private plurarService: NgPluralizeService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private nbMenuService: NbMenuService,
    private toastrService: NbToastrService,
    public sanitizer: DomSanitizer,
    private messageService: MessageService,
    private chatSubsriptionService: ChatSubscriptionService,
    public datePipe: DatePipe
  ) {
    this.currentDate = this.datePipe.transform(this.currentDate, 'M/d/yyyy') as any;
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('userData'));
    this.currentAssignedUser = {
      _id: this.currentUser._id,
      firstName: this.currentUser.firstName,
      lastName: this.currentUser.lastName,
      userColor: this.currentUser.userColor,
    };
    this.assignedUserArray.push(this.currentAssignedUser);
    this.assignee.push(this.currentUser._id);
    this.subs.push(combineLatest([this.getTablesForMenu(), this.getAllUsers()]).subscribe());
    this.subs.push(this.service.toggleSidebar.subscribe(res => {
      this.sidebarToggle = res;
    }));
    if (this.isDynamicTable) {
      this.assignee = [];
    }
    this.getTotalOpenTasks();
    this.autoForm = new FormControl();
    this.allSelectedCheck = new FormControl();
    this.allCreatedByUserSelected = new FormControl();
    this.createdByMeSelected = new FormControl();
    this.noneSelectedCheck = new FormControl();
    this.subs.push(this.route.queryParams.subscribe(res => {
      if (res && res['taskType'] && res['date']) {
        this.pageLoad = false;
        this.taskType = res['taskType'];
        this.taskTypeExist = true;
        this.dateQueryParam = new Date(res['date']);
      } else {
        const url = JSON.parse(localStorage.getItem('url'));
        if (url) {
          if (Object.keys(res).length > 1 && url == 'dashboard') {
            this.showAlert = true;
          }
        }
        this.filterKey = res;
        this.query = res;
      }
    }));
    this.routeSub = this.route.params.subscribe(params => {
      // -- When task is searched on task page
      if (params.id && params.taskType && !params.tableName) {
        this.searchedTask = params.id;
        this.taskType = params.taskType;
        this.taskTypeExist = true;
      }

      // -- When task is searched on non-task page
      if (params.tableName) {
        this.recordTypes = [];
        this.showChatWidget = false;
        this.taskTypeExist = false;
        this.taskType = undefined;
        this.searchedTask = '';
        this.assignee = [];
        this.subTasks = [];
        this.currentParentTable = params.tableName;
        this.currentParentTableId = params.tableId;
        this.currentParentResourceId = params.id;
      }

      // currentParentResourceId

      if (params.tabTitle && params.tabTitle == 'To Do' && params.taskType) {
        this.tabTitle = 'To Do';
        if (params.childResourceId) {
          this.searchedTask = params.childResourceId;
          this.childResourceId = params.childResourceId;
          this.taskType = params.taskType;
          this.taskTypeExist = true;
        }
      }

      if (params.id && params.tableId && !params.taskType && !params.tableName) {
        this.recordTypes = [];
        this.showChatWidget = false;
        this.taskTypeExist = true;
        this.taskType = undefined;
        this.searchedTask = params.id;
        this.assignee = [];
        this.subTasks = [];
      }
      this.getTableByName();
    });
  }

  ngAfterViewChecked() {
    if (this.elementView) {
      this.descriptionHeight = this.elementView.nativeElement.offsetHeight;
    }
  }

  checkDateNotInRange(d2) {
    let date = this.datePipe.transform(d2, 'M/d/yyyy') as any;
    let date1 = new Date(this.currentDate);
    let date2 = new Date(date);
    return date1.setHours(0, 0, 0, 0) > date2.setHours(0, 0, 0, 0);
  }

  getAllUsers() {
    return this.service.getAllUsers().pipe(map((res: any) => {
      if (res.data && res.statusCode === 200)
        this.assignedUser = res.data.sort((a, b) => a.firstName.localeCompare(b.firstName));
    }));
  }

  getTablesForMenu() {
    this.tableName = 'Tasks';
    this.tableNameWithoutS = 'Task';
    return this.service.getTablesForMenu().pipe(map((res: any) => {
      if (res.statusCode === 200) {
        this.tableData = res.data;
        this.accessTableName = res.data.filter(d => d.tableName === this.tableName);
        if (this.accessTableName.length === 0) {
          this.service.redirectToHomePage();
        }
      }
    }));
  }

  getTotalOpenTasks() {
    this.subs.push(this.service.getTotalOpenTasks(
      this.assignee,
      this.lookupTableId,
      this.lookupTableName,
      this.statusFilter,
      this.groupBy,
      this.createdByUsers,
      this.watchedIssue,
      this.searchValue,
      this.showCompletedTasks,
      this.showFutureTasks
    ).subscribe((res: any) => {
      if (res.data && res.statusCode === 200) {
        this.tasks = res.data;
        if (this.recordTypes.length > 0) {
          this.recordTypes.forEach(element => {
            let totalInCompleteTasks;
            const inCompleteTasks = this.tasks.filter(f => f._id === element.title)
              .map(f => f.totalInCompleteTasks);
            if (inCompleteTasks.length > 0) {
              totalInCompleteTasks = inCompleteTasks;
            }
            element.totalInCompleteTasks = totalInCompleteTasks;
          });
        }
      }
      this.getTaskCounts.emit(res.data);
    }));
  }

  getTableByName() {
    this.tableName = 'Tasks';
    this.subs.push(this.service.getTableByName(this.tableName).subscribe((res: any) => {
      if (res && res.data && res.data[0] && res.data[0].columns && res.data[0].columns.length) {
        this.tableId = res.data[0]._id;

        if(res.data[0].iconLocation) {
          this.tableIcon = res.data[0].iconLocation;
        }

        if(res.data[0].customLabelForAddForm){
          this.customLabelForAddForm = res.data[0].customLabelForAddForm;
        }

        if(res.data[0].customLabelForEditForm){
          this.customLabelForEditForm = res.data[0].customLabelForEditForm;
        }

        this.subFormLookupIds = res.data[0].subFormLookups
        if (res.data[0].masterDetail && res.data[0].masterDetail.lookupId) {
          const id = res.data[0].masterDetail.lookupId;
          let data = res.data[0].columns;
          if (id) {
            data = data.filter(item => item.type == 'lookup' && item._id == id);
            this.headerObj = {
              name: data[0].lookupTableName,
              fieldName: data[0].lookupTableFieldNames,
            };
          }
        }

        this.tempParentTableHeader = Object.assign([], res.data[0].columns);

        this.tempParentTableHeader.map((column) => {

          if (column.idField && column.idField == true) {
            this.idFields.push(column.name);
          }

          // set dependencies array.
          if (column.dependencies && column.dependencies.length) {
            const obj = [...column.dependencies];
            obj.forEach(element => {
              element.srcFieldName = column.name;
              element.srcFieldType = column.type;
              this.dependencies.push(element);
            });

          }

          if (column.type == 'status' && column.name === 'status') {
            this.statusColorArray = column.statusOptions;
            this.tempArray = this.statusColorArray;
            if (column.statusOptions) {
              column.statusOptions.map(status => {
                this.statusColor[status.status] = [];
                this.lightColors[status.status] = [];
                this.statusColor[status.status] = status.color;
                this.skipTasks[status.status] = 5;
                this.lightColors[status.status] = this.getLightColor(status.color);
              });
            }

            this.groupByDates.map(date => {
              this.statusColor[date] = [];
              this.lightColors[date] = [];
              this.statusColor[date] = '#FFFFFF';
              this.skipTasks[date] = 5;
              this.lightColors[date] = this.getLightColor('#FFFFFF');
            });
            this.statuses = column.statusOptions.map(m => m.status);
            this.closedStatus = column.statusOptions.filter(m => m.closed === true).map(m => m.status);
          }

          if (column.type == 'recordType') {
            this.recordTypeFieldName = column.name;

            if (column.options) {
              setTimeout(() => {

                column.options.forEach(element => {
                  let totalInCompleteTasks;
                  const inCompleteTasks = this.tasks && this.tasks.filter(f => f._id === element)
                    .map(f => f.totalInCompleteTasks);
                  if (inCompleteTasks.length > 0) {
                    totalInCompleteTasks = inCompleteTasks;
                  }
                  const obj = {
                    title: element,
                    totalInCompleteTasks: totalInCompleteTasks,
                  };
                  this.recordTypes.push(obj);
                });

              }, 800);
            }
          }
        });
        if (Object.keys(this.filterKey).length !== 0) {
          for (const [key, value] of Object.entries(this.filterKey)) {
            this.assignee = [];
            this.assignedUserArray = [];
            if (key === 'status') {
              this.statusFilter = [];
              this.statusFilter.push(value);
              const filterStatus = this.statusColorArray.filter(status => status.status === value);
              this.selectedStatus = filterStatus && filterStatus[0];
            } else if (key === 'assignedTo') {
              if (!(value instanceof Array)) {
                this.assignee.push(value);
                const users = this.assignedUser.filter(user => user._id == value);
                if (users && users.length > 0) {
                  this.assignedUserArray.push(users[0]);
                }
              } else {
                value && value.forEach(v => {
                  this.assignee.push(v);
                  const users = this.assignedUser.filter(user => user._id == v);
                  if (users && users.length > 0) {
                    this.assignedUserArray.push(users[0]);
                  }
                });
              }
            }
          }
          this.getTotalOpenTasks();
        }
      }
    }));
  }

  onEdit(row, tableName) {
    try {
      this.tableName = tableName;
      this.subs.push(this.service.getDynamicTreeDataById(this.tableName, row).subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.dynamicFormData = res.data;
          this.onUpdate(res.data);
        }
      }));
    } catch (error) {

    }
  }

  onUpdate(data?) {
    let title: string;
    if(this.customLabelForEditForm){
      title = this.customLabelForEditForm;
    }
    else{
      if (this.recordTypeFieldName && data.hasOwnProperty([this.recordTypeFieldName])) {
        title = 'Edit ' + data[this.recordTypeFieldName];
      } else {
        title = 'Edit ' + this.tableName;
      }
    }

    if (this.communicationRef) {
      return;
    }

    if (this.subFormLookupIds && this.subFormLookupIds.length) {
      this.communicationRef = this.dialogService.open(DynamicFormDialogComponent, {
        closeOnEsc: false,
        context: {
          title: title,
          subFormLookupIds: this.subFormLookupIds,
          form: this.tempParentTableHeader,
          button: { text: 'Update' },
          tableName: this.tableName,
          Data: data,
          recordTypeFieldName: this.recordTypeFieldName,
          tableDataForForms: this.tableData,
          recordType: this.taskType,
        },
      })
        .onClose.subscribe(name => {
          this.communicationRef = '';
          if (name.close === 'yes') {
            this.getAllTasksData();
          }
        });
    }
    else {
      this.communicationRef = this.dialogService.open(DynamicFormDialogNewDesignComponent, {
        closeOnEsc: false,
        context: {
          title: title,
          subFormLookupIds: this.subFormLookupIds,
          form: this.tempParentTableHeader,
          button: { text: 'Update' },
          tableName: this.tableName,
          Data: data,
          recordTypeFieldName: this.recordTypeFieldName,
          tableDataForForms: this.tableData,
          recordType: this.taskType,
          tableIcon: this.tableIcon,
        },
      })
        .onClose.subscribe(name => {
          this.communicationRef = '';
          if (name.close === 'yes') {
            this.getAllTasksData();
          }
        });
    }

  }

  onDeleteConfirm(id, table): void {
    this.dialogService.open(DeleteDialogComponent)
      .onClose.subscribe(name => {
        if (name) {
          this.subs.push(this.service.deleteDynamicFormData(id, table).subscribe((res: any) => {
            if (res.statusCode === 200) {
              if (this.searchedTask) {
                this.searchedTask = '';
                this.showChatWidget = false;
              }
              this.getAllTasksData();
            }
          }));
        }
      });
  }

  setAllTasksData(res) {
    this.loading = false;
    if (res.statusCode === 200) {
      if (this.pageLoaded) {
        this.getTotalOpenTasks();
      }

      if (!this.searchedTask && !this.pageLoad) {
        // window.history.replaceState({}, '', '/#/pages/tables/Tasks');
      }
      this.pageLoad = false;
      this.pageLoaded = true;
      this.allTaskData = res.data.allTasks;
      if (this.allTaskData && this.allTaskData.length > 0) {
        this.allTaskData = this.allTaskData.sort((a, b) => this.statuses.indexOf(a._id) -
          this.statuses.indexOf(b._id));

        this.statuses.map(status => this.skipTasks[status] = 5);
      }

      if (this.searchedTask && res.data.searchedTask) {
        const item = res.data.searchedTask;
        this.searchedTaskDetail = item;
        this.specificTask = item;
        this.descHtml = this.sanitizer.bypassSecurityTrustHtml(this.specificTask.description);
        this.taskType = item.taskType;
        this.showCompletedTasks = this.closedStatus.includes(item.status);
        if (!this.showCompletedTasks && this.closedStatus && this.closedStatus.length > 0) {
          this.allTaskData = this.allTaskData.filter(task => !this.closedStatus.includes(task._id));
        }
        const color = this.statusColorArray.filter(f => f.status === item.status).map(f => f.color);
        if (color.length) {
          this.lightColor = this.getLightColor(color[0]);
        }
        const createdByUser = this.assignedUser.filter(f => f._id == item.createdBy);
        this.createdBy = createdByUser[0]['firstName'] + ' ' + createdByUser[0]['lastName'];
        this.loading = true;
        this.setGroupChatTitle(this.idFields, item);
        this.setTableInfo(this.searchedTask);
        this.showChatWidget = true;
        this.loading = false;
      }

      if (this.showCalendar) {
        this.showCalendarMode({
          checked: true,
        });
      }
    }
  }

  getAllTasksData(returnwithoutSubscribe?: boolean) {
    this.loading = true;
    if (returnwithoutSubscribe) {
      return this.service.getTasksGroupByStatus(
        0,
        this.taskType,
        this.searchedTask,
        this.assignee,
        this.lookupName,
        this.lookupTableId,
        this.lookupTableName,
        this.statusFilter,
        this.showCompletedTasks,
        this.groupBy,
        this.groupByDates,
        this.createdByUsers,
        this.watchedIssue,
        this.searchValue,
        this.showFutureTasks
      ).pipe(map((res: any) => this.setAllTasksData(res)))
    }
    this.subs.push(this.service.getTasksGroupByStatus(
      0,
      this.taskType,
      this.searchedTask,
      this.assignee,
      this.lookupName,
      this.lookupTableId,
      this.lookupTableName,
      this.statusFilter,
      this.showCompletedTasks,
      this.groupBy,
      this.groupByDates,
      this.createdByUsers,
      this.watchedIssue,
      this.searchValue,
      this.showFutureTasks
    ).pipe(map((res: any) => this.setAllTasksData(res))).subscribe());
  }

  changeTab() {
    // if (!this.showCalendar) {
    //   this.activeHeader = !this.activeHeader;
    // }
    this.showCalendar = false;

  }

  onClick(id, table) {
    this.actionSubscription = this.nbMenuService.onItemClick().subscribe((event: any) => {
      if (event.item.icon['pack'] === 'edit') {
        this.onEdit(id, table);
        this.actionSubscription.unsubscribe();
      } else if (event.item.icon['pack'] === 'delete') {
        this.onDeleteConfirm(id, table);
        this.actionSubscription.unsubscribe();
      }
      this.actionSubscription.unsubscribe();
    });
  }

  ngOnDestroy() {
    if (this.actionSubscription) {
      this.actionSubscription.unsubscribe();
    }

    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }

    this.subs.forEach((sub: any) => {
      sub.unsubscribe();
    });

    this.searchedTask = '';
    this.showChatWidget = false;
  }

  delayOnChatOpen(id, item, color) {
    this.onChatOpen(id, item, color)
    // setTimeout(() => this.onChatOpen(id, item, color), 1500)
  }

  onChatOpen(id, item, color) {

    if (this.searchedTask != id) {
      this.taskType = item.taskType;
      let detailUrl: string;
      this.tabTitle = 'To Do';
      this.childResourceId = id;

      if (this.currentParentTable == 'Tasks') {
        detailUrl = `/#/pages/tables/dynamic/${this.tableId}/Tasks/${id}/taskType/${this.taskType}`;
      } else {
        detailUrl = `/#/pages/tables/dynamic/${this.currentParentTableId}/${this.currentParentTable}/${this.currentParentResourceId}/${this.tabTitle}/${this.childResourceId}/taskType/${this.taskType}`;
      }

      if (this.fromDashboard) {
        this.router.navigate([`/pages/tables/dynamic/${this.currentParentTableId}/Tasks/${id}/taskType/${this.taskType}`]);
      } else {
        window.history.replaceState({}, '', detailUrl);
      }

      this.loading = true;
      this.subTasks = [];
      if (item.subTaskCount > 0) {
        // setTimeout(() => this.getSubTasks(item._id), 500);
        this.getSubTasks(item._id)
      }
      this.setGroupChatTitle(this.idFields, item);
      this.setTableInfo(id);
      this.showChatWidget = true;
      this.loading = false;
      this.specificTask = item;
      this.descHtml = this.sanitizer.bypassSecurityTrustHtml(this.specificTask.description);
      this.searchedTask = item._id;
      const createdByUser = this.assignedUser.filter(f => f._id == item.createdBy);
      this.createdBy = createdByUser[0]['firstName'] + ' ' + createdByUser[0]['lastName'];
      this.lightColor = this.getLightColor(color);
    }
  }

  getSubTasks(id) {
    this.subTasks = [];
    this.subs.push(this.service.getSubTasks(id).subscribe((res: any) => {
      this.loading = false;
      if (res.statusCode === 200) {
        this.subTasks = res.data;
        if (this.subTasks && this.subTasks.length > 0) {
          this.subTasks = this.subTasks.sort((a, b) => this.statuses.indexOf(a.status) -
            this.statuses.indexOf(b.status));
        }
      }
    }));
  }

  setGroupChatTitle(idFields, task) {
    if (this.idFields.length > 0) {
      let tempName = task['taskType'];
      idFields.map((data) => {
        if (task[data] && task[data] != 'undefined' && typeof task[data] !== 'undefined' && task[data] != task['taskType']) {
          tempName = `${tempName} - ${task[data]} `;
        }
      });

      if (task['taskType'] != '') {
        this.groupChatTitle = tempName;
      } else {
        this.groupChatTitle = this.tableNameWithoutS + '-' + tempName;
      }
    }
  }

  setTableInfo(id) {
    this.tableInfo = {
      resourceId: id,
      tableId: this.tableId,
      tableName: this.tableName,
      resourceName: this.groupChatTitle,
    };
  }

  getChatData(id) {
    this.subs.push(this.service.getRelatedDataById(this.tableName, this.tableId, id).subscribe((res: any) => {
      if (res.statusCode == 200 && res.data) {
        this.setGroupChatTitle(this.idFields, res.data);
        this.setTableInfo(id);
      }
    }));
  }

  addNewTask(taskType, status?, dueDate?) {
    if (this.groupBy === 'date') {
      status = this.statusFilter.length > 0 ? this.statusFilter[0] : 'Requires Action';
    }
    if (!status) {
      status = 'Requires Action';
    }

    let title = '';
    if(this.customLabelForAddForm){
      title = this.customLabelForAddForm;
    }
    else{
      title = 'Add New ' + taskType;
    }

    if (this.subFormLookupIds && this.subFormLookupIds.length) {
      this.dialogService.open(DynamicFormDialogComponent, {
        closeOnEsc: false,
        context: {
          title: title,
          //headerDetail: this.headerObj,
          subFormLookupIds: this.subFormLookupIds,
          form: this.tempParentTableHeader,
          button: { text: 'Save' },
          tableName: this.tableName,
          Data: null,
          dueDate: dueDate,
          recordType: taskType,
          parentTableName: this.lookupTableName,
          parentTableData: this.parentFormData,
          lookUpNameId: this.lookupTableId,
          recordTypeFieldName: this.recordTypeFieldName,
          taskStatus: status,
          action: 'Add',
          tableDataForForms: this.tableData,
        },
      })
        .onClose.subscribe(name => {
          if (name && name.close === 'yes') {
            this.getTotalOpenTasks();
            this.getAllTasksData();
            // this.dialogFired = false;
            // this.actionSubscription.unsubscribe();
          }
        });
    }
    else {
      this.dialogService.open(DynamicFormDialogNewDesignComponent, {
        closeOnEsc: false,
        context: {
          title: title,
          //headerDetail: this.headerObj,
          subFormLookupIds: this.subFormLookupIds,
          form: this.tempParentTableHeader,
          button: { text: 'Save' },
          tableName: this.tableName,
          Data: null,
          dueDate: dueDate,
          recordType: taskType,
          parentTableName: this.lookupTableName,
          parentTableData: this.parentFormData,
          lookUpNameId: this.lookupTableId,
          recordTypeFieldName: this.recordTypeFieldName,
          taskStatus: status,
          action: 'Add',
          tableDataForForms: this.tableData,
          tableIcon: this.tableIcon,
        },
      })
        .onClose.subscribe(name => {
          if (name && name.close === 'yes') {
            this.getTotalOpenTasks();
            this.getAllTasksData();
            // this.dialogFired = false;
            // this.actionSubscription.unsubscribe();
          }
        });
    }

  }

  changeDueDate(event, id, fromCalendar?) {

    const obj = {
      dueDate: event.value,
      fieldUpdated: 'dueDate',
      editType: 'inline',
      oldValue: '',
      newValue: event.value,
      resourceName: 'Task',
      fieldLabel: 'Due Date',
    };

    this.subs.push(this.service.updateDynamicFormData(id, this.tableName, obj).subscribe(
      (res: any) => {
        if (res.statusCode === 200) {
          if (fromCalendar) {
            this.getAllTasksData();
          }
          this.toastrService.success(res.message, 'Action was successful');
        } else {
          this.toastrService.danger(res.message, 'Action was unsuccessful!');
        }
      }));
  }

  openSelect(mySelector) {
    mySelector.open();
  }

  selectOpened(event, oldUser) {
    if (isObject && oldUser) {
      this.oldAssignedUser = `${oldUser.firstName} ${oldUser.lastName}`;
    }
    this.oldAssignedUser = oldUser;
  }

  onUserChange(event, taskType, status, id, lookup) {

    if (this.specificTask) {
      this.specificTask['Assigned To'] = '';
    }

    this.searchedTask = id;

    lookup = !lookup ? [] : lookup;

    const foundIndex = lookup.findIndex(x => x.lookupName === 'assignedTo' && x.lookupTableName === 'Users');

    if (foundIndex != -1) {
      lookup[foundIndex].lookupId = event.value._id;
    } else {
      lookup.push({
        'lookupTableName': 'Users',
        'lookupId': event.value._id,
        'lookupName': 'assignedTo',
      });
    }

    const obj = {
      lookup: lookup,
      fieldUpdated: 'assignedTo',
      editType: 'inline',
      oldValue: this.oldAssignedUser,
      newValue: event.value.firstName + ' ' + event.value.lastName,
      resourceName: 'Task',
      fieldLabel: 'Assigned To',
    };

    this.messageService.Join(id);

    this.subs.push(this.service.updateDynamicFormData(id, this.tableName, obj).subscribe(
      (res: any) => {
        this.oldAssignedUser = '';

        if (res.statusCode === 200) {

          const data = {
            resourceId: id,
            userId: event.value._id,
            tableName: 'Tasks',
            invitedBy: this.currentUser._id,
          };

          this.activateSubscription(data);

          this.toastrService.success(res.message, 'Action was successful');
          this.getAllTasksData();
        } else {
          this.toastrService.danger(res.message, 'Action was unsuccessful!');
        }
      }));
  }

  sendAssigneeAMessage(resourceId, resourceName) {

    const tableInfo = {
      resourceId: resourceId,
      tableName: 'Tasks',
      resourceName: resourceName,
      tableId: '5f85df5050e26c156730bdd7',
    };

    const msg = {
      sender: this.currentUser._id,
      receiver: resourceId,
      type: 'text',
      text: 'You are assigned this task',
      resourceDetails: tableInfo,
      dateSent: new Date(),
      dateSeen: null,
      reply: true,
    };

    const shouldSave = 'no';
    this.chatSubsriptionService.sendMessage(msg, tableInfo, shouldSave);
  }

  activateSubscription(data) {

    this.subs.push(this.chatSubsriptionService.watch(data).subscribe((res: any) => {
      if (res.statusCode === 201) {
        // this.loadSubscribers();
      }
    }, (error) => {
      this.toastrService.danger(`${error.error && error.error.message}`, 'Error');
      this.loading = false;
    }, () => {
    }));
  }

  onCancel(id) {
    this.onHoverId = '';
    this.openInputBox[id] = false;
    this.displayIcon[id] = false;
  }

  onSubjectUpdate(value, id) {

    const obj = {
      subject: value.trim(),
      fieldUpdated: 'subject',
      editType: 'inline',
      oldValue: '',
      newValue: value.trim(),
      resourceName: 'Task',
      fieldLabel: 'Subject',
    };

    this.onHoverId = '';
    this.openInputBox[id] = false;
    this.displayIcon[id] = false;

    this.subs.push(this.service.updateDynamicFormData(id, this.tableName, obj).subscribe((res: any) => {
      if (res.statusCode === 200) {
        // this.getAllTasksData(this.assignee);
        this.toastrService.success(res.message, 'Action was successful');
      } else {
        this.toastrService.danger(res.message, 'Action was unsuccessful!');
      }
    }));
  }

  showCompleted(event) {
    this.taskType = this.activeTab;
    this.showCompletedTasks = event.checked;
    this.getAllTasksData();
  }

  redirectToLookup(lookupItem) {
    const link = lookupItem[Object.keys(lookupItem)[1]];
    this.router.navigate([link]);
  }

  openLookupDialog(lookup) {
    this.dialogService.open(LookupModalComponent, {
      context: {
        lookup: lookup,
      },
    }).onClose.subscribe();
  }

  onStatusChange(status, id, item, color) {
    this.dialogService.open(TaskCommentComponent, {
    }).onClose.subscribe(data => {
      if (data) {
        this.taskStatusComment = data;
        const commentObj = {
          status: status.status,
          comment: this.taskStatusComment,
          fieldUpdated: 'status',
          editType: 'inline',
          oldValue: '',
          newValue: 'Added comment `' + this.taskStatusComment + '` and changed status to ' + status.status,
          resourceName: 'Task',
          fieldLabel: 'Status',
        };
        this.subs.push(this.service.updateDynamicFormData(id, this.tableName, commentObj).subscribe((res: any) => {
          if (res.statusCode === 200) {
            this.showCompletedTasks = status.closed;
            if (this.showCompletedTasks) {
              this.getTotalOpenTasks();
            }
            this.toastrService.success('Status update successfully', 'Success');
            this.onChatOpen(id, item, color);
            this.getAllTasksData();
            this.statusColorArray = this.tempArray;
          } else {
            this.dialogService.open(InfoDialogComponent, {
              context: {
                text: res.message,
                title: 'Task update status',
              },
            });
          }
        }, (error) => {
          this.toastrService.danger(`${error.error && error.error.message}`, 'Error');
        }));
      }
    });

  }

  onShowMenu(evt) {
    evt.stopPropagation();
    this.showMenu = true;
  }

  onChange(input) {
    if (input != '') {
      this.statusColorArray = this.statusColorArray.filter((item: any) => {
        return (item.status.toUpperCase().indexOf(input.toUpperCase()) != -1);
      });
    } else {
      return this.statusColorArray = this.tempArray;
    }
  }

  drag = (e) => {
    const left = document.getElementById('drag-left');
    const bar = document.getElementById('dragbar');
    document.getSelection() ? document.getSelection().empty() : window.getSelection().removeAllRanges();
    left.style.width = (e.pageX - bar.offsetWidth / 2) + 'px';
  }

  onExpand() {
    document.addEventListener('mousemove', this.drag);
  }

  onCollapse() {
    document.removeEventListener('mousemove', this.drag);
  }

  onStatusFilter(filterStatus) {
    if (this.searchedTask) {
      this.searchedTask = '';
      this.showChatWidget = false;
    }
    if (filterStatus === 'Clear Filter') {
      this.statusFilter = [];
    } else {
      this.statusFilter = [filterStatus.status];
    }
    this.getAllTasksData();
  }

  getOptionText(option) {
    if (option) {
      return option.firstName + ' ' + option.lastName;
    }
  }

  openAutocomplete(evt, trigger: MatAutocompleteTrigger) {
    evt.stopPropagation();
    trigger.openPanel();
  }

  onOptionSelected(event: any) {
    if (this.assignee.includes('none')) {
      this.assignee = [];
    }
    this.noneSelectedCheck.setValue(null);
    this.allSelectedCheck.setValue(null);
    this.watchedIssue = false;
    if (!this.assignee.includes(event.option.value._id)) {
      this.assignedUserArray.push(event.option.value);
      this.assignee.push(event.option.value._id);
      this.createdByUsers = [];
      this.createdByUserArray = [];
      if (this.statusFilter) {
        this.statusFilter = [];
      }
      this.getAllTasksData();
      const queryParams: Params = { assignedTo: this.assignee };
      this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams: queryParams,
          // queryParamsHandling: 'merge', // remove to replace all query params by provided
        });
    }
    this.autoForm.reset('');
    this.showMenu = false;
  }

  onOptionCreatedBySelected(event: any) {
    this.assignee = [];
    this.assignedUserArray = [];
    this.watchedIssue = false;
    this.allSelectedCheck.setValue(null);
    if (!this.createdByUsers.includes(event.option.value._id)) {
      this.createdByUserArray.push(event.option.value);
      this.createdByUsers.push(event.option.value._id);
      this.getAllTasksData();
    }
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (event.option.value._id == userData._id) {
      this.createdByMeSelected.setValue(true);
    }
    this.autoForm.reset('');
    this.showMenu = false;
  }

  onRemoveAssignee(index) {
    this.assignedUserArray.splice(index, 1);
    this.assignee = this.assignedUserArray.map(assignee => assignee._id);
    if (this.searchedTask) {
      this.searchedTask = '';
      this.showChatWidget = false;
    }
    this.getAllTasksData();
    const queryParams: Params = { assignedTo: this.assignee };
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: queryParams,
        // queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
  }

  onRemoveCreatedBy(index) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (index == -1) {
      index = this.createdByUserArray.findIndex(x => x._id == userData._id);
    }
    if (userData._id == this.createdByUserArray[index]._id) {
      this.createdByMeSelected.setValue(null);
    }
    this.createdByUsers.splice(index, 1);
    this.createdByUserArray.splice(index, 1);
    if (this.searchedTask) {
      this.searchedTask = '';
      this.showChatWidget = false;
    }
    this.allCreatedByUserSelected.setValue(null);
    this.getAllTasksData();
  }

  onAllSelected(value) {
    this.noneSelectedCheck.setValue(null);
    this.allSelectedCheck.setValue(value);
    this.assignee = [];
    this.assignedUserArray = [];
    this.watchedIssue = false;
    this.createdByUsers = [];
    this.createdByUserArray = [];
    if (value == true) {
      this.assignedUserArray = [...this.assignedUser];
    }
    this.getAllTasksData();
  }

  onAllCreatedByUserSelected(value) {
    this.watchedIssue = false;
    this.allSelectedCheck.setValue(value);
    this.createdByMeSelected.setValue(value);
    this.createdByUsers = [];
    this.createdByUserArray = [];
    this.assignee = [];
    this.assignedUserArray = [];
    if (value == true) {
      this.createdByUserArray = [...this.assignedUser];
    }
    this.getAllTasksData();
  }

  onNoneSelected(value) {
    this.watchedIssue = false;
    this.assignedUserArray = [];
    this.assignee = [];
    this.allSelectedCheck.setValue(null);
    this.noneSelectedCheck.setValue(value);
    if (value == true) {
      this.assignee = ['none'];
      this.getAllTasksData();
    }
  }

  setActiveTab(i, taskType) {
    let index;
    if (this.taskType && this.taskType == 'Calendar') {
      index = taskType === this.taskType ? i : null;
      return i == index;
    }
    if (!this.searchedTaskDetail) {
      return i == 0;
    } else {
      return this.searchedTaskDetail && taskType == this.searchedTaskDetail.taskType;
    }

  }


  onDescriptionEdit() {
    this.dialogService.open(DescriptionDialogComponent, {
      context: {
        data: this.specificTask.description,
      },
    }).onClose.subscribe(data => {
      if (data) {
        this.loading = true;
        const obj = {
          description: data,
          fieldUpdated: 'description',
          editType: 'inline',
          oldValue: '',
          newValue: data,
          resourceName: 'Task',
          fieldLabel: 'Description',
        };
        this.subs.push(this.service.updateDynamicFormData(this.specificTask._id, this.tableName, obj)
          .pipe(switchMap((res: any) => {
            if (res.statusCode === 200) {
              this.toastrService.success('Description update successfully', 'Success');
              return this.getAllTasksData(true);
            } else {
              this.toastrService.danger(res.message, 'Error');
              return of({})
            }
          }))
          .subscribe((res: any) => {
          }, (error) => {
            this.toastrService.danger(`${error.error && error.error.message}`, 'Error');
          }));
      }
    });
  }

  getLightColor(color) {
    if (color) {
      const amt = this.checkLightColor(color);
      return '#' + color.replace(/^#/, '').
        replace(/../g, c => ('0' + Math.min(255, Math.max(0, parseInt(c, 16) + amt)).toString(16)).
          substr(-2));
    }
  }

  checkLightColor(color) {
    let r, g, b, hsp;

    color = +('0x' + color?.slice(1)?.replace(
      color.length < 5 && /./g, '$&$&',
    )
    );
    r = color >> 16;
    g = color >> 8 & 255;
    b = color & 255;

    hsp = Math.sqrt(
      0.299 * (r * r) +
      0.587 * (g * g) +
      0.114 * (b * b),
    );
    if (hsp >= 150 && hsp <= 200) {
      return 30;
    } else if (hsp > 200) {
      return 10;
    } else if (hsp < 85) {
      return 130;
    } else if (hsp >= 121 && hsp <= 129) {
      return 80;
    } else {
      return 190;
    }
  }

  // getDecodedText(text) {
  //   return this.sanitizer.bypassSecurityTrustHtml(text);
  // }

  getChatDate(date) {
    const now = new Date(date);
    return now.toLocaleDateString();
  }

  onTabChanged(event) {

    let tabTitle = this.plurarService.singularize(event.tabTitle)

    this.refreshCounter++;
    if (this.refreshCounter > 50)
      this.refreshCounter = 1;
    if (!this.taskTypeExist) {
      this.taskType = tabTitle;
    }
    if (this.searchedTask && !this.taskTypeExist) {
      this.searchedTask = '';
      this.showChatWidget = false;
    }
    //this.groupBy = tabTitle === 'Calendar' || this.taskType === 'Calendar' ? 'status' : 'date';
    this.groupBy = tabTitle === 'Calendar' || this.taskType === 'Calendar' ? 'status' : 'status';
    this.getAllTasksData();
    this.pageLoaded = false;
    this.taskTypeExist = false;
    this.showCalendar = tabTitle === 'Calendar' || this.taskType === 'Calendar';
    this.activeTab = this.taskType ? this.taskType : tabTitle;

  }

  getTaskId() {
    return this.fromDashboard ? 'drag' : 'drag-left';
  }

  showMoreTasks(status, type) {
    this.loading = true;
    let groupByDate, statusFilters;
    if (this.groupBy === 'date') {
      groupByDate = [status];
      statusFilters = this.statusFilter;
    } else {
      statusFilters = [status];
    }

    if (type === 'more') {
      this.subs.push(this.service.getTasksGroupByStatus(
        this.skipTasks[status],
        this.taskType,
        undefined,
        this.assignee,
        this.lookupName,
        this.lookupTableId,
        this.lookupTableName,
        statusFilters,
        this.showCompletedTasks,
        this.groupBy,
        groupByDate,
        this.createdByUsers,
        this.watchedIssue,
        this.searchValue,
        this.showFutureTasks
      ).subscribe((res: any) => {
        this.loading = false;
        if (res.statusCode === 200) {
          this.allTaskData.forEach(element => {
            if (element._id === status) {
              this.skipTasks[status] = element.tasks.length + 5;
              element.tasks.push(...res.data.allTasks[0].tasks);
            }
          });
        }
      }));
    } else {
      this.allTaskData.forEach(element => {
        if (element._id === status) {
          if (element.tasks.length - 5 > 5) {
            this.skipTasks[status] = element.tasks.length - 5;
          } else {
            this.skipTasks[status] = 5;
          }
          element.tasks = element.tasks.slice(0, this.skipTasks[status]);
        }
      });
      this.loading = false;
    }
  }

  redirectSubTasks(subTask) {
    const link = `/pages/tables/dynamic/${this.currentParentTableId}/Tasks/${subTask._id}`;
    this.router.navigate([link]);
  }

  addNewSubTask(taskType, status, subTaskId) {
    this.dialogService.open(DynamicFormDialogNewDesignComponent, {
      closeOnEsc: false,
      context: {
        title: 'Add New ' + taskType,
        form: this.tempParentTableHeader,
        button: { text: 'Save' },
        tableName: this.tableName,
        Data: null,
        recordType: taskType,
        parentTableName: 'Tasks',
        lookUpNameId: subTaskId,
        parentLookupName: 'dependentTask',
        recordTypeFieldName: this.recordTypeFieldName,
        taskStatus: status,
        action: 'Add',
        tableDataForForms: this.tableData,
        tableIcon: this.tableIcon,
      },
    })
      .onClose.pipe(switchMap((name) => {
        if (name.data) {
          // this.getTotalOpenTasks();
          this.getSubTasks(subTaskId);
          // this.dialogFired = false;
          // this.actionSubscription.unsubscribe();
          return this.getAllTasksData();
        }
        return of({})
      })).subscribe();
  }

  showCalendarMode(e) {
    this.showCalendar = e.checked;
    this.calendarTasks = [];
    if (this.showCalendar) {
      this.allTaskData.forEach(allData => {
        allData.tasks.forEach(task => {
          const color = {
            primary: this.statusColor[task.status],
            secondary: this.statusColor[task.status],
          };

          this.calendarTasks.push(
            {
              title: task.subject,
              start: new Date(new Date(new Date(task.dueDate).setHours(0)).setMinutes(0)),
              color: color,
              id: task._id,
              task: task,
              allDayEventRows: true
            },
          );
        });
      });

      if (this.taskType === 'Calendar' && this.dateQueryParam) {
        this.viewDate = this.dateQueryParam;
        this.dateObj['day'] = this.dateQueryParam.getDay();
        this.dateObj['date'] = this.dateQueryParam;
        const eventArray = [];
        this.calendarTasks.forEach(item => {
          const date1 = new Date(item.task.dueDate);
          if (this.dateQueryParam.toLocaleDateString() == date1.toLocaleDateString()) {
            eventArray.push(item);
          }
        });
        const eventDate = { date: this.dateQueryParam, events: eventArray };
        this.dayClicked(eventDate);
      }
    }
  }

  dayClicked({ date, events }: { date: Date; events }, day?: CalendarMonthViewDay): void {

    this.selectedDays = [];
    if (this.dateQueryParam) {
      this.selectedMonthViewDay = this.dateObj;
    } else {
      this.dateObj = {};
      this.selectedMonthViewDay = day;
    }
    if (isSameMonth(date, this.viewDate)) {
      this.activeDayIsOpen = !((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0);
      this.viewDate = date;
    }
    if (this.dateQueryParam) {
      const selectedDateTime = this.selectedMonthViewDay.date.getTime();
      const dateIndex = this.selectedDays.findIndex(
        (selectedDay) => selectedDay.date.getTime() === selectedDateTime);
      if (dateIndex > -1) {
        delete this.selectedMonthViewDay.cssClass;
        this.selectedDays?.splice(dateIndex, 1);
      } else {
        this.selectedDays?.push(this.selectedMonthViewDay);
        if (day !== undefined) {
          day.cssClass = 'cal-day-selected';
        }
        this.selectedMonthViewDay = day;
      }
    }
    this.dateQueryParam = null;
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach((day) => {
      if (this.selectedDays.some((selectedDay) => selectedDay.date.getTime() === day.date.getTime())) {
        day.cssClass = 'cal-day-selected';
      }
    });
  }

  setView(view: CalendarView) {

    this.view = view;
    if (this.view === 'day') {
      setTimeout(() => {
        if (document.querySelector(".task-main") === null) {
          let htmlContent = '<div class="task-main"><div  class="task-title"><div class="float-left task-data-title"> No specific time </div></div></div>';
          htmlContent = htmlContent + document.getElementsByClassName("cal-hour")[0].innerHTML
          document.getElementsByClassName("cal-hour")[0].innerHTML = htmlContent;
        }
      }, 1000);
    } else {
      if (document.querySelector(".task-main") !== null) {
        var element = document.querySelector(".task-main");
        element.remove();
      }
    }

  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  onGroupByChanged(option) {
    this.showChatWidget = false;
    this.searchedTask = '';
    if (option.value === 'status') {
      this.groupByDates = [];
    } else {
      this.groupByDates = this.groupByDatesArray;
    }
    this.groupBy = option.value;
    this.getAllTasksData();
  }

  onMyWatchedIssues(e) {
    this.watchedIssue = e.checked;
    if (this.watchedIssue) {
      this.assignee = [];
      this.assignedUserArray = [];
      this.createdByUsers = [];
      this.createdByUserArray = [];
    }
    this.searchedTask = '';
    this.showChatWidget = false;
    this.getAllTasksData();
  }

  onCreatedByMe(e) {
    this.createdByMeSelected.setValue(e);
    if (localStorage.getItem('userData')) {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const myData = this.assignedUser.filter(m => m._id == userData._id);
      if (myData && myData.length > 0) {
        if (e) {
          this.assignee = [];
          this.assignedUserArray = [];
          this.watchedIssue = false;
          this.allSelectedCheck.setValue(null);
          if (!this.createdByUsers.includes(myData[0]._id)) {
            this.createdByUserArray.push(myData[0]);
            this.createdByUsers.push(myData[0]._id);
            this.getAllTasksData();
          }
          this.autoForm.reset('');
          this.showMenu = false;
        } else {
          this.onRemoveCreatedBy(-1);
        }
      }
    }
  }

  onSearch(searchValue) {
    this.searchedTask = '';
    this.showChatWidget = false;
    this.searchValue = searchValue;
    this.getAllTasksData();
  }
  onRemoveFilter() {
    this.showAlert = false;
    const obj = {};
    const idx = 0;
    const key = Object.keys(this.query)[idx];
    const value = this.query[key];
    obj[key] = value;
    this.router.navigate([], { queryParams: obj });
  }

  openReminderModal() {
    this.dialogService.open(RemindersComponent, {
      context: {
        // title: title,
        // form: this.tempParentTableHeader[this.tableName],
        // button: { text: 'Update' },
        tableName: this.tableName,
        //resourceId:this.tableInfo.resourceId,
        resourceId: this.specificTask._id,
        tableId: this.tableId
        // Data: data,
        // recordTypeFieldName: this.recordTypeFieldName,
        // action: 'Edit',
      },
      autoFocus: true,
    })
      .onClose.subscribe(res => {

      });
  }

  hanleShowMoreDesc() {
    this.showMoreDesc = true;
  }

  hanleShowLessDesc() {
    this.showMoreDesc = false;
  }

  enableDescEditable() {
    this.isDescEditable = true;
    this.editDescription = new FormControl(this.specificTask.description);
  }

  saveDescription() {
    this.loading = true;
    const data = this.editDescription.value;
    const obj = {
      description: data,
      fieldUpdated: 'description',
      editType: 'inline',
      oldValue: '',
      newValue: data,
      resourceName: 'Task',
      fieldLabel: 'Description',
    };
    this.subs.push(this.service.updateDynamicFormData(this.specificTask._id, this.tableName, obj)
      .pipe(switchMap((res: any) => {
        if (res.statusCode === 200) {
          this.toastrService.success('Description update successfully', 'Success');
          return this.getAllTasksData(true);
        } else {
          this.toastrService.danger(res.message, 'Error');
          return of({})
        }
      }))
      .subscribe((res: any) => {
      }, (error) => {
        this.toastrService.danger(`${error.error && error.error.message}`, 'Error');
      }));
    this.isDescEditable = false;
  }

  disableDescEditable() {
    this.isDescEditable = false;
  }

  beforeWeekViewRender(data) {
    this.weekCalendarViewEvents = data.period.events;
  }

}
