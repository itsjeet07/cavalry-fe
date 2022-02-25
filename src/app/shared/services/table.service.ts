import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicTableViewComponent } from '@app/pages/tables/dynamic-table-view/dynamic-table-view.component';
import { environment } from '@env/environment';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { tableRequest } from '../interfaces/table';
@Injectable({
  providedIn: "root",
})
export class TableService {

  filterObject = new FilterForService();
  storedTreeData = {};
  clientFormData = [];
  $users: BehaviorSubject<[]> = new BehaviorSubject<[]>([]);
  //$allUsers: BehaviorSubject<[]> = new BehaviorSubject<[]>([]);
  dateTimePickerFocused = new BehaviorSubject<boolean>(false);
  taskCount$ = new Subject();
  toggleSidebar = new Subject<any>();
  redirect = new BehaviorSubject<string>("");
  welcome = new BehaviorSubject<string>("");
  logo = new BehaviorSubject<string>("");
  login = new BehaviorSubject<string>("");
  title = new BehaviorSubject<string>("");
  loginLogo = new BehaviorSubject<string>("");
  appName = new BehaviorSubject<string>("");
  lastSearchedURL = new BehaviorSubject<string>("");
  lastAccessedPage = new BehaviorSubject(0);
  reminderUpdated$ = new Subject<any>();
  refreshHeader = new Subject<any>();
  private cacheForGetTablesForMenu: any;
  private cacheForUserDetail: any;
  allAPIobject: any;
  constructor(private http: HttpClient,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private router: Router) {

  }


  getStoreDataFromTree(tableName?, data?, type?) {


    if (data || type || tableName) {
      if (tableName)
        this.storedTreeData["tableName"] = tableName;
      if (data == 'empty' && type == 'empty' && tableName == 'empty') {
        this.storedTreeData = {};
      }
      else
        this.storedTreeData[type] = data;
    }
    return this.storedTreeData;
  }

  getFilterObject(filterObj?, tableName?) {

    if (tableName !== "empty" && filterObj !== "empty") {

      if (tableName)
        this.filterObject["tableName"] = tableName;

      if (filterObj)
        this.filterObject = filterObj;
    }
    else {
      this.filterObject = new FilterForService();
    }
    return this.filterObject;
  }


  getSystemConfig() {
    return this.http.get(`${environment.apiUrl}/getSystemConfig`).pipe(
      map((resp: any) =>
        resp.data.reduce(
          (configs: any, { configName, configValue }) => ({
            ...configs,
            [configName]: configValue,
          }),
          {}
        )
      )
    );
  }

  getSearchDataForRef(tableName, searchString) {
    return this.http.get(`${environment.apiUrl}/search?baseTableName=${tableName}&q=${searchString}`);
  }

  refreshHeaderComponent() {
    this.refreshHeader.next(true);
  }

  /*Manage & Tables List Start*/
  getTable(): Observable<tableRequest> {
    return this.http.get(`${environment.apiUrl}/table/all`);
  }

  validateImport(data) {
    return this.http.post(`${environment.apiUrl}/table/validateImport`, data);
  }


  getTablesForMenu(): Observable<tableRequest> {
    if (this.cacheForGetTablesForMenu) {
      return of(this.cacheForGetTablesForMenu);
    }
    return this.http.get(`${environment.apiUrl}/table/getTablesForMenu`).pipe(
      tap(res => this.cacheForGetTablesForMenu = res)
    );
  }

  getTaskCountByTable() {
    return this.http.get(`${environment.apiUrl}/getAssignedTasksCountByTable`);
  }

  getTableDetails(id) {
    return this.http.get(
      `${environment.apiUrl}/table/getTableById?tableId=${id}`
    );
  }

  saveData(data) {
    return this.http.post(`${environment.apiUrl}/table/create`, data);
  }

  addDefaultFilter(data) {
    return this.http.post(`${environment.apiUrl}/table-filter/create`, data);
  }

  updateDefaultFilter(data) {
    return this.http.post(`${environment.apiUrl}/table-filter/update`, data);
  }

  defaultFilterList(id) {
    return this.http.get(`${environment.apiUrl}/table-filter/all/${id}`);
  }

  defaultFilterSelected(id) {
    return this.http.get(`${environment.apiUrl}/table-filter/defaultSelected/${id}`);
  }

  deleteFilter(id) {
    return this.http.get(`${environment.apiUrl}/table-filter/deleteFilter/${id}`);
  }

  uploadMedia(data) {
    return this.http.post(`${environment.apiUrl}/upload`, data);
  }

  updateTable(data) {
    return this.http.post(`${environment.apiUrl}/table/update`, data);
  }

  getAllEmailEvents(tableId) {
    return this.http.get(`${environment.apiUrl}/events/${tableId}`);
  }

  getAllDocumentsEvents(tableId, data = null) {
    return this.http.post(`${environment.apiUrl}/events/getDocuments/${tableId}`, data);
  }

  createEmailTemplate(data) {
    return this.http.post(`${environment.apiUrl}/events/create`, data);
  }

  updateEmailTemplate(data) {
    return this.http.put(
      `${environment.apiUrl}/events/update/${data._id}`,
      data
    );
  }

  deleteEmailEvent(id) {
    return this.http.delete(`${environment.apiUrl}/events/${id}`);
  }

  fireTestEmail(templateId, tableName) {
    return this.http.get(
      `${environment.apiUrl}/events/fireTest/${tableName}/${templateId}`
    );
  }

  uploadImageEmailEvent(data) {
    const formData: FormData = new FormData();
    formData.append("file", data, data.name);
    return this.http.post(`${environment.apiUrl}/upload`, formData);
  }

  updateMainTable(data) {
    return this.http.post(`${environment.apiUrl}/table/updateTable`, data);
  }

  updateTableColumn(data) {
    return this.http.post(`${environment.apiUrl}/table-columns/update`, data);
  }

  saveTableColumn(data) {
    return this.http.post(`${environment.apiUrl}/table-columns/create`, data);
  }

  getLookupsSubFormRelation(name) {
    return this.http.get(
      `${environment.apiUrl}/table-columns/getParentLookups/${name}`
    );
  }

  tableSchema(id) {
    return this.http.get(
      `${environment.apiUrl}/table/tableSchema/${id}`
    );
  }


  //Action to perform...
  actionPerform(url) {
    let res: any = "";
    try {
      res = this.http.get(`${url}`);
    } catch (e) {
      res = "";
    }
    return res;
  }

  /*Manage & Tables List End*/
  // getClientData() {
  //   return this.http.get(`${environment.apiUrl}/client/all`);
  // }

  saveClientData(data) {
    return this.http.post(`${environment.apiUrl}/client`, data);
  }

  getSubFormFieldsFromTableName(name) {
    return this.http.get(
      `${environment.apiUrl}/table-columns/getSubFormFields/${name}`
    );
  }

  deleteClientData(id) {
    return this.http.delete(`${environment.apiUrl}/client/${id}`);
  }

  getUserData() {
    return this.http.get(`${environment.apiUrl}/user/all`);
  }

  deleteUserData(id) {
    return this.http.delete(`${environment.apiUrl}/user/${id}`);
  }

  /*Dynamic Table Start*/
  getTableByName(name: string) {
    return this.http.get(
      `${environment.apiUrl}/table/getTableByName?tableName=${name}`
    );
  }

  getDynamicTreeData(
    tableName,
    pageNo?,
    search?,
    sort?,
    filterKey?,
    recordType?,
    taskRecordsOnly?,
    watchedIssue?,
    baseTable?,
    fieldName?,
    formData?,
    lookupVal?,
    searchMode?,
    viewCompletedRecords?,
    statusFilter?,
    lastSearchedURL?,
    mustHaveLookup?
  ) {

    if (lastSearchedURL) {
      return this.http.get(lastSearchedURL);
    }

    let query = `tableName=${tableName}&page=${pageNo}`;
    if (filterKey && filterKey.length > 0) {
      filterKey = JSON.stringify(filterKey);
      query += `&filterKey=${filterKey}`;
    }
    if (search) {
      query += `&search=${search}`;
    }
    if (statusFilter && statusFilter.length) {
      statusFilter = JSON.stringify(statusFilter);
      query += `&statusFilter=${statusFilter}`;
    }
    if (sort) {
      query += `&sortBy=${sort.column}&orderBy=${sort.direction}`;
    }
    if (recordType && Object.keys(recordType).length > 0) {
      recordType = JSON.stringify(recordType);
      query += `&recordType=${recordType}`;
    }
    if (taskRecordsOnly && taskRecordsOnly == true) {
      query += "&taskRecordsOnly=yes";
    }

    if (searchMode && searchMode == 'yes') {
      query += "&isMasterSearch=yes"
    }

    if (viewCompletedRecords && viewCompletedRecords == true) {
      query += "&viewCompletedRecords=true"
    }

    if (watchedIssue && watchedIssue.noFilter && watchedIssue.watchedIssue) {
      query += "&watchedIssue=true&noWatchedFilter=true"
    } else if (watchedIssue && watchedIssue.noFilter === undefined) {
      query += "&watchedIssue=true"
    }
    if (baseTable && fieldName) {
      query += `&baseTable=${baseTable}&fieldName=${fieldName}&formData=${JSON.stringify(formData)}&lookUp=${encodeURIComponent(JSON.stringify(lookupVal))}`;
    }
    if (mustHaveLookup) {
      query += `&mustHaveLookup=${mustHaveLookup}`;
    }
    let url = `${environment.apiUrl}/all?${query}`;

    this.lastSearchedURL.next(url);
    this.lastAccessedPage.next(pageNo);


    return this.http.get(url).pipe(tap((res) =>
      this.allAPIobject = res
    ));
  }

  getTasksCount(tableName, ids) {
    return this.http.get(
      `${environment.apiUrl}/getTasksCountForIDs?tableName=${tableName}&IDs=${ids}`
    );
  }

  getDynamicTreeDataById(tableName, id) {
    return this.http.get(
      `${environment.apiUrl}/getById?tableName=${tableName}&id=${id}`
    );
  }

  getRelatedDataById(tableName, tableId, id) {
    return this.http.get(
      `${environment.apiUrl}/getByIdWithRelatedData?tableId=${tableId}&tableName=${tableName}&resourceId=${id}`
    );
  }

  saveDynamicFormData(data, tableName) {
    return this.http.post(
      `${environment.apiUrl}/create?tableName=${tableName}`,
      data
    );
  }

  updateDynamicFormData(id, tableName, data) {
    return this.http.put(
      `${environment.apiUrl}/update?id=${id}&tableName=${tableName}`,
      data
    );
  }

  deleteDynamicFormData(id, tableName, deleteAll?) {
    if (deleteAll) {

      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        body: {
          records: id,
        }
      }
      return this.http.delete(`${environment.apiUrl}/mass-delete?tableName=${tableName}`, options);
    } else {
      return this.http.delete(
        `${environment.apiUrl}/delete?id=${id}&tableName=${tableName}`
      );
    }
  }

  /*Dynamic Table End*/

  // Pending users
  getPendingUsersData() {
    return this.http.get(`${environment.apiUrl}/user/getAllPendingUser`);
  }

  /// end

  /// Multiple and single File upload in S3 API
  formFileUpload(data): Observable<HttpEvent<any>> {
    const req = new HttpRequest("POST", `${environment.apiUrl}/upload`, data, {
      reportProgress: true,
      responseType: "json",
    });
    return this.http.request(req);
    // return this.http.post(`${environment.apiUrl}/upload`, data);
  }

  ///

  uploadProfileImage(data) {
    return this.http.post(`${environment.apiUrl}/upload`, data, {
      responseType: "json",
    });
  }

  getAllTasksData(selectedTaskValue) {
    return this.http.get(
      `${environment.apiUrl}/getTasks?selectedTaskValue=${selectedTaskValue}`
    );
  }

  getChartData() {
    return this.http.get(`${environment.apiUrl}/getChartTables`);
  }

  userDetail() {

    const apiUrl = `${environment.apiUrl}/user/me?id=${this.userId}`;
    if (this.cacheForUserDetail) {
      return of(this.cacheForUserDetail);
    }
    return this.http.get(apiUrl).pipe(
      tap(res => this.cacheForUserDetail = res)
    );;
  }

  getAllUsers() {
    return this.http.get(`${environment.apiUrl}/user/getAllUsers`);
  }

  getAllClients() {
    return this.http.get(`${environment.apiUrl}/client-management/getClients`);
  }

  fetchNotificationsHistory(limit, skip = 0) {
    return this.http.get(
      `${environment.apiUrl}/user/fetchAllNotifications?limit=${limit}&skip=${skip}`
    );
  }

  myReminders() {
    return this.http.get(`${environment.apiUrl}/reminders/myReminders`);
  }

  announcementSeen() {
    return this.http.post(`${environment.apiUrl}/user/announcementSeen`, {
      id: this.userId,
    });
  }

  getDateRangeData(startDate, endDate) {
    if (startDate && endDate) {
      startDate = new Date(startDate).toUTCString();
      endDate = new Date(endDate).toUTCString();
    } else {
      startDate = new Date(startDate).toUTCString();
      endDate = new Date(startDate).toUTCString();
    }
    return this.http.get(
      `${environment.apiUrl}/getTasks?startDate=${startDate}&endDate=${endDate}`
    );
  }

  getFilterSaveData(tableName) {
    return this.http.get(
      `${environment.apiUrl}/getFilterList?tableName=${tableName}`
    );
  }

  getRelatedLookupData(tableName, resourceId, page = 1) {
    return this.http.get(
      `${environment.apiUrl}/getRelatedLookupData?tableName=${tableName}&resourceId=${resourceId}&page=${page}`
    );
  }

  getRelatedLookupDataByTableName(tableName) {
    return this.http.get(
      `${environment.apiUrl}/getRelatedLookupTables?tableName=${tableName}`
    );
  }

  getTasksGroupByStatus(
    skip,
    taskType,
    task,
    assignee?,
    lookupName?,
    lookupTableId?,
    lookupTableName?,
    openStatus?,
    showCompleted?,
    groupBy?,
    groupByDates?,
    createdBy?,
    watchedIssue?,
    search?,
    showFutureTasks?
  ) {
    let query = `skip=${skip}`;
    query += taskType ? `&taskType=${taskType}` : `&taskType=${null}`;
    if (task) {
      query += `&search=${task}`;
    }

    if (openStatus && openStatus.length > 0) {
      openStatus = JSON.stringify(openStatus);
      query += `&openStatus=${openStatus}`;
    }

    if (showCompleted) {
      query += `&showCompleted=${showCompleted}`;
    }

    if (lookupTableId && lookupTableName) {
      query += `&lookupTableId=${lookupTableId}&lookupTableName=${lookupTableName}`;
      if (lookupName) {
        query += `&lookupName=${lookupName}`;
      }
    } else if (assignee && assignee.length > 0) {
      assignee = JSON.stringify(assignee);
      query += `&assignee=${assignee}`;
    }

    if (groupBy === "date") {
      if (groupByDates) {
        groupByDates = JSON.stringify(groupByDates);
        query += `&groupByDates=${groupByDates}`;
      }
    }
    if (showFutureTasks) {
      query += `&showFutureTasks=true`;
    }

    if (
      !lookupTableId &&
      !lookupTableName &&
      createdBy &&
      createdBy.length > 0
    ) {
      createdBy = JSON.stringify(createdBy);
      query += `&createdBy=${createdBy}`;
    }

    if (watchedIssue === true) {
      query += `&watchedIssue=${watchedIssue}`;
    }

    if (search) {
      query += `&searchValue=${search}`;
    }

    return this.http.get(
      `${environment.apiUrl}/getTasksGroupByStatus?${query}`
    );
  }

  setWelcomeMessageSeen(userId) {
    return this.http.put<any>(
      `${environment.apiUrl}/update?id=${userId}&tableName=Users`,
      { welcomeNoteSeen: true }
    );
  }

  getTotalOpenTasks(
    assignee,
    lookupTableId,
    lookupTableName,
    openStatus,
    groupBy,
    createdBy,
    watchedIssue,
    searchValue,
    showCompleted,
    showFutureTasks?
  ) {
    let query;
    if (assignee && assignee.length > 0) {
      assignee = JSON.stringify(assignee);
      query = `&assignee=${assignee}`;
    } else if (lookupTableId && lookupTableName) {
      query = `lookupTableId=${lookupTableId}&lookupTableName=${lookupTableName}`;
    }
    if (openStatus && openStatus.length > 0) {
      openStatus = JSON.stringify(openStatus);
      query += `&openStatus=${openStatus}`;
    }
    if (groupBy) {
      query += `&groupBy=${groupBy}`;
    }

    if (showFutureTasks) {
      query += `&showFutureTasks=true`;
    }

    if (
      !lookupTableId &&
      !lookupTableName &&
      createdBy &&
      createdBy.length > 0
    ) {
      createdBy = JSON.stringify(createdBy);
      query += `&createdBy=${createdBy}`;
    }

    if (watchedIssue === true) {
      query += `&watchedIssue=${watchedIssue}`;
    }

    if (searchValue) {
      query += `&searchValue=${searchValue}`;
    }

    if (showCompleted) {
      query += `&showCompleted=${showCompleted}`;
    }

    let apiCall;

    if (query) {
      apiCall = this.http.get(`${environment.apiUrl}/getTotalOpenTasks?${query}`);
    } else {
      apiCall = this.http.get(`${environment.apiUrl}/getTotalOpenTasks`);
    }


    return apiCall.pipe(tap((res) => this.updateTaskCount(res)))
  }

  updateTaskCount(resp) {
    if (resp && resp.data) {
      const count = resp.data.reduce((total, cur) => total += cur.totalInCompleteTasks, 0);
      this.taskCount$.next(count)
    }
  }

  getRedirectVariable(resp) {
    if (resp) {
      this.redirect.next(resp)
    }
  }

  redirectToHomePage() {
    this.redirect.subscribe((redirectUrl: any) => {
      if (redirectUrl) {
        this.router.navigate([redirectUrl]);
      } else {
        this.router.navigate(['pages/**']);
      }
    })
  }

  getWelcomeVariable(resp) {
    if (resp) {
      this.welcome.next(resp)
    }
  }

  getLogoVariable(resp) {
    if (resp) {
      this.logo.next(resp)
    }
  }

  getLoginVariable(resp) {
    if (resp) {
      this.login.next(resp)
    }
  }

  getTitleVariable(resp) {
    if (resp) {
      this.title.next(resp)
    }
  }

  getLoginLogoVariable(resp) {
    if (resp) {
      this.loginLogo.next(resp)
    }
  }

  getAppNameVariable(resp) {
    if (resp) {
      this.appName.next(resp)
    }
  }


  get userId() {
    if (JSON.parse(localStorage.getItem("userData"))) {
      return JSON.parse(localStorage.getItem("userData"))._id;
    } else {
      return;
    }

  }

  getTaskTotal() {
    let query = {}
    if (this.userId) {
      let assignee = JSON.stringify([this.userId]);
      query = `&assignee=${assignee}`;
    }

    query += `&groupBy=date`;

    return this.http.get(`${environment.apiUrl}/getTotalOpenTasks?${query}`).pipe(tap((res) => this.updateTaskCount(res))).subscribe()
  }

  getSubTasks(taskId) {
    return this.http.get(`${environment.apiUrl}/getSubTasks?id=${taskId}`);
  }

  getTutorials(query) {
    return this.http.get(
      `${environment.apiUrl}/tutorials/getHelpByName?${query}`
    );

    // localhost:8081/api/tutorials/getHelpByName?tutorialFor=Table&tableName=Clients
  }

  getCalendarTasks() {
    return this.http.get(`${environment.apiUrl}/getCalendarTasks`);
  }

  createNotes(notesObj) {
    return this.http.post(`${environment.apiUrl}/reminders/create`, notesObj);
  }

  updateNotes(id,notesObj) {
    return this.http.put(`${environment.apiUrl}/reminders/update/${id}`, notesObj);
  }

  getEvents(id) {
    return this.http.get(
      `${environment.apiUrl}/reminders/resourceReminders/${id}`
    );
  }

  updateReminder(id) {
    this.reminderUpdated$.next(true);
    return this.http.put(`${environment.apiUrl}/reminders/update/${id}`, {
      visibilityStatus: "read",
    });
  }

  updateDueTimeForReminder(id, dueDate) {
    this.reminderUpdated$.next(true);
    return this.http.put(`${environment.apiUrl}/reminders/update/${id}`, {
      dueDate: dueDate,
    });
  }

  markComplete(id) {
    this.reminderUpdated$.next(true);
    return this.http.put(`${environment.apiUrl}/reminders/update/${id}`, {
      isCompleted: true,
    });
  }

  deleteReminder(id) {
    return this.http.put(`${environment.apiUrl}/reminders/update/${id}`, {
      isActive: false,
    });
  }

  callViewForAction(chatSubscriptionService,
    route,
    dialogService,
    tableService,
    service,
    helperService,
    toastrService,
    nbMenuService,
    datePipe,
    router,
    linkifyService,
    changeDetector,
    location,
    sidebarService,
    messageService,
    oldData,
    newData,
    element) {

    let obj = new DynamicTableViewComponent(chatSubscriptionService, route, dialogService, tableService, service, helperService, toastrService, nbMenuService, null, router, null, null, null, sidebarService, null);
    obj.oldData = oldData;
    obj.newData = newData;
    obj.onActionsClick('', element);

  }

  // onActionFire(event,form){

  //   if (!event) return;

  //   let $Table = form;
  //   let $Token = localStorage.getItem("userToken");
  //   let $api = `${environment.apiUrl}`

  //   if (!eval(event.displayCondition)) {

  //     let notAvilableMessage = 'This action is not available on this record';
  //     let notAvilableMessageColr = '';

  //     if (Array.isArray(event.actionNotAvailable)) {
  //       event.actionNotAvailable.forEach((action) => {
  //         if (eval(action.condition)) {
  //           notAvilableMessage = action.message;
  //           notAvilableMessageColr = action.color;
  //         }
  //       });
  //     } else {
  //       notAvilableMessage = event.actionNotAvailable;
  //     }

  //     this.dialogService.open(InfoDialogComponent, {
  //       context: {
  //         text: notAvilableMessage,
  //         title: 'Action not available',
  //       },
  //     });
  //     return;
  //   }

  //   this.dialogService
  //     .open(ConfirmDialogComponent, {
  //       context: {
  //         actionObj: event,
  //         title: event.actionName,
  //         warningMessage: event.warningMessage,
  //         text: "",
  //         actionFlag: true,
  //         warningColor: event.warningMessageColor,
  //       },
  //     })
  //     .onClose.subscribe((column) => {
  //       if (column) {
  //         // this.isActionRunning = true;
  //         // this.pageLoaded = false;
  //         let that = this;

  //         //-- Perform action
  //         let res = this.actionPerform(eval(event.actionUrl));
  //           // .subscribe(
  //           //   (res) => {
  //           //     if (res) { }
  //           //     (error) => { }
  //           //   });

  //         //-- Set timeout according to waitTime field
  //         setTimeout(() => {
  //           //-- Refresh page..

  //           setTimeout(() => {

  //             let $Table = form;
  //             // this.pageLoaded = true;
  //             for (let k = 0; k < event.messageList.length; k++) {
  //               if (eval(event.messageList[k].condition)) {
  //                 // this.loading = false;

  //                 this.toastrService.show(event.messageList[k].message,
  //                   event.actionName,
  //                   { status: event.messageList[k].color.toLowerCase() }
  //                 );

  //                 // this.isActionRunning = false
  //               }
  //             }

  //           }, event.waitTime + 3000);

  //         }, event.waitTime);

  //       }

  //     });
  // }

}

export class FilterForService {
  tableName: string;
  filterKey: any[];
  numberOperation: null;
  formulaOperation: null;
  textValue: {};
  dropdownValue: [];
  dropdownWithImageValue: [];
  users: any[];
  filteredOptions: {};
  lookupValue: {};
  showAutocomplete: {};
  check: boolean[];
  checkboxArray: any[];
  filteredStatus: [];
  range: {
    start: Date,
    end: Date,
  };
  DateTimerange: {
    start: Date,
    end: Date,
  };
  radio: null;

  constructor() {
    this.tableName = '';
    this.filterKey = [];
    this.numberOperation = null;
    this.formulaOperation = null;
    this.textValue = {};
    this.dropdownValue = [];
    this.dropdownWithImageValue = [];
    this.users = [];
    this.filteredOptions = {};
    this.lookupValue = {};
    this.showAutocomplete = {};
    this.check = [];
    this.checkboxArray = [];
    this.filteredStatus = [];
    this.range = {
      start: null,
      end: null,
    };
    this.DateTimerange = {
      start: null,
      end: null,
    };
    this.radio = null;
  }
}
