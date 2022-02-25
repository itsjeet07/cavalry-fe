import { Component, Input, OnInit } from "@angular/core";
import { TableService } from "@app/shared/services/table.service";
import { NbDialogRef, NbToastrService } from "@nebular/theme";

@Component({
  selector: "ngx-dependencies",
  templateUrl: "./dependencies.component.html",
  styleUrls: ["./dependencies.component.scss"],
})
export class DependenciesComponent implements OnInit {
  @Input() tableData: any;
  @Input() addFlag: boolean;
  @Input() editFlag: boolean;
  @Input() columnId: any;
  @Input() dependencyIndex: any;
  public saveButtonFlag: boolean = false;
  public queryList: any;
  public editTableData: any;
  public columnList: any = [];
  public isSrcFieldSelected: boolean = false;
  public isSrcFieldLookup: boolean = false;
  public chkNull: boolean = false;
  public chkNotNull: boolean = false;
  public srcOptions: any = [];
  public dependencies: any;
  public soruceColumnType: any;
  public targetColumnType: any;
  public query: any = [];
  public fields: any = [];
  public sourceFieldName = "";

  constructor(
    private tableService: TableService,
    private toastrService: NbToastrService,
    protected dialogRef: NbDialogRef<any>
  ) {
    this.dependencies = {
      fields: [],
      query: {},
      ceatedAt: null,
      updatedAt: null,
    };
  }

  ngOnInit(): void {
    this.setSelectColumnList();
    if (this.editFlag && this.columnId) {
      this.getTableDataToEdit();
    }
  }

  setSelectColumnList() {
    //let list = [];
    this.columnList = this.tableData.columns.filter(
      (f) =>
        f.type === "radio" ||
        f.type === "dropdown" ||
        f.type === "checkbox" ||
        f.type === "status" ||
        f.type === "recordType" ||
        f.type === "lookup"
    );
  }

  getTableDataToEdit() {
    this.editTableData = this.tableData.columns.filter(
      (f) => f._id === this.columnId
    );
    if (this.editTableData.length > 0) {
      this.soruceColumnType = this.columnId;
      this.setSrcOptionList();
      this.dependencies = this.editTableData[0].dependencies[
        this.dependencyIndex
      ];
      this.fields = this.editTableData[0].dependencies[
        this.dependencyIndex
      ].fields;
      this.query = this.editTableData[0].dependencies[
        this.dependencyIndex
      ].query;
      this.isSrcFieldSelected = true;
      if(this.editTableData[0].type === 'lookup'){
        if(this.fields.indexOf('Null') > -1){
          this.chkNull = true;
        }
        else if(this.fields.indexOf('Not Null') > -1){
          this.chkNotNull = true;
        }
      }
    }
  }

  setSrcOptionList() {
    this.srcOptions = [];
    this.dependencies = {
      fields: [],
      query: {},
    };
    this.fields = [];
    this.query = [];
    this.isSrcFieldSelected = true;
    let obj = this.columnList.filter((f) => f._id == this.soruceColumnType);
    if (obj.length > 0 && obj[0].type === "lookup") {
      this.isSrcFieldLookup = true;
      this.srcOptions = ['lookup'];
    } else if (obj.length > 0 && obj[0].options && obj[0].type != "status") {
      this.isSrcFieldLookup = false;
      this.srcOptions = [...obj[0].options];
      this.sourceFieldName = obj[0].label;
      this.srcOptions.push("Null");
    } else if (obj.length > 0 && obj[0].type == "status") {
      this.isSrcFieldLookup = false;
      this.sourceFieldName = obj[0].label;
      this.srcOptions = [...obj[0].statusOptions];
      let obj1 = {...obj[0].statusOptions[0]};
      obj1.status = 'Null'
      this.srcOptions.push(obj1);
    }
  }

  srcCheckboxSelected(event, val) {
    if(this.isSrcFieldLookup){
      if(val == "Null"){
        this.chkNotNull = false;
        let index = this.fields.findIndex((f) => f === 'Not Null');
        if (index > -1) this.fields.splice(index, 1);
      }else{
        this.chkNull = false;
        let index = this.fields.findIndex((f) => f === 'Null');
        if (index > -1) this.fields.splice(index, 1);
      }
    }
    if (event) this.fields.push(val);
    else {
      let index = this.fields.findIndex((f) => f === val);
      if (index > -1) this.fields.splice(index, 1);
    }
  }

  targetCheckBoxSelected(event, val, columnData) {
    if (event) {
      if (this.query[columnData.name] == undefined)
        this.query[columnData.name] = [];
      this.query[columnData.name].push(val);
    } else {
      let index = this.query[columnData.name].findIndex((f) => f === val);
      if (index > -1) this.query[columnData.name].splice(index, 1);
      if (this.query[columnData.name].length == 0)
        delete this.query[columnData.name];
    }
  }

  saveDependency() {
    this.saveButtonFlag = true;
    if (this.fields.length > 0 && Object.keys(this.query).length) {
      this.dependencies.fields = this.fields;
      this.dependencies.query = { ...this.query };
      let obj = this.tableData.columns.findIndex(
        (i) => i._id === this.soruceColumnType
      );
      if (obj > -1) {
        if (this.addFlag) {
          this.dependencies.createdAt = new Date();
          if (
            this.tableData.columns[obj].dependencies &&
            this.tableData.columns[obj].dependencies.length > 0
          ) {
            this.tableData.columns[obj].dependencies.push(this.dependencies);
          } else {
            this.tableData.columns[obj].dependencies = [];
            this.tableData.columns[obj].dependencies.push(this.dependencies);
          }
        } else if (this.editFlag) {
          this.dependencies.updatedAt = new Date();
          this.tableData.columns[obj].dependencies[
            this.dependencyIndex
          ] = this.dependencies;
        }
      }

      this.tableService.updateTable(this.tableData).subscribe(
        (res: any) => {
          if (res.statusCode === 200) {
            this.toastrService.success(res.message);
            this.dialogRef.close(true);
            this.saveButtonFlag = false;
          } else {
            this.saveButtonFlag = false;
            this.toastrService.danger(res.message);
          }
        },
        (error) => {
          this.saveButtonFlag = false;
        }
      );
    } else {
      this.toastrService.danger("Please select soruce and target fields");
      this.saveButtonFlag = false;
    }
  }

  closeModal() {
    this.dialogRef.close(false);
  }
}
