import { DOCUMENT, DatePipe } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicFormDependenciesPipe } from '../../pipes/dynamic-form-dependency-filter.pipe';
import { DynamicTableViewComponent } from '@app/pages/tables/dynamic-table-view/dynamic-table-view.component';
import { NewReminderComponent } from '@app/pages/tables/new-reminder/new-reminder.component';
import { DynamicFormCommonService } from '@app/shared/dynamic-form-common.service';
import { FilterPipe } from '@app/shared/pipes/filter.pipe';
import { ChatSubscriptionService } from '@app/shared/services/chat-subscription.service';
import { HelperService } from '@app/shared/services/helper.service';
import { MessageService } from '@app/shared/services/message.service';
import { TableService } from '@app/shared/services/table.service';
import {
  NbContextMenuDirective,
  NbDialogRef,
  NbDialogService,
  NbMenuService,
  NbSidebarService,
  NbToastrService,
} from '@nebular/theme';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { iconList } from '@shared/iconData/iconList';
import * as moment from 'moment';
import { NgPluralizeService } from 'ng-pluralize';

import { MapService } from '../../services/map.service';
import { AddRefComponent } from '../add-ref/add-ref.component';
import { LookupDetailDialogComponent } from '../dialog/lookup-detail-dialog/lookup-detail-dialog.component';
import { EscapeDialogComponent } from '../escape-dialog/escape-dialog.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { NewReminderModalComponent } from '../new-reminder-modal/new-reminder-modal.component';
import { DynamicFormDialogComponent } from '../dynamic-form-dialog/dynamic-form-dialog.component';
@Component({
  selector: "ngx-dynamic-form-dialog-new-design",
  templateUrl: "./dynamic-form-dialog-new-design.component.html",
  styleUrls: ["./dynamic-form-dialog-new-design.component.scss"],
  providers: [DynamicFormDependenciesPipe],
})
export class DynamicFormDialogNewDesignComponent
  implements OnInit, AfterViewInit, AfterContentChecked, OnDestroy {

  @Input() inlineView: boolean = false
  private destroy$ = new Subject();
  dynamicForm: FormGroup;
  newDynamicForm: FormGroup;
  dynamicData: any;
  refDynamicForm: FormGroup;
  mappedKeysValues = {};
  @Input() tableDataForForms;
  refDynamicData: any;
  inputFields: string[] = ["password", "text", "email"];
  userFields: any = {};
  clientFields = ["zip", "city", "state"];
  loading = false;
  loadingAPI = false;
  formSubmitted = false;
  validFlag = false;
  options: string[];
  lookupValue = {};
  lookupObj = {};
  filteredOptions = {};
  search: any;
  lookTable: any;
  lookupName: any;
  tableData: any = [];
  showAutocomplete = {};
  lookupData: any = [];
  isActive: boolean;
  currentGadgetValue = "";
  finalRecordTypes = [];
  fileUploadS3Data: [];
  demoData: [];
  fileFormData: any = [];
  showArrayData: {};
  @Input() droppedFiles: {};
  uploadProgress = 0;
  buttonDisable = true;
  checkData = false;
  isUpload = false;
  isInputDisable = false;
  dateTimeErrorFlag = false;
  dateErrorFlag = false;
  removeLookup = {};
  uploadedFiles: {};
  editData = {};
  lookupFieldRequired = {};
  valueToMapInField;
  @ViewChild("scrollable") scrollable: ElementRef;
  @Input() tableName: string;
  @Input() optionRecordType;
  @Input() title: string;
  @Input() subFormLookupIds: any;
  @Input() form: any[];
  @Input() button: { text: string };
  @Input() Data: any;
  @Input() isForceSave: boolean = false;
  @Input() recordType: string;
  @Input() taskStatus: string;
  @Input() recordTypeFieldName: string;
  @Input() recordTypeFlagFromAddNew = false;
  @Input() action: string;
  @ViewChild("autoInput") input;
  @Input() parentTableName: string;
  @Input() parentTableData: any;
  @Input() recordTypeName: string;
  @ViewChild("formpicker") formpicker;
  @Input() isDraggedFromParent: boolean;
  @Input() showChats = false;
  @Input() lookUpNameId = "";
  @Input() lookUpName = "";
  @Input() parentLookupName = "";
  @Input() dueDate: Date;
  @Input() tableIcon = "";
  @Input() viewFlag = false;
  @Input() editViewFlag = false;
  @Input() tableId;
  @Input() id;
  @Input() actions;
  @Input() recordGadgets;
  @Input() fromOldView = false;
  @Input() formHeight;
  @Input() formWidth;
  @Input() fieldAlignment;
  @Input() customValidations;
  @Input() fromRecordPage = false;
  groupChatTitle = "";
  lookUpOptions = [];
  timeout;
  dependsFields = [];
  unwantedFieldsInOptions = ["displayInTree", "lookups", "_id"];
  show = {};
  list;
  visibilityData;
  reftableId: any;
  tempParentTableHeader: any = [];
  refRecordTypes: any = [];
  reflookupFieldRequired = {};
  refshowAutocomplete = {};
  reffilteredOptions = {};
  refeditData = {};
  reflookupName: any;
  reflookTable: any;
  refremoveLookup = {};
  refIsInputDisable: boolean;
  refUserFields: any = {};
  refDemoData: [];
  refLookupData: any = [];
  refLookupValue = {};
  refEditData: any;
  refShow = {};
  refVisibilityData: any;
  refDependsFields = [];
  refRecordType: any;
  refparentTableName: any;
  refLookUpNameId: any;
  refRecordTypeFieldName: any;
  refDynamicFilterData: any;
  reftitle = "";
  refLookUpName: any = "";
  reftableData: any = [];
  refTableName: string;
  @Input() tableRecordTypes = [];
  @ViewChild(NbContextMenuDirective) contextMenu: NbContextMenuDirective;
  tableRecordType: any;
  setFieldIndex: any;
  isSubForm: boolean = false;
  subField: any;
  tutorials = [];
  statuses = [];
  chatOpened = true;
  continueFlag = false;

  // -- Watch properties
  isWatcherOpened = false;
  subscriptionText = "Follow this task";
  subscribers = [];
  tableInfo = {};
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  isSelfSubscribed = false;
  currentUser = null;
  public dependenciesList: any = [];
  public count: number = 0;
  colorSetter = [];
  dateTimePickerToggeledOn = false;
  editform: boolean = false;
  tutorial = "Hello this is tutorial";
  sections = [];
  arrayForLookup = [];
  withoutSectionData = [];
  public cssFlagAfterVisibility: boolean = false;
  public refreshFilterVar = "";
  public dropDownText = {};
  public rollupFields = [];
  getTableByNameObjectForData = {};
  colorForFont = "";
  sizeObj = {
    large: 12,
    medium: 6,
    small: 4,
    tiny: 3
  }
  colorForRightPanel;
  addEditFlag = true;
  finalArrayForWithoutSection = [];
  finalArrayForSection = [];
  singularTableName;
  hour;
  minute;
  second;
  day;
  year;
  recordData;
  imageForDropdownWithImageView = '';
  lookupArray = [];
  lookupTableName = [];
  otherDataKeys = [];
  @Input() mapField: any;
  @Input() values: any;
  showFooter = true;
  finalArrayForViewMode = [];
  defaultBackgrounColor = '#4279ee';
  loadTinyMce = false;

  constructor(
    private elRef: ElementRef,
    @Optional() protected ref: NbDialogRef<DynamicFormDialogNewDesignComponent>,
    private modalDialg: NgbModal,
    @Inject(DOCUMENT) private document: Document,
    private formBuilder: FormBuilder,
    private toastrService: NbToastrService,
    private tableService: TableService,
    private router: Router,
    private service: NgPluralizeService,
    private mapService: MapService,
    private dialogService: NbDialogService,
    private nbMenuService: NbMenuService,
    private changeDetector: ChangeDetectorRef,
    private chatSubscriptionService: ChatSubscriptionService,
    private route: ActivatedRoute,
    private helperService: HelperService,
    private sidebarService: NbSidebarService,
    private dynamicFormService: DynamicFormCommonService,
    private messageService: MessageService,
    private filterPipe: FilterPipe,
    private datePipe: DatePipe
  ) {
    this.currentUser = JSON.parse(localStorage.getItem("userData"));
  }

  ngOnInit() {
    if (this.id) {
      this.getTableData();
    }
    this.dynamicData = this.form;
    this.list = [];

    if (this.viewFlag) {
      this.viewFlag = true;
      this.editViewFlag = false;
      this.addEditFlag = false;
      let currentDate = new Date();
      let finalcurrentDate = currentDate.getTime();
      let createdAt = new Date(this.Data["createdAt"]);
      let finalcreatedAt = createdAt.getTime();
      const difference = Math.abs(finalcurrentDate - finalcreatedAt);
      this.day = Math.floor((difference / (1000 * 60 * 60 * 24)) % 365);
      this.hour = Math.round((difference / (1000 * 60 * 60)) % 24);
      this.minute = Math.round((difference / (1000 * 60)) % 60);
      this.second = Math.round((difference / 1000) % 60);

      let image = this.dynamicData.filter(v => v.type == "dropdownWithImage");
      if (image && image.length) {
        image.forEach(element => {
          if (element.options && element.options.length) {
            element.options.forEach(ele => {
              if (this.Data[element.name] == ele.title) {
                this.imageForDropdownWithImageView = ele.image;
              }
            });
          }
        });
      }
    }
    else {
      this.addEditFlag = true;
      this.viewFlag = false;
      this.editViewFlag = false;
    }
    const element = document.getElementById("main_body");
    element.classList.add("add-edit-client-form");
    this.setDependenciesList();
    if (this.Data) {
      this.editform = true;
    }
    if (this.dynamicData) {

      this.dynamicData.forEach((data, index) => {
        if (this.Data && data.type === "file") {
          this.uploadedFiles = {};
          this.uploadedFiles[data.name] = [];
          this.uploadedFiles[data.name] = this.Data[data.name];
        }

        if (data.type === "checkbox") {
          data["this.checkBoxValidateForDynamicForm"] = false;
          const check = [];
          if (this.Data) {
            const checkedData = this.Data[data.name]?.split(",");
            if (data.options) {
              data.options.forEach((option) =>
                check.push(new FormControl(checkedData?.includes(option)))
              );
            }
          } else if (data.defaultOptionValue) {
            const checkedData = [data.defaultOptionValue];
            if (data.options) {
              data.options.forEach((option) =>
                check.push(new FormControl(checkedData?.includes(option)))
              );
            }
          } else {
            data.options.forEach((option) =>
              check.push(new FormControl(false))
            );
          }
          this.userFields[data.name] = new FormArray(check);
        } else if (data.type === "lookup") {
          this.dropDownText[data.name] = "Type to search";
          this.isInputDisable = false;
          this.removeLookup[data.name] = true;
          this.lookTable = data.lookupTableName;
          this.lookupName = data.name;
          this.lookupValue[data.name] = [];
          this.editData[data.name] = [];
          this.filteredOptions[data.name] = [];
          this.showAutocomplete[data.name] = false;
          this.lookupFieldRequired[data.name] = false;

          const lookUpArray = [];
          data.options.forEach((el) => {
            const temp: [] = Object.assign([], el);
            temp.shift();
            if (data.loadAsDropDown) {
              if (el.length > 1) {
                this.filteredOptions[data.name].push({
                  id: el[0],
                  value: temp.toString().replace(/,/g, " "),
                });
              }
            }

            if (data.name == this.lookUpName) {
              lookUpArray.push({
                id: el[0],
                value: temp.toString().replace(/,/g, " "),
              });
            }
          });

          if (this.editform && !data.loadAsDropDown) {
            this.filteredOptions[data.name] = [];
            const lookups = this.Data.lookup.filter(
              (f) => f.lookupTableName === data.lookupTableName
            );
            if (lookups.length) {
              for (let lookUP of lookups) {
                let value = "";
                if (
                  lookUP &&
                  lookUP[data.name] &&
                  lookUP[data.name].length > 2
                ) {
                  for (let i = 1; i < lookUP[data.name].length; i++) {
                    value += lookUP[data.name][i] + " ";
                  }
                  value = value.trim();
                } else if (
                  lookUP &&
                  lookUP[data.name] &&
                  lookUP[data.name].length == 2
                ) {
                  value = lookUP[data.name][1];
                }
                if (lookUP[data.name] && lookUP[data.name].length) {
                  this.filteredOptions[data.name].push({
                    id: lookUP[data.name][0],
                    value: value,
                  });
                }
              }
            }
          }

          //set lookupvalue, options and filteredOptions according to parent table, if there
          if (
            !this.editform &&
            this.parentTableName &&
            this.parentTableName == data.lookupTableName &&
            this.parentTableData
          ) {
            let tempOption = [];
            let tempFilteredOption = {};
            tempOption.push(this.lookUpNameId);
            tempFilteredOption["id"] = this.lookUpNameId;
            tempFilteredOption["value"] = "";
            data.lookupTableFieldNames.forEach((element) => {
              if (this.parentTableData[element]) {
                tempOption.push(this.parentTableData[element]);
                tempFilteredOption["value"] +=
                  this.parentTableData[element] + " ";
              }
            });
            tempFilteredOption["value"] = tempFilteredOption["value"].trim();
            this.filteredOptions[data.name].push({ ...tempFilteredOption });
            if (data.options) {
              data.options.push(tempOption);
            } else {
              data.options = [];
              data.options.push(tempOption);
            }

            if (data.isReference)
              this.list.push({ name: data.name, value: [{ idField: tempOption, others: [] }], lookupTableName: data.lookupTableName })
          }

          this.lookUpOptions = lookUpArray;
          data.IdFieldValue?.map((res) => {
            res.splice(3, 1);
          });
          this.demoData = data;
          this.lookupData.push(this.demoData);

          if (this.Data && data.loadAsDropDown) {
            this.Data.lookup.forEach((el1) => {
              if (!data.isReference) {
                data.options.forEach((element) => {
                  if (
                    this.Data.lookup &&
                    data.name === el1.lookupName &&
                    element[0] === el1.lookupId
                  ) {
                    const displayValue = data.options.filter(
                      (f) => f[0] === el1.lookupId
                    );
                    if (displayValue.length > 0) {
                      const temp: [] = Object.assign([], displayValue[0]);
                      temp.shift();
                      this.lookupValue[data.name].push({
                        id: el1.lookupId,
                        value: temp.toString().replace(/,/g, " "),
                      });
                    } else {
                      if (element[0] === el1.lookupId) {
                        this.lookupValue[data.name].push({
                          id: el1.lookupId,
                          value: element[1],
                        });
                      }
                    }

                    this.editData[data.name] = this.lookupValue[data.name];
                    this.editData[data.name].forEach((element) => {
                      if (element.name) element.name = element.value;
                    });
                  }
                });
              }
            });
          } else if (this.editform) {
            if (!data.isReference) {
              if (this.filteredOptions[data.name].length) {
                this.lookupValue[data.name] = this.filteredOptions[data.name];
                this.editData[data.name] = this.lookupValue[data.name];
                this.editData[data.name].forEach((element) => {
                  if (element.name) element.name = element.value;
                });
              }
            }
          }
        } else if (data.type === "status") {
          this.userFields[data.name] = [
            this.Data ? this.Data[data.name] : data.defaultOptionValue
              ? data.defaultOptionValue
              : "",
            data.isRequired ? [Validators.required] : [],
          ];

          if (this.Data) {
            if (data.statusOptions && Array.isArray(data.statusOptions)) {
              const i = data.statusOptions.find(
                (j) => j.status == this.Data[data.name]
              );
              if (i) {
                this.colorSetter[data.name] = i.color;
                this.colorForRightPanel = this.colorSetter[data.name];
                this.colorForFont = i.labelColor ? i.labelColor : "";
              }
            }

            this.statuses[data.name] = this.Data[data.name];
          }
          if (!this.Data && data.defaultOptionValue) {
            if (data.statusOptions && Array.isArray(data.statusOptions)) {
              const i = data.statusOptions.find(
                (j) => j.status == data.defaultOptionValue
              );
              if (i) {
                this.colorSetter[data.name] = i.color;
                this.colorForRightPanel = this.colorSetter[data.name];
                this.colorForFont = i.labelColor ? i.labelColor : "";
              }
            }

            this.statuses[data.name] = data.defaultOptionValue;
          }
        } else if (
          ((!this.editform || !this.Data[data.name]) &&
            data.type === "dateTime") ||
          data.type == "date"
        ) {
          let days: any = 0;
          let isRecordTypeMatchFlag = false;
          let setInitialDateFlag = false;
          if (data.dateTimeOptions && data.dateTimeOptions.length) {
            setInitialDateFlag = true;
            const recordelement = this.recordType
              ? this.recordType
              : this.tableName;
            data.dateTimeOptions.forEach((element) => {
              if (
                element.recordType.toLowerCase() == recordelement.toLowerCase()
              ) {
                days = element.numberOfDays;
                isRecordTypeMatchFlag = true;
              }
            });
            if (!isRecordTypeMatchFlag) {
              const index = data.dateTimeOptions.findIndex((v) =>
                v.recordType
                  ? v.recordType.toLowerCase()
                  : v.recordType == "all"
              );
              if (index > -1) {
                days = data.dateTimeOptions[index].numberOfDays;
              }
            }
          }
          const date = new Date();
          days = parseInt(days);

          date.setDate(date.getDate() + days);


          if (this.Data && this.Data[data.name]) {
            let d = new Date(this.Data[data.name]);
            d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
            this.Data[data.name] = d;
          }
          this.userFields[data.name] = [
            this.Data ? this.Data[data.name] : setInitialDateFlag ? date : "",
            data.isRequired ? [Validators.required] : [],
          ];
          if (
            this.parentLookupName === "dependentTask" &&
            data.name === "isSubtask"
          ) {
            this.userFields[data.name] = "Yes";
          }
          if (this.dueDate) {
            this.userFields[data.name] = this.dueDate;
          }
        } else if (data.type === "dropdown") {
          if (
            this.Data &&
            this.Data[data.name] &&
            data.allowMultipleValues &&
            !Array.isArray(this.Data[data.name])
          ) {
            this.Data[data.name] = this.Data[data.name].split();
          }
          this.userFields[data.name] = [
            this.Data
              ? this.Data[data.name]
              : data.defaultOptionValue
                ? data.defaultOptionValue
                : "",
            data.isRequired ? [Validators.required] : [],
          ];
        } else if (data.type === "gadget") {

          this.userFields[data.name] = [
            this.Data
              ? this.Data[data.name]
              : data.gadget
                ? data.gadget
                : "",
            data.isRequired ? [Validators.required] : [],
          ];
          this.currentGadgetValue = data.gadget ? data.gadget : "";
        } else if (data.type === "dropdownWithImage") {
          if (
            this.Data &&
            this.Data[data.name] &&
            data.allowMultipleValues &&
            !Array.isArray(this.Data[data.name])
          ) {
            this.Data[data.name] = this.Data[data.name].split();
          }
          this.userFields[data.name] = [
            this.Data
              ? this.Data[data.name]
              : data.defaultOptionValue
                ? data.defaultOptionValue
                : null,
            data.isRequired ? [Validators.required] : [],
          ];
        }
        else if (data.type === "recordType") {
          if (
            this.Data &&
            this.Data[data.name] &&
            data.allowMultipleValues &&
            !Array.isArray(this.Data[data.name])
          ) {
            this.Data[data.name] = this.Data[data.name].split();
          }
          this.userFields[data.name] = [
            this.Data
              ? this.Data[data.name]
              : data.defaultOptionValue
                ? data.defaultOptionValue
                : "",
            data.isRequired ? [Validators.required] : [],
          ];
        }
        else if (data.type === "radio") {
          this.userFields[data.name] = [
            this.Data
              ? this.Data[data.name]
              : data.defaultOptionValue
                ? data.defaultOptionValue
                : "",
            data.isRequired ? [Validators.required] : [],
          ];
        } else if (data.type == 'autoNumber') {
          this.userFields[data.name] = [
            this.Data
              ? this.Data[data.name]
              : '',
            data.isRequired ? [Validators.required] : [],
          ];
        }
        else {
          // tslint:disable-next-line: max-line-length
          this.userFields[data.name] = [
            this.Data ? this.Data[data.name] : "",
            data.isRequired ? [Validators.required] : [],
          ];
          if (
            this.parentLookupName === "dependentTask" &&
            data.name === "isSubtask"
          ) {
            this.userFields[data.name] = "Yes";
          }
        }

        this.show[data.name] = true;
        if (
          data.isVisibilityOn &&
          data.fieldValuesData &&
          data.fieldValuesData.length > 0
        ) {
          this.visibilityData = this.dynamicData
            .filter((col) => col._id === data.visibilityData)
            .map((col) => col.name);
          this.visibilityData = this.visibilityData[0];
          this.dependsFields.push(data);
          let arr = [];
          arr = this.Data ? this.Data[this.visibilityData] ? this.Data[this.visibilityData].split(',') : [] : [];
          if (arr && arr.length) {
            for (const item of arr) {
              this.show[data.name] = this.Data
                ? !!data.fieldValuesData.includes(item)
                : this.recordType
                  ? !!data.fieldValuesData.includes(this.recordType)
                  : false;
              if (this.show[data.name]) {
                break;
              }
            }
          }
          else {
            this.show[data.name] = this.Data
              ? !!data.fieldValuesData.includes(this.Data[this.visibilityData])
              : this.recordType
                ? !!data.fieldValuesData.includes(this.recordType)
                : false;
          }
          if (
            data.name === "dependentTask" &&
            this.parentLookupName === "dependentTask"
          ) {
            this.show[data.name] = true;
          }

        }

        if (data.type == "lookup") {
          if (data.isReference == true) {
            this.show[data.name] = false;
          }
        }
      });
      this.dynamicForm = this.formBuilder.group(this.userFields);

      if (!this.Data) {
        let visibilityFields = this.dynamicData.filter(item => item.isVisibilityOn == true);
        visibilityFields.forEach(ele => {
          if (
            ele.isVisibilityOn &&
            ele.fieldValuesData &&
            ele.fieldValuesData.length > 0
          ) {
            this.visibilityData = this.dynamicData
              .filter((col) => col._id === ele.visibilityData)
              .map((col) => col.name);
            if (this.visibilityData && this.visibilityData.length) {
              this.visibilityData = this.visibilityData[0];
              this.dependsFields.push(ele);
              if (this.visibilityData == "taskType") {
                ele.fieldValuesData.forEach(item => {
                  if (this.recordType == item) {
                    this.show[ele.name] = true;
                  } else {
                    this.show[ele.name] = false;
                  }
                });
              } else {
                ele.fieldValuesData.forEach(item => {
                  let value = this.dynamicData.filter(val => {
                    if (this.visibilityData == val.name)
                      return true;
                  })
                  if (value && value.length) {
                    if (value[0].type == "checkbox") {
                      let index = value[0].options.findIndex(v => v == item);
                      if (index > -1) {
                        let arr = this.dynamicForm.get(this.visibilityData).value;
                        arr.forEach((element, i) => {
                          if (i == index) {
                            if (element == true) {
                              this.show[ele.name] = true;
                            } else {
                              this.show[ele.name] = false;
                            }
                          }
                        });
                      }
                    }
                    else {
                      if (this.visibilityData && this.dynamicForm.get(this.visibilityData).value == item) {
                        this.show[ele.name] = true;
                      } else {
                        this.show[ele.name] = false;
                      }
                    }
                  }
                })
              }
            }
          }
        })
      }

      if (this.values && this.mapField) {
        let mapFieldKeys = Object.keys(this.mapField);
        mapFieldKeys.forEach(ele => {
          let typeCheck = this.dynamicData.filter(item => item.name == ele);
          if (typeCheck && typeCheck.length > 0 && typeCheck[0].type == "lookup") {
            if (this.lookupValue[ele]) {
              this.lookupValue[ele] = this.values[this.mapField[ele]];
            }
          } else {
            if (Object.keys(this.userFields).findIndex(v => v == ele) > -1) {
              this.dynamicForm.patchValue({
                [ele]:
                  this.values[this.mapField[ele]],
              });
            }
          }
        })
      }
    }

    if (this.Data && this.Data["lookup"] && this.Data["lookup"].length) {

      let lookupfields = this.form.filter(f => f.type == "lookup");
      if (lookupfields && lookupfields.length) {
        lookupfields.forEach((element, i) => {
          if (element.isReference) {
            this.lookupArray.push(element);
          }
        });
      }

      if (this.lookupArray && this.lookupArray.length) {
        this.lookupArray.forEach(ele => {
          this.lookupTableName.push(ele.lookupTableName);
          this.otherDataKeys.push({ name: ele.name, value: ele.lookupTableFieldNames });
        });
      }
      this.Data["lookup"].forEach(element => {
        let field = this.dynamicData.filter(v => v.name == element.lookupName);
        if (field && field.length && field[0].isReference) {
          this.tableService.getDynamicTreeDataById(element.lookupTableName, element.lookupId).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
            if (res.data) {
              let refLookupIdFields = [];
              let refLookupField = this.lookupArray.filter(f => f.name == element.lookupName);
              if (refLookupField && refLookupField.length) {
                let refLookTable = refLookupField[0].lookupTableName;
                let response = this.tableDataForForms.filter(ele => ele.tableName == refLookTable);
                if (response && response.length) {
                  refLookupIdFields = response[0].columns.map(v => v.idField ? v.name : '');
                }
              }
              let obj = {
                name: '',
                value: null,
                lookupTableName: ''
              };
              obj.name = element.lookupName;
              obj.value = [];
              obj.lookupTableName = refLookupField[0].lookupTableName;
              let valueObj = {
                idField: [],
                others: [],
                id: null
              }
              let arrayForId = [];
              let arrForOther = [];
              let keys = Object.keys(res.data);
              let valueofOther = this.otherDataKeys.filter(valueELe => {
                if (valueELe.name == element.lookupName) {
                  return true;
                }
              });
              if (keys) {
                keys.forEach(element => {
                  if (refLookupIdFields.includes(element)) {
                    if (typeof (res.data[element]) !== 'object')
                      arrayForId.push(' ' + res.data[element]);
                  }
                  if (valueofOther && valueofOther.length) {
                    if (valueofOther[0].value.includes(element)) {
                      arrForOther.push(' ' + res.data[element]);
                    }
                  }
                })
              }
              valueObj.id = element.lookupId;
              valueObj.idField.push(arrayForId);
              valueObj.others.push(arrForOther);
              obj.value.push(valueObj);
              let temp = [];
              temp.push(obj);
              let invalid = false;
              if (this.list && this.list.length) {

                this.list.forEach(ele => {
                  if (ele.name == obj.name) {

                    if (!ele.value.includes(obj.value)) {
                      ele.value.push(valueObj);
                      invalid = true;
                      return;
                    }
                  }
                })
                if (!invalid) {
                  this.list.push(obj);
                }
              } else {
                this.list = temp;
              }
            }

          });
        }
      });
      this.changeDetector.detectChanges();
    }

    const indices = this.dynamicData
      .map((e, k) => (e.type === "section" ? k : ""))
      .filter(String);
    let i = 0;
    this.dynamicData.forEach((data) => {
      if (data.type == "section") {
        this.sections[i] = this.dynamicData.slice(indices[i], indices[++i]);
      }
    });
    this.withoutSectionData = this.dynamicData.slice(0, indices[0]);

    let limit = 12;
    let temp = [];
    let count = 0;
    if (this.withoutSectionData && this.withoutSectionData.length) {
      this.withoutSectionData.forEach((element, i) => {

        if ((element.type != "section") && ((element.type !== 'recordType') || (element.type == 'recordType' && this.recordType == ''))) {

          if (limit >= this.sizeObj[element.fieldSize]) {
            element["sequence"] = i;
            temp.push(element);
            limit = limit - this.sizeObj[element.fieldSize];
            if (i == this.withoutSectionData.length - 1) {
              let hide = true;
              for (const item of temp) {
                if (this.show[item.name]) {
                  hide = false;
                  break;
                }
              }
              if (hide) {
                this.finalArrayForWithoutSection.push({ data: temp, hide: true, backgColor: this.colorSetter[element.name] ? this.colorSetter[element.name] : '' });
              } else {
                this.finalArrayForWithoutSection.push({ data: temp, hide: false, backgColor: this.colorSetter[element.name] ? this.colorSetter[element.name] : '' });
              }
              let checkStatus = this.finalArrayForWithoutSection[count].data.filter(v => v.type == "status");
              if (checkStatus && checkStatus.length) {
                this.finalArrayForWithoutSection[count].backgColor = this.colorSetter[checkStatus[0].name];
              }
              count++;
            }
          }
          else {
            let hide = true;
            for (const item of temp) {
              if (this.show[item.name]) {
                hide = false;
                break;
              }
            }
            if (hide) {
              this.finalArrayForWithoutSection.push({ data: temp, hide: true, backgColor: this.colorSetter[element.name] ? this.colorSetter[element.name] : '' });
            } else {
              this.finalArrayForWithoutSection.push({ data: temp, hide: false, backgColor: this.colorSetter[element.name] ? this.colorSetter[element.name] : '' });
            }
            let checkStatus = this.finalArrayForWithoutSection[count].data.filter(v => v.type == "status");
            if (checkStatus && checkStatus.length) {
              this.finalArrayForWithoutSection[count].backgColor = this.colorSetter[checkStatus[0].name];
            }
            count++;
            temp = [];
            limit = 12;
            element["sequence"] = i;
            temp.push(element);
            limit = limit - this.sizeObj[element.fieldSize];
            if (i == this.withoutSectionData.length - 1) {
              let hide = true;
              for (const item of temp) {
                if (this.show[item.name]) {
                  hide = false;
                  break;
                }
              }
              if (hide) {
                this.finalArrayForWithoutSection.push({ data: temp, hide: true, backgColor: this.colorSetter[element.name] ? this.colorSetter[element.name] : '' });
              } else {
                this.finalArrayForWithoutSection.push({ data: temp, hide: false, backgColor: this.colorSetter[element.name] ? this.colorSetter[element.name] : '' });
              }
              let checkStatus = this.finalArrayForWithoutSection[count].data.filter(v => v.type == "status");
              if (checkStatus && checkStatus.length) {
                this.finalArrayForWithoutSection[count].backgColor = this.colorSetter[checkStatus[0].name];
              }
              count++;
            }
          }
        } else {
          if (i == this.withoutSectionData.length - 1) {
            let hide = true;
            for (const item of temp) {
              if (this.show[item.name]) {
                hide = false;
                break;
              }
            }
            if (hide) {
              this.finalArrayForWithoutSection.push({ data: temp, hide: true, backgColor: this.colorSetter[element.name] ? this.colorSetter[element.name] : '' });
            } else {
              this.finalArrayForWithoutSection.push({ data: temp, hide: false, backgColor: this.colorSetter[element.name] ? this.colorSetter[element.name] : '' });
            }
            let checkStatus = this.finalArrayForWithoutSection[count].data.filter(v => v.type == "status");
            if (checkStatus && checkStatus.length) {
              this.finalArrayForWithoutSection[count].backgColor = this.colorSetter[checkStatus[0].name];
            }
            count++;
          }
        }
      });

      this.loadTinyMce = true;
    }

    if (this.sections && this.sections.length) {
      this.showFooter = false;
      this.sections.forEach(ele => {
        limit = 12;
        temp = [];
        count = 0;
        this.finalArrayForSection = [];
        if (ele && ele.length) {
          ele.forEach((element, i) => {

            if ((element.type != "section") && ((element.type !== 'recordType') || (element.type == 'recordType' && this.recordType == ''))) {

              if (limit >= this.sizeObj[element.fieldSize]) {

                element["sequence"] = i;
                temp.push(element);
                limit = limit - this.sizeObj[element.fieldSize];
                if (i == ele.length - 1) {

                  let hide = true;
                  for (const item of temp) {
                    if (this.show[item.name]) {
                      hide = false;
                      break;
                    }
                  }

                  if (hide) {
                    if (temp && temp.length)
                      this.finalArrayForSection.push({ data: temp, hide: true, backgColor: this.colorSetter[element.name] ? this.colorSetter[element.name] : '' });
                  } else {
                    if (temp && temp.length)
                      this.finalArrayForSection.push({ data: temp, hide: false, backgColor: this.colorSetter[element.name] ? this.colorSetter[element.name] : '' });
                  }

                  if (this.finalArrayForSection && this.finalArrayForSection.length) {
                    let checkStatus = this.finalArrayForSection[count].data.filter(v => v.type == "status");
                    if (checkStatus && checkStatus.length) {
                      this.finalArrayForSection[count].backgColor = this.colorSetter[checkStatus[0].name];
                    }
                    count++;
                  }
                }
              }
              else {
                let hide = true;
                for (const item of temp) {
                  if (this.show[item.name]) {
                    hide = false;
                    break;
                  }
                }
                if (hide) {
                  if (temp && temp.length)
                    this.finalArrayForSection.push({ data: temp, hide: true, backgColor: this.colorSetter[element.name] ? this.colorSetter[element.name] : '' });
                } else {
                  if (temp && temp.length)
                    this.finalArrayForSection.push({ data: temp, hide: false, backgColor: this.colorSetter[element.name] ? this.colorSetter[element.name] : '' });
                }

                if (this.finalArrayForSection && this.finalArrayForSection.length) {
                  let checkStatus = this.finalArrayForSection[count].data.filter(v => v.type == "status");
                  if (checkStatus && checkStatus.length) {
                    this.finalArrayForSection[count].backgColor = this.colorSetter[checkStatus[0].name];
                  }
                  count++;
                }
                temp = [];
                limit = 12;
                element["sequence"] = i;
                temp.push(element);
                limit = limit - this.sizeObj[element.fieldSize];
                if (i == ele.length - 1) {
                  let hide = true;
                  for (const item of temp) {
                    if (this.show[item.name]) {
                      hide = false;
                      break;
                    }
                  }
                  if (hide) {
                    if (temp && temp.length)
                      this.finalArrayForSection.push({ data: temp, hide: true, backgColor: this.colorSetter[element.name] ? this.colorSetter[element.name] : '' });
                  } else {
                    if (temp && temp.length)
                      this.finalArrayForSection.push({ data: temp, hide: false, backgColor: this.colorSetter[element.name] ? this.colorSetter[element.name] : '' });
                  }
                  if (this.finalArrayForSection && this.finalArrayForSection.length) {
                    let checkStatus = this.finalArrayForSection[count].data.filter(v => v.type == "status");
                    if (checkStatus && checkStatus.length) {
                      this.finalArrayForSection[count].backgColor = this.colorSetter[checkStatus[0].name];
                    }
                    count++;
                  }
                }
              }
            }
            else {
              if (i == ele.length - 1) {
                let hide = true;
                for (const item of temp) {
                  if (this.show[item.name]) {
                    hide = false;
                    break;
                  }
                }
                if (hide) {
                  if (temp && temp.length)
                    this.finalArrayForSection.push({ data: temp, hide: true, backgColor: this.colorSetter[element.name] ? this.colorSetter[element.name] : '' });
                } else {
                  if (temp && temp.length)
                    this.finalArrayForSection.push({ data: temp, hide: false, backgColor: this.colorSetter[element.name] ? this.colorSetter[element.name] : '' });
                }
                if (this.finalArrayForSection && this.finalArrayForSection.length) {
                  let checkStatus = this.finalArrayForSection[count].data.filter(v => v.type == "status");
                  if (checkStatus && checkStatus.length) {
                    this.finalArrayForSection[count].backgColor = this.colorSetter[checkStatus[0].name];
                  }
                  count++;
                }
              }
            }
          });
        }
        ele["array"] = this.finalArrayForSection;
      });
      this.sections = this.sections.filter(ele => ele.array.length > 0);
    }
    if (this.viewFlag) {

      let limit = 12;
      let temp = [];
      let count = 0;
      if (this.dynamicData && this.dynamicData.length) {
        this.dynamicData.forEach((element, i) => {

          if (element.type != "section") {

            if (limit >= this.sizeObj[element.fieldSize]) {
              element["sequence"] = i;
              temp.push(element);
              limit = limit - this.sizeObj[element.fieldSize];
              if (i == this.dynamicData.length - 1) {
                this.finalArrayForViewMode.push({ data: temp, backgColor: this.colorSetter[element.name] ? this.colorSetter[element.name] : '' });
                let checkStatus = this.finalArrayForViewMode[count].data.filter(v => v.type == "status");
                if (checkStatus && checkStatus.length) {
                  this.finalArrayForViewMode[count].backgColor = this.colorSetter[checkStatus[0].name];
                }
                count++;
              }
            }
            else {
              this.finalArrayForViewMode.push({ data: temp, backgColor: this.colorSetter[element.name] ? this.colorSetter[element.name] : '' });
              let checkStatus = this.finalArrayForViewMode[count].data.filter(v => v.type == "status");
              if (checkStatus && checkStatus.length) {
                this.finalArrayForViewMode[count].backgColor = this.colorSetter[checkStatus[0].name];
              }
              count++;
              temp = [];
              limit = 12;
              element["sequence"] = i;
              temp.push(element);
              limit = limit - this.sizeObj[element.fieldSize];
              if (i == this.dynamicData.length - 1) {
                this.finalArrayForViewMode.push({ data: temp, backgColor: this.colorSetter[element.name] ? this.colorSetter[element.name] : '' });
                let checkStatus = this.finalArrayForViewMode[count].data.filter(v => v.type == "status");
                if (checkStatus && checkStatus.length) {
                  this.finalArrayForViewMode[count].backgColor = this.colorSetter[checkStatus[0].name];
                }
                count++;
              }
            }
          } else {
            if (i == this.dynamicData.length - 1) {
              this.finalArrayForViewMode.push({ data: temp, backgColor: this.colorSetter[element.name] ? this.colorSetter[element.name] : '' });
              let checkStatus = this.finalArrayForViewMode[count].data.filter(v => v.type == "status");
              if (checkStatus && checkStatus.length) {
                this.finalArrayForViewMode[count].backgColor = this.colorSetter[checkStatus[0].name];
              }
              count++;
            }
          }
        });
      }
    }

    if (this.isDraggedFromParent) {
      this.onDroppedFile(this.droppedFiles["file"], "file");
    }
    if (this.lookUpNameId && this.parentTableName) {
      let lookupDetail;
      if (this.parentLookupName) {
        lookupDetail = this.dynamicData.find(
          (x) =>
            x.lookupTableName == this.parentTableName &&
            x.name === this.parentLookupName
        );
      } else {
        lookupDetail = this.dynamicData.find(
          (x) => x.lookupTableName == this.parentTableName
        );
      }
      let lookupDetailToDisplay = [];
      lookupDetail.options.forEach((e) => {
        e.forEach((e1) => {
          if (e1 == this.lookUpNameId) {
            lookupDetailToDisplay = e;
          }
        });
      });
      const lookup = [];
      lookup.push({
        id: lookupDetailToDisplay[0],
        value: lookupDetailToDisplay[1],
        name: lookupDetailToDisplay[2],
      });
      this.editData[lookupDetail.name].push(lookup[0]);
      this.lookupValue[lookupDetail.name].push(lookup[0]);
      this.editData[lookupDetail.name][
        this.editData[lookupDetail.name].length - 1
      ].name = this.parentTableName;
      this.onSelectionChange(lookup, lookupDetail);
    }

    this.loadTutorial();
    this.dynamicForm.valueChanges.subscribe((x) => {
      this.count++;
      if (this.count > 999) this.count = 0;
      this.dependenciesCheck();
      if (this.dynamicForm.valid && !this.validFlag) {
        this.formSubmitted = false;
        this.validFlag = false;
      }
    });
    this.dependenciesCheck();
    if (!this.Data) {
      this.evalExpressionForFormulaField();
    }

    if (this.tableName.endsWith("s" || "S")) {
      this.singularTableName = this.service.singularize(this.tableName);
      //  this.tableNameWithoutS = this.tableName.slice(0, -1);
    } else {
      this.singularTableName = this.tableName;
    }

    this.getRecordGadgets();

    if (this.tableDataForForms && this.tableDataForForms.length) {
      this.tableDataForForms.forEach(element => {
        if (element.tableName == "Tasks") {
          let col = element.columns;
          if (col && col.length) {
            col.forEach(item => {
              if (item.type == 'lookup' && item.lookupTableId == this.tableId) {
                this.showAddTask = true;
                this.taskFormHeight = element.formHeight ? element.formHeight : null;
                this.taskFormWidth = element.formWidth ? element.formWidth : null;
                this.taskFormFieldAllignment = element.fieldAlignment ? element.fieldAlignment : null;
                this.taskFormActions = element.actions ? element.actions : [];
                this.taskFormCustomValidations = element.customValidations ? element.customValidations : [];
                this.taskFormRecordGadgets = element.recordGadgets ? element.recordGadgets : [];
                this.taskFormForm = element.columns;
                this.taskTableIcon = element.iconLocation ? element.iconLocation : '';
                this.taskTableId = element._id;
                if (this.tableDataForForms && this.tableDataForForms.length) {
                  this.tableDataForForms.forEach(ele => {
                    if (ele && ele.columns && ele.columns.length) {
                      this.getRecordType(Object.assign([], ele.columns), ele.tableName);
                    } else {
                      this.tableRecordTypes[ele.tableName] = [];
                    }
                  });
                }

                this.tempParentTableHeader = Object.assign([], col);
                this.tempParentTableHeader.map((column) => {
                  if (column.type == 'recordType') {
                    this.recordTypeFieldName = column.name;
                    column.options.forEach(element => {
                      const obj = {
                        title: element,
                      };
                      this.recordTypes.push(obj);
                    });
                  }
                });
              }
            });
          }
        }
      });
    }
  }

  showAddTask = false;
  taskFormHeight;
  taskFormWidth;
  taskFormCustomValidations = [];
  taskFormActions = [];
  taskFormRecordGadgets = [];
  taskFormFieldAllignment;
  taskFormForm = [];
  taskTableIcon;
  taskTableId;
  recordTypes = [];
  taskRecordType = '';
  taskRecordTypeFieldName;

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  matchPattern(value): boolean {
    const pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !!pattern.test(value);
  }

  changesPhoneDashes(phone) {
    const phoneVal = phone.replace(/\D[^\.]/g, '');
    return phoneVal.slice(0, 3) + '-' + phoneVal.slice(3, 6) + '-' + phoneVal.slice(6);
  }

  getTableData() {
    if (!this.tableName || !this.tableId || !this.id) {
      return;
    }

    this.tableService
      .getRelatedDataById(this.tableName, this.tableId, this.id).pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.lookupData = {};
        if (res.statusCode == 200 && res.data) {
          this.recordData = res.data;
          // -- Set Group chat title
          this.setGroupChatTitle(res);
          this.setTableInfo(this.id);
        }
      });
  }

  setGroupChatTitle(res) {
    if (res.data.IDField && res.data.IDField.length > 0) {
      let tempName = "";
      res.data.IDField.map((data) => {
        if (tempName == "") {
          tempName = res.data[data];
        } else {
          if (res.data[data] && res.data[data] != this.recordType) {
            tempName = `${tempName} - ${res.data[data]}`;
          }
        }
      });

      this.groupChatTitle = this.singularTableName + " - " + tempName;
      if (this.recordType) {
        this.groupChatTitle = this.recordType + " - " + tempName;
      } else {
        this.groupChatTitle = this.singularTableName + " - " + tempName;
      }
    }
  }

  setTableInfo(id) {
    this.tableInfo = {
      resourceId: id,
      tableId: this.tableId,
      tableName: this.tableName,
      resourceName: this.groupChatTitle,
    };

    this.changeDetector.detectChanges();
  }

  dependenciesCheck() {
    //check if dependency is there for current field..
    this.dynamicData.forEach((item, index) => {
      item.isDependencyHit = false;
      item.oldValue = this.dynamicForm.value[item.name];
      this.dependenciesList.forEach((element, i) => {
        let keys = Object.keys(element.query);
        if (keys.indexOf(item.name) > -1) {
          if (!item.isDependencyHit) {
            this.filtereAllOptions(item, element);
          }
        }
      });
    });
  }

  filtereAllOptions(field, dependencyObj) {
    //check for the value in srcField..
    let srcFieldName = dependencyObj.srcFieldName;
    let srcFieldType = dependencyObj.srcFieldType;
    let srcFieldOptions = dependencyObj.srcFieldOptions;

    let dependencyField = [...dependencyObj.fields];

    for (
      let dFieldIndex = 0;
      dFieldIndex < dependencyField.length;
      dFieldIndex++
    ) {
      //find index of option
      let idxOfOption = -1;
      let isAllCheckboxesNull = true;
      if (srcFieldType == "checkbox") {
        srcFieldOptions.forEach((op, i) => {
          if (this.dynamicForm.value[srcFieldName][i] == true)
            isAllCheckboxesNull = false;
        });
      }

      //if src type  is checkbox then we have to check value for respected option
      if (srcFieldType == "checkbox") {
        idxOfOption = srcFieldOptions.findIndex(
          (e) => e == dependencyField[dFieldIndex]
        );

        //if checkbox is true for srcField || dependency is null and all checkboxes are false
        if (
          this.dynamicForm.value[srcFieldName][idxOfOption] == true ||
          (dependencyField[dFieldIndex] == "Null" && isAllCheckboxesNull)
        ) {
          this.updateOptionsList(field, dependencyObj);
          field.isDependencyHit = true;
          return;
        } else if (dependencyObj.showUndependent && !field.isDependencyHit) {
          this.updateOptionsListOnDependencyCheckFail(field, dependencyObj);
        } else {
          if (!field.isDependencyHit) {
            if (field.type == "status") {
              field.statusOptions = [];
            } else {
              field.options = [];
            }
            this.setFormValueNull(field);
          }
        }
      }
      //for recordType only
      else if (srcFieldType == "recordType") {
        //if current recordType is equal to dependency's field value || for record type null condition
        if (
          this.recordType == dependencyField[dFieldIndex] ||
          (dependencyField[dFieldIndex] == "Null" &&
            !this.dynamicForm.value[srcFieldName])
        ) {
          this.updateOptionsList(field, dependencyObj);
          field.isDependencyHit = true;
          return;
        } else if (dependencyObj.showUndependent && !field.isDependencyHit) {
          this.updateOptionsListOnDependencyCheckFail(field, dependencyObj);
        } else {
          if (!field.isDependencyHit) {
            if (field.type == "status") {
              field.statusOptions = [];
            } else {
              field.options = [];
            }
            this.setFormValueNull(field);
          }
        }
      } else if (srcFieldType == "lookup") {
        if (
          dependencyField[dFieldIndex] == "Null" &&
          ((field.type == "checkbox" &&
            field.type == "checkbox" &&
            isAllCheckboxesNull) ||
            !this.lookupValue[srcFieldName].length)
        ) {
          this.updateOptionsList(field, dependencyObj);
          field.isDependencyHit = true;
          return;
        } else if (
          dependencyField[dFieldIndex] == "Not Null" &&
          ((field.type == "checkbox" &&
            field.type == "checkbox" &&
            !isAllCheckboxesNull) ||
            this.lookupValue[srcFieldName].length)
        ) {
          this.updateOptionsList(field, dependencyObj);
          field.isDependencyHit = true;
          return;
        } else if (dependencyObj.showUndependent && !field.isDependencyHit) {
          this.updateOptionsListOnDependencyCheckFail(field, dependencyObj);
        } else {
          if (!field.isDependencyHit) {
            if (field.type == "status") {
              field.statusOptions = [];
            } else {
              field.options = [];
            }
            this.setFormValueNull(field);
          }
        }
      }

      //if src type isnot checkbox then we have to check options directly
      else if (srcFieldType != "checkbox") {
        //if value is equal to srcField-value || dependency is null and src-field-value is null
        if (
          this.dynamicForm.value[srcFieldName] ==
          dependencyField[dFieldIndex] ||
          (dependencyField[dFieldIndex] == "Null" &&
            !this.dynamicForm.value[srcFieldName])
        ) {
          this.updateOptionsList(field, dependencyObj);
          field.isDependencyHit = true;
          return;
        } else if (dependencyObj.showUndependent && !field.isDependencyHit) {
          this.updateOptionsListOnDependencyCheckFail(field, dependencyObj);
        } else {
          if (!field.isDependencyHit) {
            if (field.type == "status") {
              field.statusOptions = [];
            } else {
              field.options = [];
            }
            this.setFormValueNull(field);
          }
        }
      }
    }
  }

  updateOptionsList(field, dependencyObj) {
    if (field.type == "status") {
      field.statusOptions = [...field.temOptions];
      let temp = [];
      dependencyObj.query[field.name].forEach((element) => {
        if (field.temOptions && field.temOptions.length) {
          let index = field.temOptions.findIndex((f) => f.status == element);
          if (index > -1) {
            temp.push(field.temOptions[index]);
          }
        }
      });
      field.statusOptions = [...temp];
    } else {
      field.options = [...dependencyObj.query[field.name]];
    }

    //if old value of field is available in option..
    let isOldValueAvailable = false;
    if (field.type == "status") {
      let oldValueOption = field.statusOptions.filter(
        (f) => f.status == field.oldValue
      );
      if (oldValueOption.length) {
        isOldValueAvailable = true;
        this.colorSetter[field.name] = oldValueOption[0].color;
        this.statuses[field.name] = oldValueOption[0].status;
        this.dynamicForm.value[field.name] = oldValueOption[0].status;
      }
    } else {
      let oldValueOption = field.options.filter((f) => f == field.oldValue);
      if (oldValueOption.length) {
        isOldValueAvailable = true;
        this.dynamicForm.value[field.name] = field.oldValue;
      }
    }

    //make value of field null if not in the options.
    if (!isOldValueAvailable) {
      if (field.type == "status" && this.dynamicForm.value[field.name]) {
        let index = field.statusOptions.findIndex(
          (f) => f.status == this.dynamicForm.value[field.name]
        );
        if (index == -1) {
          this.colorSetter[field.name] = "#fff";
          this.statuses[field.name] = "STATUS";
          this.dynamicForm.value[field.name] = "";
        }
      } else if (field.type == "checkbox") {
        if (field.temOptions && field.temOptions.length) {
          field.temOptions.forEach((element, idx) => {
            let idx1 = dependencyObj.query[field.name].findIndex(
              (f) => f == element
            );
            if (idx1 == -1) {
              if (this.dynamicForm.value[field.name][idx]) {
                this.dynamicForm.value[field.name][idx] = false;
              }
            }
          });
        }
      }
    }
  }

  updateOptionsListOnDependencyCheckFail(field, dependencyObj) {
    if (field.type == "status") {
      field.statusOptions = [...field.tempOptions];
      field.statusOptions.forEach((opt) => {
        let optionInQuery = dependencyObj.query[field.name].indexOf((itm) => {
          opt === itm;
        });
        if (optionInQuery > -1) {
          field.statusOptions.splice(optionInQuery, 1);
        }
      });
    } else {
      field.options = [...field.tempOptions];
      if (field.options) {
        field.options.forEach((opt) => {
          let optionInQuery = dependencyObj.query[field.name].indexOf((itm) => {
            opt === itm;
          });
          if (optionInQuery > -1) {
            field.options.splice(optionInQuery, 1);
          }
        });
      }
    }

    //make value of field null if not in the options.
    if ((field.type = "status" && this.dynamicForm.value[field.name])) {
      let index = field.statusOptions.findIndex(
        (f) => f.status == this.dynamicForm.value[field.name]
      );
      if (index == -1) {
        this.dynamicForm.value[field.name] = "";
        this.colorSetter[field.name] = "#fff";
        this.statuses[field.name] = "";
      }
    } else if (field.type == "checkbox") {
      if (field.temOptions && field.temOptions.length) {
        field.temoptions.forEach((element, idx) => {
          let idx1 = dependencyObj.query[field.name].findIndex(
            (f) => f == element
          );
          if (idx1 == -1) {
            if (this.dynamicForm.value[field.name][idx])
              this.dynamicForm.value[field.name][idx] = false;
          }
        });
      }
    }
  }

  setFormValueNull(field) {
    if (field && field.name) {
      if (field.type == "status") {
        this.dynamicForm.value[field.name] = "";
        this.dynamicForm.value[field.name] = "";
        this.colorSetter[field.name] = "#fff";
        this.statuses[field.name] = "";
      } else if (field.type != "checkbox") {
        this.dynamicForm.value[field.name] = null;
      } else {
        if (this.dynamicForm.value[field.name].length) {
          this.dynamicForm.value[field.name].forEach((element) => {
            element = false;
          });
        }
      }
    }
  }

  evalExpressionForFormulaField() {
    for (let field of this.dynamicData) {
      if (field.type == "formula") {
        if (
          field.options &&
          field.options[0] &&
          field.options[0].formula &&
          field.options[0].alsoAFrontEndFormula
        ) {
          let $Table = this.dynamicForm.value;

          try {
            if ($Table && field && field.name && field.options && field.options[0].formula) {
              this.dynamicForm
                .get(field.name)
                .setValue(eval(field.options[0].formula));
            }
          } catch (e) {
            console.log('Error processing formula ', e)
          }
        }
      }
    }
  }

  ngAfterViewInit() {
    this.tableService.dateTimePickerFocused.subscribe((res) => {
      setTimeout((_) => (this.dateTimePickerToggeledOn = res));
    });
    if (this.editform) {
      this.loadSubscribers();
    }
  }

  ngAfterContentChecked() {
    this.changeDetector.detectChanges();
  }

  loadSubscribers() {
    this.chatSubscriptionService
      .getSubscribers(this.Data._id).pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res.data) {
          this.subscribers = res.data;
          if (res.data.length > 0) {
            res.data.map((data) => {
              if (data._id == this.currentUser._id) {
                this.subscriptionText = "Stop watching";
                this.isSelfSubscribed = true;
              }
            });
          }
          this.changeDetector.detectChanges();
        }
      });
  }

  setDependenciesList() {
    if (this.dynamicData.length > 0) {
      const dependencies = this.dynamicData.filter(
        (f) => f.dependencies != undefined
      );
      dependencies.forEach((element) => {
        element.dependencies.forEach((e) => {
          this.dependenciesList.push({
            fields: e.fields,
            query: e.query,
            srcFieldName: element.name,
            showUndependent: element.showUndependentOptions,
            srcFieldType: element.type,
            srcFieldOptions: element.statusOptions
              ? element.statusOptions
              : element.options,
          });
        });
      });
      this.dynamicData.forEach((element) => {
        if (
          element.type == "radio" ||
          element.type == "checkbox" ||
          element.type == "recordType" ||
          element.type == "dropdown" ||
          element.type == "dropdownWithImage" ||
          element.type == "lookup"
        ) {
          if (element.options) element.temOptions = [...element.options];
        } else if (element.type == "status") {
          if (element.options) element.temOptions = [...element.statusOptions];
        }
      });
    }
  }

  loadTutorial() {
    const query = `tutorialFor=Field&tableName=${this.tableName}`;
    this.tableService.getTutorials(query).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      if (res.data) {
        this.tutorials = res.data;
      }
    });
  }

  scrollToBottom(delayTime) {
    setTimeout(() => {
      const natEle = this.scrollable["scrollable"].nativeElement;
      natEle.scrollTop = natEle.scrollHeight;
    }, delayTime);
  }

  setDynamicData(dynamicData) {
    if (dynamicData) {
      dynamicData.forEach((data, index) => {
        if (data.type === "checkbox") {
          const check = [];
          data.options.forEach((option) => check.push(new FormControl(false)));
          this.refUserFields[data.name] = new FormArray(check);
        } else if (data.type === "lookup") {
          this.refIsInputDisable = false;
          this.refremoveLookup[data.name] = true;
          this.reflookTable = data.lookupTableName;
          this.reflookupName = data.name;
          this.refLookupValue[data.name] = "";
          this.refeditData[data.name] = "";
          this.reffilteredOptions[data.name] = [];
          this.refshowAutocomplete[data.name] = false;
          this.reflookupFieldRequired[data.name] = false;

          const lookUpArray = [];
          data.options.forEach((el) => {
            const temp: [] = Object.assign([], el);
            temp.shift();
            this.reffilteredOptions[data.name].push({
              id: el[0],
              value: temp.toString().replace(/,/g, " "),
            });

            if (data.name == this.refLookUpName) {
              lookUpArray.push({
                id: el[0],
                value: temp.toString().replace(/,/g, " "),
              });
            }
          });
          this.lookUpOptions = lookUpArray;

          this.refDemoData = data;
          this.refLookupData.push(this.refDemoData);
        } else if (data.type === "status") {
          data.isRequired = false;
        } else {
          // tslint:disable-next-line: max-line-length
          this.refUserFields[data.name] = [
            "",
            data.isRequired ? [Validators.required] : [],
          ];
        }

        this.refShow[data.name] = true;
        if (
          data.isVisibilityOn &&
          data.fieldValuesData &&
          data.fieldValuesData.length > 0
        ) {
          this.refVisibilityData = this.refDynamicData
            .filter((col) => col._id === data.visibilityData)
            .map((col) => col.name);
          this.refVisibilityData = this.refVisibilityData[0];
          this.refDependsFields.push(data);
          this.refShow[data.name] = this.refRecordType
            ? !!data.fieldValuesData.includes(this.refRecordType)
            : false;
          if (data.isRequired) {
            data.isRequired = this.refRecordType
              ? !!data.fieldValuesData.includes(this.refRecordType)
              : false;
          }
        }
      });
      this.refDynamicForm = this.formBuilder.group(this.refUserFields);
    }
    if (this.refLookUpNameId && this.refparentTableName) {
      const lookupDetail = this.refDynamicData.find(
        (x) => x.lookupTableName == this.refparentTableName
      );
      let lookupDetailToDisplay = [];
      lookupDetail.options.forEach((e) => {
        e.forEach((e1) => {
          if (e1 == this.refLookUpNameId) {
            lookupDetailToDisplay = e;
          }
        });
      });
      const lookup = {
        id: lookupDetailToDisplay[0],
        value: lookupDetailToDisplay[1],
        name: lookupDetailToDisplay[2],
      };
      this.refEditData[lookupDetail.name] = lookup;
      this.refLookupValue[lookupDetail.name] = lookup;
      this.refEditData[lookupDetail.name].name = this.refparentTableName;
    }
  }

  getTableByName() {
    this.refTableName = this.subField.lookupTableName;

    if (this.getTableByNameObjectForData[this.refTableName]) {
      let resData = this.getTableByNameObjectForData[this.refTableName];
      this.refDynamicFilterData = resData[0].columns;
      if (this.refDynamicFilterData) {
        for (const data of this.refDynamicFilterData) {
          if (data.type === "lookup") {
            this.isInputDisable = false;
            this.reflookTable = data.lookupTableName;
            this.reflookupName = data.name;
            this.refLookupValue[data.name] = "";
            this.reffilteredOptions[data.name] = [];
            this.refshowAutocomplete[data.name] = false;

            data.options.forEach((el) => {
              const temp: [] = Object.assign([], el);
              temp.shift();
              this.reffilteredOptions[data.name].push({
                id: el[0],
                value: temp.toString().replace(/,/g, " "),
              });
            });
            this.refDemoData = data;
            this.refLookupData.push(this.refDemoData);
          }
        }
      }
      if (resData[0].columns && resData[0].columns.length) {
        this.reftableId = resData[0]._id;
        this.tempParentTableHeader = Object.assign([], resData[0].columns);
        this.tempParentTableHeader.map((column) => {
          if (column.type == "recordType") {
            this.refRecordTypeFieldName = column.name;
            column.options.forEach((element) => {
              const obj = {
                title: element,
              };
              this.refRecordTypes.push(obj);
            });
          }
        });
      }
      this.refDynamicData = this.tempParentTableHeader;
      //this.openSubForm(this.subField, this.setFieldIndex);
    }
    else {
      this.tableService
        .getTableByName(this.refTableName).pipe(takeUntil(this.destroy$))
        .subscribe((res: any) => {
          if (res && res.data && res.data[0].columns) {
            this.getTableByNameObjectForData[this.reftableData] = res.data;
            this.refDynamicFilterData = res.data[0].columns;
            if (this.refDynamicFilterData) {
              for (const data of this.refDynamicFilterData) {
                if (data.type === "lookup") {
                  this.isInputDisable = false;
                  this.reflookTable = data.lookupTableName;
                  this.reflookupName = data.name;
                  this.refLookupValue[data.name] = "";
                  this.reffilteredOptions[data.name] = [];
                  this.refshowAutocomplete[data.name] = false;

                  data.options.forEach((el) => {
                    const temp: [] = Object.assign([], el);
                    temp.shift();
                    this.reffilteredOptions[data.name].push({
                      id: el[0],
                      value: temp.toString().replace(/,/g, " "),
                    });
                  });
                  this.refDemoData = data;
                  this.refLookupData.push(this.refDemoData);
                }
              }
            }
            if (res.data[0].columns && res.data[0].columns.length) {
              this.reftableId = res.data[0]._id;
              this.tempParentTableHeader = Object.assign([], res.data[0].columns);
              this.tempParentTableHeader.map((column) => {
                if (column.type == "recordType") {
                  this.refRecordTypeFieldName = column.name;
                  column.options.forEach((element) => {
                    const obj = {
                      title: element,
                    };
                    this.refRecordTypes.push(obj);
                  });
                }
              });
            }
            this.refDynamicData = this.tempParentTableHeader;
            this.openSubForm(this.subField, this.setFieldIndex);
          }
        });
    }

  }

  openSubForm(field, fieldIndex) {
    this.loading = false;
    this.dialogService
      .open(DynamicFormDialogNewDesignComponent, {
        closeOnEsc: false,
        context: {
          title: this.reftitle,
          form: this.tempParentTableHeader,
          button: { text: "Save" },
          tableName: this.refTableName,
          Data: null,
          recordType: this.refRecordType,
          recordTypeFieldName: this.refRecordTypeFieldName,
          action: "Add",
          // mainTableData: this.tableData,
          mapField: field.mappedFields,
          values: this.mappedKeysValues,
          optionRecordType: this.finalRecordTypes,
          recordTypeFlagFromAddNew: true,
        },
      })

      .onClose.subscribe((res) => {
        this.isSubForm = false;
        let optionValue: string = "";
        if (res && res.close == "yes") {
          const name = res.data;
          if (name._id) {
            const option = [];
            option.push(name._id);
            if (
              field.lookupTableFieldNames &&
              field.lookupTableFieldNames.length
            ) {
              field.lookupTableFieldNames.forEach((lookupele) => {
                if (!!name[lookupele]) {
                  optionValue = optionValue + " " + name[lookupele];
                }
              });
              option.push(name[field.lookupTableFieldNames[0]]);
              option.push(name[field.lookupTableFieldNames[1]]);
            }

            if (field.loadAsDropDown) {
              this.refreshFilterVar = "";
              if (
                this.dynamicData[fieldIndex] &&
                this.dynamicData[fieldIndex].options &&
                this.dynamicData[fieldIndex].options.length
              ) {
                this.dynamicData[fieldIndex].options.push(option);
                this.dynamicData[fieldIndex].IdFieldValue.push(option);
              } else {
                this.dynamicData[fieldIndex].options = [];
                this.dynamicData[fieldIndex].IdFieldValue = [];
                this.dynamicData[fieldIndex].options.push(option);
                this.dynamicData[fieldIndex].IdFieldValue.push(option);
              }
              this.filteredOptions[this.subField.name] = [
                ...this.filteredOptions[this.subField.name],
                { id: name._id, value: optionValue },
              ];
            } else {
              this.filteredOptions[this.subField.name] = [
                ...this.filteredOptions[this.subField.name],
                { id: name._id, value: optionValue },
              ];
            }
            this.lookupValue[this.subField.name] = [
              ...this.lookupValue[this.subField.name],
              {
                id: name._id,
                value: optionValue,
              },
            ];
            //this.filteredOptions[this.subField.name] = [...this.lookupValue[this.subField.name]];
            this.onSelectionChange(
              this.lookupValue[this.subField.name],
              this.subField
            );
          }
          // Call a Pipe to filter options.
          this.filteredOptions[this.subField.name] = this.filterPipe.transform(
            this.filteredOptions[this.subField.name],
            this.lookupValue[this.subField.name],
            ""
          );
        } else {
          this.lookupValue[this.subField.name] = [
            ...this.lookupValue[this.subField.name],
          ];
          this.editData[this.subField.name] = [
            ...this.editData[this.subField.name],
          ];
        }
      });
  }

  getFileName(filename) {
    filename = decodeURI(filename);
    return filename.match(/.*\/(.*)$/)[1];
  }

  getFileExtension(filename) {
    const ext = filename.split(".").pop();
    const obj = iconList.filter((row) => {
      if (row.type === ext) {
        return true;
      }
    });
    if (obj.length > 0) {
      return obj[0].icon;
    } else {
      return "fiv-cla fiv-icon-blank fiv-size-md";
    }
  }

  getOptionText(option) {
    if (option && option.value) return option.value;
  }

  listCity(dynamicForm) {
    const zip = dynamicForm.value.zip;
    const stateForm = dynamicForm.get("state");
    const cityForm = dynamicForm.get("city");
    if (stateForm) {
      stateForm.setValue("");
    }
    if (cityForm) {
      cityForm.setValue("");
    }
    if (zip && zip.length == 5) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.mapService.getLocations(zip).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
          if (res && res.results) {
            const data = res.results[zip][0];
            if (stateForm) {
              stateForm.setValue(data.state);
            }
            if (cityForm) {
              cityForm.setValue(data.city);
            }
          }
        });
      }, 800);
    }
  }

  setTinyMce($event) { }

  cancel() {
    console.log('close Action');
    this.ref.close({ close: "no" });
    this.ref.close();
  }

  close() {
    console.log('close Action');
    this.ref.close();
  }

  //-- Sub form code needs to be removed
  // lookuptableName,name,index,field
  addSubForm(field, fieldIndex) {
    this.loading = true;
    this.isSubForm = true;
    this.subField = field;
    this.setFieldIndex = fieldIndex;
    this.tableRecordType = this.subField.lookupTableName;
    this.refRecordType = this.service.singularize(
      this.subField.lookupTableName
    );
    let values = [];
    if (field.mappedFields) {
      values = Object.values(field.mappedFields);

      values.forEach(ele => {
        let typeCheck = this.dynamicData.filter(v => v.name == ele);
        if (typeCheck && typeCheck.length && typeCheck[0].type == "lookup") {
          this.mappedKeysValues[ele] = this.lookupValue[ele];
        }
        else {
          this.mappedKeysValues[ele] = this.dynamicForm.get(ele).value;
        }
      })
    }

    if (
      this.tableRecordTypes[this.subField.lookupTableName] &&
      this.tableRecordTypes[this.subField.lookupTableName].length
    ) {
      this.finalRecordTypes = this.tableRecordTypes[this.subField.lookupTableName];
      this.setSubForm(this.subField.lookupTableName);
    } else {
      this.setSubForm(this.subField.lookupTableName);
    }
  }

  setSubForm(formName) {
    this.loading = true;
    this.reftitle = "Add " + formName;
    this.getTableByName();
  }

  onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.isActive = true;
  }

  onDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.isActive = false;
  }

  onDrop(event: any, fieldName) {
    event.preventDefault();
    event.stopPropagation();
    this.droppedFiles = {};
    this.droppedFiles[fieldName] = [];
    for (let i = 0; i < event.dataTransfer.files.length; i++) {
      this.droppedFiles[fieldName].push(event.dataTransfer.files[i]);
    }
    this.onDroppedFile(this.droppedFiles[fieldName], fieldName);
    this.isActive = false;
  }

  onDroppedFile(droppedFiles, fieldName) {
    const formData = new FormData();
    !this.showArrayData && (this.showArrayData = {});
    this.showArrayData[fieldName] = droppedFiles;
    this.buttonDisable = false;
    if (this.droppedFiles && this.droppedFiles[fieldName]) {
      for (let i = 0; i < this.droppedFiles[fieldName].length; i++) {
        formData.append("file", this.droppedFiles[fieldName][i]);
      }
    }
    this.fileFormData = formData;
    this.uploadProgress = 0;
    if (
      this.showArrayData &&
      this.showArrayData[fieldName] &&
      this.showArrayData[fieldName].length > 0
    ) {
      // File upload in S3 API
      if (this.fileFormData) {
        this.tableService.formFileUpload(this.fileFormData).pipe(takeUntil(this.destroy$)).subscribe(
          (event) => {
            this.isUpload = true;
            switch (event.type) {
              case HttpEventType.Sent:
                break;
              case HttpEventType.ResponseHeader:
                break;
              case HttpEventType.UploadProgress:
                this.uploadProgress = Math.round(
                  (event.loaded / event.total) * 100
                );
                break;
              case HttpEventType.Response:
                setTimeout(() => {
                  this.uploadProgress = 0;
                }, 2000);
            }
            if (event instanceof HttpResponse) {
              if (event.body.statusCode === 201) {
                this.fileUploadS3Data = event.body.data;
                for (const d of this.dynamicData) {
                  if (this.Data) {
                    if (d.type === "file" && d.name === fieldName) {
                      if (!this.uploadedFiles) this.uploadedFiles = {};
                      if (!this.uploadedFiles[d.name])
                        this.uploadedFiles[d.name] = [];
                      this.uploadedFiles[d.name] = this.fileUploadS3Data;
                      this.Data[d.name] &&
                        this.Data[d.name].map((f) =>
                          this.uploadedFiles[d.name].push(f)
                        );
                    }
                  } else {
                    if (d.type === "file" && d.name === fieldName) {
                      if (!this.uploadedFiles) this.uploadedFiles = {};
                      if (!this.uploadedFiles[d.name])
                        this.uploadedFiles[d.name] = [];
                      this.fileUploadS3Data.map((files) => {
                        this.uploadedFiles[d.name].push(files);
                      });
                    }
                  }
                }
              }
            }
            this.buttonDisable = true;
          },
          (err) => {
            this.uploadProgress = 0;
          }
        );
      } else {
        this.uploadProgress = 0;
      }
    }
  }

  onSelectedFile(event: any, fieldName) {
    this.droppedFiles = {};
    this.buttonDisable = false;
    this.droppedFiles[fieldName] = [];
    for (let i = 0; i < event.target.files.length; i++) {
      this.droppedFiles[fieldName].push(event.target.files[i]);
    }
    this.onDroppedFile(this.droppedFiles[fieldName], fieldName);
  }
  optionsData = [];

  updatedVal(e, value) {
    if (e && e.length) {
      this.editData[value] = [];
      e.forEach((element) => {
        if (element && !element.$ngOptionLabel) {
          this.editData[value].push(element);
        }
      });
    }
    this.count++;
    this.checkData = false;
    if (e && e.length >= 0) {
      this.showAutocomplete[value] = true;
      this.checkData = true;
    } else {
      this.showAutocomplete[value] = false;
      this.checkData = false;
    }
  }

  compareFn(c11: any, c22: any): boolean {
    return c11 && c22 ? c11.id === c22.id : c11 === c22;
  }

  onSelectionChange(data1, field, index?) {

    let lookupfields = this.form.filter(f => f.type == "lookup");
    if (lookupfields && lookupfields.length) {
      lookupfields.forEach((element, i) => {
        if (element.isReference) {
          this.lookupArray.push(element);
        }
      });
    }

    if (this.lookupArray && this.lookupArray.length) {
      this.lookupArray.forEach(ele => {
        this.lookupTableName.push(ele.lookupTableName);
        this.otherDataKeys.push({ name: ele.name, value: ele.lookupTableFieldNames });
      });
    }
    let keys = Object.keys(field.mappedFields);
    if (keys && keys.length) {
      keys.forEach((ele) => {
        this.valueToMapInField = field.mappedFields[ele];
        let mappedFieldIndex = this.dynamicData.findIndex(
          (v) => v.name == this.valueToMapInField
        );
        if (mappedFieldIndex > -1) {
          if (this.dynamicData[mappedFieldIndex].type == "lookup" && this.dynamicData[mappedFieldIndex].isReference) {
            this.tableService.getDynamicTreeDataById(field.lookupTableName, data1[0].id).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
              if (res.data) {
                let refLookupIdFields = [];
                let refLookupField = this.lookupArray.filter(f => f.name == this.dynamicData[mappedFieldIndex].name);
                if (refLookupField && refLookupField.length) {
                  let refLookTable = refLookupField[0].lookupTableName;
                  let response = this.tableDataForForms.filter(ele => ele.tableName == refLookTable);
                  if (response && response.length) {
                    refLookupIdFields = response[0].columns.map(v => v.idField ? v.name : '');
                  }
                }
                let obj = {
                  name: '',
                  value: null,
                  lookupTableName: ''
                };
                obj.name = this.valueToMapInField;
                obj.value = [];
                obj.lookupTableName = refLookupField[0].lookupTableName;
                let valueObj = {
                  idField: [],
                  others: [],
                  id: null
                }
                let arrayForId = [];
                let arrForOther = [];
                let keys = Object.keys(res.data);
                let valueofOther = this.otherDataKeys.filter(valueELe => {
                  if (valueELe.name == this.valueToMapInField) {
                    return true;
                  }
                });
                if (keys) {
                  keys.forEach(element => {
                    if (refLookupIdFields.includes(element)) {
                      if (typeof (res.data[element]) !== 'object')
                        arrayForId.push(' ' + res.data[element]);
                    }
                    if (valueofOther && valueofOther.length) {
                      if (valueofOther[0].value.includes(element)) {
                        arrForOther.push(' ' + res.data[element]);
                      }
                    }
                  })
                }
                valueObj.id = data1[0].id;
                valueObj.idField.push(arrayForId);
                valueObj.others.push(arrForOther);
                obj.value.push(valueObj);
                let temp = [];
                temp.push(obj);
                let invalid = false;
                if (this.list && this.list.length) {

                  this.list.forEach(ele => {
                    if (ele.name == obj.name) {

                      if (!ele.value.includes(obj.value)) {
                        ele.value.push(valueObj);
                        invalid = true;
                        return;
                      }
                    }
                  })
                  if (!invalid) {
                    this.list.push(obj);
                  }
                } else {
                  this.list = temp;
                }
              }

            });
          } else {
            field.showOption = false;
            this.lookupValue[field.name] = [];
            this.arrayForLookup = [];
            if (index && !data1.length) {
              // Cancel clicked.
              this.removeText(field.name);
            } else {
              let name = field.name;
              if (data1 && !data1[0]) {
                let obj = data1;
                data1 = [];
                data1.push(obj);
              }
              data1.forEach((data, index) => {
                if (data && data.id) {
                  this.tableService
                    .getRelatedDataById(
                      field.lookupTableName,
                      field.lookupTableId,
                      data.id
                    ).pipe(takeUntil(this.destroy$))
                    .subscribe((res: any) => {
                      if (res.statusCode === 200) {
                        let listData = this.dynamicData.filter((item) => {
                          if (item.name == name) {
                            return true;
                          } else {
                            return false;
                          }
                        });

                        if (listData && listData.length && listData[0].mappedFields) {
                          let keys = Object.keys(listData[0].mappedFields);
                          if (keys) {
                            keys.forEach((ele) => {
                              this.valueToMapInField = listData[0].mappedFields[ele];
                              let mappedFieldIndex = this.dynamicData.findIndex(
                                (v) => v.name == this.valueToMapInField
                              );
                              if (mappedFieldIndex > -1) {
                                if (
                                  this.dynamicData[mappedFieldIndex].type == "lookup"
                                ) {
                                  if (res.data["lookup"] && res.data["lookup"].length) {
                                    let lookupList = res.data["lookup"].filter(
                                      (element) => element.lookupDataName == ele
                                    );
                                    if (lookupList && lookupList.length) {
                                      this.userFields[this.valueToMapInField] =
                                        lookupList[0].lookupId;
                                      let obj = {
                                        id: lookupList[0].lookupId,
                                        value: lookupList[0].lookupName,
                                      };
                                      if (
                                        this.filteredOptions[this.valueToMapInField] &&
                                        this.filteredOptions[this.valueToMapInField]
                                          .length
                                      ) {
                                        this.filteredOptions[
                                          this.valueToMapInField
                                        ].push(obj);
                                      } else {
                                        this.filteredOptions[
                                          this.valueToMapInField
                                        ] = [];
                                      }
                                      this.lookupValue[this.valueToMapInField] = [];
                                      this.editData[this.valueToMapInField][index] = {};
                                      this.lookupValue[this.valueToMapInField] = [
                                        ...this.lookupValue[this.valueToMapInField],
                                        {
                                          ...obj,
                                        },
                                      ];
                                      this.editData[this.valueToMapInField][index] = {
                                        ...obj,
                                      };
                                      this.editData[this.valueToMapInField][
                                        index
                                      ].name = obj.value;
                                      this.dynamicForm.patchValue({
                                        [this.valueToMapInField]:
                                          lookupList[0].lookupId,
                                      });
                                    }
                                  }
                                } else {
                                  if (res.data[ele] && res.data[ele] != "") {
                                    this.userFields[this.valueToMapInField] =
                                      res.data[ele];
                                    this.dynamicForm.patchValue({
                                      [this.valueToMapInField]: res.data[ele],
                                    });
                                  }
                                }
                              }

                              let visibilityFields = this.dynamicData.filter(item => item.isVisibilityOn == true);
                              visibilityFields.forEach(ele => {
                                if (
                                  ele.isVisibilityOn &&
                                  ele.fieldValuesData &&
                                  ele.fieldValuesData.length > 0
                                ) {
                                  this.visibilityData = this.dynamicData
                                    .filter((col) => col._id === ele.visibilityData)
                                    .map((col) => col.name);
                                  if (this.visibilityData && this.visibilityData.length) {
                                    this.visibilityData = this.visibilityData[0];
                                    this.dependsFields.push(ele);
                                    if (this.visibilityData == "taskType") {
                                      ele.fieldValuesData.forEach(item => {
                                        if (this.recordType == item) {
                                          this.show[ele.name] = true;
                                        }
                                        else {
                                          this.show[ele.name] = false;
                                        }
                                      });
                                    }
                                    else {
                                      ele.fieldValuesData.forEach(item => {

                                        let value = this.dynamicData.filter(val => {
                                          if (this.visibilityData == val.name)
                                            return true;
                                        })
                                        if (value && value.length) {
                                          if (value[0].type == "checkbox") {
                                            let index = value[0].options.findIndex(v => v == item);
                                            if (index > -1) {
                                              let arr = this.dynamicForm.get(this.visibilityData).value;
                                              arr.forEach((element, i) => {
                                                if (i == index) {
                                                  if (element == true) {
                                                    this.show[ele.name] = true;
                                                  }
                                                  else {
                                                    this.show[ele.name] = false;
                                                  }
                                                }
                                              });
                                            }
                                          }
                                          else {
                                            if (this.visibilityData && this.dynamicForm.get(this.visibilityData).value == item) {
                                              this.show[ele.name] = true;
                                            }
                                            else {
                                              this.show[ele.name] = false;
                                            }
                                          }
                                        }
                                      })
                                    }
                                  }
                                }
                              })
                            });
                          }
                        }
                        //show Error Message for Lookup
                        if (listData && listData[0] && listData[0].filters) {
                          listData[0].filters.forEach(element => {
                            if (element.showErrorMessage)
                              this.toastrService.warning(element.errorMessageForCheckBox, "LookUp");
                          });
                        }
                      }
                    });
                }

                if (data && data.id && data.value) {
                  if (!this.lookupObj[name]) {
                    this.lookupObj[name] = [];
                  }
                  this.lookupObj[name].push(data);
                  //this.lookupValue[name][index] = data.value;
                  this.isInputDisable = true;
                  this.removeLookup[name] = true;
                  for (const d of this.dynamicData) {
                    if (d.type === "lookup" && name === d.name) {
                      if (d.loadAsDropDown) {
                        const displayValue = d.options.filter(
                          (f) => f[0] === data.id
                        );
                        if (displayValue.length > 0) {
                          const temp: [] = Object.assign([], displayValue[0]);
                          temp.shift();
                          this.lookupValue[name] = [
                            ...this.lookupValue[name],
                            {
                              id: data.id,
                              value: temp.toString().replace(/,/g, " "),
                            },
                          ];
                        } else {
                          d.options.forEach((el) => {
                            if (data.id === el[0]) {
                              this.lookupValue[name] = [
                                ...this.lookupValue[name],
                                {
                                  id: data.id,
                                  value: el[1],
                                },
                              ];
                            }
                          });
                        }
                      } else {
                        if (
                          this.lookupValue[name].findIndex((f) => f.id == data.id) == -1
                        ) {
                          this.lookupValue[name] = [
                            ...this.lookupValue[name],
                            { id: data.id, value: data.value },
                          ];
                        }
                      }
                      this.editData[name] = this.editData[name].concat(
                        this.lookupValue[name]
                      );

                      // Filterout only unique values
                      this.editData[name] = this.editData[name].filter(
                        (ob, i, arr) => arr.findIndex((t) => t.id === ob.id) === i
                      );

                      // Filterout only unique values
                      this.lookupValue[name] = this.lookupValue[name].filter(
                        (ob, i, arr) => arr.findIndex((t) => t.id === ob.id) === i
                      );
                      this.lookupValue[name] = [...this.lookupValue[name]];

                      this.editData[name].forEach((element) => {
                        if (element.name) {
                          element.name = element.value;
                        }
                      });
                    }
                  }
                  this.lookupFieldRequired[name] = false;
                }
              });
              this.arrayForLookup = this.lookupValue[field.name];
            }
          }
        }
      });
    } else {
      field.showOption = false;
      this.lookupValue[field.name] = [];
      this.arrayForLookup = [];
      if (index && !data1.length) {
        // Cancel clicked.
        this.removeText(field.name);
      } else {
        let name = field.name;
        if (data1 && !data1[0]) {
          let obj = data1;
          data1 = [];
          data1.push(obj);
        }
        data1.forEach((data, index) => {
          if (data && data.id) {
            this.tableService
              .getRelatedDataById(
                field.lookupTableName,
                field.lookupTableId,
                data.id
              ).pipe(takeUntil(this.destroy$))
              .subscribe((res: any) => {
                if (res.statusCode === 200) {
                  let listData = this.dynamicData.filter((item) => {
                    if (item.name == name) {
                      return true;
                    } else {
                      return false;
                    }
                  });

                  if (listData && listData.length && listData[0].mappedFields) {
                    let keys = Object.keys(listData[0].mappedFields);
                    if (keys) {
                      keys.forEach((ele) => {
                        this.valueToMapInField = listData[0].mappedFields[ele];
                        let mappedFieldIndex = this.dynamicData.findIndex(
                          (v) => v.name == this.valueToMapInField
                        );
                        if (mappedFieldIndex > -1) {
                          if (
                            this.dynamicData[mappedFieldIndex].type == "lookup"
                          ) {
                            if (res.data["lookup"] && res.data["lookup"].length) {
                              let lookupList = res.data["lookup"].filter(
                                (element) => element.lookupDataName == ele
                              );
                              if (lookupList && lookupList.length) {
                                this.userFields[this.valueToMapInField] =
                                  lookupList[0].lookupId;
                                let obj = {
                                  id: lookupList[0].lookupId,
                                  value: lookupList[0].lookupName,
                                };
                                if (
                                  this.filteredOptions[this.valueToMapInField] &&
                                  this.filteredOptions[this.valueToMapInField]
                                    .length
                                ) {
                                  this.filteredOptions[
                                    this.valueToMapInField
                                  ].push(obj);
                                } else {
                                  this.filteredOptions[
                                    this.valueToMapInField
                                  ] = [];
                                }
                                this.lookupValue[this.valueToMapInField] = [];
                                this.editData[this.valueToMapInField][index] = {};
                                this.lookupValue[this.valueToMapInField] = [
                                  ...this.lookupValue[this.valueToMapInField],
                                  {
                                    ...obj,
                                  },
                                ];
                                this.editData[this.valueToMapInField][index] = {
                                  ...obj,
                                };
                                this.editData[this.valueToMapInField][
                                  index
                                ].name = obj.value;
                                this.dynamicForm.patchValue({
                                  [this.valueToMapInField]:
                                    lookupList[0].lookupId,
                                });
                              }
                            }
                          } else {
                            if (res.data[ele] && res.data[ele] != "") {
                              this.userFields[this.valueToMapInField] =
                                res.data[ele];
                              this.dynamicForm.patchValue({
                                [this.valueToMapInField]: res.data[ele],
                              });
                            }
                          }
                        }

                        let visibilityFields = this.dynamicData.filter(item => item.isVisibilityOn == true);
                        visibilityFields.forEach(ele => {
                          if (
                            ele.isVisibilityOn &&
                            ele.fieldValuesData &&
                            ele.fieldValuesData.length > 0
                          ) {
                            this.visibilityData = this.dynamicData
                              .filter((col) => col._id === ele.visibilityData)
                              .map((col) => col.name);
                            if (this.visibilityData && this.visibilityData.length) {
                              this.visibilityData = this.visibilityData[0];
                              this.dependsFields.push(ele);
                              if (this.visibilityData == "taskType") {
                                ele.fieldValuesData.forEach(item => {
                                  if (this.recordType == item) {
                                    this.show[ele.name] = true;
                                  }
                                  else {
                                    this.show[ele.name] = false;
                                  }
                                });
                              }
                              else {
                                ele.fieldValuesData.forEach(item => {

                                  let value = this.dynamicData.filter(val => {
                                    if (this.visibilityData == val.name)
                                      return true;
                                  })
                                  if (value && value.length) {
                                    if (value[0].type == "checkbox") {
                                      let index = value[0].options.findIndex(v => v == item);
                                      if (index > -1) {
                                        let arr = this.dynamicForm.get(this.visibilityData).value;
                                        arr.forEach((element, i) => {
                                          if (i == index) {
                                            if (element == true) {
                                              this.show[ele.name] = true;
                                            }
                                            else {
                                              this.show[ele.name] = false;
                                            }
                                          }
                                        });
                                      }
                                    }
                                    else {
                                      if (this.visibilityData && this.dynamicForm.get(this.visibilityData).value == item) {
                                        this.show[ele.name] = true;
                                      }
                                      else {
                                        this.show[ele.name] = false;
                                      }
                                    }
                                  }
                                })
                              }
                            }
                          }
                        })
                      });
                    }
                  }
                  //show Error Message for Lookup
                  if (listData && listData[0] && listData[0].filters) {
                    listData[0].filters.forEach(element => {
                      if (element.showErrorMessage)
                        this.toastrService.warning(element.errorMessageForCheckBox, "LookUp");
                    });
                  }
                }
              });
          }

          if (data && data.id && data.value) {
            if (!this.lookupObj[name]) {
              this.lookupObj[name] = [];
            }
            this.lookupObj[name].push(data);
            //this.lookupValue[name][index] = data.value;
            this.isInputDisable = true;
            this.removeLookup[name] = true;
            for (const d of this.dynamicData) {
              if (d.type === "lookup" && name === d.name) {
                if (d.loadAsDropDown) {
                  const displayValue = d.options.filter(
                    (f) => f[0] === data.id
                  );
                  if (displayValue.length > 0) {
                    const temp: [] = Object.assign([], displayValue[0]);
                    temp.shift();
                    this.lookupValue[name] = [
                      ...this.lookupValue[name],
                      {
                        id: data.id,
                        value: temp.toString().replace(/,/g, " "),
                      },
                    ];
                  } else {
                    d.options.forEach((el) => {
                      if (data.id === el[0]) {
                        this.lookupValue[name] = [
                          ...this.lookupValue[name],
                          {
                            id: data.id,
                            value: el[1],
                          },
                        ];
                      }
                    });
                  }
                } else {
                  if (
                    this.lookupValue[name].findIndex((f) => f.id == data.id) == -1
                  ) {
                    this.lookupValue[name] = [
                      ...this.lookupValue[name],
                      { id: data.id, value: data.value },
                    ];
                  }
                }
                this.editData[name] = this.editData[name].concat(
                  this.lookupValue[name]
                );

                // Filterout only unique values
                this.editData[name] = this.editData[name].filter(
                  (ob, i, arr) => arr.findIndex((t) => t.id === ob.id) === i
                );

                // Filterout only unique values
                this.lookupValue[name] = this.lookupValue[name].filter(
                  (ob, i, arr) => arr.findIndex((t) => t.id === ob.id) === i
                );
                this.lookupValue[name] = [...this.lookupValue[name]];

                this.editData[name].forEach((element) => {
                  if (element.name) {
                    element.name = element.value;
                  }
                });
              }
            }
            this.lookupFieldRequired[name] = false;
          }
        });
        this.arrayForLookup = this.lookupValue[field.name];
      }
    }


    this.dependenciesCheck();

    //Check if filter => call api for that field and set filtered opetions.
    this.dynamicData.forEach(element => {
      if (element.filters && element.filters.length) {
        let filter = [...element.filters];
        filter.forEach(f => {
          if (f.baseTableField === field.name) {
            this.dynamicSearchForLoadAsDropDown(element);
          }
        })
      }
    });
  }

  onDelete(event, fieldName) {
    // delete file from FileList
    if (this.uploadedFiles && this.uploadedFiles[fieldName]) {
      this.uploadedFiles[fieldName].splice(event, 1);
    }
  }

  removeText(value, isLoadAsDropDown?) {
    this.count++;
    this.lookupValue[value] = [];
    this.lookupObj[value] = [];
    this.isInputDisable = false;
    this.removeLookup[value] = false;
    if (isLoadAsDropDown) {
      this.filteredOptions[value] = [];
    }
    this.dependenciesCheck();
  }

  submit() {
    this.formSubmitted = true;
    try {
      let invalid = false;
      let tempCheck = this.dynamicData.filter(ele => {
        if (ele.type == "checkbox")
          return true;
      });
      if (tempCheck && tempCheck.length) {
        for (const item of tempCheck) {
          if (!this.dynamicForm.value[item.name].includes(true) && item.isRequired && this.show[item.name]) {
            this.toastrService.danger("", "Required Fields Are Missing");
            invalid = true;
            break;
          }
        }
        if (invalid)
          return;

      }

      let tempCheckForDataTime = this.dynamicData.filter(ele => {
        if (ele.type == "dateTime")
          return true;
      });
      if (tempCheckForDataTime && tempCheckForDataTime.length) {
        for (const item of tempCheckForDataTime) {
          if (this.dynamicForm.value[item.name] == "" && item.isRequired && this.show[item.name]) {
            this.dateTimeErrorFlag = true;
            this.toastrService.danger("Required Field is Missing", `${item.label} is Missing`);
            invalid = true;
            break;
          }
        }
        if (invalid)
          return;

      }

      let tempCheckForDate = this.dynamicData.filter(ele => {
        if (ele.type == "date")
          return true;
      });
      if (tempCheckForDate && tempCheckForDate.length) {
        for (const item of tempCheckForDate) {
          if ((this.dynamicForm.value[item.name] == "" || this.dynamicForm.value[item.name] == null) && item.isRequired && this.show[item.name]) {
            this.dateErrorFlag = true;
            this.toastrService.danger("Required Field is Missing", `${item.label} is Missing`);
            invalid = true;
            break;
          }
        }
        if (invalid)
          return;

      }


      if (this.dynamicForm.invalid) {
        for (const [key, value] of Object.entries(this.dynamicForm.controls)) {
          let dateVal = false;
          if (tempCheckForDate && tempCheckForDate.length) {
            tempCheckForDate.forEach(element => {
              if (element.name == key) {
                dateVal = true;
                return;
              }
            });
          }
          if (!dateVal) {
            if (value.invalid && this.show[key]) {
              this.toastrService.danger("", "Required Fields Are Missing");
              invalid = true;
              break;
            }
          }
        }
        if (invalid)
          return;
      }


      this.loading = true;

      if (
        this.recordType != null &&
        this.recordType != "" &&
        this.recordTypeFieldName
      ) {
        this.dynamicForm.value[this.recordTypeFieldName] = this.recordType;
      }

      if (this.recordType && this.recordTypeName) {
        this.dynamicForm.value[this.recordTypeName] = this.recordType;
      }

      if (this.taskStatus && !this.dynamicForm.value.status) {
        this.dynamicForm.value.status = this.taskStatus;
      }

      let total_files = 0,
        temp = {};
      for (const data of this.dynamicData) {
        if (
          data.type === "lookup" &&
          data.isRequired === true &&
          !this.lookupValue[data.name].length &&
          this.show[data.name]
        ) {
          this.lookupFieldRequired[data.name] = true;
          this.loading = false;
          this.tableData = [];
          this.toastrService.danger("Please select all fields");
          this.loading = false;
          return;
        } else if (
          data.type === "lookup" &&
          data.isRequired === true &&
          this.lookupValue[data.name].length
        ) {
          this.lookupFieldRequired[data.name] = false;
        }

        if (data.type === "lookup") {
          this.lookTable = data.lookupTableName;
          let temp = {};
          temp = this.dynamicForm.value;
          this.editData[data.name].forEach((element) => {
            if (element["id"]) {
              this.tableData.push({
                lookupTableName: this.lookTable,
                lookupId: element["id"],
                lookupName: data.name,
              });
            }
            if (!this.removeLookup[data.name]) {
              this.tableData.pop({
                lookupTableName: this.lookTable,
                lookupId: element["id"],
                lookupName: data.name,
              });
            }
          });



          temp["lookup"] = this.tableData;
        }
        if (
          data.type === "file" &&
          this.showArrayData &&
          this.showArrayData[data.name] &&
          this.showArrayData[data.name].length > 0 &&
          this.isUpload === true
        ) {
          //  check file upload exists or not
          total_files += this.showArrayData[data.name].length;
        }

        temp = this.dynamicForm.value;
        if (data.type === "file" && this.uploadedFiles) {
          temp[data.name] = this.uploadedFiles[data.name];
        }

        if (data.type === "time" && this.dynamicForm.value[data.name]) {
          const relatedDateField = this.dynamicData
            .filter((field) => field._id === data.relatedDate)
            .map((field) => field.name);
          if (relatedDateField && relatedDateField.length > 0) {
            const time = this.dynamicForm.value[data.name];
            const relatedDate = this.dynamicForm.value[relatedDateField[0]];
            const hours = time.split(":");
            const datetime = new Date(relatedDate);
            this.dynamicForm.value[relatedDateField[0]] = new Date(
              datetime.setHours(hours[0], hours[1], 0)
            );
          }
        }

        if (data.type === "number") {
          let fractionPoint = data.fraction;
          if (fractionPoint > 0) {
            temp[data.name] = Number(temp[data.name]).toFixed(fractionPoint);
          } else {
            if (!(Number(temp[data.name]) % 1 != 0)) {
              fractionPoint = 2;
              temp[data.name] = Number(temp[data.name]).toFixed(fractionPoint);
            }
          }
        }

        if (data.name === "activateDate" && !temp[data.name]) {
          temp[data.name] = moment(new Date()).format('YYYY-MM-DD');
        }

        if (data.type === "date" && temp[data.name]) {
          temp[data.name] = moment(temp[data.name]).format('YYYY-MM-DD');
        }
      }

      if (this.list && this.list.length) {
        this.list.forEach(element => {
          element.value.forEach(item => {

            this.tableData.push({
              lookupTableName: element.lookupTableName,
              lookupId: item.id,
              lookupName: element.name,
            });
          });
        });
      }

      temp["lookup"] = this.tableData;

      temp["subscribers"] = this.subscribers;
      this.loading = true;

      for (const data of this.dynamicData) {
        if (data.type === "checkbox") {
          // tslint:disable-next-line: max-line-length
          this.dynamicForm.value[data.name] = this.dynamicForm.value[data.name]
            .map((checked, i) => (checked ? data.options[i] : null))
            .filter((v) => v !== null)
            .join(",");
        }
      }

      //Remove rollup and formula fields..
      for (let key of Object.keys(temp)) {
        let isExists = this.dynamicData.filter(f => f.name == key && (f.type == 'rollUp' || f.type == 'formula' || f.type == 'injectSubForm'))
        if (isExists && isExists.length) {
          delete temp[key];
        }
      }

      if (this.Data == null || this.isForceSave) {
        if (this.isUpload === false) {
          this.dynamicForm.value.file = [];
          this.showArrayData = {};
        }
        if (this.isForceSave) {
          temp["file"] = this.Data.file;
        }
        let $Table = this.dynamicForm.value;
        let $Form = this.dynamicForm.value;
        let customValidateLogic = false;
        if (this.customValidations && this.customValidations.length) {
          this.customValidations.forEach(element => {
            if (!eval(element[0].jstextArea)) {
              customValidateLogic = true;
              this.toastrService.danger(element[0].errorMessage, "Custom Validate Error");
              temp = {};
              this.tableData = [];
              return;
            }
          });
        }

        if (!customValidateLogic) {
          this.tableService.saveDynamicFormData(temp, this.tableName).pipe(takeUntil(this.destroy$)).subscribe(
            (res: any) => {
              if (res.statusCode === 201) {

                let id = this.dynamicFormService.userLookupChangedWatchers(res.data);
                if (id && id.length) {
                  id.forEach(ele => {
                    this.activateSubscription(ele, res.data._id, false);
                  })
                }
                if (this.continueFlag) {
                  this.toastrService.success(res.message, "Success");
                  this.dynamicForm.reset();
                  const element = document.getElementById("main_body");
                  element.classList.remove("add-edit-client-form");
                  this.loading = false;
                  this.ref.close({ close: "yes", data: res.data, continue: this.continueFlag, fromRecordPage: this.fromRecordPage });
                }
                else {
                  if (this.actions && this.actions.length) {
                    this.actions.forEach(element => {
                      if (element.onSave == "yes") {
                        // this.tableService.onActionFire(element,this.form);
                        let obj = new DynamicTableViewComponent(this.chatSubscriptionService, this.route, this.dialogService, this.tableService, this.service, this.helperService, this.toastrService, this.nbMenuService, null, this.router, null, null, null, this.sidebarService, this.messageService);
                        obj.oldData = temp;
                        obj.newData = temp;
                        obj.onActionsClick('', element);
                      }
                    });
                  }
                  this.toastrService.success(res.message, "Success");
                  this.dynamicForm.reset();
                  const element = document.getElementById("main_body");
                  element.classList.remove("add-edit-client-form");
                  this.loading = false;
                  this.ref.close({ close: "yes", data: res.data });
                }

              } else {
                this.loading = false;
                this.toastrService.danger(res.message, "Error");
              }
            },
            (error) => {
              this.toastrService.danger(
                `${error.error && error.error.message}`,
                "Error"
              );
              this.loading = false;
            }
          );
        } else
          this.loading = false;

      } else {
        let $Form = this.dynamicForm.value;
        let $Table = this.Data;
        let customValidateLogic = false;
        if (this.customValidations && this.customValidations.length) {
          this.customValidations.forEach(element => {
            if (!eval(element[0].jstextArea)) {
              customValidateLogic = true;
              this.toastrService.danger(element[0].errorMessage, "Custom Validate Error");
              temp = {};
              this.tableData = [];
              return;
            }
          });
        }

        if (!customValidateLogic) {

          if (temp['phoneNumber']) {
            temp['phoneNumber'] = temp['phoneNumber'].replace(/-/ig, '').replace('(', '').replace(')', '');
          }

          this.tableService
            .updateDynamicFormData(this.Data._id, this.tableName, temp).pipe(takeUntil(this.destroy$))
            .subscribe(
              (res: any) => {
                if (res.statusCode === 200) {

                  let id = this.dynamicFormService.userLookupChangedWatchers(temp);
                  if (id && id.length) {
                    id.forEach(ele => {
                      this.activateSubscription(ele, this.Data._id, false);
                    })
                  }

                  if (this.continueFlag) {
                    this.toastrService.success(res.message, "Success");
                    this.dynamicForm.reset();
                    const element = document.getElementById("main_body");
                    element.classList.remove("add-edit-client-form");
                    this.loading = false;
                    this.ref.close({ close: "yes", data: temp, id: this.id, continue: this.continueFlag, fromRecordPage: this.fromRecordPage });
                  }
                  else {
                    if (this.actions && this.actions.length) {
                      this.actions.forEach(element => {
                        if (element.onSave == "yes") {
                          // this.tableService.onActionFire(element,this.form);
                          let obj = new DynamicTableViewComponent(this.chatSubscriptionService, this.route, this.dialogService, this.tableService, this.service, this.helperService, this.toastrService, this.nbMenuService, null, this.router, null, null, null, this.sidebarService, this.messageService);
                          obj.oldData = this.Data;
                          obj.newData = temp;
                          obj.onActionsClick('', element);
                        }
                      });
                    }
                    this.toastrService.success(res.message, "Success");
                    this.dynamicForm.reset();
                    const element = document.getElementById("main_body");
                    element.classList.remove("add-edit-client-form");
                    this.loading = false;
                    this.ref.close({ close: "yes", data: temp, id: this.id });
                  }

                } else {
                  this.loading = false;
                  this.toastrService.danger(res.message, "Error");
                }
              },
              (error) => {
                this.toastrService.danger(
                  `${error.error && error.error.message}`,
                  "Error"
                );
                this.loading = false;
              }
            );
        } else
          this.loading = false;

      }
    } catch (error) {
      this.loading = false;
    }
  }

  onMenuItemSelected(val) { }

  onDependentFieldChanged(event, fieldId, type, fieldName, section, index, field?) {
    let value,
      isChecked = true;
    if (type === "checkbox") {
      this.dynamicData.filter(ele => {
        if (ele.name == fieldName)
          ele.checkBoxValidateForDynamicForm = false;
        value = event.currentTarget.textContent.trim();
        isChecked = event.target.checked;
        if (!this.dynamicForm.value[fieldName].includes(true)) {
          ele.checkBoxValidateForDynamicForm = true;
        }
      });
    } else if (type === "dropdown") {
      value = event.value;
    } else if (type === "gadget") {
      value = event.name;
    } else if (type === "dropdownWithImage") {
      value = event;
    } else if (type === "recordType") {
      value = event.value;
    }
    else if (type === "radio") {
      value = event;
    }
    // this.dynamicForm.patchValue({ [fieldName]: value });
    if (field) {
      this.dynamicForm.value[fieldName] = field.oldValue;
    } else {
      this.dynamicForm.patchValue({ [fieldName]: value });
    }
    this.dependsFields.forEach((element) => {
      if (element.visibilityData === fieldId) {
        this.show[element.name] =
          isChecked &&
          element.fieldValuesData.length > 0 &&
          !!element.fieldValuesData.includes(value);

        if (section) {
          this.finalArrayForWithoutSection.forEach(item => {
            item.hide = true;
            for (const temp of item.data) {
              if (this.show[temp.name]) {
                item.hide = false;
                break;
              }
            }
          })
        } else {
          this.finalArrayForSection.forEach(item => {
            item.hide = true;
            for (const temp of item.data) {
              if (this.show[temp.name]) {
                item.hide = false;
                break;
              }
            }
          })
        }

        // this.finalArrayForWithoutSection[index].data.forEach(value => {
        //   if(value.name == element.name){
        //     if (section) {
        //       this.finalArrayForWithoutSection[index].hide = !this.show[element.name]
        //     }
        //     else {
        //       this.finalArrayForSection[index].hide = !this.show[element.name]
        //     }
        //   }
        // });

        this.cssFlagAfterVisibility = true;
      }
    });


    this.evalExpressionForFormulaField();
  }

  incrCountForCallingPipe() {
    this.count++;
  }


  onDone(status, field, index, section) {
    this.colorSetter[field.name] = status.color;
    if (section) {
      this.finalArrayForWithoutSection[index].backgColor = this.colorSetter[field.name];
      this.colorForRightPanel = this.colorSetter[field.name]
    }
    else {
      this.finalArrayForSection[index].backgColor = this.colorSetter[field.name];
      this.colorForRightPanel = this.colorSetter[field.name];
    }
    if (status.labelColor) {
      this.colorForFont = status.labelColor;
    }
    else {
      this.colorForFont = "";
    }
    this.statuses[field.name] = status.status;
    if (this.dynamicForm.get(field.name))
      this.dynamicForm.patchValue({ [field.name]: status.status });
    else if (this.newDynamicForm.get(field.name))
      this.newDynamicForm.patchValue({ [field.name]: status.status });

    this.dependsFields.forEach((element) => {
      if (element.visibilityData === field._id) {
        this.show[element.name] =
          element.fieldValuesData.length > 0 &&
          !!element.fieldValuesData.includes(status.status);

        // this.dynamicData.forEach(ele=>{
        //   if(ele.name == element.name){
        //     ele.isRequired = this.show[element.name];
        //   }
        // })
      }
    });

    this.evalExpressionForFormulaField();
  }

  dynamicSearch(e, field) {
    this.dropDownText[field.name] = "";
    this.loadingAPI = true;
    let filterKey;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (field.name === "dependentTask" && field.lookupTableName === "Tasks") {
        filterKey = [{ isSubtask: "No" }];
      } else {
        filterKey = 0;
      }
      if (!e.target.value) {
        this.filteredOptions[field.name] = [];
        this.loadingAPI = false;
        this.dropDownText[field.name] = "Type to search";
      } else {
        let lookupVal = this.lookupValue;
        let formDataObj = {};
        this.dynamicData.forEach(e => {
          if (e.type != 'injectSubForm' && e.type != 'lookup') {
            formDataObj[e.name] = this.dynamicForm.value[e.name];
          }
        })
        this.tableService
          .getDynamicTreeData(
            field.lookupTableName,
            1,
            e.target.value,
            0,
            filterKey,
            "",
            "",
            "",
            this.tableName,
            field.name,
            formDataObj,
            lookupVal
          ).pipe(takeUntil(this.destroy$))
          .subscribe((res: any) => {
            this.filteredOptions[field.name] = [];
            if (res && res.data && res.data.pageOfItems) {
              res.data.pageOfItems.forEach((data) => {
                let val = "";
                Object.keys(data).forEach((lookupele) => {
                  if (!!data[lookupele] && !this.unwantedFieldsInOptions.includes(lookupele)) {
                    val = val + " " + data[lookupele];
                  }
                });
                const obj = {
                  id: data._id,
                  value: val,
                };
                this.filteredOptions[field.name] = [
                  ...this.filteredOptions[field.name],
                  obj,
                ];
              });
              this.loadingAPI = false;
            }
            if (this.filteredOptions[field.name].length) {
              this.dropDownText[field.name] = "Type to search";
            } else {
              this.dropDownText[field.name] = "No record found";
            }
          });
      }
    }, 800);
  }

  dynamicSearchForLoadAsDropDown(field) {
    this.loadingAPI = true;
    let filterKey;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (field.name === "dependentTask" && field.lookupTableName === "Tasks") {
        filterKey = [{ isSubtask: "No" }];
      } else {
        filterKey = 0;
      }
      let lookupVal = this.lookupValue;
      let formDataObj = {};
      this.dynamicData.forEach(e => {
        if (e.type != 'injectSubForm' && e.type != 'lookup') {
          formDataObj[e.name] = this.dynamicForm.value[e.name];
        }
      })
      this.tableService
        .getDynamicTreeData(
          field.lookupTableName,
          1,
          "",
          0,
          filterKey,
          "",
          "",
          "",
          this.tableName,
          field.name,
          formDataObj,
          lookupVal
        ).pipe(takeUntil(this.destroy$))
        .subscribe((res: any) => {
          this.filteredOptions[field.name] = [];
          if (res && res.data && res.data.pageOfItems) {
            res.data.pageOfItems.forEach((data) => {
              let val = "";
              Object.keys(data).forEach((lookupele) => {
                if (!!data[lookupele] && !this.unwantedFieldsInOptions.includes(lookupele)) {
                  val = val + " " + data[lookupele];
                }
              });
              const obj = {
                id: data._id,
                value: val,
              };
              this.filteredOptions[field.name] = [
                ...this.filteredOptions[field.name],
                obj,
              ];
            });
            this.loadingAPI = false;
          }
          if (this.filteredOptions[field.name].length) {
            this.dropDownText[field.name] = "Type to search";
          } else {
            this.dropDownText[field.name] = "No record found";
          }
        });
    }, 800);
  }

  watcherMenuOpened() {
    this.isWatcherOpened = true;
  }

  watcherMenuClosed() {
    this.isWatcherOpened = false;
  }

  selfSubsription() {
    this.isSelfSubscribed = !this.isSelfSubscribed;
    if (this.isSelfSubscribed) {
      this.subscribers.push({
        _id: this.currentUser._id,
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
      });
      this.subscriptionText = "Stop watching";
      this.isSelfSubscribed = true;
      this.activateSubscription();
    } else {
      this.cancelSubscription(this.currentUser._id);
      this.subscriptionText = "Start watching";
      this.isSelfSubscribed = false;

    }
  }

  cancelSubscription(id) {
    const sub = this.subscribers.findIndex((s) => s._id == id);
    this.subscribers.splice(sub, 1);
    this.chatSubscriptionService.cancelSubscription(
      {
        resourceId: this.id,
        userId: id,
      }).pipe(takeUntil(this.destroy$)).subscribe(
        (data: any) => {
          if (data.statusCode == 200) {
            if (id == this.currentUser._id) {
              this.subscriptionText = "Start watching";
              this.isSelfSubscribed = false;
            }
            this.toastrService.success(data.message, 'Action was  completed!');
          }
        });
  }

  updateSubscribers(subscriber) {
    const checkAlreadyAdded = this.subscribers.findIndex(
      (s) => s._id == subscriber._id
    );
    if (checkAlreadyAdded == -1) {
      this.subscribers.push(subscriber);
      this.activateSubscription(subscriber._id);
    }
    this.subscribers.forEach((data) => {
      if (data._id == this.currentUser._id) {
        this.subscriptionText = "Stop watching";
        this.isSelfSubscribed = true;
      }
    });

  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    if (event.keyCode == 27) {

      if (this.editViewFlag) {
        const modalref = this.modalDialg.open(EscapeDialogComponent);

        modalref.result
          .then((result) => {
            if (result) {
              console.log('close 2 Action');
              this.ref.close();

            }
            this.modalDialg.dismissAll();
          })
          .catch((err) => { });
      }
    }

  }

  openLookupModalForDetail(val, field) {

    if (!field.allowMultipleValues) {
      this.loading = true;

      let index = this.lookupValue[field.name].findIndex(f => f.id == val.id)
      let data = this.tableDataForForms;
      data = data.filter(item => item.tableName == field.lookupTableName);
      let tableColumns = data[0]?.columns;
      let subFormLookupIdsForLookupView = data[0]?.subFormLookups;

      if (this.getTableByNameObjectForData[field.lookuptableName]) {
        let resData = this.getTableByNameObjectForData[field.lookuptableName];
        if (resData && resData[0] && resData[0].columns && resData[0].columns.length) {
          let tempParentTableHeaderForLookup = Object.assign([], resData[0].columns);
          let recordTypeFieldNameforlookup;
          let recordTypesForlookup = [];
          tempParentTableHeaderForLookup.map((column) => {

            if (column.type == 'recordType') {
              recordTypeFieldNameforlookup = column.name;
              column.options.forEach(element => {
                const obj = {
                  title: element,
                };
                recordTypesForlookup.push(obj);
              });
            }
          });
          let dataForDisplay;

          this.tableService
            .getRelatedDataById(
              field.lookupTableName,
              field.lookupTableId,
              val.id
            ).pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
              if (res.statusCode === 200) {
                if (res.data) {
                  dataForDisplay = res.data;
                  if (dataForDisplay) {


                    this.loading = false;
                    const ref = this.dialogService.open(LookupDetailDialogComponent, {
                      context: {
                        // data: {
                        fromFormFlag: true,
                        name: field.name,
                        subFormLookupIds: subFormLookupIdsForLookupView,
                        tempParentTableHeader: tempParentTableHeaderForLookup,
                        recordTypeFieldName: recordTypeFieldNameforlookup,
                        tableData: this.tableDataForForms,
                        tableRecordTypes: this.tableRecordTypes,
                        dataForLookupDetail: dataForDisplay,
                        tableName: field.lookupTableName,
                        tableIdFromForm: field.lookupTableId,
                        resourceIdForForm: val.id,
                        tableColumns: tableColumns,

                        // }
                      },
                    })
                      .onClose.subscribe(name => {

                        if (name && name.close == 'yes') {
                          // alert('great');
                          // this.ngOnInit();

                        }
                      });
                  }
                }


              }
            });

        }
      }
      else {
        this.tableService.getTableByName(field.lookupTableName).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {

          if (res && res.data && res.data[0] && res.data[0].columns && res.data[0].columns.length) {
            this.getTableByNameObjectForData[field.lookuptableName] = res.data;
            let tempParentTableHeaderForLookup = Object.assign([], res.data[0].columns);
            let recordTypeFieldNameforlookup;
            let recordTypesForlookup = [];
            tempParentTableHeaderForLookup.map((column) => {

              if (column.type == 'recordType') {
                recordTypeFieldNameforlookup = column.name;
                column.options.forEach(element => {
                  const obj = {
                    title: element,
                  };
                  recordTypesForlookup.push(obj);
                });
              }
            });
            let dataForDisplay;

            this.tableService
              .getRelatedDataById(
                field.lookupTableName,
                field.lookupTableId,
                val.id
              ).pipe(takeUntil(this.destroy$))
              .subscribe((res: any) => {
                if (res.statusCode === 200) {
                  if (res.data) {
                    dataForDisplay = res.data;
                    if (dataForDisplay) {


                      this.loading = false;
                      const ref = this.dialogService.open(LookupDetailDialogComponent, {
                        context: {
                          // data: {
                          fromFormFlag: true,
                          name: field.name,
                          subFormLookupIds: subFormLookupIdsForLookupView,
                          tempParentTableHeader: tempParentTableHeaderForLookup,
                          recordTypeFieldName: recordTypeFieldNameforlookup,
                          tableData: this.tableDataForForms,
                          tableRecordTypes: this.tableRecordTypes,
                          dataForLookupDetail: dataForDisplay,
                          tableName: field.lookupTableName,
                          tableIdFromForm: field.lookupTableId,
                          resourceIdForForm: val.id,
                          tableColumns: tableColumns,

                          // }
                        },
                      })
                        .onClose.subscribe(name => {

                          if (name && name.close == 'yes') {
                            // alert('great');
                            // this.ngOnInit();

                          }
                        });
                    }
                  }


                }
              });

          }
        });
      }
    }
  }


  removeSelected(val, field) {
    field.showOption = false;
    let index = this.lookupValue[field.name].findIndex(f => f.id == val.id)
    if (index > -1) {
      if (index == 0 && this.lookupValue[field.name].length == 1) {
        this.lookupValue[field.name] = [];
        this.editData[field.name] = [];
      }
      else {
        this.lookupValue[field.name].splice(index, 1);
        this.editData[field.name].splice(index, 1);
      }
      this.editData[field.name] = [...this.editData[field.name]];
      this.lookupValue[field.name] = [...this.lookupValue[field.name]];
    }

    field.showOption = true;
  }

  showColor(row, index) {
    let color = "";
    for (let element of row) {
      if (element.type == "status") {
        color = this.colorSetter[element.name];
        this.colorForRightPanel = color;
        return color;
      }
    }


  }

  setRowColorAt1stIndex(rowIndex) {
    let color = "";
    if (rowIndex == 0) {
      color = "white";
      return color;
    }
  }

  showFontColor(row, index) {
    let color = "";
    for (let element of row) {
      if (element.type == "status") {
        color = this.colorForFont;
        return color;
      }
    }
  }

  addRef(fieldName) {

    if (this.viewFlag) {
      this.viewFlag = false;
      this.editViewFlag = true;
    }

    const ref = this.dialogService.open(AddRefComponent, {
      context: {
        fieldsData: this.form,
        tableName: this.tableName,
        list: this.list,
        tableDataForForms: this.tableDataForForms,
      },
    })
      .onClose.subscribe(listval => {

        if (listval && listval.length) {
          this.list = listval;


          this.list.forEach(loop => {

            let listData = this.dynamicData.filter((item) => {
              if (item.name == loop.name) {
                return true;
              } else {
                return false;
              }
            });

            if (listData && listData.length && listData[0].mappedFields) {
              let keys = Object.keys(listData[0].mappedFields);
              if (keys) {
                keys.forEach((ele) => {
                  this.valueToMapInField = listData[0].mappedFields[ele];
                  let mappedFieldIndex = this.dynamicData.findIndex(
                    (v) => v.name == this.valueToMapInField
                  );
                  if (mappedFieldIndex > -1) {
                    if (
                      this.dynamicData[mappedFieldIndex].type == "lookup"
                    ) {
                      if (loop.value[0].val["lookup"] && loop.value[0].val["lookup"].length) {
                        let lookupList = loop.value[loop.value.length - 1].val["lookup"].filter(
                          (element) => element.lookupName == ele
                        );
                        if (lookupList && lookupList.length) {

                          this.tableService.getDynamicTreeDataById(lookupList[0].lookupTableName, lookupList[0].lookupId).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
                            if (res.data) {

                              this.userFields[this.valueToMapInField] =
                                lookupList[0].lookupId;
                              let obj = {
                                id: lookupList[0].lookupId,
                                value: res.data.name,
                              };
                              if (
                                this.filteredOptions[this.valueToMapInField] &&
                                this.filteredOptions[this.valueToMapInField]
                                  .length
                              ) {
                                this.filteredOptions[
                                  this.valueToMapInField
                                ].push(obj);
                              } else {
                                this.filteredOptions[
                                  this.valueToMapInField
                                ] = [];
                              }
                              this.lookupValue[this.valueToMapInField] = [];
                              // this.editData[this.valueToMapInField][index] = {};
                              this.lookupValue[this.valueToMapInField] = [
                                ...this.lookupValue[this.valueToMapInField],
                                {
                                  ...obj,
                                },
                              ];
                              // this.editData[this.valueToMapInField][index] = {
                              //   ...obj,
                              // };
                              // this.editData[this.valueToMapInField][
                              //   index
                              // ].name = obj.value;
                              this.dynamicForm.patchValue({
                                [this.valueToMapInField]:
                                  lookupList[0].lookupId,
                              });
                            }
                          });

                        }
                      }
                    } else {
                      if (loop.value[0].val[ele] && loop.value[0].val[ele] != "") {
                        this.userFields[this.valueToMapInField] =
                          loop.value[0].val[ele];
                        this.dynamicForm.patchValue({
                          [this.valueToMapInField]: loop.value[0].val[ele],
                        });
                      }
                    }
                  }

                  let visibilityFields = this.dynamicData.filter(item => item.isVisibilityOn == true);
                  visibilityFields.forEach(ele => {
                    if (
                      ele.isVisibilityOn &&
                      ele.fieldValuesData &&
                      ele.fieldValuesData.length > 0
                    ) {
                      this.visibilityData = this.dynamicData
                        .filter((col) => col._id === ele.visibilityData)
                        .map((col) => col.name);
                      if (this.visibilityData && this.visibilityData.length) {
                        this.visibilityData = this.visibilityData[0];
                        this.dependsFields.push(ele);
                        if (this.visibilityData == "taskType") {
                          ele.fieldValuesData.forEach(item => {
                            if (this.recordType == item) {
                              this.show[ele.name] = true;
                            }
                            else {
                              this.show[ele.name] = false;
                            }
                          });
                        }
                        else {
                          ele.fieldValuesData.forEach(item => {

                            let value = this.dynamicData.filter(val => {
                              if (this.visibilityData == val.name)
                                return true;
                            })
                            if (value && value.length) {
                              if (value[0].type == "checkbox") {
                                let index = value[0].options.findIndex(v => v == item);
                                if (index > -1) {
                                  let arr = this.dynamicForm.get(this.visibilityData).value;
                                  arr.forEach((element, i) => {
                                    if (i == index) {
                                      if (element == true) {
                                        this.show[ele.name] = true;
                                      }
                                      else {
                                        this.show[ele.name] = false;
                                      }
                                    }
                                  });
                                }
                              }
                              else {
                                if (this.visibilityData && this.dynamicForm.get(this.visibilityData).value == item) {
                                  this.show[ele.name] = true;
                                }
                                else {
                                  this.show[ele.name] = false;
                                }
                              }
                            }
                          })
                        }
                      }
                    }
                  })
                });
              }
            }
            //show Error Message for Lookup
            if (listData && listData[0] && listData[0].filters) {
              listData[0].filters.forEach(element => {
                if (element.showErrorMessage)
                  this.toastrService.warning(element.errorMessageForCheckBox, "LookUp");
              });
            }
          });



          this.changeDetector.detectChanges();
        }
      });
  }

  closeList(main, index, row) {

    if (row == 0 && main.length == 1) {
      main = [];
      if (index == 0 && this.list.length == 1) {
        this.list = [];
      }
      else {
        this.list.splice(index, 1);
      }
    }
    else {
      main.splice(row, 1);
    }
    this.changeDetector.detectChanges();
  }

  closeModal() {
    if (this.ref) {
      this.ref.close();
    }
  }

  changeToEditViewMode() {
    this.editViewFlag = true;
    this.viewFlag = false;
    this.addEditFlag = false;
    // this.ngOnInit();
    this.changeDetector.detectChanges();
  }

  backToView() {
    this.editViewFlag = false;
    this.viewFlag = true;
    this.addEditFlag = false;
    this.changeDetector.detectChanges();
  }

  openReminderModal() {

    let temp = [];
    this.recordData["IDField"].forEach((element, i) => {
      let IDElement = this.recordData["tableColumns"].filter(v => v.name == element)[0];
      if (IDElement.type == "date" || IDElement.type == "dateTime") {
        if (this.recordData[element] && typeof this.recordData[element] !== 'object') {
          let val = this.datePipe.transform(this.recordData[element], "M/d/yy")
          temp.push(' ' + val);
        }
      } else {
        if (this.recordData[element] && typeof this.recordData[element] !== 'object') {
          temp.push(' ' + this.recordData[element]);
        }
      }

    });
    this.dialogService.open(NewReminderModalComponent, {
      context: {
        tableId: this.tableId,
        tableName: this.tableName,
        resourceId: this.Data._id,
        IdFieldData: temp,
        fromViewPage: true,
        tableIcon: this.tableIcon
      },
      autoFocus: true,
    })
      .onClose.subscribe(res => {
        if (res) {

        }
      });
  }

  continueView() {
    this.continueFlag = true;
    this.submit();
  }

  userLookupChangedWatchers(temp: Object) {

    if (temp["lookup"]) {
      temp["lookup"].forEach(element => {
        if (element.lookupTableName == "Users") {
          this.activateSubscription(element.lookupId, temp["_id"], false);
        }
      });
    }
  }

  getSubscribers(val) {
    this.subscribers = val;
    if (val.length > 0) {
      val.map((data) => {
        if (data._id == this.currentUser._id) {
          this.subscriptionText = "Stop watching";
          this.isSelfSubscribed = true;
        }
      });
    }
    this.changeDetector.detectChanges();
  }
  activateSubscription(idForCreate?, resourceId?, showToaster = true) {
    const data = {
      resourceId: resourceId ? resourceId : this.Data?._id,
      userId: idForCreate ? idForCreate : this.currentUser._id,
      tableName: this.tableName,
      invitedBy: this.currentUser._id
    };
    this.loading = true;
    let res: any = this.dynamicFormService.activateSubscription(data);
    this.loading = false;
  }

  recordGadgetValue;
  gadgetFieldValue;
  //getting recordGadgets
  getRecordGadgets() {

    //let $Table = this.dynamicForm.value;
    let $Table = this.Data;
    if (this.recordGadgets && this.recordGadgets.length) {
      let activeGadget = this.recordGadgets.filter(v => v.active == true)[0];
      if (activeGadget)
        this.recordGadgetValue = eval(activeGadget.logic);

      let currentGadget = this.recordGadgets.filter(v => v.name == this.currentGadgetValue)[0];
      if (currentGadget)
        this.gadgetFieldValue = eval(currentGadget.logic);

      this.changeDetector.detectChanges();
    }

  }

  getStep(index, move = '') {

    if (index == 1 && move == 'Back') {
      return this.ref.close();
    }
    if (index == this.sections.length - 1) {
      this.showFooter = true;
    }
    else {
      this.showFooter = false;
    }

    if (index < this.sections.length) {
      this.sections[index].array.forEach(element => {
        element.data.forEach(item => {
          if (item.type == 'richTextArea') {
            setTimeout(() => {
              this.loadTinyMce = true;
            }, 1000)
          } else {
            this.loadTinyMce = false;
          }
        });
      });
    }

  }

  goBackToMode() {

    if (this.editViewFlag) {
      this.editViewFlag = false;
      this.viewFlag = true;
    }
    else if (this.addEditFlag && !this.viewFlag && !this.editViewFlag) {
      this.ref.close();
    }
  }

  openTaskForm() {
    let title: string;
    title = "Add New Task"

    if (this.subFormLookupIds && this.subFormLookupIds.length) {
      const ref = this.dialogService.open(DynamicFormDialogComponent, {
        closeOnEsc: false,
        context: {
          title: title,
          subFormLookupIds: this.subFormLookupIds,
          form: this.taskFormForm,
          button: { text: 'Save' },
          tableName: 'Tasks',
          Data: null,
          recordType: this.recordType,
          recordTypeFieldName: this.recordTypeFieldName,
          action: 'Add',
          tableRecordTypes: this.tableRecordTypes,
          tableDataForForms: this.tableDataForForms,
          actions: this.taskFormActions,
          customValidations: this.taskFormCustomValidations,
          tableId: this.taskTableId,
          parentTableName: this.singularTableName,
          parentTableData: this.Data,
          lookUpNameId: this.id,
        },
      }).onClose.subscribe(name => {
        if (name && name.close == 'yes') {
        }
      });
    } else {
      const ref = this.dialogService.open(DynamicFormDialogNewDesignComponent, {
        closeOnEsc: false,
        context: {
          title: title,
          subFormLookupIds: this.subFormLookupIds,
          form: this.taskFormForm,
          button: { text: 'Save' },
          tableName: 'Tasks',
          Data: null,
          recordType: this.taskRecordType,
          recordTypeFieldName: this.taskRecordTypeFieldName,
          action: 'Add',
          tableRecordTypes: this.tableRecordTypes,
          tableDataForForms: this.tableDataForForms,
          tableIcon: this.taskTableIcon,
          actions: this.taskFormActions,
          customValidations: this.taskFormCustomValidations,
          recordGadgets: this.taskFormRecordGadgets,
          showChats: this.showChats,
          tableId: this.taskTableId,
          formHeight: this.taskFormHeight,
          formWidth: this.taskFormWidth,
          fieldAlignment: this.taskFormFieldAllignment,
          parentTableName: this.singularTableName,
          parentTableData: this.Data,
          lookUpNameId: this.id,
          recordTypeFlagFromAddNew: true,
          optionRecordType: this.tableRecordTypes['Tasks']
        },
      }).onClose.subscribe(name => {
        if (name && name.close == 'yes') {

        }
      });
    }
  }
  taskRecordTypes = [];
  getRecordType(cols, tableName) {
    let findRecordType = cols.find(x => x.type == 'recordType');
    if (typeof findRecordType != 'undefined' && findRecordType != 'undefined' && findRecordType !== null) {
      const name = findRecordType.name;
      findRecordType = findRecordType.options;
      const recordArray = [];
      findRecordType && findRecordType.forEach(element => {
        const obj = {
          title: element,
          data: {
            menu: tableName,
            name: name,
          },
        };
        recordArray.push(obj);
        if (tableName == 'Tasks') {
          this.taskRecordTypes.push(obj);
        }
      });
      this.tableRecordTypes[tableName] = recordArray;
    }
  }
}
