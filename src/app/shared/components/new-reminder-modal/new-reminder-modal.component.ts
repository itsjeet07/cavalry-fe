import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { TableService } from '../../services/table.service';
import { CreateNote } from '../reminder-modal/reminder-modal.component';

@Component({
  selector: 'ngx-new-reminder-modal',
  templateUrl: './new-reminder-modal.component.html',
  styleUrls: ['./new-reminder-modal.component.scss']
})
export class NewReminderModalComponent implements OnInit {


  @Input('tableId') tableId;
  @Input('tableName') tableName;
  @Input('resourceId') resourceId;
  @Input('IdFieldData') IdFieldData;
  @Input('fromViewPage') fromViewPage = false;
  @Input('tableIcon') tableIcon;
  @Input('updateReminder') updateReminder;

  reminder: CreateNote = new CreateNote();
  currentDate;
  isSaveDisable: boolean = false;
  constructor(protected ref: NbDialogRef<NewReminderModalComponent>,
    private toaster: NbToastrService,
    private tableService: TableService) {
    this.currentDate = new Date();
  }

  ngOnInit(): void {
    if(this.updateReminder){
      this.reminder.notes = this.updateReminder.notes;
      this.reminder.details = this.updateReminder.details;
      this.reminder.dueDate = this.updateReminder.dateTime;
    } else{
      this.reminder = new CreateNote();
    }
  }

  close() {
    this.ref.close(false);
  }

  closeTableReference(){
    this.fromViewPage = false;
  }

  saveReminder() {
    if (this.reminder.notes && this.reminder.details && this.reminder.dueDate) {
      this.isSaveDisable = true;
      if(this.fromViewPage){
        this.reminder.resourceId = this.resourceId;
        this.reminder.tableId = this.tableId;
        this.reminder.tableName = this.tableName;
      } else{
        this.reminder.resourceId = null;
        this.reminder.tableId = null;
        this.reminder.tableName = "";
      }

      if(this.updateReminder){
        this.reminder.dueDate = new Date(this.reminder.dueDate);
        this.tableService.updateNotes(this.updateReminder.notificationId,this.reminder).subscribe(
          (res: any) => {
            this.isSaveDisable = false;
            if (res.statusCode === 200) {
              this.toaster.success(res.message, "Success");
              this.ref.close('Done');
            } else {
              this.toaster.danger(res.message, "Error");
            }
          },
          (error) => {
          }
        );
      } else{
        this.tableService.createNotes(this.reminder).subscribe(
          (res: any) => {
            this.isSaveDisable = false;
            if (res.statusCode === 201) {
              this.toaster.success(res.message, "Success");
              this.ref.close('Done');
            } else {
              this.toaster.danger(res.message, "Error");
            }
          },
          (error) => {
          }
        );
      }


    } else {
      this.toaster.warning("Enter all fields", "Required Fields");
    }
  }
}
