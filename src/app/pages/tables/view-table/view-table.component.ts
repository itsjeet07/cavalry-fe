import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { SmartTableData } from '../../../@core/data/smart-table';
import { Router, ActivatedRoute } from '@angular/router';
import { TableService } from '@app/shared/services/table.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { AddEditColumnInDialogComponent } from '../add-edit-column-in-dialog/add-edit-column-in-dialog.component';

@Component({
  selector: 'ngx-view-table',
  templateUrl: './view-table.component.html',
  styleUrls: ['./view-table.component.scss'],
})
export class ViewTableComponent {

  tableName = '';
  tableId = '';
  tableItems: any = [];
  settings = {
    actions: false,
    // hideSubHeader: true,

    // add: {
    //   addButtonContent: '<i class="nb-plus"></i>',
    //   createButtonContent: '<i class="nb-checkmark"></i>',
    //   cancelButtonContent: '<i class="nb-close"></i>',
    // },
    // edit: {
    //   editButtonContent: '<i class="nb-edit"></i>',
    //   saveButtonContent: '<i class="nb-checkmark"></i>',
    //   cancelButtonContent: '<i class="nb-close"></i>',
    // },
    // delete: {
    //   deleteButtonContent: '<i class="nb-trash"></i>',
    //   confirmDelete: true,
    // },
    //   custom: [{ name: 'ourCustomAction', title: '<i class="nb-compose"></i>' }],

    // actions: {
    //   columnTitle: 'Actions',
    //   // add: false,
    //   // edit: false,
    //   // delete: false,
    //   custom: [
    //   { name: 'viewrecord', title: '<i class="nb-compose"></i>'},
    //   { name: 'editrecord', title: '&nbsp;&nbsp;<i class="nb-eye"></i>' }
    // ],
    //   position: 'right'
    // },
    columns: {
      label: {
        title: 'Label',
        type: 'string',
      },
      name: {
        title: 'Name',
        type: 'string',
      },
      type: {
        title: 'Type',
        type: 'string',
      },
      isRequired: {
        title: 'Required',
        type: 'boolean',
      },
      _id: {
        title: 'Actions',
        type: 'custom',
        renderComponent: ViewTableRendererComponent,
        filter: false,
        onComponentInitFunction: (instance) => {
          instance.save.subscribe(data => {
            if (data) {
              this.getTable();
            }
          });
        },
      },
    },
  };


  source: LocalDataSource = new LocalDataSource();

  constructor(
    private tableService: TableService,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private router: Router
  ) {
    this.getTable();
  }

  getTable() {
    this.tableId = this.route.snapshot.paramMap.get('id');
    const data = this.tableService.getTableDetails(this.tableId)
      .subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.tableName = res.data[0].tableName;
          const tableData = res.data[0].columns;
          this.tableItems = tableData;
          this.source.load(tableData);
        }
      });
  }

  onEdit(event) {
    // alert(event);
  }

  addColumn() {
    this.dialogService.open(AddEditColumnInDialogComponent, {
      context: {
        items: {
          tableId: this.tableId,
          tableItems: this.tableItems,
          tableName: this.tableName,
        }
      }
    })
      .onClose.subscribe(column => {
        if (column) {
          this.getTable();
        }
      });
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onClick() {
    this.router.navigate(['/pages/tables/tableConfig', this.tableId]);
  }
}


@Component({
  selector: 'app-custom-renderer',
  template: `<i class="nb-edit" (click)="onEdit()" style="font-size:20px"></i>
  <i class="nb-trash" (click)="onDelete()" style="font-size:20px"></i>`,
})
export class ViewTableRendererComponent implements OnInit {
  @Output() save: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router,
    private dialogService: NbDialogService) {
  }

  renderValue: string;
  @Input() value: string | number;
  @Input() rowData: any;
  ngOnInit() {
  }

  onEdit() {
    const items = this.value;
    this.dialogService.open(AddEditColumnInDialogComponent, { context: { items: this.rowData } })
      .onClose.subscribe(column => {
        if (column) {
          console.log("ddd",column);
          this.save.emit(column);
        }
      });
  }

  onView() {
    this.router.navigate(['/tables/view/' + this.value]);
  }

  onDelete() {
    // const modalRef = this._modalService.open(ConfirmDialogComponent);
    // modalRef.componentInstance.titleFrom = 'Delete Profile Field ';
    // modalRef.componentInstance.message = 'Are you sure you want to delete this field?';
    // modalRef.result
    //   .then((result) => {
    //     if (result) {
    //       this.loaderService.show();
    //       const id = this.value;
    //       this.customService.deleteCustomeField(id).subscribe((res: any) => {
    //         if (res.statusCode === 200) {
    //           this.loaderService.hide();
    //           this.save.emit(true);
    //         } else {
    //         }
    //       });
    //     }
    //   });
  }

}
