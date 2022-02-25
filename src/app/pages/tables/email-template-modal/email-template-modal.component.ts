import { Component, OnInit, Input, AfterViewInit } from "@angular/core";
import { NbToastrService, NbDialogRef, NbDialogService } from "@nebular/theme";
import { TableService } from "@app/shared/services/table.service";
import { EmailConfigHelpComponent } from "../email-config-help/email-config-help.component";

export class EmailEvent {
  _id: string = null;
  tableId: string;
  columnId: string;
  event: EmailObject;
  emailType: any;
  newRecord: any

  constructor() {
    this.tableId = "";
    this.columnId = "";
    this.event = new EmailObject();
    this.emailType = 'data';
    this.newRecord = false;
  }
}

export class EmailEventTimeTrigger {
  _id: string = null;
  tableId: string;
  columnId: string;
  timeUnit: any;
  length: any;
  beforeAfter: any;
  emailType: any;
  newRecord: any;
  event: EmailObjectTimeTrigger

  constructor() {
    this.tableId = "";
    this.columnId = "";
    this.timeUnit = "";
    this.length = null;
    this.beforeAfter = "";
    this.emailType = "time";
    this.newRecord = false;
    this.event = new EmailObjectTimeTrigger();
  }
}
export class EmailObject {
  any: boolean;
  oldValue: any;
  newValue: any;
  subject: any;
  body: any;
  emailTo: string;
  constructor() {
    this.oldValue = [];
    this.newValue = [];
    this.body = "";
    this.emailTo = "";
    this.subject = "";
    this.any = false;
  }
}

export class EmailObjectTimeTrigger {
  subject: any;
  body: any;
  emailTo: string;
  constructor() {
    this.body = "";
    this.emailTo = "";
    this.subject = "";
  }
}


@Component({
  selector: "ngx-email-template-modal",
  templateUrl: "./email-template-modal.component.html",
  styleUrls: ["./email-template-modal.component.scss"],
})
export class EmailTemplateModalComponent implements OnInit, AfterViewInit {
  @Input() tableData: any;
  @Input() addFlag: boolean;
  @Input() editFlag: boolean;
  @Input() columnEventData: any;
  @Input() columnId: any;
  @Input() emailIndex: any;
  @Input() type: any;

  public saveButtonFlag: boolean = false;
  public isAnyField: boolean = false;
  public isAnyChangeCheckBox: boolean = false;
  public isNewRecordCheckBox: boolean = false;
  public editTableData: any;
  public columnList: any = [];
  public oldfieldsSelected: any = [];
  public newfieldsSelected: any = [];
  public isNewRecord: boolean = false;

  public isSrcFieldSelected: boolean = false;
  public loading: boolean = false;
  public srcOptions: any = [];
  public soruceColumnId: any;
  public sourceFieldName = "";
  public editorConfig: any;
  public that;

  oldInputValue: any;
  newInputValue: any;
  dateTimePickerToggeledOn = false;
  emailEventObject = new EmailEvent();
  emailEventTimeTrigger = new EmailEventTimeTrigger();
  selectedColumnObj: any;

  options = [
    { value: 'data', label: 'Data Trigger' },
    { value: 'time', label: 'Time Trigger' },
  ];
  option = 'data';
  dataFlag: boolean = true;
  timeFlag: boolean = false;
  date_dateTimeArray = [];
  fieldOptionSelected;
  length;
  timeUnitArray = [
    { value: 'month', label: 'Month' },
    { value: 'week', label: 'Week' },
    { value: 'day', label: 'Day' },
    { value: 'hour', label: 'Hour' },
    { value: 'min', label: 'Minute' },
  ];
  timeUnit;
  beforeAfterArray = [
    { value: 'before', label: 'Before' },
    { value: 'after', label: 'After' },
  ];
  beforeAfter;
  constructor(
    private tableService: TableService,
    private toastrService: NbToastrService,
    protected dialogRef: NbDialogRef<any>,
    private dialogService: NbDialogService
  ) {
    var that = this;
    this.editorConfig = {
      plugins: "image code",
      toolbar: "undo redo | link image | code",
      image_title: true,
      entity_encoding: "raw",
      skin: false,
      content_css: '/app/assets/tinymce-content.min.css',
      automatic_uploads: true,
      image_dimensions: false,
      file_picker_types: "image",
      skin_url: 'assets/skins/lightgray',
      // allow_conditional_comments: true,
      // allow_html_in_named_anchor: true,
      // extended_valid_elements : '%',
      // custom_elements : '%,~%',

      file_picker_callback: function (cb, value, meta) {
        var input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");

        input.onchange = function () {
          var file = input.files[0];
          var reader = new FileReader();
          reader.onload = function () {
            var id = "blobid" + new Date().getTime();
            var blobCache = tinymce.activeEditor.editorUpload.blobCache;
            var a1 = reader.result as any;
            var base64 = a1.split(",")[1];
            var blobInfo = blobCache.create(id, file, base64);
            blobCache.add(blobInfo);
            that.loading = true;
            var a = document.getElementsByClassName("mce-floatpanel") as any;
            a[0].style.zIndex = "0";
            tableService.uploadImageEmailEvent(file).subscribe(
              (res: any) => {
                if (res.statusCode === 201) {
                  cb(res["data"][0], { title: file.name });
                  that.loading = false;
                  a[0].style.zIndex = "99992";
                } else {
                }
              },
              (error) => {
                toastrService.danger(error.message, "Action was unsuccessful!");
                that.loading = false;
                a[0].style.zIndex = "99992";
              }
            );
          };
          reader.readAsDataURL(file);
        };

        input.click();
      },
      content_style:
        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px } img {height:200px;width:200px}",
    };
  }

  ngAfterViewInit(): void {
    this.tableService.dateTimePickerFocused.subscribe((res) => {
      setTimeout((_) => (this.dateTimePickerToggeledOn = res));
    });
  }

  ngOnInit(): void {
    this.setSelectColumnList();
    if (this.editFlag && this.columnEventData) {
      this.option = this.type;
      this.triggerEvent(this.type)
      this.getTableDataToEdit();
    }
  }

  setSelectColumnList() {
    this.columnList = this.tableData.columns.filter(
      (v) => v.type != "lookup" && v.type != "richTextArea" && v.type != "file"
    );

    this.date_dateTimeArray = this.columnList.filter(
      (v) => v.type == "date" || v.type == "dateTime"
    );
  }

  getTableDataToEdit() {
    if (this.editFlag) {
      if (!this.columnId) {
        this.soruceColumnId = "any";
      } else {
        this.soruceColumnId = this.columnId;
      }
    }

    this.setSrcOptionList();
    this.isNewRecordCheckBox = this.columnEventData.newRecord;
    this.emailEventObject.event = { ...this.columnEventData.event };
    if (this.columnEventData.emailType == "time") {
      this.emailEventTimeTrigger._id = this.columnEventData._id;
      this.emailEventTimeTrigger.beforeAfter = this.columnEventData.beforeAfter;
      this.emailEventTimeTrigger.length = this.columnEventData.length;
      this.emailEventTimeTrigger.columnId = this.columnEventData.columnId;
      this.emailEventTimeTrigger.timeUnit = this.columnEventData.timeUnit;
      this.emailEventTimeTrigger.newRecord = this.columnEventData.newRecord;
    }
    else {
      this.emailEventObject._id = this.columnEventData._id;
      this.emailEventObject.newRecord = this.columnEventData.newRecord;
      this.setOldAndNewValues();
      this.isSrcFieldSelected = true;

    }

  }

  isAnyChangechecked(event) {
    if (event) {
      this.emailEventObject.event["oldValue"] = [];
      this.emailEventObject.event["newValue"] = [];
      this.emailEventObject.event["any"] = true;
    } else {
      delete this.emailEventObject.event["any"];
    }
  }

  isNewRecordChecked(event) {
    if (this.timeFlag) {
      this.emailEventTimeTrigger.newRecord = event;
      this.isNewRecordCheckBox = event;
    }
    else {
      this.isNewRecordCheckBox = event;
      this.emailEventObject.newRecord = event;
    }
  }

  setSrcOptionList() {
    this.isSrcFieldSelected = true;
    this.selectedColumnObj = this.columnList.filter(
      (f) => f._id == this.soruceColumnId
    )[0];

    if (this.soruceColumnId === "any") {
      this.isAnyField = true;
      this.isAnyChangeCheckBox = false;
      this.sourceFieldName = "any";
      this.srcOptions = [];
    } else {
      if (!this.isAnyChangeCheckBox) {
        if (
          this.selectedColumnObj &&
          this.selectedColumnObj.options &&
          this.selectedColumnObj.type == "status"
        ) {
          this.sourceFieldName = this.selectedColumnObj.label;
          this.srcOptions = this.selectedColumnObj.statusOptions
            ? this.selectedColumnObj.statusOptions
            : [];
        } else if (
          this.selectedColumnObj &&
          this.selectedColumnObj.type != "status"
        ) {
          this.srcOptions = this.selectedColumnObj.options
            ? this.selectedColumnObj.options
            : [];
          this.sourceFieldName = this.selectedColumnObj.label;
        }
      }
    }
  }

  setOldAndNewValues() {
    //set isAnyChangeCheckBox flag...
    if (this.emailEventObject.event.oldValue.length == 0 && this.columnId) {
      this.isAnyChangeCheckBox = true;
    } else this.isAnyChangeCheckBox = false;
    //set all values for edit table..
    if (!this.isAnyChangeCheckBox && !this.isAnyField) {
      if (
        this.selectedColumnObj.type == "date" ||
        this.selectedColumnObj.type == "text" ||
        this.selectedColumnObj.type == "area" ||
        this.selectedColumnObj.type == "dateTime"
      ) {
        this.dateTimePickerToggeledOn = true;
        this.tableService.dateTimePickerFocused.next(
          this.dateTimePickerToggeledOn
        );
        this.oldInputValue = this.emailEventObject.event.oldValue[0];
        this.newInputValue = this.emailEventObject.event.newValue[0];
      } else {
        this.oldfieldsSelected = [...this.emailEventObject.event.oldValue];
        this.newfieldsSelected = [...this.emailEventObject.event.newValue];
      }
    }
  }

  oldValueCheckedItems(event, val) {
    this.emailEventObject.event.oldValue = [];
    if (event) {
      this.oldfieldsSelected.push(val);
    } else {
      let index = this.oldfieldsSelected.findIndex((f) => f === val);
      if (index > -1) {
        this.oldfieldsSelected.splice(index, 1);
      }
    }

    //update newInputValues array
    this.emailEventObject.event.oldValue = this.oldfieldsSelected;

    let index = this.newfieldsSelected.indexOf(val);
    if (index > -1) {
      this.newfieldsSelected.splice(index, 1);
    }
    index = this.emailEventObject.event.newValue.indexOf(val);
    if (index > -1) {
      this.emailEventObject.event.newValue.splice(index, 1);
    }
  }

  newValueCheckedItems(event, val) {
    this.emailEventObject.event.newValue = [];
    if (event) {
      this.newfieldsSelected.push(val);
    } else {
      let index = this.newfieldsSelected.findIndex((f) => f === val);
      if (index > -1) {
        this.newfieldsSelected.splice(index, 1);
      }
    }
    this.emailEventObject.event.newValue = this.newfieldsSelected;
  }

  matchPattern(): boolean{
    const pattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
    return !!this.emailEventObject.event.emailTo?.match(pattern);
  }

  saveEmail(myForm) {
    this.saveButtonFlag = true;
    if (this.dataFlag) {
      if (myForm.valid) {
        if (!this.isAnyChangeCheckBox) {
          delete this.emailEventObject.event["any"];
        }
        if (this.emailEventObject.newRecord || this.isNewRecordCheckBox) {

        }
        else {
          if (!this.soruceColumnId) {
            this.toastrService.danger("Please select source field");
            return;
          } else {
            if (!this.isAnyField && !this.isAnyChangeCheckBox) {
              if (
                this.selectedColumnObj.type == "date" ||
                this.selectedColumnObj.type == "text" ||
                this.selectedColumnObj.type == "area" ||
                this.selectedColumnObj.type == "dateTime"
              ) {
                this.emailEventObject.event.oldValue = [];
                this.emailEventObject.event.oldValue.push(this.oldInputValue);
                this.emailEventObject.event.newValue = [];
                this.emailEventObject.event.newValue.push(this.newInputValue);
              }
            }
          }
        }

        if (
          !(this.emailEventObject.event.oldValue.length > 0) &&
          !this.isAnyField &&
          !this.isAnyChangeCheckBox && !this.isNewRecordCheckBox
        ) {
          this.toastrService.danger("Please fill old value field");
          return;
        }
        if (
          !(this.emailEventObject.event.newValue.length > 0) &&
          !this.isAnyField &&
          !this.isAnyChangeCheckBox && !this.isNewRecordCheckBox
        ) {
          this.toastrService.danger("Please fill new value field");
          return;
        }
        if (!this.emailEventObject.event.emailTo) {
          this.toastrService.danger("Please fill email-to field");
          return;
        }
        if (this.emailEventObject.event.emailTo) {

          let charAt1st = this.emailEventObject.event.emailTo.charAt(0);
          let charAt2nd = this.emailEventObject.event.emailTo.charAt(1);
          if(charAt1st == "<" && charAt2nd == "?"){

          } else if(this.matchPattern()){

          } else{
            this.toastrService.danger("Enter valid send-to field","Invalid");
            return;
          }
        }
        if (!this.emailEventObject.event.subject) {
          this.toastrService.danger("Please fill email-subject field");
          return;
        }
        if (!this.emailEventObject.event.body) {
          this.toastrService.danger("Please fill email-body field");
          return;
        } else {
          let columnObjIndex = this.tableData.columns.findIndex(
            (i) => i._id === this.soruceColumnId
          );

          this.emailEventObject.tableId = this.tableData._id;

          if ((columnObjIndex > -1 || this.isAnyField) || this.isNewRecordCheckBox) {
            if (this.addFlag) {
              if (!this.isAnyField && !this.isNewRecordCheckBox)
                this.emailEventObject.columnId = this.tableData.columns[
                  columnObjIndex
                ]._id;
              if (this.isAnyField) this.emailEventObject.columnId = null;
              this.tableService
                .createEmailTemplate(this.emailEventObject)
                .subscribe(
                  (res: any) => {
                    if (res.statusCode === 200) {
                      this.toastrService.success(res.message);
                      this.dialogRef.close("data");
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
            } else if (this.editFlag) {
              if (!this.isAnyField)
                this.emailEventObject.columnId = this.tableData.columns[
                  columnObjIndex
                ]._id;
              if (this.isAnyField) this.emailEventObject.columnId = null;
              this.tableService
                .updateEmailTemplate(this.emailEventObject)
                .subscribe(
                  (res: any) => {
                    if (res.statusCode === 200) {
                      this.toastrService.success(res.message);
                      this.dialogRef.close("data");
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
            }
          }
        }
      }
    }
    else {
      if (myForm.valid) {

        if (this.emailEventObject.event.emailTo) {

          let charAt1st = this.emailEventObject.event.emailTo.charAt(0);
          let charAt2nd = this.emailEventObject.event.emailTo.charAt(1);

          if(charAt1st == "<" && charAt2nd == "?"){

          } else if(this.matchPattern()){

          } else{
            this.toastrService.danger("Enter valid send-to field","Invalid");
            return;
          }
        }

        if (!this.emailEventTimeTrigger.timeUnit && !this.emailEventTimeTrigger.length && !this.emailEventTimeTrigger.beforeAfter) {
          this.toastrService.danger("Please select empty fields");
          return;
        }
        else {
          let columnObjIndex = this.tableData.columns.findIndex(
            (i) => i._id === this.emailEventTimeTrigger.columnId
          );

          this.emailEventTimeTrigger.tableId = this.tableData._id;
          this.emailEventTimeTrigger.event.body = this.emailEventObject.event.body;
          this.emailEventTimeTrigger.event.subject = this.emailEventObject.event.subject;
          this.emailEventTimeTrigger.event.emailTo = this.emailEventObject.event.emailTo;

          if (columnObjIndex > -1 ) {

            if (this.addFlag) {
              this.tableService
                .createEmailTemplate(this.emailEventTimeTrigger)
                .subscribe(
                  (res: any) => {
                    if (res.statusCode === 200) {
                      this.toastrService.success(res.message);
                      this.dialogRef.close(this.emailEventTimeTrigger.emailType);
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
            } else if (this.editFlag) {
              this.tableService
                .updateEmailTemplate(this.emailEventTimeTrigger)
                .subscribe(
                  (res: any) => {
                    if (res.statusCode === 200) {
                      this.toastrService.success(res.message);
                      this.dialogRef.close(this.emailEventTimeTrigger.emailType);
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
            }
          }
        }
      }
    }

  }

  closeModal() {
    this.dialogRef.close(false);
  }

  openToEmailHelp() {
    //Open dialog for help
    this.dialogService
      .open(EmailConfigHelpComponent, {
        context: {
          tableData: this.tableData,
        },
      })
      .onClose.subscribe((res) => {
        if (res) {

        }
      });
  }

  triggerEvent(event){

    if (event == 'data') {
      this.dataFlag = true;
      this.timeFlag = false;
    }
    else {
      this.dataFlag = false;
      this.timeFlag = true;
      this.emailEventTimeTrigger.emailType = "time";
    }
  }
}
