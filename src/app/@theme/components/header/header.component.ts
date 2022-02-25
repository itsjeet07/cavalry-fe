import { DOCUMENT, formatDate, DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ShowcaseDialogComponent } from '@app/shared/components';
import { InfoDialogComponent } from '@app/shared/components/dialog/info-dialog/info-dialog.component';
import { NewReminderModalComponent } from '@app/shared/components/new-reminder-modal/new-reminder-modal.component';
import { AuthService } from '@app/shared/services';
import { MessageService } from '@app/shared/services/message.service';
import { SocketService } from '@app/shared/services/socket.service';
import {
  NbComponentStatus,
  NbDialogService,
  NbMediaBreakpointsService,
  NbMenuService,
  NbPopoverDirective,
  NbSidebarService,
  NbThemeService,
  NbToastrService,
} from '@nebular/theme';
import { Observable, Subject, Subscription } from 'rxjs';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { map, takeUntil, throttleTime } from 'rxjs/operators';
import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { RippleService } from '../../../@core/utils/ripple.service';
import { TableService } from '../../../shared/services/table.service';
import { ChatSubscriptionService } from '../../../shared/services/chat-subscription.service';
import { DynamicFormDialogNewDesignComponent } from '../../../shared/components/dynamic-form-dialog-new-design/dynamic-form-dialog-new-design.component';
import { DynamicFormDialogComponent } from '@app/shared/components/dynamic-form-dialog/dynamic-form-dialog.component';
import { ReminderAlertComponent } from '@app/shared/components/reminder-alert/reminder-alert.component';

@Component({
  selector: "ngx-header",
  styleUrls: ["./header.component.scss"],
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public readonly materialTheme$: Observable<boolean>;
  userPictureOnly: boolean = false;
  user: any;
  condtion = false;
  timeout;
  keySubscription: Subscription;
  mouseSubscription: Subscription;
  isActive = true;
  userId = "";
  actionSubscription: Subscription;
  logoPathSubscription: Subscription;
  refreshHeaderSubscription: Subscription;
  notificationCount = 0;
  notificationBadgeText = "";
  showNotification = false;
  isAnnounceRead = true;
  announcement: any = [];
  allowedUserStatus = ["Online", "Away"];
  cavalryLogo = {
    path: "",
    height: 45,
    cssClass: "cavalry-logo",
  };
  reminderSubScription: Subscription;
  items = [
    { icon: { icon: 'python', pack: 'edit' } },
    // -- { icon: { icon: 'python', pack: 'view' } },
    // { icon: { icon: 'python', pack: 'delete' } },
  ];
  currentTheme = "default";
  userMenu = [{ title: "Profile" }, { title: "Log out" }];
  notificationMenu = [
    {
      notificationId: "",
      title: "No new notification!",
      tableId: "",
      tableName: "",
      reminderNotes: '',
      resourceId: "",
      subject: "",
      description: "",
      resourceName: "",
      notes: "",
      isNewMessage: false,
      subscribers: [],
      details: '',
      dateTime: new Date(),
      toDisplay: [],
      tableIcon: {},
    },
  ];

  isGearIcon = false;
  quickActionList = [];
  username = "";

  @ViewChild(NbPopoverDirective) popover;

  public constructor(
    @Inject(DOCUMENT) private document: Document,
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private rippleService: RippleService,
    private socketService: SocketService,
    private authService: AuthService,
    private router: Router,
    private chatSubscriptionService: ChatSubscriptionService,
    private tableService: TableService,
    private messageService: MessageService,
    private nbToastrService: NbToastrService,
    private renderer: Renderer2,
    private dialogService: NbDialogService,
    private datePipe: DatePipe
  ) {
    this.materialTheme$ = this.themeService.onThemeChange().pipe(
      map((theme) => {
        const themeName: string = theme?.name || "";
        return themeName.startsWith("material");
      })
    );

    this.userId = JSON.parse(localStorage.getItem("userData"))._id;

    this.actionSubscription = this.menuService
      .onItemClick()
      .subscribe((event: any) => {
        if (event.item.title === "Log out") {
          this.authService.logout();
        }
        if (event.item.title === "Profile") {
          const userTableId = "5f60cb6e10fd660a92e9b416";
          this.router.navigateByUrl(
            `pages/tables/dynamic/${userTableId}/Users/${this.userId}`
          );
        }
      });

    this.renderer.listen("window", "click", (e: Event) => {

      let index = 0;
      let valid = false;
      for (let noti of this.notificationMenu) {

        const ele = document.getElementById('edit-btn' + '-' + index);
        if (ele && ele.contains(<Node>e.target)) {
          valid = true;
          this.showNotification = true;
          break;
        }
        index++;
      }
      if (!valid) {
        this.showNotification = false;
      }
    });
    if (JSON.parse(localStorage.getItem('userData'))) {
      this.getUserDetail();
    }


    this.logoPathSubscription = tableService.logo.subscribe(count => {
      this.cavalryLogo.path = count;
    })

  }

  getTablesForMenu() {
    this.tableService.getTablesForMenu().subscribe(((res: any) => {
      if (res.statusCode == 200) {
        this.getTablesForMenuData = res.data;
        this.quickActionList = this.getTablesForMenuData.filter(v => v.quickAction).map(ele => ele.tableName);
      }
    }))
  }
  ngOnInit() {
    this.changeUserStatus();
    this.getTablesForMenu();
    this.currentTheme = this.themeService.currentTheme;
    // this.getUnreadMessages();
    if (localStorage.getItem("userData")) {
      const userData = JSON.parse(localStorage.getItem("userData"));
      this.isGearIcon = userData.isGearIcon;
      this.username = (
        userData.firstName +
        " " +
        userData.lastName
      ).toUpperCase();
    }

    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => (this.user = users.nick));

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService
      .onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (isLessThanXl: boolean) => (this.userPictureOnly = isLessThanXl)
      );

    this.themeService
      .onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$)
      )
      .subscribe((themeName) => {
        this.currentTheme = themeName;
        this.rippleService.toggle(themeName?.startsWith("material"));
      });
    // for chat functions
    this.setStatusChangeTimer();
    this.keyPressSubscription();
    this.mouseMoveSubscription();
    this.chatSubscriptionService.getSubscriptions();
    this.getChatSubscription();
    this.getAllUsers();
    //this.loadNotificationsHistory();
    this.loadReminders();
    this.getNotifications();
    // this.getSystemConfig();
    this.listenGeneralReminders();

    this.tableService.reminderUpdated$.subscribe((res: any) => {
      this.loadReminders();
    });

    this.tableService.refreshHeader.subscribe((res: any) => {
     this.getTablesForMenu();
    })

  }

  loadReminders() {

    this.tableService.myReminders().subscribe((res: any) => {
      if (res.statusCode == 200) {
        if (res.data.reminders) {
          this.notificationCount = res.data.reminders.length;
          let overDueRemindes = res.data.reminders.length;

          if (this.notificationCount > 0) {
            if (localStorage.getItem("isFirstTime")) {
              localStorage.removeItem("isFirstTime");
              //-- open pop up to show notification count.
              this.dialogService.open(InfoDialogComponent, {
                context: {
                  title: `You have Reminders!`,
                  text: `Total ${overDueRemindes} reminders needs attention.`,
                  dialogType: "firstTimeReminder",
                },
                closeOnEsc: false,
                closeOnBackdropClick: false,
              });
            }
          }
          this.notificationBadgeText =
            this.notificationCount > 0 ? this.notificationCount.toString() : "";

          if (res.data.reminders.length > 0) {
            this.notificationMenu = [];

            res.data.reminders.forEach((element) => {
              this.updateNotifications(element);
            });
          }

          if (res.data.reminders.length === 0) {
            this.notificationMenu[0].title = 'No new notification!';
          }
        }
      }
    });
  }

  listenGeneralReminders() {

    this.socketService.listen("generic_reminder").subscribe((res: any) => {
      if (res._id !== this.userId) return;
      this.dialogService.open(InfoDialogComponent, {
        context: {
          title: `You have ${res.unreadReminders} new reminders`,
          text: '<a href="" [routerLink]="[\'/pages/tables/notifications\']>View Reminders</a>',
          dialogType: "reminder",
        },
      });
    })
  }

  readNotifications(e) {
    setTimeout(() => {
      this.loadReminders();
      this.showNotification = !this.showNotification;
      this.notificationCount = 0;
      this.notificationBadgeText = "";
      //this.updateMessageStatus();
      this.popover.hide();
      e.stopPropagation();
    }, 0);
  }

  redirect(notification) {

    notification['reminderDetails'] = notification;
    console.log('notification ', notification)
    this.dialogService.open(InfoDialogComponent, {
      context: {
        title: ``,
        text: "",
        dialogType: "reminder",
        notification: notification,
      },
    }).onClose.subscribe((res) => {
      if (res == 'markDone') {
        this.loadReminders();
        this.showNotification = !this.showNotification;
        this.notificationCount = 0;
        this.notificationBadgeText = '';
        this.popover.hide();
      }
    });

    return false;
  }

  getNotifications() {
    this.socketService.listen("new_notification").subscribe((res: any) => {
      if (res.subscribers) {
        if (!res.subscribers.find(sub => sub.receiver == this.userId)) {
          return;
        }
      }
      this.notificationCount++;
      this.notificationBadgeText = this.notificationCount.toString();
      //this.showToast('primary');

      //open pop up to show details.
      this.dialogService.open(ReminderAlertComponent, {
        context: {
          title: "You have a new notification",
          text: "",
          dialogType: "notification",
          notification: res.resourceDetails,
        },
      });

      if (
        this.notificationMenu.length == 1 &&
        this.notificationMenu[0]["title"] == "No new notification!"
      ) {
        this.notificationMenu = [];
      }

      if (this.notificationMenu.length == 5) {
        this.notificationMenu.pop();
      }

      this.updateNotifications(res, true);
    });
  }

  showToast(status: NbComponentStatus) {
    this.nbToastrService.show(
      "New notification",
      "You have a new notification!",
      { status }
    );
  }

  getTablesForMenuData = [];
  tableIcon = {};
  updateNotifications(data, isNewMessage = false) {

    let apiData;
    let temp = [];
    if (data?.tableName && data?.resourceId) {
      this.tableService
        .getRelatedDataById(data?.tableName, data?.tableId, data?.resourceId).pipe(takeUntil(this.destroy$))
        .subscribe((res: any) => {
          if (res.statusCode == 200 && res.data) {
            apiData = res.data;

            if (apiData["IDField"] && apiData["IDField"].length) {
              apiData["IDField"].forEach((element, i) => {
                let IDElement = apiData["tableColumns"].filter(v => v.name == element)[0];
                if (IDElement.type == "date" || IDElement.type == "dateTime") {
                  if (apiData[element] && typeof apiData[element] !== 'object') {
                    let val = this.datePipe.transform(apiData[element], "M/d/yy")
                    temp.push(' ' + val);
                  }
                } else {
                  if (apiData[element] && typeof apiData[element] !== 'object') {
                    temp.push(' ' + apiData[element]);
                  }
                }

              });
            }



            if (this.tableIcon[data.tableName]) {
              this.tableIcon[data.tableName] = this.tableIcon[data.tableName];
            } else {
              let iconData = this.getTablesForMenuData.filter(v => v.tableName == data?.tableName);
              if (iconData && iconData.length) {
                this.tableIcon[data.tableName] = iconData[0].iconLocation ? iconData[0].iconLocation : '';
              }
            }


          }
        });

      this.notificationMenu.unshift({
        title: "You have new task reminder",
        tableId: data?.tableId,
        tableName: data?.tableName,
        reminderNotes: data?.reminderNotes,
        resourceId: data?.resourceId,
        subject: data?.resourceDetails?.subject,
        description: data?.resourceDetails?.description,
        resourceName: data?.resourceDetails?.resourceName,
        notes: data?.resourceDetails?.reminderNotes || data.notes,
        details: data?.details,
        isNewMessage: isNewMessage,
        subscribers: data?.subscribers,
        notificationId: data?._id,
        dateTime: data.dueDate,
        toDisplay: temp,
        tableIcon: this.tableIcon
      })

    } else {
      this.notificationMenu.unshift({
        title: "You have new task reminder",
        tableId: data?.tableId,
        tableName: data?.tableName,
        reminderNotes: data?.reminderNotes,
        resourceId: data?.resourceId,
        subject: data?.resourceDetails?.subject,
        description: data?.resourceDetails?.description,
        resourceName: data?.resourceDetails?.resourceName,
        notes: data?.resourceDetails?.reminderNotes || data.notes,
        details: data?.details,
        isNewMessage: isNewMessage,
        subscribers: data?.subscribers,
        notificationId: data?._id,
        dateTime: data.dueDate,
        toDisplay: temp,
        tableIcon: this.tableIcon
      })

    }


  }

  getChatSubscription() {
    this.chatSubscriptionService.chatSubscribersSub.subscribe((res: any) => {
      if (res.statusCode == 200 && res.data) {
        res.data.forEach((resourceId: any) => {
          this.messageService.Join(resourceId);
        });
      }
    });
  }

  getAllUsers() {
    this.tableService.getAllUsers().subscribe((res: any) => {
      if (res.statusCode == 200) {
        //let data = res.data.filter(v=> this.allowedUserStatus.includes(v.status));
        this.tableService.$users.next(res.data);
        //this.tableService.$allUsers.next(res.data);
      }
    });
  }

  // loadNotificationsHistory() {
  //   this.tableService.fetchNotificationsHistory(null).subscribe((res: any) => {
  //     if (res.statusCode == 200) {
  //       if (res.data) {
  //         this.notificationCount = res.data.unreadCount;
  //         if(this.notificationCount > 0){
  //           if (localStorage.getItem("isFirstTime")) {
  //             localStorage.removeItem("isFirstTime");
  //             //open pop up to show notification count.
  //             this.dialogService.open(InfoDialogComponent, {
  //               context: {
  //                 title: `You have ${this.notificationCount} new reminders`,
  //                 text: '<a href="" [routerLink]="[\'/pages/tables/notifications\']>View Reminders</a>',
  //                 dialogType: "reminder",
  //               },
  //             });
  //           }
  //         }
  //         this.notificationBadgeText =
  //           this.notificationCount > 0 ? this.notificationCount.toString() : "";

  //         if (res.data.notifications.length > 0) {
  //           this.notificationMenu = [];

  //           res.data.notifications.reverse().forEach((element) => {
  //             this.updateNotifications(element);
  //           });
  //         }
  //       }
  //     }
  //   });
  // }

  updateMessageStatus(notification): void {
    const data = {
      receiver: this.userId,
      notification: notification.notificationId,
      participantType: 2,
    };

    if (notification.subscribers) {
      let subscribers = notification.subscribers;
      const findIndex = subscribers.findIndex((x) => x.receiver == this.userId);

      if (findIndex > -1) {
        if (subscribers[findIndex].visibility == "unread") {
          notification.isNewMessage = false;
          this.socketService.emit("message_status_change", data);
        }
      }
    }
  }

  changeUserStatus() {
    const data = {
      id: this.userId,
      status: "Online",
    };
    // this.messageService.userStatusChange(data);
    this.socketService.emit("user_status_change", data);
  }

  keyPressSubscription() {
    this.keySubscription = fromEvent(this.document, "keydown")
      .pipe(throttleTime(20000))
      .subscribe((event) => {
        this.setStatusChangeTimer();
      });
  }

  mouseMoveSubscription() {
    this.mouseSubscription = fromEvent(document, "mousemove")
      .pipe(throttleTime(20000))
      .subscribe((e) => {
        this.setStatusChangeTimer();
      });
  }

  setStatusChangeTimer() {
    const data = { id: this.userId, status: "Online" };
    if (!this.isActive) {
      this.isActive = true;
      // this.messageService.userStatusChange(data);

      this.socketService.emit("user_status_change", data);
    }
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.isActive = false;
      const statusData = { id: this.userId, status: "Away" };
      // this.messageService.userStatusChange(statusData);

      this.socketService.emit("user_status_change", statusData);
    }, 30000);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.keySubscription) {
      this.keySubscription.unsubscribe();
    }

    if (this.mouseSubscription) {
      this.mouseSubscription.unsubscribe();
    }

    if (this.actionSubscription) {
      this.actionSubscription.unsubscribe();
    }

    if (this.logoPathSubscription) {
      this.logoPathSubscription.unsubscribe();
    }
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, "menu-sidebar");
    this.layoutService.changeLayoutSize();
    this.tableService.toggleSidebar.next((this.condtion = !this.condtion));
    return false;
  }

  onEmailClick() {
    this.router.navigate(["/pages/tables/email"]);
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  manageTables() {
    this.router.navigate(["/pages/tables/list"]);
  }

  redirectToNotifications() {
    this.router.navigate(["/pages/tables/notifications"]);
  }

  formatDate(value) {
    if (!value) {
      return "";
    }

    return formatDate(value, "M/d/yy, h:mm a", "en");
  }

  getUserDetail() {
    this.tableService.userDetail().subscribe(
      (res: any) => {

        if (res.message.announcements != null && res.message.me.lastClickedOnAnnouncement != undefined && res.message.me.lastClickedOnAnnouncement) {

          const announceClicked = new Date(res.message.me.lastClickedOnAnnouncement).getTime();
          const announceDate = new Date(res.message.announcements.updatedAt).getTime();
          this.isAnnounceRead = !(announceClicked == 0 || announceDate > announceClicked);
        } else {
          this.isAnnounceRead = false;
        }
        console.log(res.message.announcements);
        this.announcement = res.message.announcements;

        if (res.message.me && res.message.me.welcomeNoteSeen) {
          if (!this.isAnnounceRead) {
            this.openAnnouncementBox();
          }
        }

      },
    );

  }

  openAnnouncementBox() {
    if (this.announcement) {
      // commented for this task CA-615
      // if (!this.isAnnounceRead) {
      //   this.tableService.announcementSeen().subscribe(
      //     (res: any) => {
      //       if (res.statusCode == 200) {
      //         this.isAnnounceRead = true;
      //       }
      //     },
      //   );
      // }
      this.tableService.announcementSeen().subscribe(
        (res: any) => {
          if (res.statusCode == 200) {
            this.isAnnounceRead = true;
          }
        },
      );
      this.dialogService.open(ShowcaseDialogComponent, {
        context: {
          title: this.announcement.subject,
          body: `${this.announcement.message}`,
          button: { text: 'Close' },
        },
        hasBackdrop: true,
      });
    }
  }

  public onSearch(searchStr) {
    if (!!searchStr === true) {
      this.router.navigateByUrl(`/pages/tables/master-search?search=${searchStr}`);
    }
  }

  openReminderModal(notification?) {

    if (notification) {
      if (notification.tableId && notification.resourceId) {
        this.dialogService.open(NewReminderModalComponent, {
          context: {
            tableId: notification.tableId,
            tableName: notification.tableName,
            resourceId: notification.resourceId,
            IdFieldData: notification.toDisplay,
            fromViewPage: true,
            tableIcon: notification.tableIcon[notification.tableName],
            updateReminder: notification
          }
        }).onClose.subscribe(res => {
          if (res && res == 'Done') {
            this.loadReminders();
          }
        });;
      } else {
        this.dialogService.open(NewReminderModalComponent, {
          context: {
            fromViewPage: false,
            updateReminder: notification
          }
        }).onClose.subscribe(res => {
          if (res && res == 'Done') {
            this.loadReminders();
          }
        });;
      }
    } else {
      this.dialogService.open(NewReminderModalComponent, {
        context: {
          fromViewPage: false,
        }
      }).onClose.subscribe(res => {
        if (res && res == 'Done') {
          this.loadReminders();
        }
      });;
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

  openForm(tableName) {

    let table = this.getTablesForMenuData.filter(v => v.tableName == tableName)[0];
    console.log(table);
    if (this.getTablesForMenuData && this.getTablesForMenuData.length) {
      this.getTablesForMenuData.forEach(ele => {
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
        closeOnEsc: true,
        context: {
          title: tableName,
          form: table.columns,
          button: { text: 'Save' },
          tableName: table.tableName,
          Data: null,
          action: 'Add',
          tableDataForForms: this.getTablesForMenuData,
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
          if (name.continue) { }
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
          tableDataForForms: this.getTablesForMenuData,
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
