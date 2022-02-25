import { TableService } from '@app/shared/services/table.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'ngx-table-breadcrumb',
  templateUrl: './table-breadcrumb.component.html',
  styleUrls: ['./table-breadcrumb.component.css'],
})
export class TableBreadcrumbComponent implements OnInit {
  @Output() onchangeStatus: EventEmitter<any> = new EventEmitter();
  @Input() id;
  @Input() tableName;
  @Input() breadcrumbs;
  statusArray = [];
  breadCrumbList = [];
  mobileDevice = false;
  showAllStatus = false;
  constructor(
    private toasterService: NbToastrService,
    private tableService: TableService,
    private dialogService: NbDialogService,
  ) { }

  ngOnInit() {
    this.setBreadCrumb(this.breadcrumbs);
  }

  setBreadCrumb(items) {
    items.forEach((element, index) => {
      const arr = [];
      arr['label'] = element.label;
      arr['name'] = element.name;
      arr['icon'] = 'fa fa-user';
      arr['active'] = element.active;
      arr['color'] = element.color;
      if (index == 0) {
        arr['class'] = 'first-icon';
      } else if (index + 1 == items.length) {
        arr['class'] = 'end-icon';
      } else {
        arr['class'] = 'icon';
      }
      this.breadCrumbList.push(arr);
    });
  }


  onUpdateStatus(value) {
    const data = {};
    data[value.name] = value.label;

    this.breadCrumbList.forEach(ele => {
      if (ele != value) {
        ele.active = false;
      } else {
        ele.active = true;
      }
    });
    this.tableService.updateDynamicFormData(this.id, this.tableName, data)
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.toasterService.success('Status update succesfully', 'Success');
        } else {
          this.toasterService.danger(res.message, 'Error');
        }
      }, (error) => {
        this.toasterService.danger(`${error.error && error.error.message}`, 'Error');
      });
  }

  confirmUpdateStatus(value) {
    if (!value.active) {
      const dialogData = {
        title: 'Are you Sure?',
        text: 'Do you really want to change the status?',
      };
      this.dialogService.open(ConfirmDialogComponent, { context: dialogData })
        .onClose.subscribe((res: any) => {
          if (res) {
            this.onUpdateStatus(value);
          }
        });
    }
  }
}
