import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { EmailTemplateModalComponent } from "../email-template-modal/email-template-modal.component";
import { TableService } from "@app/shared/services/table.service";
import { Router } from "@angular/router";

@Component({
  selector: "ngx-email-template-config",
  templateUrl: "./email-template-config.component.html",
  styleUrls: ["./email-template-config.component.scss"]
})
export class EmailTemplateConfigComponent implements OnInit {
  @Input() tableDetails;
  @Output() getTableDetails :EventEmitter<any> =  new EventEmitter();

  emailTemplateList = [];
  typeFlag = "data";
  dataList = [];
  timeList = [];

  constructor(
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private tableService: TableService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.getAllEmailEvents();
  }

  getAllEmailEvents(){

    this.tableService.getAllEmailEvents(this.tableDetails._id).subscribe(
      (res: any) => {
        if (res.statusCode === 200) {
          this.emailTemplateList = res['data'].filter(x => x.type === 'Email');
          this.dataList = this.emailTemplateList.filter(
            (v) => !v.emailType || v.emailType == 'data'
          );

          this.timeList = this.emailTemplateList.filter(
            (v) => v.emailType == 'time'
          );

        } else {
        }
      },
      (error) => {

      }
    );
  }


  addNewEmailTemplate() {
    this.dialogService
      .open(EmailTemplateModalComponent, {
        context: {
          tableData: this.tableDetails,
          addFlag: true,
          editFlag: false,
          columnId: null
        }
      })
      .onClose.subscribe(res => {
        if (res) {
          this.typeFlag = res;
          this.getAllEmailEvents();
        }
      });
  }

  editTemplate(id, i,type) {
    let column = this.emailTemplateList.filter(f=>f._id == id);
    if(column.length == 1){
      this.dialogService
      .open(EmailTemplateModalComponent, {
        context: {
          tableData: this.tableDetails,
          columnEventData: column[0],
          editFlag: true,
          addFlag: false,
          columnId: column[0].columnId,
          type:type,
          emailIndex: i
        }
      })
      .onClose.subscribe(res => {
        if (res) {
          this.typeFlag = res;
          this.getAllEmailEvents();
        }
      });
    }

  }

  deleteTemplate(id, i) {
    this.tableService.deleteEmailEvent(id).subscribe(
      (res: any) => {
        if (res.statusCode === 200) {
          this.toastrService.success("Success", res.message);
          this.getAllEmailEvents();
        } else {
          this.toastrService.danger("Request failed", res.message);
        }
      },
      error => {
        this.toastrService.danger("Failed to delete, please try again");
      }
    );
  }

  fireTestEmail(templateId){
    this.tableService.fireTestEmail(templateId,this.tableDetails.tableName).subscribe(
      (res: any) => {
        if (res.statusCode === 200) {
          this.toastrService.success("Success", res.message);
          this.getAllEmailEvents();
        } else {
          this.toastrService.danger("Request failed", res.message);
        }
      },
      error => {
        this.toastrService.danger("Failed to delete, please try again");
      }
    );
  }

  onEdit(){
    this.router.navigate(['pages/tables/edit/' + this.tableDetails._id])
  }
}
