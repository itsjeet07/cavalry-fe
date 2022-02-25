import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { SmartTableData } from '../../../@core/data/smart-table';
import { Router } from '@angular/router';
import { TableService } from '@app/shared/services/table.service';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-pending-users-table',
  templateUrl: './pending-users-table.component.html',
  styleUrls: ['./pending-users-table.component.scss']
})
export class PendingUsersTableComponent {

  loading = false;

  settings = {
    actions: {
      columnTitle: 'Actions',
      add: false,
      edit: false,
      delete: false,
      custom: [
        { name: 'editrecord', title: '<button type="button">Approved</button>' }
      ],
      filter: false,
      position: 'right',
    },
    columns: {
      firstName: {
        title: 'First Name',
        type: 'string',
      },
      lastName: {
        title: 'Last Name',
        type: 'string',
      },
      email: {
        title: 'E-mail',
        type: 'string',
      },
      mobileNumber: {
        title: 'Mobile Number',
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private tableService: TableService,
    private toastrService: NbToastrService,
  ) {
    this.onInItData();
  }

  onInItData(){
    this.tableService.getPendingUsersData().subscribe(((res: any) => {      
      if(res && res.data){
        res.data = res.data.filter(x => x.userStatus == 'Pending');
        this.source.load(res.data);
      }
    }));
  }

  onCustomAction(event) {  
    this.loading = true;
    event.data.userStatus = 'Approved';

    this.tableService.updateDynamicFormData(event.data._id, 'user', event.data).
      subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.toastrService.success(res.message, 'Success');
          this.onInItData();
          this.loading = false;
        } else {
          this.loading = false;
          this.toastrService.danger(res.message, 'Error');
        }
      }, (error) => {
        this.toastrService.danger(`${error.error && error.error.message}`, 'Error');
        this.loading = false;
      });
  }


}
