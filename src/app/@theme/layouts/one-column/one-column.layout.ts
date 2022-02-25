import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NbSidebarService } from '@nebular/theme';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
    <nb-layout windowMode>
      <nb-layout-header fixed>
        <ngx-header></ngx-header>
      </nb-layout-header>

      <nb-sidebar [state]="this.state" class="menu-sidebar" tag="menu-sidebar" responsive (click)="onOver()" >
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-layout-footer fixed>
        <ngx-footer></ngx-footer>
      </nb-layout-footer>
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent {
   url: string = '';
   state: string = 'compacted';
   currentUser;

   constructor( private sidebarService: NbSidebarService,private router:Router){

    this.currentUser = JSON.parse(localStorage.getItem('userData'));

    router.events.subscribe((val) => {
     if (val instanceof NavigationEnd) {
      this.url = '';
      this.url = this.router.url;
      this.url = this.url.slice(14, 21);
       if (this.url.includes('dynamic')) {
         this.state = 'compacted';
       }
     }
  });
  }


    onOver() {
      if (this.url.includes('dynamic')) {
      this.sidebarService.toggle(true, 'menu-sidebar');
      }
    }

    onLeave() {

      //-- Check for Hemant
   //   if(this.currentUser.firstName != 'hemant'){
        if (this.url.includes('dynamic')) {
          this.sidebarService.toggle(true, 'menu-sidebar');
        }
   //   }
  }
}
