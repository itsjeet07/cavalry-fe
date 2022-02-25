import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { TableService } from '@app/shared/services/table.service';
import { NbDialogService } from '@nebular/theme';
import { ExportTableComponent } from '../export-table/export-table.component';
import { ImportTableComponent } from '../import-table/import-table.component';

@Component({
  selector: 'ngx-list-table',
  templateUrl: './list-table.component.html',
  styleUrls: ['./list-table.component.scss'],
})
export class ListTableComponent {

  data = [];
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
      tableName: {
        title: 'Name',
        type: 'string',
      },
      _id: {
        title: 'Actions',
        type: 'custom',
        renderComponent: CustomRendererComponent,
        filter: false,
        onComponentInitFunction: (instance) => {
          instance.save.subscribe(data => {
            if (data) {
              // this.getCustomList();
            }
          });
        }
      },
    },
  };
  loading = false;

  source: LocalDataSource = new LocalDataSource();

  constructor(private tableService: TableService,
    private router: Router, 
    private dialogService: NbDialogService) {
    this.loading = true;
    this.tableService.getTable().subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.source.load(res.data);
      }
      this.loading = false;
    });
  }

  onEdit(event) {
    // alert(event);
  }

  onAddColumns(event) {
    this.router.navigate(['/tables/view/' + event.data.id]);
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  exportTable() {
    const modalRef = this.dialogService.open(ExportTableComponent, {
      context: {
        source: this.source
      }
    });
  }

  importTable() {
    const modalRef = this.dialogService.open(ImportTableComponent);    
  }
}


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-custom-renderer',
  template: `<i class="fa fa-eye" (click)="onView()"></i>&nbsp;&nbsp;
  <i class="nb-edit" (click)="onEdit()"></i>&nbsp;&nbsp;
  <i class="fa fa-cog" style="color: #8f9bb3;" (click)="onClick()"></i>`
})

export class CustomRendererComponent implements OnInit {
  @Output() save: EventEmitter<any> = new EventEmitter()

  constructor(private router: Router) {
  }

  renderValue: string;
  @Input() value: string | number;
  @Input() rowData: any;
  ngOnInit() {
  }


  onEdit() {
    this.router.navigate(['pages/tables/edit/' + this.value])
  }


  onView() {
    this.router.navigate(['pages/tables/view/' + this.value])
  }

  onClick() {
    this.router.navigate(['/pages/tables/tableConfig', this.value]);
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
