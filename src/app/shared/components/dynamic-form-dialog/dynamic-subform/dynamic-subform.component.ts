import { DOCUMENT } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { iconList } from '@app/shared/iconData/iconList';
import { FilterPipe } from '@app/shared/pipes/filter.pipe';
import { ChatSubscriptionService } from '@app/shared/services/chat-subscription.service';
import { MapService } from '@app/shared/services/map.service';
import { TableService } from '@app/shared/services/table.service';
import { NbContextMenuDirective, NbDialogRef, NbDialogService, NbMenuService, NbToastrService } from '@nebular/theme';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgPluralizeService } from 'ng-pluralize';

import { DeleteDialogComponent } from '../../delete-dialog/delete-dialog.component';
import { LookupDetailDialogComponent } from '../../dialog/lookup-detail-dialog/lookup-detail-dialog.component';
import {
  DynamicFormDialogNewDesignComponent,
} from '../../dynamic-form-dialog-new-design/dynamic-form-dialog-new-design.component';
import { DynamicFormDialogComponent } from '../dynamic-form-dialog.component';

@Component({
  selector: "ngx-dynamic-subform",
  templateUrl: "./dynamic-subform.component.html",
  styleUrls: ["./dynamic-subform.component.scss"],
})
export class DynamicSubformComponent
  implements OnInit, AfterViewInit, AfterContentChecked {
  @Input() subFormFields: any;
  @Input() subFormName: any;
  @Input() formSubmitted: any;
  @Input() tableDataForForms;
  @Input() unwantedFieldsInOptions = [];
  public subFormMaster: any;
  public subFormArray = [];
  newDynamicForm: FormGroup;
  refDynamicForm: FormGroup;
  refsubFormFields: any;
  inputFields: string[] = ["password", "number", "text", "email", "currency"];
  userFields: any = {};
  clientFields = ["zip", "city", "state"];
  loading = false;
  loadingAPI = false;
  onSubFormAdd: boolean = false;
  options: string[];
  lookupValue = [];
  lookupObj = {};
  filteredOptions = [];
  finalRecordTypes = [];
  lookTable: any = [];
  lookupName: any;
  tableData: any = [];
  newTableData: any = [];
  showAutocomplete = [];
  lookupData: any = [];
  isActive: boolean;
  fileUploadS3Data: [];
  getTableByNameObjectForData = {};
  mappedKeysValues = {};

  demoData: [];
  fileFormData: any = [];
  showArrayData: {};
  @Input() droppedFiles: {};
  uploadProgress = 0;
  buttonDisable = true;
  noRecord = false;
  checkData = false;
  isUpload = false;
  isInputDisable = false;
  removeLookup = [];
  uploadedFiles: {};
  editData = [];
  editFileData = [];
  lookupFieldRequired = [];
  newTableName: any;
  valueToMapInField;
  @ViewChild("scrollable") scrollable: ElementRef;
  @Input() tableName: string;
  @Input() title: string;
  @Input() subFormLookupIds: any;
  @Input() button: { text: string };
  @Input() editFormData: any = {};
  Data: any;
  @Input() recordType: string;
  @Input() recordTypeFieldName: string;
  @Input() action: string;
  @ViewChild("autoInput") input;
  @Input() parentTableName: string;
  @Input() parentTableData: any;
  @Input() parentSourceId: string;
  @Input() recordTypeName: string;
  @ViewChild("formpicker") formpicker;
  @Input() isDraggedFromParent: boolean;
  @Input() lookUpNameId = "";
  @Input() lookUpName = "";
  @Input() mainTableData = [];
  @Input() parentLookupName = "";
  @Input() dueDate: Date;
  lookUpOptions = [];
  clientCityList = [];
  clientStateList = [];
  timeout;
  dependsFields = [];
  show = [];
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
  accessTableName: any;
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
  displayMenu: boolean = false;
  refLookUpName: any = "";
  reftableData: any = [];
  refTableName: string;
  mapFieldsArray: any = [];
  setFieldName: any;
  @Input() tableRecordTypes = [];
  @ViewChild(NbContextMenuDirective) contextMenu: NbContextMenuDirective;
  tableRecordType: any;
  setFieldIndex: any;
  isSubForm: boolean = false;
  showOption: boolean = true;
  subField: any;
  tutorials = [];
  statuses = [];

  deleteSubFormMsg = "";
  deletedRecordCount = 0;
  // -- Watch properties
  isWatcherOpened = false;
  subscriptionText = "Follow this task";
  subscribers = [];
  tableInfo = {};
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  watchers = [];
  isSelfSubscribed = false;
  firstTime = true;
  currentUser = null;
  newData = [];
  public dependenciesList: any = [];
  public count: number = 0;
  colorSetter = [];
  dateTimePickerToggeledOn = false;
  editform: boolean = false;
  tutorial = "Hello this is tutorial";
  combineDate;
  sections = [];
  withoutSectionData = [];
  subFormIndex = 0;
  subFormBuilderArray = [];
  @Output() subFormBuilder: EventEmitter<any> = new EventEmitter<any>();
  @Output() subFormData: EventEmitter<any> = new EventEmitter<any>();
  @Output() subFormLookupData: EventEmitter<any> = new EventEmitter<any>();
  @Input() subFormLookupName = "";
  public dropDownText = [];
  public refreshFilterVar = "";
  public showDelete: boolean = false;

  large = 4;
  medium = 3;
  small = 2;
  tiny = 1;
  sumForSize = 0;
  percentForSize;
  sizeObj = {
    large: 4,
    medium: 3,
    small: 2,
    tiny: 1
  }
  constructor(
    protected ref: NbDialogRef<DynamicFormDialogComponent>,
    private modalDialg: NgbModal,
    @Inject(DOCUMENT) private document: Document,
    private formBuilder: FormBuilder,
    private tableService: TableService,
    private service: NgPluralizeService,
    private mapService: MapService,
    private dialogService: NbDialogService,
    private changeDetector: ChangeDetectorRef,
    private chatSubscriptionService: ChatSubscriptionService,
    private filterPipe: FilterPipe,
    private nbMenuService: NbMenuService,
    private toastrService: NbToastrService
  ) { }

  ngOnInit(secondTime?) {
    // secondTime flag is to identify if onInit is getting called for the first time or not
    if (!secondTime) {
      this.subFormMaster = [...this.subFormFields];
      this.subFormMaster.forEach(element => {
        if (element.fieldSize)
          this.sumForSize = this.sumForSize + this.sizeObj[element.fieldSize];
      });
      this.percentForSize = 95 / this.sumForSize;
      this.subFormMaster = this.subFormMaster.map(element => {
        return {
          ...element,
          widthSize: (this.percentForSize * this.sizeObj[element.fieldSize]).toFixed(2) + '%'
        }
      })
      this.subFormArray.push({ fields: [...this.subFormMaster] });
    }
    const element = document.getElementById("main_body");
    element.classList.add("add-edit-client-form");

    // Set dependency list for 1 time only
    if (!secondTime) this.setDependenciesList();

    // Creating form builder & setting edit data in form fields for 1 time only.
    if (this.editFormData && this.editFormData.length && !secondTime) {
      for (const element of this.editFormData) {
        this.Data = element[this.subFormLookupName]
          ? element[this.subFormLookupName]
          : [];
        if (this.Data.length) break;
      }
      //if(!this.Data) this.Data = [];
      this.editform = true;
      let idx = 0;
      this.subFormArray = [];
      for (const form of this.Data) {
        this.subFormArray.push(this.subFormMaster);
        this.createFormGroup(this.subFormArray[idx], false, idx);
        idx++;
        this.subFormIndex++;
      }
      this.subFormIndex--;
    } else {
      this.createFormGroup(this.subFormMaster, secondTime);
      if (!this.Data) {
        let visibilityFields = this.subFormMaster.filter(item => item.isVisibilityOn == true);
        visibilityFields.forEach(ele => {
          if (
            ele.isVisibilityOn &&
            ele.fieldValuesData &&
            ele.fieldValuesData.length > 0
          ) {
            this.visibilityData = this.subFormMaster
              .filter((col) => col._id === ele.visibilityData)
              .map((col) => col.name);
            if (this.visibilityData && this.visibilityData.length) {
              this.visibilityData = this.visibilityData[0];
              this.dependsFields.push(ele);
              if (this.visibilityData == "taskType") {
                ele.fieldValuesData.forEach(item => {
                  if (this.recordType == item) {
                    this.show[this.subFormIndex][ele.name] = true;
                  }
                  else {
                    this.show[this.subFormIndex][ele.name] = false;
                  }
                });
              }
              else {
                ele.fieldValuesData.forEach(item => {
                  if (this.subFormBuilderArray[0].get(this.visibilityData).value == item) {
                    this.show[this.subFormIndex][ele.name] = true;
                  }
                  else {
                    this.show[this.subFormIndex][ele.name] = false;
                  }
                })
              }
            }

          }
        })

      }
    }

    if (this.isDraggedFromParent) {
      this.onDroppedFile(this.droppedFiles["file"], "file");
    }
    if (this.lookUpNameId && this.parentTableName) {
      let lookupDetail;
      if (this.parentLookupName) {
        lookupDetail = this.subFormFields.find(
          (x) =>
            x.lookupTableName == this.parentTableName &&
            x.name === this.parentLookupName
        );
      } else {
        lookupDetail = this.subFormFields.find(
          (x) => x.lookupTableName == this.parentTableName
        );
      }
      let lookupDetailToDisplay = [];
      if (lookupDetail && lookupDetail.options) {
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
        if (!this.editData[0]) {
          this.editData.push({});
        }
        if (!this.lookupValue[0]) {
          this.lookupValue.push({});
        }

        this.editData[0][lookupDetail.name].push(lookup[0]);
        this.lookupValue[0][lookupDetail.name].push(lookup[0]);
        this.editData[0][lookupDetail.name][
          this.editData[0][lookupDetail.name].length - 1
        ].name = this.parentTableName;
        this.onSelectionChange(lookup, lookupDetail, 0);
      }
    }

    if (!secondTime) this.loadTutorial();

    // Setting on form value change event for setting dependency and emitting value to parent
    this.subFormBuilderArray.forEach((e, idx) => {
      e.valueChanges.subscribe((x) => {
        this.count++;
        if (this.count > 999) this.count = 0;
        this.emitValuesToParent();
        this.dependenciesCheck();

        // To show delete button on 1st row
        this.showDelete = false;
        // Check in form first
        for (let [key, val] of Object.entries(this.subFormBuilderArray[0].value)) {
          if (val) {
            this.showDelete = true;
          }
        }
        // If 1st row is empty in form then check in lookup array
        if (!this.showDelete) {
          for (let [key, v] of Object.entries(this.lookupValue[0])) {
            let val = v as any;
            if (val.length) {
              this.showDelete = true;
            }
          }

        }
      });
    });

    const indices = this.subFormFields
      .map((e, k) => (e.type === "section" ? k : ""))
      .filter(String);
    let i = 0;
    this.subFormFields.forEach((data) => {
      if (data.type == "section") {
        this.sections[i] = this.subFormFields.slice(indices[i], indices[++i]);
      }
    });
    this.withoutSectionData = this.subFormFields.slice(0, indices[0]);

    // Setting initial dependency.
    this.dependenciesCheck();
    this.changeDetector.detectChanges();
  }

  // Creating form builder and set edit value if exist.
  createFormGroup(subFormMaster, secondTime, idx?) {
    if (this.subFormFields) {
      subFormMaster.forEach((data, index) => {
        data["showOption"] = false;
        if (this.Data && this.Data && this.Data[idx] && data.type === "file") {
          this.uploadedFiles = {};
          this.uploadedFiles[data.name] = [];
          this.uploadedFiles[data.name] = this.Data[idx][data.name];
        }

        if (data.type === "checkbox") {
          data["checkForValidationInSubForm"] = false;
          const check = [];
          if (this.Data && this.Data[idx]) {
            const checkedData = this.Data[idx][data.name]?.split(",");
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
          if (!this.dropDownText[idx ? idx : this.subFormIndex]) {
            this.dropDownText.push({});
          }
          this.dropDownText[idx ? idx : this.subFormIndex][data.name] =
            "Type to search";
          this.isInputDisable = false;
          if (!this.removeLookup[idx ? idx : this.subFormIndex]) {
            this.removeLookup.push({});
          }
          this.removeLookup[idx ? idx : this.subFormIndex][data.name] = true;
          this.lookTable = data.lookupTableName;
          this.lookupName = data.name;
          if (!this.lookupValue[idx ? idx : this.subFormIndex]) {
            this.lookupValue.push({});
          }
          this.lookupValue[idx ? idx : this.subFormIndex][data.name] = [];
          if (!this.editData[idx ? idx : this.subFormIndex]) {
            this.editData.push({});
          }
          this.editData[idx ? idx : this.subFormIndex][data.name] = [];
          if (!this.filteredOptions[idx ? idx : this.subFormIndex]) {
            this.filteredOptions.push({});
          }
          this.filteredOptions[idx ? idx : this.subFormIndex][data.name] = [];
          if (!this.showAutocomplete[idx ? idx : this.subFormIndex]) {
            this.showAutocomplete.push({});
          }
          this.showAutocomplete[idx ? idx : this.subFormIndex][
            data.name
          ] = false;
          this.lookupFieldRequired[data.name] = false;

          const lookUpArray = [];
          data.options.forEach((el) => {
            const temp: [] = Object.assign([], el);
            temp.shift();
            if (data.loadAsDropDown) {
              this.filteredOptions[idx ? idx : this.subFormIndex][
                data.name
              ].push({
                id: el[0],
                value: temp.toString().replace(/,/g, " "),
              });
            }

            if (data.name == this.lookUpName) {
              lookUpArray.push({
                id: el[0],
                value: temp.toString().replace(/,/g, " "),
              });
            }
          });

          if (this.editform && !data.loadAsDropDown) {
            this.filteredOptions[idx ? idx : this.subFormIndex][data.name] = [];
            if (this.Data[idx ? idx : this.subFormIndex]) {
              const lookups = this.Data[
                idx ? idx : this.subFormIndex
              ].lookup.filter(
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
                  if (lookUP[data.name]) {
                    if (!this.filteredOptions[idx ? idx : this.subFormIndex]) {
                      this.filteredOptions.push({});
                    }
                    this.filteredOptions[idx ? idx : this.subFormIndex][
                      data.name
                    ].push({
                      id: lookUP[data.name][0],
                      value: value,
                    });
                  }
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
            this.filteredOptions[idx ? idx : this.subFormIndex][
              data.name
            ].push({ ...tempFilteredOption });
            if (data.options) {
              data.options.push(tempOption);
            } else {
              data.options = [];
              data.options.push(tempOption);
            }
          }

          this.lookUpOptions = lookUpArray;
          this.demoData = data;
          if (!this.lookupData[idx ? idx : this.subFormIndex]) {
            this.lookupData[idx ? idx : this.subFormIndex] = [];
          }
          this.lookupData[idx ? idx : this.subFormIndex].push(this.demoData);

          if (
            this.Data &&
            this.Data[idx] &&
            this.Data[idx].lookup &&
            data.loadAsDropDown
          ) {
            this.Data[idx].lookup.forEach((el1) => {
              if (data.options) {
                data.options.forEach((element) => {
                  if (
                    this.Data[idx].lookup &&
                    data.name === el1.lookupName &&
                    element[0] === el1.lookupId
                  ) {
                    let displayValue = [];
                    if (data.IdFieldValue) {
                      displayValue = data.IdFieldValue.filter(
                        (f) => f[0] === el1.lookupId
                      );
                    }

                    if (displayValue.length > 0) {
                      const temp: [] = Object.assign([], displayValue[0]);
                      temp.shift();
                      this.lookupValue[idx ? idx : this.subFormIndex][
                        data.name
                      ] = [
                          ...this.lookupValue[idx ? idx : this.subFormIndex][
                          data.name
                          ],
                          {
                            id: el1.lookupId,
                            value: temp.toString().replace(/,/g, " "),
                          },
                        ];
                    } else {
                      if (element[0] === el1.lookupId) {
                        this.lookupValue[idx ? idx : this.subFormIndex][
                          data.name
                        ] = [
                            ...this.lookupValue[idx ? idx : this.subFormIndex][
                            data.name
                            ],
                            {
                              id: el1.lookupId,
                              value: element[1],
                            },
                          ];
                      }
                    }

                    this.editData[idx ? idx : this.subFormIndex][data.name] = [
                      ...this.editData[idx ? idx : this.subFormIndex][
                      data.name
                      ],
                      ...this.lookupValue[idx ? idx : this.subFormIndex][
                      data.name
                      ],
                    ];
                    this.editData[idx ? idx : this.subFormIndex][
                      data.name
                    ].forEach((element) => {
                      element.name = element.value;
                    });
                  }
                });
              }
            });
          } else if (this.editform && idx > -1) {
            if (
              this.filteredOptions[idx ? idx : this.subFormIndex][data.name]
                .length
            ) {
              this.lookupValue[idx ? idx : this.subFormIndex][data.name] = [
                ...this.lookupValue[idx ? idx : this.subFormIndex][data.name],
                ...this.filteredOptions[idx ? idx : this.subFormIndex][
                data.name
                ],
              ];
              this.editData[idx ? idx : this.subFormIndex][
                data.name
              ] = this.lookupValue[idx ? idx : this.subFormIndex][data.name];
              this.editData[idx ? idx : this.subFormIndex][data.name].forEach(
                (element) => {
                  element.name = element.value;
                }
              );
            }
          }
        } else if (data.type === "status") {
          this.userFields[data.name] = [
            this.Data
              ? this.Data[idx]
                ? this.Data[idx][data.name]
                  ? this.Data[idx][data.name]
                  : ""
                : ""
              : "",
            data.isRequired ? [Validators.required] : [],
          ];
          this.statuses.push({});
          this.colorSetter.push({});
          if (this.Data && this.Data[idx]) {
            if (data.statusOptions && Array.isArray(data.statusOptions)) {
              const i = data.statusOptions.find(
                (j) => j.status == this.Data[idx][data.name]
              );
              if (i) {
                this.colorSetter[idx][data.name] = i.color;
              }
            }
            this.statuses[idx][data.name] = this.Data[idx][data.name];
          }
        } else if (
          ((!this.editform ||
            (this.Data && this.Data[idx] && !this.Data[idx][data.name])) &&
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
            if (recordelement) {
              data.dateTimeOptions.forEach((element) => {
                if (
                  element.recordType.toLowerCase() == recordelement.toLowerCase()
                ) {
                  days = element.numberOfDays;
                  isRecordTypeMatchFlag = true;
                }
              });
            }

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

          // if (days) {
          //   date.setDate(date.getDate() + days);
          // }
          // if (!days) {
          //   setInitialDateFlag = false;
          // }
          if (this.Data && this.Data[idx] && this.Data[idx][data.name]) {
            let d = new Date(this.Data[data.name]);
            d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
            this.Data[data.name] = d;
          }
          this.userFields[data.name] = [
            this.Data
              ? this.Data[idx]
                ? this.Data[idx][data.name]
                : ""
              : setInitialDateFlag
                ? date
                : "",
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
            this.Data[idx] &&
            this.Data[idx][data.name] &&
            data.allowMultipleValues &&
            !Array.isArray(this.Data[idx][data.name])
          ) {
            this.Data[idx][data.name] = this.Data[idx][data.name].split();
          }
          this.userFields[data.name] = [
            this.Data
              ? this.Data[idx]
                ? this.Data[idx][data.name]
                : ""
              : data.defaultOptionValue
                ? data.defaultOptionValue
                : "",
            data.isRequired ? [Validators.required] : [],
          ];
        }else if (data.type === "dropdownWithImage") {
          if (
            this.Data &&
            this.Data[idx] &&
            this.Data[idx][data.name] &&
            data.allowMultipleValues &&
            !Array.isArray(this.Data[idx][data.name])
          ) {
            this.Data[idx][data.name] = this.Data[idx][data.name].split();
          }
          this.userFields[data.name] = [
            this.Data
              ? this.Data[idx]
                ? this.Data[idx][data.name]
                : ""
              : data.defaultOptionValue
                ? data.defaultOptionValue
                : "",
            data.isRequired ? [Validators.required] : [],
          ];
        }
        else if (data.type === "radio") {
          this.userFields[data.name] = [
            this.Data
              ? this.Data[idx]
                ? this.Data[idx][data.name]
                : ""
              : data.defaultOptionValue
                ? data.defaultOptionValue
                : "",
            data.isRequired ? [Validators.required] : [],
          ];
        } else if (data.type == 'autoNumber') {
          this.userFields[data.name] = [
            this.Data ? this.Data[idx] ? this.Data[idx][data.name] : '' : '',
            data.isRequired ? [Validators.required] : [],
          ];
        } else {
          // tslint:disable-next-line: max-line-length
          this.userFields[data.name] = [
            this.Data
              ? this.Data[idx]
                ? this.Data[idx][data.name]
                : data.type == "recordType"
                  ? undefined
                  : ""
              : data.type == "recordType"
                ? null
                : "",
            data.isRequired ? [Validators.required] : [],
          ];
          if (
            this.parentLookupName === "dependentTask" &&
            data.name === "isSubtask"
          ) {
            this.userFields[data.name] = "Yes";
          }
        }
        if (!this.show[this.subFormIndex]) {
          this.show.push({});
        }
        this.show[this.subFormIndex][data.name] = true;
        if (
          data.isVisibilityOn &&
          data.fieldValuesData &&
          data.fieldValuesData.length > 0
        ) {
          this.visibilityData = this.subFormFields
            .filter((col) => col._id === data.visibilityData)
            .map((col) => col.name);
          this.visibilityData = this.visibilityData[0];
          if (this.Data) {
            this.dependsFields.push(data);
            this.show[idx ? idx : this.subFormIndex][data.name] = this.Data[idx]
              ? !!data.fieldValuesData.includes(
                this.Data[idx][this.visibilityData]
              )
              : this.recordType
                ? data.fieldValuesData.includes(this.recordType)
                : false;
          } else {
            this.show[idx ? idx : this.subFormIndex][data.name] = this
              .recordType
              ? data.fieldValuesData.includes(this.recordType)
              : false;
          }

          // if (data.isRequired) {
          //   if (this.Data) {
          //     data.isRequired = this.Data[idx]
          //       ? !!data.fieldValuesData.includes(
          //         this.Data[idx][this.visibilityData]
          //       )
          //       : this.recordType
          //         ? !!data.fieldValuesData.includes(this.recordType)
          //         : false;
          //   } else {
          //     data.isRequired = this.recordType
          //       ? !!data.fieldValuesData.includes(this.recordType)
          //       : false;
          //   }
          // }
          if (
            data.name === "dependentTask" &&
            this.parentLookupName === "dependentTask"
          ) {
            this.show[idx ? idx : this.subFormIndex][data.name] = true;
          }
        }
      });

      if (secondTime) {
        Object.keys(this.userFields).forEach((element) => {
          if (
            this.subFormMaster.findIndex(
              (f) => f.name == element && f.type == "recordType"
            ) == -1
          ) {
            this.userFields[element][0] = "";
          }
        });
      } else {
        if (this.Data && this.Data[idx] && this.Data[idx]["_id"]) {
          this.userFields["_id"] = [];
          this.userFields["_id"].push(this.Data[idx]["_id"]);
          this.userFields["_id"].push([]);
        }
      }
      this.subFormBuilderArray.push(this.formBuilder.group(this.userFields));

      this.evalExpressionForFormulaField(idx ? idx : this.subFormIndex);

      this.emitValuesToParent();
    }
  }

  dependenciesCheck() {
    //check if dependency is there for current field..
    let idx = 0;
    if (this.subFormArray.length == this.subFormBuilderArray.length) {
      for (let form of this.subFormArray) {
        let fields = form["fields"] ? form["fields"] : form;
        for (let [i1, val] of Object.entries(fields)) {
          let item = val as any;
          item.isDependencyHit = false;
          item.oldValue = this.subFormBuilderArray[idx].value[item.name];
          this.dependenciesList.forEach((element) => {
            let keys = Object.keys(element.query);
            if (keys.indexOf(item.name) > -1) {
              if (!item.isDependencyHit) {
                let field = this.filtereAllOptions({ ...item }, element, idx);
                if (item.type == "status") {
                  fields[i1].statusOptions = field.statusOptions;
                } else {
                  fields[i1].options = field.options ? field.options : [];
                }
                fields[i1].isDependencyHit = field.isDependencyHit;
              }
            }
          });
        }
        idx++;
      }
    }
  }

  filtereAllOptions(field, dependencyObj, indexOfsubForm): any {
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
          if (
            this.subFormBuilderArray[indexOfsubForm].value[srcFieldName][i] ==
            true
          )
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
          this.subFormBuilderArray[indexOfsubForm].value[srcFieldName][
          idxOfOption
          ] == true ||
          (dependencyField[dFieldIndex] == "Null" && isAllCheckboxesNull)
        ) {
          field.isDependencyHit = true;
          return this.updateOptionsList(field, dependencyObj, indexOfsubForm);
        } else if (dependencyObj.showUndependent && !field.isDependencyHit) {
          field = this.updateOptionsListOnDependencyCheckFail(
            field,
            dependencyObj,
            indexOfsubForm
          );
        } else {
          if (!field.isDependencyHit) {
            if (field.type == "status") {
              field.statusOptions = [];
            } else {
              field.options = [];
            }
            field = this.setFormValueNull(field, indexOfsubForm);
          }
        }
      }
      //for recordType only
      else if (srcFieldType == "recordType") {
        //if current recordType is equal to dependency's field value || for record type null condition
        if (
          this.recordType == dependencyField[dFieldIndex] ||
          (dependencyField[dFieldIndex] == "Null" &&
            !this.subFormBuilderArray[indexOfsubForm].value[srcFieldName])
        ) {
          field.isDependencyHit = true;
          return this.updateOptionsList(field, dependencyObj, indexOfsubForm);
        } else if (dependencyObj.showUndependent && !field.isDependencyHit) {
          field = this.updateOptionsListOnDependencyCheckFail(
            field,
            dependencyObj,
            indexOfsubForm
          );
        } else {
          if (!field.isDependencyHit) {
            if (field.type == "status") {
              field.statusOptions = [];
            } else {
              field.options = [];
            }
            field = this.setFormValueNull(field, indexOfsubForm);
          }
        }
      } else if (srcFieldType == "lookup") {
        if (
          dependencyField[dFieldIndex] == "Null" &&
          ((field.type == "checkbox" &&
            field.type == "checkbox" &&
            isAllCheckboxesNull) ||
            !this.lookupValue[this.subFormIndex][srcFieldName].length)
        ) {
          field.isDependencyHit = true;
          return this.updateOptionsList(field, dependencyObj, indexOfsubForm);
        } else if (
          dependencyField[dFieldIndex] == "Not Null" &&
          ((field.type == "checkbox" &&
            field.type == "checkbox" &&
            !isAllCheckboxesNull) ||
            this.lookupValue[this.subFormIndex][srcFieldName].length)
        ) {
          field.isDependencyHit = true;
          return this.updateOptionsList(field, dependencyObj, indexOfsubForm);
        } else if (dependencyObj.showUndependent && !field.isDependencyHit) {
          field = this.updateOptionsListOnDependencyCheckFail(
            field,
            dependencyObj,
            indexOfsubForm
          );
        } else {
          if (!field.isDependencyHit) {
            if (field.type == "status") {
              field.statusOptions = [];
            } else {
              field.options = [];
            }
            field = this.setFormValueNull(field, indexOfsubForm);
          }
        }
      }

      //if src type isnot checkbox then we have to check options directly
      else if (srcFieldType != "checkbox") {
        //if value is equal to srcField-value || dependency is null and src-field-value is null
        if (
          this.subFormBuilderArray[indexOfsubForm].value[srcFieldName] ==
          dependencyField[dFieldIndex] ||
          (dependencyField[dFieldIndex] == "Null" &&
            !this.subFormBuilderArray[indexOfsubForm].value[srcFieldName])
        ) {
          field.isDependencyHit = true;
          return this.updateOptionsList(field, dependencyObj, indexOfsubForm);
        } else if (dependencyObj.showUndependent && !field.isDependencyHit) {
          field = this.updateOptionsListOnDependencyCheckFail(
            field,
            dependencyObj,
            indexOfsubForm
          );
        } else {
          if (!field.isDependencyHit) {
            if (field.type == "status") {
              field.statusOptions = [];
            } else {
              field.options = [];
            }
            field = this.setFormValueNull(field, indexOfsubForm);
          }
        }
      }
    }
    return field;
  }

  updateOptionsList(field, dependencyObj, indexOfsubForm): any {
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
        this.colorSetter[indexOfsubForm][field.name] = oldValueOption[0].color;
        this.statuses[indexOfsubForm][field.name] = oldValueOption[0].status;
        this.subFormBuilderArray[indexOfsubForm].value[field.name] =
          oldValueOption[0].status;
      }
    } else {
      let oldValueOption = field.options.filter((f) => f == field.oldValue);
      if (oldValueOption.length) {
        isOldValueAvailable = true;
        this.subFormBuilderArray[indexOfsubForm].value[field.name] =
          field.oldValue;
      }
    }

    //make value of field null if not in the options.
    if (!isOldValueAvailable) {
      if (
        field.type == "status" &&
        this.subFormBuilderArray[indexOfsubForm].value[field.name]
      ) {
        let index = field.statusOptions.findIndex(
          (f) =>
            f.status ==
            this.subFormBuilderArray[indexOfsubForm].value[field.name]
        );
        if (index == -1) {
          this.colorSetter[indexOfsubForm][field.name] = "#fff";
          this.statuses[indexOfsubForm][field.name] = "STATUS";
          this.subFormBuilderArray[indexOfsubForm].value[field.name] = "";
        }
      } else if (field.type == "checkbox") {
        if (field.temOptions && field.temOptions.length) {
          field.temOptions.forEach((element, idx) => {
            let idx1 = dependencyObj.query[field.name].findIndex(
              (f) => f == element
            );
            if (idx1 == -1) {
              if (
                this.subFormBuilderArray[indexOfsubForm].value[field.name][idx]
              ) {
                this.subFormBuilderArray[indexOfsubForm].value[field.name][
                  idx
                ] = false;
              }
            }
          });
        }
      }
    }
    return field;
  }

  updateOptionsListOnDependencyCheckFail(
    field,
    dependencyObj,
    indexOfsubForm
  ): any {
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
    if (
      (field.type =
        "status" && this.subFormBuilderArray[indexOfsubForm].value[field.name])
    ) {
      let index = field.statusOptions.findIndex(
        (f) =>
          f.status == this.subFormBuilderArray[indexOfsubForm].value[field.name]
      );
      if (index == -1) {
        this.subFormBuilderArray[indexOfsubForm].value[field.name] = "";
        this.colorSetter[indexOfsubForm][field.name] = "#fff";
        this.statuses[indexOfsubForm][field.name] = "";
      }
    } else if (field.type == "checkbox") {
      if (field.temOptions && field.temOptions.length) {
        field.temoptions.forEach((element, idx) => {
          let idx1 = dependencyObj.query[field.name].findIndex(
            (f) => f == element
          );
          if (idx1 == -1) {
            if (this.subFormBuilderArray[indexOfsubForm].value[field.name][idx])
              this.subFormBuilderArray[indexOfsubForm].value[field.name][
                idx
              ] = false;
          }
        });
      }
    }
    return field;
  }

  setFormValueNull(field, indexOfsubForm): any {
    if (field && field.name) {
      if (field.type == "status") {
        this.subFormBuilderArray[indexOfsubForm].value[field.name] = "";
        this.subFormBuilderArray[indexOfsubForm].value[field.name] = "";
        this.colorSetter[indexOfsubForm][field.name] = "#fff";
        this.statuses[indexOfsubForm][field.name] = "";
      } else if (field.type != "checkbox") {
        this.subFormBuilderArray[indexOfsubForm].value[field.name] = null;
      } else {
        if (this.subFormBuilderArray[indexOfsubForm].value[field.name].length) {
          this.subFormBuilderArray[indexOfsubForm].value[field.name].forEach(
            (element) => {
              element = false;
            }
          );
        }
      }
    }
    return field;
  }

  evalExpressionForFormulaField(idx) {
    let forms = this.subFormArray[idx].fields ? this.subFormArray[idx].fields : this.subFormArray[idx];
    for (let field of forms) {
      if (field.type == "formula") {
        if (
          field.options &&
          field.options[0] &&
          field.options[0].formula &&
          field.options[0].alsoAFrontEndFormula
        ) {
          let $Table = this.subFormBuilderArray[idx].value;
          this.subFormBuilderArray[idx]
            .get(field.name)
            .setValue(eval(field.options[0].formula));
        }
      }
    }
  }

  ngAfterViewInit() {
    this.tableService.dateTimePickerFocused.subscribe((res) => {
      setTimeout((_) => (this.dateTimePickerToggeledOn = res));
    });
    if (this.editform) {
      //this.loadSubscribers();
    }
  }

  ngAfterContentChecked() {
    this.changeDetector.detectChanges();
  }

  loadSubscribers() {
    this.chatSubscriptionService
      .getSubscribers(this.Data._id)
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
        }
      });
  }

  setDependenciesList() {
    if (this.subFormFields.length > 0) {
      const dependencies = this.subFormFields.filter(
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
            srcFieldOptions:
              element.statusOptions && element.statusOptions.length
                ? element.statusOptions
                : element.options
                  ? element.options
                  : [],
          });
        });
      });
      this.subFormFields.forEach((element) => {
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
    const query = `tutorialFor=Field&tableName=${this.subFormName}`;
    this.tableService.getTutorials(query).subscribe((res: any) => {
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

  setsubFormFields(subFormFields) {
    if (subFormFields) {
      subFormFields.forEach((data, index) => {
        if (data.type === "checkbox") {
          const check = [];
          if (data.options) {
            data.options.forEach((option) =>
              check.push(new FormControl(false))
            );
          }
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
          if (data.options) {
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
          }

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
          this.refVisibilityData = this.refsubFormFields
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
      const lookupDetail = this.refsubFormFields.find(
        (x) => x.lookupTableName == this.refparentTableName
      );
      let lookupDetailToDisplay = [];
      if (!lookupDetail.options) {
        lookupDetail.options = [];
      }
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

  getTableByName(idx) {
    this.refTableName = this.subField.lookupTableName;

    if(this.getTableByNameObjectForData[this.refTableName]){
      let resData = this.getTableByNameObjectForData[this.refTableName];

        if (resData && resData[0].columns) {
          this.refDynamicFilterData = resData[0].columns;
          if (this.refDynamicFilterData) {
            for (const data of this.refDynamicFilterData) {
              if (data.type === "lookup") {
                this.reflookTable = data.lookupTableName;
                this.reflookupName = data.name;
                this.refLookupValue[data.name] = "";
                this.reffilteredOptions[data.name] = [];
                this.refshowAutocomplete[data.name] = false;
                if (data.options) {
                  data.options.forEach((el) => {
                    const temp: [] = Object.assign([], el);
                    temp.shift();
                    this.reffilteredOptions[data.name].push({
                      id: el[0],
                      value: temp.toString().replace(/,/g, " "),
                    });
                  });
                }

                this.refDemoData = data;
                this.refLookupData.push(this.refDemoData);
              }
            }
          }
          if (resData[0].columns && resData[0].columns.length) {
            this.reftableId = resData._id;
            this.tempParentTableHeader = Object.assign([], resData[0].columns);
            this.tempParentTableHeader.map((column) => {
              if (column.type == "recordType") {
                this.refRecordTypeFieldName = column.name;
                if (column.options) {
                  column.options.forEach((element) => {
                    const obj = {
                      title: element,
                    };
                    this.refRecordTypes.push(obj);
                  });
                }
              }
            });
          }
          this.refsubFormFields = this.tempParentTableHeader;
          this.openSubForm(this.subField, this.setFieldIndex, idx);
        }
    }
    else{
      this.tableService
      .getTableByName(this.refTableName)
      .subscribe((res: any) => {
        if (res && res.data && res.data[0].columns) {
          this.getTableByNameObjectForData[this.refTableName] = res.data;
          this.refDynamicFilterData = res.data[0].columns;
          if (this.refDynamicFilterData) {
            for (const data of this.refDynamicFilterData) {
              if (data.type === "lookup") {
                this.reflookTable = data.lookupTableName;
                this.reflookupName = data.name;
                this.refLookupValue[data.name] = "";
                this.reffilteredOptions[data.name] = [];
                this.refshowAutocomplete[data.name] = false;
                if (data.options) {
                  data.options.forEach((el) => {
                    const temp: [] = Object.assign([], el);
                    temp.shift();
                    this.reffilteredOptions[data.name].push({
                      id: el[0],
                      value: temp.toString().replace(/,/g, " "),
                    });
                  });
                }

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
                if (column.options) {
                  column.options.forEach((element) => {
                    const obj = {
                      title: element,
                    };
                    this.refRecordTypes.push(obj);
                  });
                }
              }
            });
          }
          this.refsubFormFields = this.tempParentTableHeader;
          this.openSubForm(this.subField, this.setFieldIndex, idx);
        }
      });
    }

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
        this.mapService.getLocations(zip).subscribe((res: any) => {
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

  cancel() {
    this.ref.close({ close: "no" });
    this.ref.close();
  }

  close() {
    this.ref.close();
  }

  // lookuptableName,name,index,field
  addSubForm(field, fieldIndex, idx) {
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
        let typeCheck = this.subFormMaster.filter(v => v.name == ele);
        if (typeCheck && typeCheck.length && typeCheck[0].type == "lookup") {
          this.mappedKeysValues[ele] = this.lookupValue[idx][ele];
        }
        else {
          this.mappedKeysValues[ele] = this.subFormBuilderArray[idx].get(ele).value;
        }
      })
    }

    if (
      this.tableRecordTypes[this.subField.lookupTableName] &&
      this.tableRecordTypes[this.subField.lookupTableName].length
    ) {
      this.finalRecordTypes = this.tableRecordTypes[this.subField.lookupTableName];
        this.setSubForm(this.subField.lookupTableName,idx);
    } else {
      this.setSubForm(this.subField.lookupTableName,idx);
    }
  }

  setSubForm(formName, idx) {
    this.loading = true;
    this.reftitle = "Add " + formName;
    this.getTableByName(idx);
  }

  // For add new lookup.
  openSubForm(field, fieldIndex, idx) {
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
          optionRecordType:this.finalRecordTypes,
        },
      })

      .onClose.subscribe((res) => {
        this.isSubForm = false;
        let optionValue: string = "";
        if (res) {
          if (res.close == "yes") {
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
                let fieldOptions = this.subFormArray[idx]["fields"]
                  ? this.subFormArray[idx]["fields"][fieldIndex]
                  : this.subFormArray[idx][fieldIndex];
                if (
                  fieldOptions &&
                  fieldOptions.options &&
                  fieldOptions.options.length
                ) {
                  fieldOptions.options.push(option);
                  fieldOptions.IdFieldValue.push(option);
                } else {
                  fieldOptions.options = [];
                  fieldOptions.IdFieldValue = [];
                  fieldOptions.options.push(option);
                  fieldOptions.IdFieldValue.push(option);
                }
              } else {
                this.filteredOptions[idx][this.subField.name] = [
                  ...this.filteredOptions[idx][this.subField.name],
                  { id: name._id, value: optionValue },
                ];
              }
              this.lookupValue[idx][this.subField.name] = [
                ...this.lookupValue[idx][this.subField.name],
                {
                  id: name._id,
                  value: optionValue,
                },
              ];
              // this.filteredOptions[idx][this.subField.name] = [
              //   ...this.lookupValue[idx][this.subField.name],
              // ];
              this.onSelectionChange(
                this.lookupValue[idx][this.subField.name],
                this.subField,
                idx
              );
            }
            // Call a Pipe to filter options.
            this.filteredOptions[idx][
              this.subField.name
            ] = this.filterPipe.transform(
              this.filteredOptions[idx][this.subField.name],
              this.lookupValue[idx][this.subField.name]
            );
          } else {
            this.lookupValue[idx][this.subField.name] = [
              ...this.lookupValue[idx][this.subField.name],
            ];
            this.editData[idx][this.subField.name] = [
              ...this.editData[idx][this.subField.name],
            ];
          }
        }

      });
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
        this.tableService.formFileUpload(this.fileFormData).subscribe(
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
                for (const d of this.subFormFields) {
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

  // For showing auto-complete dropdown list
  updatedVal(e, value, idx) {
    this.count++;
    this.checkData = false;
    this.editData[idx][value] = [];
    e.forEach((element) => {
      if (!element.$ngOptionLabel) {
        this.editData[idx][value].push(element);
      }
    });
    if (e && e.length >= 0) {
      this.showAutocomplete[idx][value] = true;
      this.checkData = true;
    } else {
      this.showAutocomplete[idx][value] = false;
      this.checkData = false;
    }
  }

  compareFn(c11: any, c22: any): boolean {
    if (c11.disabled) {
      return false;
    }
    return c11 && c22 ? c11.id === c22.id : c11 === c22;
  }

  // Lookup selection change
  onSelectionChange(data1, field, idx, fieldIndex?) {
    field.showOption = false;
    this.onSubFormAdd = false;
    this.subField = field;
    if (fieldIndex && !data1.length) {
      // Cancel clicked.
      this.removeText(field.name, idx);
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
            )
            .subscribe((res: any) => {
              if (res.statusCode === 200) {


                if (res.data && res.data.lookup && res.data.lookup) {
                  let temp = res.data.lookup;
                  temp.forEach(ele => {
                    if (field.lookupTableName == ele.lookupTableName) {
                      this.addSubFormFields();

                      this.lookupValue[this.subFormIndex][field.name] = [{
                        id: ele.lookupId,
                        value: ele.lookupName
                      }];

                      this.filteredOptions[this.subFormIndex][
                        field.name
                      ].push({
                        id: ele.lookupId,
                        value: ele.lookupName
                      })

                      this.editData[this.subFormIndex][field.name] = this.lookupValue[this.subFormIndex][field.name];
                      this.onSubFormAdd = true;
                    }

                  })
                }
                let listData = this.subFormFields.filter((item) => {
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
                      let mappedFieldIndex = this.subFormFields.findIndex(
                        (v) => v.name == this.valueToMapInField
                      );
                      if (mappedFieldIndex > -1) {
                        if (
                          this.subFormFields[mappedFieldIndex].type == "lookup"
                        ) {
                          if (res.data["lookup"] && res.data["lookup"].length) {
                            let lookupList = res.data["lookup"].filter(
                              (element) => element.lookupDataName == ele
                            );
                            if (lookupList && lookupList.length) {
                              // this.userFields[this.valueToMapInField] =
                              //   lookupList[0].lookupId;
                              let obj = {
                                id: lookupList[0].lookupId,
                                value: lookupList[0].lookupName,
                              };
                              if (
                                this.filteredOptions[idx][
                                this.valueToMapInField
                                ] &&
                                this.filteredOptions[idx][
                                  this.valueToMapInField
                                ].length
                              ) {
                                this.filteredOptions[idx][
                                  this.valueToMapInField
                                ].push(obj);

                              } else {
                                this.filteredOptions[idx][
                                  this.valueToMapInField
                                ] = [];
                              }
                              this.filteredOptions[idx][
                                this.valueToMapInField
                              ] = [...this.filteredOptions[idx][
                                this.valueToMapInField
                              ]];
                              this.lookupValue[idx][this.valueToMapInField][
                                index
                              ] = obj;
                              this.lookupValue[idx][this.valueToMapInField] = [...this.lookupValue[idx][this.valueToMapInField]];
                              this.editData[idx][this.valueToMapInField][
                                index
                              ] = obj;
                              this.editData[idx][this.valueToMapInField][
                                index
                              ].name = obj.value;
                              this.editData[idx][this.valueToMapInField] = [...this.editData[idx][this.valueToMapInField]];
                              this.subFormBuilderArray[idx].patchValue({
                                [this.valueToMapInField]:
                                  lookupList[0].lookupId,
                              });
                            }
                          }
                        } else {
                          if (res.data[ele] && res.data[ele] != "") {
                            this.userFields[this.valueToMapInField] =
                              res.data[ele];
                            this.subFormBuilderArray[idx].patchValue({
                              [this.valueToMapInField]: res.data[ele],
                            });
                          }
                        }
                      }



                    });
                  }
                }
                let visibilityFields = this.subFormMaster.filter(item => item.isVisibilityOn == true);
                visibilityFields.forEach(ele => {
                  if (
                    ele.isVisibilityOn &&
                    ele.fieldValuesData &&
                    ele.fieldValuesData.length > 0
                  ) {
                    this.visibilityData = this.subFormMaster
                      .filter((col) => col._id === ele.visibilityData)
                      .map((col) => col.name);
                    if (this.visibilityData && this.visibilityData.length) {
                      this.visibilityData = this.visibilityData[0];
                      this.dependsFields.push(ele);
                      if (this.visibilityData == "taskType") {
                        ele.fieldValuesData.forEach(item => {
                          if (this.recordType == item) {
                            this.show[this.subFormIndex][ele.name] = true;
                          }
                          else {
                            this.show[this.subFormIndex][ele.name] = false;
                          }
                        });
                      }
                      else {
                        ele.fieldValuesData.forEach(item => {
                          this.subFormBuilderArray.forEach((element, i) => {
                            if (element.get(this.visibilityData).value == item) {
                              this.show[i][ele.name] = true;
                            }
                            else {
                              this.show[i][ele.name] = false;
                            }
                          })
                        })
                      }
                    }

                  }
                })

                if (listData && listData[0] && listData[0].filters) {
                  listData[0].filters.forEach(element => {
                    if (element.showErrorMessage)
                      this.toastrService.warning(element.errorMessageForCheckBox, "LookUp");
                  });
                }
                // Call a Pipe to filter options.
                this.filteredOptions[idx][
                  this.subField.name
                ] = this.filterPipe.transform(
                  this.filteredOptions[idx][this.subField.name],
                  this.lookupValue[idx][this.subField.name]
                );

              }

              // Emit values after change in lookup value
              this.emitValuesToParent();
              if (this.onSubFormAdd) {
                this.onSelectionChange(this.lookupValue[this.subFormIndex][field.name], field, this.subFormIndex);
              }
            });
        }

        if (data && data.id && data.value) {
          this.lookupObj[name] = data;
          //this.lookupValue[idx][name][index] = data.value;
          this.isInputDisable = true;
          this.removeLookup[idx][name] = true;
          for (const d of this.subFormFields) {
            if (d.type === "lookup" && name === d.name) {
              if (d.loadAsDropDown) {
                let displayValue;
                if (d && d.IdFieldValue) {
                  displayValue = d.IdFieldValue.filter((f) => f[0] === data.id);
                }
                if (displayValue && displayValue.length > 0) {
                  const temp: [] = Object.assign([], displayValue[0]);
                  temp.shift();
                  this.lookupValue[idx][name] = [
                    ...this.lookupValue[idx][name],
                    {
                      id: data.id,
                      value: temp.toString().replace(/,/g, " "),
                    },
                  ];
                } else {
                  d.options.forEach((el) => {
                    if (data.id === el[0]) {
                      this.lookupValue[idx][name] = [
                        ...this.lookupValue[idx][name],
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
                  this.lookupValue[idx][name].findIndex(
                    (f) => f.id == data.id
                  ) == -1
                ) {
                  this.lookupValue[idx][name] = [
                    ...this.lookupValue[idx][name],
                    { id: data.id, value: data.value },
                  ];
                }
              }
              this.editData[idx][name] = this.lookupValue[idx][name];
              // Filterout only unique values
              this.editData[idx][name] = this.editData[idx][name].filter(
                (ob, i, arr) => arr.findIndex((t) => t.id === ob.id) === i
              );
              this.editData[idx][name].forEach((element) => {
                if (element.name) {
                  element.name = element.value;
                }
              });
            }
          }

          this.lookupFieldRequired[name] = false;
          // Call a Pipe to filter options.
          this.filteredOptions[idx][
            this.subField.name
          ] = this.filterPipe.transform(
            this.filteredOptions[idx][this.subField.name],
            this.lookupValue[idx][this.subField.name]
          );
        }
      });
    }

    // For applying dependency
    this.dependenciesCheck();

    //Emit values to parent
    this.emitValuesToParent();

    // If 1st row is empty in form then check in lookup array
    this.showDelete = false;
    if (!this.showDelete) {
      for (let [key, v] of Object.entries(this.lookupValue[0])) {
        let val = v as any;
        if (val.length) {
          this.showDelete = true;
        }
      }
    }


  }

  onDelete(event, fieldName) {
    // delete file from FileList
    if (this.uploadedFiles && this.uploadedFiles[fieldName]) {
      this.uploadedFiles[fieldName].splice(event, 1);
    }
  }

  removeText(value, idx, isLoadAsDropDown?) {
    this.count++;
    this.lookupValue[idx][value] = [];
    this.lookupObj[value] = [];
    this.isInputDisable = false;
    this.removeLookup[idx][value] = false;
    if (isLoadAsDropDown) {
      this.filteredOptions[idx][value] = [];
    }
    this.dependenciesCheck();
  }

  // Emit values to parent
  emitValuesToParent() {

    if (this.firstTime) {
      let tempArray = [];
      tempArray = this.subFormMaster.filter(element => {
        if (element.type == "checkbox") {
          return true;
        }
      });

      if (tempArray) {
        tempArray.forEach(item => {
          this.subFormBuilderArray.forEach(ele => {
            if (!ele.value[item.name].includes(true)) {
              item.checkForValidationInSubForm = true;
            }
          })
        })
      }

    }

    let validFlag = false;
    this.subFormArray.forEach((ele, i) => {
      if (!this.subFormBuilderArray[i].valid) {
        validFlag = true;
      }
    })
    this.subFormBuilder.emit({
      name: this.subFormLookupName,
      data: this.subFormBuilderArray,
      valid: validFlag
    });
    this.subFormData.emit({
      name: this.subFormLookupName,
      data: this.subFormArray,
    });
    if (this.subFormMaster.filter((f) => f.type == "lookup")) {
      this.subFormLookupData.emit({
        name: this.subFormLookupName,
        data: this.lookupValue,
        lookupFields: this.lookupData,
        lookupFieldRequired: this.lookupFieldRequired,
        editData: this.editData,
        removeLookup: this.removeLookup,
      });
    }

  }

  onDependentFieldChanged(event, fieldId, type, idx, fieldName, field?) {
    let value,
      isChecked = true;

    if (type === "checkbox") {
      this.firstTime = false;
      let variable = [...this.subFormArray[idx].fields ? this.subFormArray[idx].fields : this.subFormArray[idx]];

      if (variable) {
        variable.forEach(element => {
          if (element.name == fieldName) {

            element.checkForValidationInSubForm = false;
            if (!this.subFormBuilderArray[idx].value[fieldName].includes(true)) {
              element.checkForValidationInSubForm = true;
            }
          }
        })

      }
      value = event.currentTarget.textContent.trim();
      isChecked = event.target.checked;

    } else if (type === "dropdown") {
      value = event.value;
    } else if (type === "dropdownWithImage") {
      value = event;
    }
     else if (type === "radio") {
      value = event;
    }
    if (field) {
      this.subFormBuilderArray[idx].patchValue({ [fieldName]: field.oldValue });
    }

    // this.subFormBuilderArray[idx].patchValue({ [fieldName]: value });

    // this.subFormArray.forEach((e, idx) => {
    this.dependsFields.forEach((element) => {
      if (element.visibilityData === fieldId) {
        this.show[idx][element.name] =
          isChecked &&
          element.fieldValuesData.length > 0 &&
          !!element.fieldValuesData.includes(value);

      }
    });
    // });
    this.evalExpressionForFormulaField(idx);
  }

  onDone(res, field, idx) {
    this.colorSetter[idx][field.name] = res.color;
    this.statuses[idx][field.name] = res.status;
    if (this.subFormBuilderArray[idx].get(field.name))
      this.subFormBuilderArray[idx].patchValue({
        [field.name]: res.status,
      });
    else if (this.newDynamicForm.get(field.name))
      this.newDynamicForm.patchValue({ [field.name]: res.status });

    this.dependsFields.forEach((element) => {
      if (element.visibilityData === field._id) {
        this.show[idx][element.name] =
          element.fieldValuesData.length > 0 &&
          !!element.fieldValuesData.includes(res.status);

      }
    });
    this.evalExpressionForFormulaField(idx);
  }
  // openSetStatusModal(field, idx) {
  //   this.dialogService
  //     .open(SetStatusComponent, {
  //       context: {
  //         statusOptionsArray: field.statusOptions,
  //       },
  //     })
  //     .onClose.subscribe((res) => {
  //       if (res) {
  //         this.colorSetter[idx][field.name] = res.color;
  //         this.statuses[idx][field.name] = res.status;
  //         if (this.subFormBuilderArray[idx].get(field.name))
  //           this.subFormBuilderArray[idx].patchValue({
  //             [field.name]: res.status,
  //           });
  //         else if (this.newDynamicForm.get(field.name))
  //           this.newDynamicForm.patchValue({ [field.name]: res.status });

  //           this.dependsFields.forEach((element) => {
  //             if (element.visibilityData === field._id) {
  //               this.show[idx][element.name] =
  //                 element.fieldValuesData.length > 0 &&
  //                 !!element.fieldValuesData.includes(res.status);
  //             }
  //           });
  //         this.evalExpressionForFormulaField(idx);
  //       }
  //     });
  // }

  dynamicSearch(e, field, idx, searchTerm?) {
    this.dropDownText[idx][field.name] = "";
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
        this.filteredOptions[idx][field.name] = [];
        this.loadingAPI = false;
        this.dropDownText[idx][field.name] = "Type to search";
      } else {
        let formDataObj = {};
        let data11 = this.subFormArray[idx].fields ? this.subFormArray[idx].fields : this.subFormArray[idx];
        data11.forEach(e => {
          if (e.type != 'injectSubForm' && e.type != 'lookup') {
            formDataObj[e.name] = this.subFormBuilderArray[idx].value[e.name];
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
            this.subFormName,
            field.name,
            formDataObj,
            this.lookupValue[idx]
          )
          .subscribe((res: any) => {
            this.filteredOptions[idx][field.name] = [];
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
                this.filteredOptions[idx][field.name] = [
                  ...this.filteredOptions[idx][field.name],
                  obj,
                ];
              });
              this.loadingAPI = false;
            }
            if (this.filteredOptions[idx][field.name].length) {
              this.dropDownText[idx][field.name] = "Type to search";
            } else {
              this.dropDownText[idx][field.name] = "No record found";
            }
          });
      }
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
    } else {
      this.cancelSubscription(this.currentUser._id);
      this.subscriptionText = "Start watching";
      this.isSelfSubscribed = false;
    }
  }

  cancelSubscription(id) {
    const sub = this.subscribers.findIndex((s) => s._id == id);
    this.subscribers.splice(sub, 1);
  }

  updateSubscribers(subscriber) {
    const checkAlreadyAdded = this.subscribers.findIndex(
      (s) => s._id == subscriber._id
    );
    if (checkAlreadyAdded == -1) {
      this.subscribers.push(subscriber);
    }
    this.subscribers.forEach((data) => {
      if (data._id == this.currentUser._id) {
        this.subscriptionText = "Stop watching";
        this.isSelfSubscribed = true;
      }
    });
  }

  // Add new row in sub-form
  addSubFormFields() {
    let ob = JSON.parse(JSON.stringify(this.subFormMaster));
    this.subFormArray.push({ fields: ob });
    this.subFormIndex++;

    // For adding new row in form builder..
    this.ngOnInit(true);
  }

  // Delete i'th row in sub-form
  deleteSubFormLookup(idx, deleteByApi, all?) {
    let id = "";
    if (!all) {
      id = this.subFormBuilderArray[idx]["value"]._id;
    } else {
      id = idx;
    }

    if (!deleteByApi) {
      this.removeRowFromList(idx);
      // After deleting row, emit form values to parent dynamic form
      this.emitValuesToParent();
    } else {
      // Call API to delete subForm record.
      this.dialogService
        .open(DeleteDialogComponent)
        .onClose.subscribe((name) => {
          if (name) {
            this.tableService
              .deleteDynamicFormData(id, this.subFormName, all)
              .subscribe((res: any) => {
                if (res.statusCode === 200) {
                  this.toastrService.success(res["message"]);
                  if (!all) {
                    this.removeRowFromList(idx);
                    this.Data.splice(idx, 1);
                  } else {
                    this.removeRowFromList(0, true);
                  }
                } else {
                  this.toastrService.danger(res["message"]);
                }
                // After deleting row, emit form values to parent dynamic form
                this.emitValuesToParent();
              });
          }
        });
    }
  }

  removeRowFromList(idx, removeAll?) {
    if (this.subFormArray.length == 1 || removeAll) {
      if (this.Data && this.Data[idx]) {
        this.Data = [];
      }
      this.subFormArray = [];
      if (removeAll) {
        this.subFormIndex = 0;
      }
      let ob = JSON.parse(JSON.stringify(this.subFormMaster));
      this.subFormArray.push({ fields: ob });

      this.subFormBuilderArray = [];
      this.show[0] = {};
      this.colorSetter[0] = {};
      this.statuses[0] = {};
      this.lookupValue = [];
      this.lookupData = [];
      this.editData = [];
      this.removeLookup = [];
      this.userFields = {};
      this.ngOnInit(true);
    } else {
      if (this.Data && this.Data[idx]) {
        this.Data.splice(idx, 1);
      }

      this.subFormArray.splice(idx, 1);
      this.subFormBuilderArray.splice(idx, 1);
      this.show.splice(idx, 1);
      this.colorSetter.splice(idx, 1);
      this.statuses.splice(idx, 1);
      this.lookupValue.splice(idx, 1);
      this.lookupData.splice(idx, 1);
      this.editData.splice(idx, 1);
      this.removeLookup.splice(idx, 1);

      this.subFormIndex--;
    }

    this.showDelete = false;
    // Check in form first
    for (let [key, val] of Object.entries(this.subFormBuilderArray[0].value)) {
      if (val) {
        this.showDelete = true;
      }
    }

    // If 1st row is empty in form then check in lookup array
    if (!this.showDelete) {
      for (let [key, v] of Object.entries(this.lookupValue[0])) {
        let val = v as any;
        if (val.length) {
          this.showDelete = true;
        }
      }
    }
  }

  clearRows() {
    // While editing.
    let deleteIds = [];
    this.deletedRecordCount = this.subFormBuilderArray.length;

    if (this.editform && this.Data && this.Data.length) {
      this.Data.forEach((element, idx) => {
        deleteIds.push(this.subFormBuilderArray[idx]["value"]._id);
      });
      this.deleteSubFormLookup(deleteIds, true, true);
    } else {
      this.dialogService
        .open(DeleteDialogComponent)
        .onClose.subscribe((name) => {
          if (name) {
            this.removeRowFromList(0, true);
          }
        });
    }
    this.emitValuesToParent();
  }

  openLookupModalForDetail(val, field) {

    if (!field.allowMultipleValues) {
      this.loading = true;

      let data = this.tableDataForForms;
      data = data.filter(item => item.tableName == field.lookupTableName);
      let tableColumns = data[0]?.columns;
      let subFormLookupIdsForLookupView = data[0]?.subFormLookups;

      if(this.getTableByNameObjectForData[field.lookuptableName]){

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
              )
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
                          tableColumns:tableColumns,

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
      else{
        this.tableService.getTableByName(field.lookupTableName).subscribe((res: any) => {

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
              )
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
                          tableColumns:tableColumns,

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
    let index = this.lookupValue[this.subFormIndex][field.name].findIndex(f => f.id == val.id)
    if (index > -1) {
      if (index == 0 && this.lookupValue[this.subFormIndex][field.name].length == 1) {
        this.lookupValue[this.subFormIndex][field.name] = [];
        this.editData[this.subFormIndex][field.name] = [];
      }
      else {
        this.lookupValue[this.subFormIndex][field.name].splice(index, 1);
        this.editData[this.subFormIndex][field.name].splice(index, 1);
      }
      this.lookupValue[this.subFormIndex][field.name] = [...this.lookupValue[this.subFormIndex][field.name]];
      this.editData[this.subFormIndex][field.name] = [...this.editData[this.subFormIndex][field.name]];
    }
  }


  onKeyDown(e, idx, name) {
    var keyCode = e.keyCode ? e.keyCode : e.which;
    if (keyCode == 38) {
      let index = name + (idx - 1);
      let interval = setInterval(() => {
        let field = document.getElementById(index);
        if (field != null) {
          field.focus();
          clearInterval(interval);
        }
      }, 50);
    }
    else if (keyCode == 40) {
      let index = name + (idx + 1);
      let interval = setInterval(() => {
        let field = document.getElementById(index);
        if (field != null) {
          field.focus();
          clearInterval(interval);
        }
      }, 50);
    }
  }

}
