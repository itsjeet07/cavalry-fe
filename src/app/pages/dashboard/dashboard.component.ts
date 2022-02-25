import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  NbThemeService,
  NbDialogService,
  NbCalendarRange,
  NbDateService,
} from '@nebular/theme';
import { SolarData } from '@app/@core/data/solar';
import { ShowcaseDialogComponent } from '@app/shared/components';
import { now } from 'lodash';
import { TableService } from '@app/shared/services/table.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarView,
  CalendarDateFormatter,
} from 'angular-calendar';
import { CustomDateFormatter } from './custom-date-formatter.provider';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
})
export class DashboardComponent implements OnDestroy, OnInit {

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = false;
  type = 'PieChart';
  // columnNames = ['Browser', 'Percentage'];
  options: {
     legend: { position: 'side', alignment: 'center' },
    slices: {
      1: {offset: 0.04},
      2: {offset: 0.04},
    },
    pieSliceText: 'none',
  };
  width = 332;
  height = 320;
  date = new Date();
  checkedViewAll = {};
  actionSubscription: Subscription;
  welcomeSubscription:Subscription;
  loading = false;
  panelOpenState = false;

  welcomeMessage =  `<br>` +
            `We, Cavalry LLC, are a warm, diverse team of professionals seeking to assist and support our clients in any way possible through providing a plethora of quality services including expediter services, architectural drafting and design,<br>` +
            `violation removal, contracting, and engineering.<br><br>` +
            `Through our website and intranet, we have the opportunity to communicate with you directly, efficiently, and transparently. Updates, feedback, documents, and correspondence can easily be submitted through our system, and you can expect responsiveness and reliability from our associates. <br><br>` +
            `As always, our team is here to support you!<br><br>` +
            `If you have any comments, questions, or suggestions, please Contact Us. <a href="https://Info@synccos.com/" target="_blank">Info@synccos.com</a><br><br>` +
            `` +
            `Thank you.<br>`;

  table1All = false;
  table1 = [
    // tslint:disable-next-line: max-line-length
    { checked: true, alertChecked: true, from: 'abc@gmail.com', text: 'Fill out Covid-19 form', status: 'Progress', date: now() },
    { checked: false, alertChecked: false, from: 'xyz@gmail.com', text: 'Meeting', status: 'Pending', date: now() },
    // tslint:disable-next-line: max-line-length
    { checked: false, alertChecked: false, from: 'cavalry@gmail.com', text: 'Arrange Call', status: 'Approved', date: now() },
    { checked: false, alertChecked: false, from: 'abx@gmail.com', text: 'Conference', status: 'Pending', date: now() },
    // tslint:disable-next-line: max-line-length
    { checked: false, alertChecked: false, from: 'xyb@gmail.com', text: 'Arrange meeting', status: 'Approved', date: now() },
  ];
  tempTable1 = Object.assign([], this.table1);

  private alive = true;

  announcement: any = [];
  isAnnounceRead = true;
  range: NbCalendarRange<Date>;
  oldStatusValue = '';
  chartArray = [];
  isCollapsed = [];
  calendarTasks = [];
  constructor(private themeService: NbThemeService,
    private solarService: SolarData,
    private dialogService: NbDialogService,
    private tableService: TableService,
    protected dateService: NbDateService<Date>,
    private router: Router,
  ) {


    if (JSON.parse(localStorage.getItem('userData'))) {
      this.getUserDetail();
    }

    this.range = {
      start: this.dateService.today(),
    };

    // this.actionSubscription = this.nbMenuService.onItemClick().subscribe(function (event) {
    //   let fireDialog = false;
    //   that.recordTypes.forEach(e => {
    //     if (e.title === event.item.title) {
    //       if (window.location.href.indexOf('pages/dashboard') > -1) {
    //         that.recordType = e.title;
    //         that.onAddUpdate();
    //         fireDialog = true;
    //       }
    //     }
    //
    //   });
    // });

    this.welcomeSubscription = this.tableService.welcome.subscribe((count) => {
      if(count){
        this.welcomeMessage = count;
      }
    })
  }

  ngOnInit(): void {

    this.tableService.redirect.subscribe((redirectUrl:any) => {
      if(redirectUrl){
        this.router.navigate([redirectUrl]);
      }
    })

    this.getCalendarTasks();
    this.getChartTables();
    // this.getWelcomeMessage();
  }

  // getWelcomeMessage() {
  //   this.tableService.getSystemConfig().subscribe((configs) => {
  //     this.welcomeMessage = configs['Welcome Modal'];
  //   });
  // }

  getChartTables() {
    this.tableService.getChartData().subscribe((res: any) => {
      this.chartArray = res.data;
      this.chartArray.forEach((chart, index) => {
        this.isCollapsed[index + 1] = false;
        chart['count'] = 0;
        chart.chart.forEach(c => {
          if (chart['count'] < c.count) {
            chart['count'] = c.count
          };
          c.options.legend = { alignment: 'center',position:'right'};
          c.options.chartArea = { bottom: 40, left: 0, right:0};
          c.options.height = 225;
          c.options.pieSliceText = 'none';
          c.options.sliceVisibilityThreshold = 0;
          c.options.titleTextStyle = {
            color: '#9B9FB3',
            fontName: 'Roboto',
            fontStyle: 'normal',
            fontSize: 15,
          };
          if(c.data && c.data.length){
              if(c.options.colors && c.options.colors.length){
                let temp = [];
                temp = c.options.colors;
                c.options.colors = temp.filter(v => v !== null);
              }
            } else{
              let temp = [];
              temp.push("No Data");
              temp.push(100);
              c.data.push(temp);

              temp = [];
              temp.push("#808080");
              c.options.colors = temp;
            }

        });
      });
    });


  }

  getCalendarTasks() {
    this.tableService.getCalendarTasks().subscribe((res: any) => {
      this.calendarTasks = res.data;
      this.calendarTasks.forEach(task => {
        task.start = new Date(task.start);
      });
    });
  }

  onSelect(event, data, tableName) {
    let redirectUrl: any = this.router.url;
    redirectUrl = redirectUrl.split('/').pop();
    localStorage.setItem('url', JSON.stringify(redirectUrl));
    const row = event.selection[0].row;
    let id;
    const url = `pages/tables/${tableName}`;

    if(data.data[0][0] == "No Data"){
      this.router.navigate([url]);
    } else{
      data.idField.forEach((element, index) => {
        if (index == row) {
          id = element;
        }
      });

      let filterKey = { [data.groupByField] : id };
      data.filter && data.filter.forEach(filter => {
        filter.rules && filter.rules.forEach(rule => {
          if (rule.operator == '$in' || rule.operator == '$eq') {
            filterKey =  {...filterKey, [rule.field] : rule.value};
          }
        });
      });
      this.router.navigate([url], {queryParams: {filterKey:JSON.stringify(filterKey),fromDashboard:true}});
    }
  }


  ngOnDestroy() {
    this.alive = false;
    if (this.actionSubscription) {
      this.actionSubscription.unsubscribe();
    }
    if(this.welcomeSubscription){
      this.welcomeSubscription.unsubscribe();
    }
  }

  getUserDetail() {
    this.tableService.userDetail().subscribe(
      (res: any) => {

        if (res.message.me && !res.message.me.welcomeNoteSeen) {
          this.showWelcomePopup();
        }

        if (res.message.announcements != null && res.message.me.lastClickedOnAnnouncement != undefined && res.message.me.lastClickedOnAnnouncement) {

          const announceClicked = new Date(res.message.me.lastClickedOnAnnouncement).getTime();
          const announceDate = new Date(res.message.announcements.updatedAt).getTime();
          this.isAnnounceRead = !(announceClicked == 0 || announceDate > announceClicked);
        } else {
          this.isAnnounceRead = false;
        }
        this.announcement = res.message.announcements;

        if (res.message.me && res.message.me.welcomeNoteSeen) {
          if (!this.isAnnounceRead) {
            //this.openAnnouncementBox();
          }
        }

      },
    );

  }

  showWelcomePopup() {

      this.dialogService.open(ShowcaseDialogComponent, {
        context: {
          firstTimeLogin: true,
          title: 'Welcome!',
          body: this.welcomeMessage,
          button: { text: 'Close' },
        },
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: false,
      }).onClose.subscribe(() => {
       if (!this.isAnnounceRead) {
          //this.openAnnouncementBox();
        }
      });

  }

  openWelcomeBox() {
    this.dialogService.open(ShowcaseDialogComponent, {
      context: {
        title: 'Welcome!',
        body: this.welcomeMessage,
        button: { text: 'Close' },
      },
      hasBackdrop: true,
    });
  }
  // Annoucement moved to header
  // openAnnouncementBox() {
  //   if (this.announcement) {
  //     if (!this.isAnnounceRead) {
  //       this.tableService.announcementSeen().subscribe(
  //         (res: any) => {
  //           if (res.statusCode == 200) {
  //             this.isAnnounceRead = true;
  //           }
  //         },
  //       );
  //     }
  //     this.dialogService.open(ShowcaseDialogComponent, {
  //       context: {
  //         title: this.announcement.subject,
  //         body: `${this.announcement.message}`,
  //         button: { text: 'Close' },
  //       },
  //       hasBackdrop: true,
  //     });
  //   }
  // }

  ontable1check(data, i?, value?) {
    let count = 0;
    this.table1.forEach((element, index) => {
      if (data == 'next') {
        this.table1All = !this.table1All;
        element.checked = value != 'all';
      } else {
        if (i == index) {
          element.checked = data != 'active';
        }
        if (element.checked) {
          count++;
        }
        this.table1All = this.table1.length == count;
      }
    });
  }

  ontable1alertcheck(data, i?) {
    this.table1.forEach((element, index) => {
      if (i == index) {
        element.alertChecked = data != 'alert';
      }
    });
  }

  onSearchApp(searchVal) {
    this.table1 = this.tempTable1.filter((el) => {
      return (
        (el.status.toUpperCase().indexOf(searchVal.toUpperCase()) != -1) ||
        (el.text.toUpperCase().indexOf(searchVal.toUpperCase()) != -1)
      );
    });
  }

  onStatusClick(value) {
    this.oldStatusValue = '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = value.innerHTML;
    this.oldStatusValue = tmp.textContent || tmp.innerText || '';
  }

  onCollapse(i) {
    // this. chartArray.forEach((ele, index) => {
    //   if (i !== index)
    //    this.isCollapsed[index] = true;
    //  });
    console.log('collapsing ', this.isCollapsed[i])
     this.isCollapsed[i] = ! this.isCollapsed[i];
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this.router.navigate(['/pages/tables/Tasks'], {queryParams: { date: date, taskType: 'Calendar'}});
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
