import { Component, Input, OnInit } from '@angular/core';
import {  NbDialogRef, NbToastrService } from "@nebular/theme";
@Component({
  selector: 'ngx-email-config-help',
  templateUrl: './email-config-help.component.html',
  styleUrls: ['./email-config-help.component.scss']
})
export class EmailConfigHelpComponent implements OnInit {
  @Input() tableData;
  userProperties = ['firstName','lastName','email','status','isActive','profileImage','lastActivityTime','userStatus'];
  public tableFields:any = [];
  constructor(
    protected dialogRef: NbDialogRef<any>,
    private nbToastrService : NbToastrService,
  ) { }

  ngOnInit(): void {
    this.tableData.columns.map((column) => {
      this.tableFields.push({id:column._id,name:column.name});
    });
  }
  closeModal() {
    this.dialogRef.close(false);
  }

  copied(){
    this.nbToastrService.success('Done!','Copied successfully');
  }

}
