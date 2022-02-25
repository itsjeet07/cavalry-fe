import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeleteDialogComponent } from '@app/shared/components/delete-dialog/delete-dialog.component';
import { DynamicFormDialogNewDesignComponent } from '@app/shared/components/dynamic-form-dialog-new-design/dynamic-form-dialog-new-design.component';
import { DynamicFormDialogComponent } from '@app/shared/components/dynamic-form-dialog/dynamic-form-dialog.component';
import { TableService } from '@app/shared/services/table.service';
import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'ngx-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
})
export class UserTableComponent implements OnInit {
  columnName: any = [];
  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
    },
  };

  source: LocalDataSource = new LocalDataSource();
  columnDefs: any;
  loading = false;
  tableName = '';

  customLabelForAddForm = '';
  customLabelForEditForm = '';



  constructor(
    private router: Router,
    private tableService: TableService,
    private dialogService: NbDialogService,
  ) {
    this.tableService.getUserData().subscribe(((response: any) => {
      this.source.load(response.data);
      this.columnDefs = [response.data];
    }));
  }

  ngOnInit(): void {
    this.getTableByName();
  }


  getTableByName() {
    const tempArray = {};
    this.tableName = this.router.url.split('/').pop();
    this.tableService.getTableByName(this.tableName).subscribe((res: any) => {
      this.columnDefs = res.data[0].columns.filter(data => data.displayInList == true),
        this.columnDefs.forEach((c: any) => {
          tempArray[c.name] = {
            title: c.label,
            type: c.type,
          };
        });
      this.settings.columns = tempArray;
    });
  }

  onAdd() {
    this.tableService.getTableByName(this.tableName).subscribe((res: any) => {
      if (res.statusCode === 200) {

        if(res.data[0].customLabelForAddForm){
          this.customLabelForAddForm = res.data[0].customLabelForAddForm;
        }

        let title = '';
        if(this.customLabelForAddForm){
          title = this.customLabelForAddForm;
        }
        else{
          title = 'Add New User';
        }
        this.dialogService.open(DynamicFormDialogNewDesignComponent, {
          closeOnEsc:false,
          context: {
            title: title,
            form: res.data[0].columns,
            button: { text: 'Save' },
            tableName: 'user',
          },
        })
          .onClose.subscribe(res => {
            this.tableService.getUserData().subscribe(((response: any) => {
              this.source.load(response.data);
              this.columnDefs = [response.data];
            }));
          });
      }
    });
  }


  onDeleteConfirm(event): void {
    this.dialogService.open(DeleteDialogComponent)
      .onClose.subscribe(name => {
        if (name === 'yes') {
          this.tableService.deleteUserData(event.data._id).subscribe((res: any) => {
            if (res.statusCode === 200) {
              this.tableService.getUserData().subscribe(((response: any) => {
                this.source.load(response.data);
                this.columnDefs = [response.data];
              }));
            }
          });
        }
      });
  }

}
