import { TableService } from './../../../shared/services/table.service';
import { NbToastrService } from '@nebular/theme';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { NbComponentSize } from '@nebular/theme';

@Component({
  selector: 'ngx-task-tab',
  templateUrl: './task-tab.component.html',
  styleUrls: ['./task-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskTabComponent implements OnInit {

  @Input() taskColumns: any;
  @Input() lookupDatas: any;

  dropdDownSize: NbComponentSize = 'small';
  inputFields: string[] = ['password', 'number', 'text', 'email', 'currency'];
  doNotRenderFields: string[] = ['_id', 'id', 'date', 'edit', 'key', 'column', 'dupValue', 'value', '__v', 'isActive', 'file', 'subject', 'dueDate', 'completed', 'assignedTo', 'description', 'createdBy'];
  taskFirstItems = {
    'subject': {
      key: 'subject',
      edit: false,
      id: '',
    },
    'assignedTo': {
      key: 'assignedTo',
      edit: false,
      id: '',
    },
    'dueDate': {
      key: 'dueDate',
      edit: false,
      id: '',
    },
  };
  taskLastItems: string[] = ['createdBy', 'description'];
  completed;
  subject;
  dueDate;
  assignedTo = 'Hemnat J';
  createdBy = 'Hemant';
  lookupDubData = [];
  constructor(
    private datePipe: DatePipe,
    private toastrService: NbToastrService,
    private tableService: TableService,
  ) { }

  ngOnInit(): void {
    this.setTaskData();
  }

  setTaskData() {
    this.lookupDubData = Object.assign({}, this.lookupDatas);
  }

  toStaticEdit(lookup, resid, name) {

    const column = this.taskColumns.find(x => x.name == name);

    if (column) {
      lookup[name + 'data'] = {
        value: lookup[name],
        id: resid,
        edit: true,
        key: name,
        column: column,
        dupValue: lookup[name],
      };

      if (column.type == 'date') {

        if (lookup[name + 'data'].value) {

          lookup[name + 'data']['date'] = new Date(lookup[name]);
          lookup.date = new Date(lookup[name]);
        } else {

          lookup[name + 'data']['date'] = lookup[name];
          lookup.date = lookup[name];
        }
      }
    }
  }

  isCompleted(lookup) {

    lookup.completed = !lookup.completed;

    const data = {
      completed: lookup.completed,
      oldValue: !lookup.completed,
      newValue: lookup.completed,
      fieldUpdated: 'completed',
      editType: 'inline',
    };

    this.tableService.updateDynamicFormData(lookup._id, 'Tasks', data)
      .subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.toastrService.success(res.message, 'Action was  completed!');
        }
      });
  }

  toEdit(lookup, id) {

    const column = this.taskColumns.find(x => x.name == lookup.key);
    if (column) {
      if (column.type == 'date') {
        if (lookup.value) {
          lookup.date = new Date(lookup.value);
        } else {
          lookup.date = lookup.value;
        }
      }

      lookup['id'] = id;
      lookup['edit'] = true;
      lookup[lookup.key] = lookup.value;
      lookup['column'] = column;
      lookup['dupValue'] = lookup.value;
    }
  }

  onSave(lookup) {
    const data = {};
    if (lookup.column.type != 'date') {
      data[lookup.key] = lookup.value;
    } else {
      data[lookup.key] = lookup.date;
      lookup.value = this.datePipe.transform(lookup.date);
    }
    if (!lookup.value && lookup.column.isRequired) {
      this.toastrService.danger('The field is required');
    } else {

      lookup['edit'] = false;
      data['fieldUpdated'] = lookup['key'];
      data['editType'] = 'inline';
      data['oldValue'] = lookup['dupValue'];
      data['newValue'] = lookup['value'];

      this.tableService.updateDynamicFormData(lookup.id, 'Tasks', data)
        .subscribe((res: any) => {
          if (res.statusCode == 200) {
            this.toastrService.success(res.message, 'Action was  completed!');
          }
        });
    }

  }

  onStaticSave(lookupData, name) {
    const lookup = lookupData[name + 'data'];

    const data = {};
    if (lookup.column.type != 'date') {
      data[lookup.key] = lookupData[name];
    } else {
      data[lookup.key] = lookupData.date;
      lookupData.date = this.datePipe.transform(lookupData.date);
      lookup.date = this.datePipe.transform(lookupData.date);
      lookupData.dueDate = this.datePipe.transform(lookupData.date);
    }
    if (!lookup.value && lookup.column.isRequired) {
      this.toastrService.danger('The field is required');
    } else {
      lookup['edit'] = false;

      data['fieldUpdated'] = lookup['key'];
      data['editType'] = 'inline';
      data['oldValue'] = lookup['value'];
      data['newValue'] = data[lookup.key];
      data['resourceName'] = 'Task';

      this.tableService.updateDynamicFormData(lookup.id, 'Tasks', data)
        .subscribe((res: any) => {
          if (res.statusCode == 200) {
            this.toastrService.success(res.message, 'Action was  completed!');
          }
        });
    }
  }

  onCancel(lookup) {
    lookup['edit'] = false;
    lookup['value'] = lookup.dupValue;
  }

  onStaticCancel(lookupData, name) {
    const lookup = lookupData[name + 'data'];
    lookup['edit'] = false;
    lookupData[name] = lookup.dupValue;
  }

  isObject(val) {
    return typeof (val) !== 'object';
  }


}
