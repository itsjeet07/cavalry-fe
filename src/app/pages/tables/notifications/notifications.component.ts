import { Component, OnInit, Input } from '@angular/core';
import { TableService } from '../../../shared/services/table.service';
import { Router } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';
import { SocketService } from '@app/shared/services/socket.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { RemindersComponent } from '../reminders/reminders.component';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { InfoDialogComponent } from '@app/shared/components/dialog/info-dialog/info-dialog.component';

@Component({
  selector: 'ngx-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  notifications = [];
  reminderData = [];
  allReminderData = [];
  datePipeString;
  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();
  numberOfPagesLoaded = 0;
  userId = "";
  fromReminderFlag:boolean = false;
  @Input() fromDashboard: boolean = false;

  constructor(private tableService: TableService,
             private router: Router,
             private datePipe:DatePipe,
             private toasterService:NbToastrService,
             private dialogService: NbDialogService,
             private socketService: SocketService)
          {
              this.userId = JSON.parse(localStorage.getItem('userData'))._id;
  }


  ngOnInit(): void {
    this.fetchNotifications();
  }

  fetchNotifications(limit=20,skip=0){
    this.tableService.fetchNotificationsHistory(limit,skip).subscribe(
      (res: any) => {
        if (res.statusCode == 200) {
          if(res.data){
            this.numberOfPagesLoaded++;
            this.notifications = this.notifications.concat(res.data.notifications);
          }
        }
      }
    )
  }

  onScrollDownForReminder(){

  }


  viewAllReminders(){

    this.reminderData = [...this.allReminderData];
    
  }

  getAllReminders(value){

    this.allReminderData = value;
    this.allReminderData.forEach(ele=>{
      ele["date"] = ele.dueDate;
      ele["overDue"] = this.isDue(ele.dueDate);
    })
    this.allReminderData = [...this.allReminderData];
    this.fromReminderFlag = true;

    this.datePipeString = this.datePipe.transform(this.viewDate,"yyyy-MM-dd");
    this.reminderData = this.allReminderData.filter(item=>{
      let date = this.datePipe.transform(item.dueDate,"yyyy-MM-dd");
      if(date == this.datePipeString){
        return true;
      }
      else{
        return false;
      }
    });
    // if(this.fromDashboard) {
    //   this.viewAllReminders();
    // }
  }

  
  redirect(notification){
    if(notification.resourceDetails.tableId && notification.resourceDetails.tableId != ''){
      this.router.navigate([`pages/tables/dynamic/${notification.resourceDetails.tableId}/${notification.resourceDetails.tableName}/${notification.resourceDetails.resourceId}`]);
    }
    return false;
  }


  formatDate(value) {
    if (!value) {
      return '';
    }
    return formatDate(value, 'M/d/yy, h:mm a', 'en')
  }

  onScrollDown() {
    this.fetchNotifications(20,this.numberOfPagesLoaded * 20);
  }

  updateMessageStatus(notification): void{

    const data = {
      receiver: this.userId,
      notification:notification._id,
      participantType: 2
    };
    if(notification.subscribers){

      let subscribers = notification.subscribers;
      const findIndex = subscribers.findIndex(x => x.receiver == this.userId);

      if(findIndex > -1){
        if(subscribers[findIndex].visibility == 'unread'){
          subscribers[findIndex].visibility = 'read';
          this.socketService.emit("message_status_change", data);
        }
      }
    }
  }

  isRead(notification){

    let status = false;

    if(notification.subscribers){

      let subscribers = notification.subscribers;
      const findIndex = subscribers.findIndex(x => x.receiver == this.userId);

      if(findIndex > -1){
        if(subscribers[findIndex].visibility == 'unread'){
          status = true;
        }
      }
    }
    return status;
  }

  markAllAsRead(){

    const data = {
      receiver: this.userId,
      participantType: 2
    };
    this.socketService.emit("message_status_change", data);

    this.notifications.forEach((notification) => {

      if(notification.subscribers){

        let subscribers = notification.subscribers;
        const findIndex = subscribers.findIndex(x => x.receiver == this.userId);

        if(findIndex > -1){
          if(subscribers[findIndex].visibility == 'unread'){
            subscribers[findIndex].visibility = 'read';
          }
        }
      }
    });
  }

  deleteReminder(data, rowindex) {
    let reminderId = data._id;
    if (window.confirm("Are you sure you want to delete?")) {
      this.tableService.deleteReminder(reminderId).subscribe(
        (res: any) => {
          if (res.statusCode === 200) {
            this.toasterService.success(res.message, "Success");
            this.reminderData.splice(rowindex, 1);
            let index = this.reminderData.findIndex((v) => v._id == reminderId);
            if (index > -1) {
              this.reminderData.splice(index, 1);
              this.refresh.next();
            }
          }
        },
        (error: any) => {
          this.toasterService.danger(error.message, "Error");
        }
      );
    }
  }

  reminderClicked(data, rowindex) {
    if (!this.isDue(data.dueDate)) {
      //alert('Its not due yet!');
      //this.toastrService.info('Mark as read request','Its not due yet!');

      this.dialogService.open(InfoDialogComponent, {
        context: {
          title: "",
          text: "It's not due yet!",
          dialogType: "notification",
          notification: data,
          plainAlert: true,
        },
      });

      return;
    }

    let reminderId = data._id;

    if (data.visibilityStatus == "unread") {
      this.tableService.updateReminder(reminderId).subscribe(
        (res: any) => {
          if (res.statusCode === 200) {
            this.toasterService.success("Reminder marked as read!", "Success");
            this.reminderData[rowindex].visibilityStatus = "read";
            let index = this.allReminderData.findIndex((v) => v._id == reminderId);
            if (index > -1) {
              this.allReminderData[index].visibilityStatus = "read";
              this.refresh.next();
            }
          }
        },
        (error: any) => {
          this.toasterService.danger(error.message, "Error");
        }
      );
    }
  }

  isDue(reminderDate) {
    if (moment(reminderDate).isAfter(moment())) {
      return false;
    } else {
      return true;
    }
  }
  
  getReminderForSelectedDate(value){
      this.fromReminderFlag = true;
      this.reminderData = value;
  }
}
