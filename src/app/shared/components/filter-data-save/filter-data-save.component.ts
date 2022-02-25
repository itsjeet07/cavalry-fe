import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableService } from '@app/shared/services/table.service';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { threadId } from 'worker_threads';

@Component({
  selector: 'ngx-filter-data-save',
  templateUrl: './filter-data-save.component.html',
  styleUrls: ['./filter-data-save.component.scss']
})
export class FilterDataSaveComponent implements OnInit {

  @Input() tableName: string;
  @Input() filerDataSend: any [];
  filterDisplay = [];
  item = [];
  filtercFormData: FormGroup;
  filterData: any = [];
  constructor(protected ref: NbDialogRef<FilterDataSaveComponent>,
    private formBuilder: FormBuilder,
    private tableService: TableService,
    private toastrService: NbToastrService) {
      this.initForms();
    }

  ngOnInit(): void {
    this.tableService.getFilterSaveData(this.tableName).subscribe((res: any) => {
      this.filterDisplay = Object.assign([], res.data);
      this.filterData = this.filterDisplay.find(x => x.isDefaultList == true);
    });
  }

  onCancel() {
    this.ref.close();
  }

  initForms(): void {
    this.filtercFormData = this.formBuilder.group({
      filterName: ['' , Validators.required],
      isDefaultList: [''],
    });
  }

  onSaveFilterData() {
    if (this.filtercFormData.value.isDefaultList) {
      if (this.filterData) {
        this.tableService.updateDynamicFormData(this.filterData._id, 'filterList',
          this.filterData.isDefaultList = false).subscribe((res: any) => {});
      }
    }
    if (this.filtercFormData.invalid) {
      for (const  [key, value]  of Object.entries(this.filtercFormData.controls)) {
        if (value.invalid) {
           this.toastrService.danger(key.toUpperCase() + ' is Required', 'Error');
           return false;
        }
      }
    }


   let temp = {};
  temp = this.filtercFormData.value;
  temp['filterList'] = this.filerDataSend;
  temp['tableName'] = this.tableName;
  // console.log(temp);

  this.tableService.saveDynamicFormData(temp, 'filterList').subscribe((res: any) => {
    if (res.statusCode === 201) {
       this.toastrService.success(res.message, 'Success');
      this.filtercFormData.reset();
      this.ref.close('yes');
    } else {
      this.toastrService.danger(res.message, 'Error');
    }
  }, (error) => {
    this.toastrService.danger(`${error.error && error.error.message}`, 'Error');
  });


  }
}
