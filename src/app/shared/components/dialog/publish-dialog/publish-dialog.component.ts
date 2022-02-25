import { Component, OnInit } from '@angular/core';
import { NbToastrService, NbDialogRef } from '@nebular/theme';
import { TableService } from '../../../services/table.service';

@Component({
  selector: 'ngx-publish-dialog',
  templateUrl: './publish-dialog.component.html',
  styleUrls: ['./publish-dialog.component.scss']
})
export class PublishDialogComponent implements OnInit {

  constructor(private toaster:NbToastrService,private ref:NbDialogRef<PublishDialogComponent>,
    private tableService:TableService) { }

  client;
  clientList = [];
  ngOnInit(): void {
    this.getAllClients();
  }

  getAllClients(){
   this.tableService.getAllClients().subscribe((res:any)=>{
    if (res.statusCode === 200) {
      this.clientList = res.data;
      console.log(this.clientList);
    }
   })
  }

  publish(){
    if(this.client){

    } else{

    }
  }

  onClose() {
    this.ref.close();
  }
}
