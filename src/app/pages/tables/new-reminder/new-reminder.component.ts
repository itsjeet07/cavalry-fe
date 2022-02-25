import { Component, Input, OnInit } from '@angular/core';
import { TableService } from '@app/shared/services/table.service';
import { NbDialogRef, NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-new-reminder',
  templateUrl: './new-reminder.component.html',
  styleUrls: ['./new-reminder.component.scss']
})
export class NewReminderComponent implements OnInit {

  reminderObj;
  @Input() tableId;
  @Input() tableName;
  loading;
  constructor(protected ref: NbDialogRef<NewReminderComponent>,
    private toastrService: NbToastrService,
    private tableService: TableService,) { }

  ngOnInit(): void {
    this.reminderObj = new NewReminderClass();
  }

  closeModal() {
    this.ref.close();
  }

  saveModal(){
   
      this.loading = true;
  
      if (!this.reminderObj.desc || !this.reminderObj.time) {
        this.toastrService.danger(
          "Please enter notes and reminder time",
          "Error"
        );
        this.loading = false;
        return;
      }

    
      this.reminderObj.tableId = this.tableId?this.tableId:null;
      this.reminderObj.tableName = this.tableName?this.tableName:null;
  
      this.tableService.createNotes(this.reminderObj).subscribe(
        (res: any) => {
          if (res.statusCode === 201) {
            this.toastrService.success(res.message, "Success");
            this.ref.close();
          } else {
            this.toastrService.danger(res.message, "Error");
          }
          this.loading = false;
        },
        (error) => {
          this.loading = false;
        }
      );
    }
    

}

export class NewReminderClass{

  date:any;
  time:any;
  desc:any;
  tableId:any;
  tableName:any;
}
