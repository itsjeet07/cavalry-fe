import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MENU_ITEMS } from './pages-menu';
import { AuthService } from '@app/shared/services';
import { TableService } from '@app/shared/services/table.service';
import { NbIconLibraries, NbMenuService } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { MessageCommonService } from '@app/shared/services/message-common.service';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="tableDataMenu"></nb-menu>
      <router-outlet>
      <ngx-message></ngx-message>
      </router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit, OnDestroy {

  menu = MENU_ITEMS;
  tableMenu = [];
  tableM: any = [];
  userId = '';
  urlName: any;
  tableDataMenu: any = [...this.menu];
  subscription: Subscription;
  redirectLinkSubscription:Subscription;
  iconPlaceHolderImage = 'assets/images/users.png';
  tableWithTask: any;
  linkValue;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthService,
    private tableService: TableService,
    private nbMenuService: NbMenuService,
    private messageCommonService: MessageCommonService,
    private iconsLibrary: NbIconLibraries,
  ) {
    this.userId = JSON.parse(localStorage.getItem('userData'))._id;
    this.tableService.getTaskCountByTable().subscribe(
      (res: any) => {
        if (res.statusCode == 200) {
          this.tableWithTask = res.data;
          this.getMenuList();
        }
      },
    );
    this.tableService.taskCount$.pipe(filter(count => !!count)).subscribe((count) => {
      const taskIndex = this.tableDataMenu.findIndex(({title}) => title === "Tasks");
      if (taskIndex > -1) {
        this.tableDataMenu[taskIndex] = {
          ...this.tableDataMenu[taskIndex],
          badge: {
            text: count,
            status: 'primary'
          }
        }
      }
    })
    // subscribe to save table response
    this.subscription = this.messageCommonService.getMessage().subscribe(message => {
      if (message.text == 'table') {
        this.getMenuList();
      }
    });

    this.redirectLinkSubscription = this.tableService.redirect.subscribe((count) => {
      if(count){
        this.menu[0].link = count;
      }
    })


  }


  getMenuList() {
    this.tableService.getTablesForMenu().pipe(
      tap(() => this.tableService.getTaskTotal())
    ).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.tableDataMenu = [...this.menu];
        this.tableMenu = [];
        this.tableMenu = Object.assign([], res.data);

        this.tableMenu.forEach(e => {

          this.urlName = e.tableName.replace(/ /g, '_');

          if (e.iconLocation == '' || e.iconLocation == '' || e.iconLocation == undefined) {
            e.iconLocation = this.iconPlaceHolderImage;
          }
          this.iconsLibrary.registerSvgPack(e.tableName, { 'python': '<img src= "' + e.iconLocation + '"  width="25px">' });
          let taskCountData;
          let taskCount;
          if (this.tableWithTask) {
            taskCountData = this.tableWithTask.find(x => x._id == e.tableName);
          }
          if (taskCountData) {
            taskCount = taskCountData.totalTasks;
          }

          //-- For tasks, we will seperate request CA-656
          if (taskCount > 0 && e.tableName != 'Users' && e.tableName != 'Tasks') {
            this.tableDataMenu.push({
              title: e.tableName,
              badge: {
                text: taskCount,
                status: 'primary',
              },
              // taskCount: taskCount,
              icon: { icon: 'python', pack: e.tableName },
              link: `/pages/tables/${this.urlName}`,
            });
          } else {
            this.tableDataMenu.push({
              title: e.tableName,
              icon: { icon: 'python', pack: e.tableName },
              link: `/pages/tables/${this.urlName}`,
            });
          }


        });
        // this.arraymove(this.tableDataMenu, 1, this.tableDataMenu.length - 1)
      }
    });
  }

  // arraymove(arr, fromIndex, toIndex) {
  //   var element = arr[fromIndex];
  //   arr.splice(fromIndex, 1);
  //   arr.splice(toIndex, 0, element);
  // }

  // For testing purpose but when API add JWT.interceptor call automatically.
  ngOnInit() {
    const element = document.getElementById('main_body');
    element.classList.remove('login_body');
    this.authService.checkTokenExpiration();
    localStorage.setItem('lastAction', Date.now().toString());

  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    if(this.redirectLinkSubscription){
      this.redirectLinkSubscription.unsubscribe();
    }
    this.subscription.unsubscribe();

  }

}
