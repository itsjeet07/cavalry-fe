import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Optional, Output, TemplateRef, ViewChild } from '@angular/core';
import { InfoDialogComponent } from '@app/shared/components/dialog/info-dialog/info-dialog.component';
import { TableService } from '@app/shared/services/table.service';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { color } from 'd3-color';
import { isSameMonth } from 'date-fns';
import * as moment from 'moment';
import { Subject } from 'rxjs';

// import { EventEmitter } from "events";
const colors: any = {
  red: {
    primary: "#ad2121",
    secondary: "#FAE3E3",
  },
  blue: {
    primary: "#1e90ff",
    secondary: "#D1E8FF",
  },
  yellow: {
    primary: "#e3bc08",
    secondary: "#FDF1BA",
  },
};
@Component({
  selector: "ngx-reminders",
  templateUrl: "./reminders.component.html",
  styleUrls: ["./reminders.component.scss"],
  providers: [DatePipe],
})
export class RemindersComponent implements OnInit {
  @Input("resourceId") resourceId: any;
  @Input("tableName") tableName: any;
  @Input("tableId") tableId: any;
  @Input() notifyFlag:boolean = false;
  @Input() isFromDashboard:boolean = false;
  @ViewChild("modalContent", { static: true }) modalContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  currentDate = new Date();
  currentDateToDisplay;
  todoEvents: CalendarEvent[] = [];
  reminderData = [];
  datePipeString: any;
  selectedDateData = [];
  selectedReminderObj;
  selecteddata = [];
  ReadFlagAfterUnread = false;
  activeDayIsOpen: boolean = true;
  refresh: Subject<any> = new Subject();
  showAdd = false;
  reminders = [];
  notes = "";
  createNoteObj: CreateNote = new CreateNote();
  loading = false;
  time = { hour: 13, minute: 30 };
  meridian = true;
  CHECK_INTERVAL = 10000; // in ms
  currentUser;
  reminderLoader = false;
  @Output() remindersForSelectedDate:EventEmitter<any> = new EventEmitter<any>();
  @Output() allReminders:EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private modalService: NgbModal,
    private tableService: TableService,
    private datePipe: DatePipe,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    @Optional() public ref?: NbDialogRef<RemindersComponent>
  ) {
  }

  ngOnInit() {
    this.getReminders();
    this.currentUser = JSON.parse(localStorage.getItem("userData"));

    //-- Refresh every sec.
    setInterval(() => {
      this.processReminders();
    }, this.CHECK_INTERVAL);
  }

  getReminders() {
    this.ReadFlagAfterUnread = false;
    this.todoEvents = [];
    this.selectedDateData = [];
    this.reminderData = [];
    this.tableService
      .getEvents(this.resourceId ? this.resourceId : "")
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.reminders = res.data;
          let emitReminderData = [];
           this.reminders.forEach(ele=>{
             if(ele.reminders && ele.reminders.length){
              emitReminderData = [...emitReminderData,...ele.reminders];
             }
          })
          this.allReminders.emit(emitReminderData);
          this.datePipeString = this.datePipe.transform(
            this.viewDate,
            "yyyy-MM-dd"
          );
          this.processReminders();
        }
      });
  }

  processReminders(ReRenderListing = true) {
    if (ReRenderListing) {
      this.selectedDateData = [];
    }

    this.todoEvents = [];

    this.reminders.forEach((ele) => {
      let temp = [];
      temp = ele.reminders;
      temp.forEach((item, i) => {
        if (ReRenderListing) {
          this.reminderData.push(item);
          let date = item.dueDate;
          date = this.datePipe.transform(date, "yyyy-MM-dd");
          if (this.datePipeString == date) {
            this.selectedDateData.push({
              notes: item.notes,
              date: item.dueDate,
              visibilityStatus: item.visibilityStatus,
              id: item._id,
              isActive: item.isActive,
              createdBy: item.createdBy,
              dueDate: moment(item.dueDate),
              overDue: this.isDue(item.dueDate),
            });
          }
        }

        if (item.notes) {
          let obj: CalendarEvent = {
            start: null,
            title: "",
            color: null,
            id: null,
          };
          obj.start = new Date(item.dueDate);
          obj.title = item.notes;
          obj.id = item._id;
          if (
            moment(item.dueDate).isAfter(moment()) ||
            item.visibilityStatus == "read"
          ) {
            obj.color = colors.blue;
          } else {
            obj.color = colors.red;
          }
          this.todoEvents.push(obj);
        }
      });
      this.refresh.next();
    });
  }

  addFlag:boolean = true;
  dayClicked({ date, events }): void {


    if(new Date(date).getMonth() > new Date().getMonth()){
      this.addFlag = true;
    } else if(new Date(date).getMonth() == new Date().getMonth()){
      if(new Date(date).getDate() >= new Date().getDate()){
        this.addFlag = true;
      } else{
        this.addFlag = false;
      }
    } else{
      this.addFlag = false;
    }

    this.ReadFlagAfterUnread = false;
    this.selectedDateData = [];
    this.datePipeString = this.datePipe.transform(date, "yyyy-MM-dd");

    if (isSameMonth(date, this.viewDate) && events && events.length) {
      events.forEach((item) => {
        let obj = {
          notes: "",
          date: null,
          id: null,
          visibilityStatus: "",
          isActive: null,
          createdBy: "",
          dueDate: moment(),
          overDue: null,
        };
        obj.notes = item.title;
        obj.date = item.start;
        obj.id = item.id;
        let list = this.reminderData.filter((f) => f._id == item.id);
        if (list && list.length) {
          obj.visibilityStatus = list[0].visibilityStatus;
          obj.isActive = list[0].isActive;
          obj.createdBy = list[0].createdBy;
          obj.dueDate = moment(list[0].dueDate);
          obj.overDue = this.isDue(list[0].dueDate);
          this.selectedDateData.push(obj);
          this.refresh.next();
        }
      });
    }
    this.remindersForSelectedDate.emit(this.selectedDateData);
  }
  setView(view: CalendarView) {
    this.view = view;
  }
  addReminder() {
    this.showAdd = true;
  }

  saveReminder() {
    this.loading = true;

    if (!this.notes || !this.time.hour) {
      this.toastrService.danger(
        "Please enter notes and reminder time",
        "Error"
      );
      this.loading = false;
      return;
    }

    this.createNoteObj.notes = this.notes;
    this.createNoteObj.dueDate = moment(
      this.datePipeString +
        " " +
        this.time.hour +
        ":" +
        this.time.minute +
        ":00"
    );
    this.createNoteObj.resourceId = this.resourceId?this.resourceId:null;
    this.createNoteObj.tableId = this.tableId?this.tableId:null;
    this.createNoteObj.tableName = this.tableName?this.tableName:null;

    this.tableService.createNotes(this.createNoteObj).subscribe(
      (res: any) => {
        if (res.statusCode === 201) {
          this.toastrService.success(res.message, "Success");
          this.getReminders();
        } else {
          this.toastrService.danger(res.message, "Error");
        }
        this.loading = false;
        this.showAdd = false;
        this.notes = "";
      },
      (error) => {
        this.loading = false;
        this.showAdd = false;
        this.notes = "";
      }
    );
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
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

    let reminderId = data.id;

    if (data.visibilityStatus == "unread") {
      this.tableService.updateReminder(reminderId).subscribe(
        (res: any) => {
          if (res.statusCode === 200) {
            this.toastrService.success("Reminder marked as read!", "Success");
            this.selectedDateData[rowindex].visibilityStatus = "read";
            let index = this.reminderData.findIndex((v) => v._id == reminderId);
            if (index > -1) {
              this.reminderData[index].visibilityStatus = "read";
              this.refresh.next();
            }
            this.processReminders(false);
          }
        },
        (error: any) => {
          this.toastrService.danger(error.message, "Error");
        }
      );
    }
  }

  deleteReminder(data, rowindex) {
    let reminderId = data.id;
    if (window.confirm("Are you sure you want to delete?")) {
      this.tableService.deleteReminder(reminderId).subscribe(
        (res: any) => {
          if (res.statusCode === 200) {
            this.toastrService.success(res.message, "Success");
            this.selectedDateData.splice(rowindex, 1);
            let index = this.reminderData.findIndex((v) => v._id == reminderId);
            let notesIndex = this.todoEvents.findIndex(
              (v) => v.id == reminderId
            );
            if (notesIndex > -1) {
              this.todoEvents.splice(index, 1);
              this.refresh.next();
            }
            if (index > -1) {
              this.reminderData.splice(index, 1);
            }
          }
        },
        (error: any) => {
          this.toastrService.danger(error.message, "Error");
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

  onCancel() {
    this.ref.close(false);
  }

  stopAdding() {
    this.showAdd = false;
  }
}

export class CreateNote {
  resourceId: number;
  tableName: string;
  notes: string;
  tableId: number;
  dueDate: any;

  constructor() {
    this.resourceId = null;
    this.tableName = "";
    this.notes = "";
    this.tableId = null;
    this.dueDate = null;
  }
}
