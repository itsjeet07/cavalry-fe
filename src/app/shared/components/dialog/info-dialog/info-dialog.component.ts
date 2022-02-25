import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import { Router } from "@angular/router";
import { TableService } from "@app/shared/services/table.service";
import { NbDialogRef, NbDialogService, NbToastrService } from "@nebular/theme";
import { SnoozeTimeComponent } from '../../snooze-time/snooze-time.component';
import { DatePipe } from '@angular/common';
import { NewReminderModalComponent } from '../../new-reminder-modal/new-reminder-modal.component';

@Component({
  selector: "ngx-info-dialog",
  templateUrl: "./info-dialog.component.html",
  styleUrls: ["./info-dialog.component.scss"],
})
export class InfoDialogComponent implements OnInit {

  currentUser;
  constructor(
    public ref: NbDialogRef<InfoDialogComponent>,
    private router: Router,
    private tableService: TableService,
    private toasterService: NbToastrService,
    private dialogService: NbDialogService,
    private cd:ChangeDetectorRef,
    private datePipe:DatePipe
  ) {
    this.currentUser = JSON.parse(localStorage.getItem("userData"));
  }

  @Input() text = "";
  @Input() title = "";
  @Input() dialogType = "";
  @Input() notification: any;
  @Input() plainAlert = false;
  loading = false;
  buttonText = "Cancel";

  times = [
    { label: "5 min", val: 5 },
    { label: "10 min", val: 10 },
    { label: "30 min", val: 30 },
    { label: "1 hour", val: 60 },
    { label: "reschedule", val: 'reschedule' },
  ];

  actionItems = [
     { icon: { icon: 'python', pack: 'edit' } },
    // -- { icon: { icon: 'python', pack: 'view' } },
    // { icon: { icon: 'python', pack: 'delete' } },
  ];
  snoozeTime;
  triggerTime;
  triggerDate;
  expiryDate = new Date();
  ngOnInit(): void {


    if (this.dialogType == 'reminder') {
      this.buttonText = 'View Reminders';
    }

    if(this.notification?.reminderDetails.dueDate){
      this.triggerTime = this.datePipe.transform(this.notification.reminderDetails.dueDate, 'shortTime');
      this.triggerDate = this.datePipe.transform(this.notification.reminderDetails.dueDate, 'MM/dd/yyyy');
    }

    if(this.notification?.reminderDetails.dateTime){
      this.triggerTime = this.datePipe.transform(this.notification.reminderDetails.dateTime, 'shortTime');
      this.triggerDate = this.datePipe.transform(this.notification.reminderDetails.dateTime, 'MM/dd/yyyy');
    }

  }

  onLinkClicked() {
    this.router.navigate([
      "pages/tables/dynamic/" +
      this.notification.tableId +
      "/" +
      this.notification.tableName +
      "/" +
      this.notification.resourceId +
      "/" +
      "/To Do",
    ]);
    this.ref.close();
  }

  redirect() {

    if (this.dialogType == 'reminder') {
      this.router.navigate(['/pages/tables/notifications']);
    }

    this.ref.close();
  }

  snooze(notification) {

    if (this.snoozeTime) {
      this.loading = true;
      let dateVal = new Date();

      let snooze = new Date(dateVal.getTime() + this.snoozeTime * 60000)

      // this.tableService.updateDynamicFormData(this.currentUser._id, "Users", this.currentUser).subscribe(
      //   (res: any) => {
      //     if (res.statusCode === 200) {
      //       this.toasterService.success(res.message, "Success");
      //     } else {
      //       this.toasterService.danger(res.message, "Error");
      //     }
      //     this.closeIt();
      //   },
      //   (error) => {
      //     this.closeIt();
      //   }
      // );

      // Update Notification
      // notification.reminderDetails._id

      let resource = '';

      if(notification.reminderDetails._id){
        resource = notification.reminderDetails._id;
      }

      if(notification.reminderDetails.notificationId){
        resource = notification.reminderDetails.notificationId;
      }

      this.tableService.updateDueTimeForReminder(resource, snooze).subscribe(
        (res: any) => {
          if (res.statusCode === 200) {
            this.toasterService.success(res.message, "Success");
          } else {
            this.toasterService.danger(res.message, "Error");
          }
          this.closeIt();
        },
        (error) => {
          this.closeIt();
        }
      );

    }else {
      if (this.dialogType == 'reminder') {
        this.router.navigate(['/pages/tables/notifications']);
      }

      this.ref.close();
    }

  }

  closeIt() {
    this.loading = false;
    this.ref.close();
  }

  onClose() {
    this.ref.close();
  }

  onFirstTimeReminder() {
    this.ref.close();
    const element = <HTMLElement>document.querySelector('.notification_dropdown');
    element.click();
  }

  remindNavigate(notification) {
    this.router.navigate([`/pages/tables/dynamic/${notification.tableId}/${notification.tableName}/${notification.resourceId}`]);
  }

  markComplete(notification){

    let resource = '';

      if(notification.reminderDetails._id){
        resource = notification.reminderDetails._id;
      }

      if(notification.reminderDetails.notificationId){
        resource = notification.reminderDetails.notificationId;
      }

    this.tableService.markComplete(resource).subscribe(
      (res: any) => {
        if (res.statusCode === 200) {
          this.toasterService.success("","Reminder marked as completed sucessfully!");
        } else {
          this.toasterService.danger(res.message, "Error");
        }
        this.markCompleteClose('markDone');
      },
      (error) => {
        this.markCompleteClose(false);
      }
    );

  }

  markCompleteClose(value) {
    this.loading = false;
    this.ref.close(value);
  }

  openSnoozeModal(notification) {

    const ref = this.dialogService.open(SnoozeTimeComponent, {
      context: {
        times: this.times,
      },
    })
      .onClose.subscribe(val => {

        if (val) {
          this.snoozeTime = val;
          this.snooze(notification);
        }
      });
  }

  openReminderModal(){

    if(this.notification.tableId && this.notification.resourceId){
      const ref = this.dialogService.open(NewReminderModalComponent, {
        context: {
          tableId:this.notification.tableId,
          tableName:this.notification.tableName,
          resourceId:this.notification.resourceId,
          IdFieldData:this.notification.toDisplay,
          fromViewPage:true,
          tableIcon:this.notification.tableIcon[this.notification.tableName],
          updateReminder:this.notification
        },
      })
        .onClose.subscribe(val => {

          if(val == 'Done'){
            this.ref.close();
          }
        });
    } else{
      const ref = this.dialogService.open(NewReminderModalComponent, {
        context: {
          fromViewPage:false,
          updateReminder:this.notification
        },
      })
        .onClose.subscribe(val => {

          if(val == 'Done'){
            this.ref.close();
          }
        });
    }

  }
}
