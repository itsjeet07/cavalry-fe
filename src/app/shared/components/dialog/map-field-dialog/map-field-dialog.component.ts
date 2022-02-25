import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { isElement } from 'lodash';
@Component({
  selector: 'ngx-map-field-dialog',
  templateUrl: './map-field-dialog.component.html',
  styleUrls: ['./map-field-dialog.component.scss'],
})
export class MapFieldDialogComponent {
  @Input() lookupData = [];
  @Input() currentTableData = [];
  @Input() mappedFields;
  fieldList = [];
  submitFlag: boolean = false;
  fieldObj = {}
  copyLookUp;
  constructor(
    protected ref: NbDialogRef<MapFieldDialogComponent>,
    private cdr: ChangeDetectorRef,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,

  ) {
    this.fieldList.push(new MapeedFieldsClass());
  }

  ngOnInit() {
    this.copyLookUp = this.lookupData;
    this.getMapData();
  }
  addNewRow() {
    const arr = {
      lookupField: '',
      tableField: '',
    };
    this.fieldList.push(arr);
  }

  removeRow(i) {
    this.fieldList.splice(i, 1);
  }

  getMapData() {
    if(this.mappedFields){
      let keys= Object.keys(this.mappedFields);
      if(keys.length){
        keys.forEach((ele, i) => {
          if(!i){
            this.fieldList[i] = {lookupField: ele, tableField: this.mappedFields[ele]};
          }else{

            let obj = new MapeedFieldsClass();
            obj.lookupField = ele;
            obj.tableField = this.mappedFields[ele];
            this.fieldList.push(obj);
          }
        });
      }
    }
  }




  cancel() {
    this.ref.close();
  }

  submit() {


    this.submitFlag = false;
    this.fieldList.forEach((item, i) => {
      if (item.lookupField != null && item.tableField != null && item.lookupField != "" && item.tableField != "") {
        this.fieldObj[item.lookupField] = item.tableField;
      } else if(item.lookupField == null && item.tableField == null){
        this.submitFlag = true;
      }else {
        this.submitFlag = true;
      }
    })
    if (this.submitFlag) {
      this.toastrService.warning("Enter all fields");
      return;
    }
    else {
      this.ref.close(this.fieldObj);
    }
  }
}

export class MapeedFieldsClass{
  lookupField: string;
  tableField: string;
  constructor(){
    this.lookupField = "";
    this.tableField = "";
  }
}
