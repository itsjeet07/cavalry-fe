import { AdditionalFormDialogComponent } from "@shared/components/dialog/additional-form-dialog/additional-form-dialog.component";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  FormArray,
  Validators,
} from "@angular/forms";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { ColumnOptionDialogComponent } from "@app/shared/components/dialog/column-option-dialog/column-option-dialog.component";
import { TableService } from "@app/shared/services/table.service";
import { Router, ActivatedRoute } from "@angular/router";
import * as _ from "lodash";
import { LookUpDialogComponent } from "@app/shared/components/dialog/lookup-dialog/lookup-dialog.component";
import { tableRequest } from "@app/shared/interfaces/table";
import { MessageCommonService } from "@app/shared/services/message-common.service";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { ColumnStatusComponent } from "@shared/components/dialog/column-status-dialog.component.ts/column-status-dialog.component";
import { isNullOrUndefined } from "util";
import { isEmpty } from "lodash";
import { ColumnDateTimeDialogComponent } from "@app/shared/components/dialog/column-date-time-dialog/column-date-time-dialog.component";
import { ColumnRollUpDialogComponent } from "@app/shared/components/dialog/column-roll-up-dialog/column-roll-up-dialog.component";
import { ColumnDropdownImageComponent } from "@app/shared/components/dialog/column-dropdown-image/column-dropdown-image.component";

@Component({
  selector: "ngx-add-edit-table",
  templateUrl: "./add-edit-table.component.html",
  styleUrls: ["./add-edit-table.component.scss"],
})
export class AddEditTableComponent implements OnInit, OnDestroy {
  myform: FormGroup;
  options = [];
  loading = false;
  tableId = "";
  title = "";
  removeId = [];
  allTableData: tableRequest[];
  lookupTableFields = [];
  lookupTableId = [];
  imageSrc: string;
  iconData: any;
  autoNumberRead: boolean;
  dataVisibleField: [];
  displayVisibility: boolean;
  tableData: [];
  filterValue = [];
  tableNameField: string;
  fieldValues: any[] = [];
  subFormTableNames = [];
  visibleFieldData = [];
  relatedDateFields = [];
  tutorialText = "";
  mappedFields: any;
  filters: any;
  fileHolder: File | null;
  imageURL: any = [];
  columnArray: any;
  recordGadgets = [];
  panelOpenState = false;

  scrollToElement(): void {
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 200);
  }

  tempEditData: any = [];
  rollUpFormTableData = [];
  parentFormsForRollup = {};


  constructor(
    private service: TableService,
    private fb: FormBuilder,
    private dialogService: NbDialogService,
    private tableService: TableService,
    private toastrService: NbToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private messageCommonService: MessageCommonService,
    private cd: ChangeDetectorRef
  ) {
    this.fileHolder = null;
    this.tableId = this.route.snapshot.paramMap.get("id");
    this.addClassToBody();
  }

  ngOnDestroy(): void {
    const element = document.getElementById("main_body");
    element.classList.remove("drag_item");
  }

  addClassToBody() {
    const element = document.getElementById("main_body");
    element.classList.add("drag_item");
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.columnsArr.controls,
      event.previousIndex,
      event.currentIndex
    );
    (this.myform.controls.columns as FormArray).controls[event.currentIndex]
      .get("displayPriority")
      .setValue(event.currentIndex + 1);
    const element = document.getElementById("main_body");
    element.classList.remove("drag-drop-on");
  }

  dragStart(event) {
    const element = document.getElementById("main_body");
    element.classList.add("drag-drop-on");
  }

  ngOnInit(): void {
    if (this.tableId) {
      this.getTableDetails();
    }
    this.getAllTableData();
    this.setTitles();
    this.myform = this.fb.group({
      tableName: ["", Validators.required],
      file: [null],
      _id: [""],
      deletedColumns: [""],
      columns: this.fb.array([this.addColumnGroup()]),
    });
  }

  typeSelected(event, index) {
    if (
      this.myform.value.columns &&
      this.myform.value.columns[index] &&
      this.myform.value.columns[index].type == "formula" || this.myform.value.columns[index].type == "rollUp"
    ) {
      (this.myform.controls.columns as FormArray).controls[index]
        .get("isReadOnly")
        .setValue(true);
    }
    if (event.target.value == "gadget") {
      (this.myform.controls.columns as FormArray).controls[index]
        .get("gadget").setValidators(Validators.required);
    } else {
      (this.myform.controls.columns as FormArray).controls[index]
        .get("gadget").clearValidators();
    }


  }

  getType(index) {
    return this.myform.value.columns &&
      this.myform.value.columns[index] && this.myform.value.columns[index].type == "lookup"
  }

  onKeypressEvent(event: any) {
    const k = event.charCode;
    return (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k == 8 ||
      k == 32 ||
      (k >= 48 && k <= 57)
    );
  }

  getAllTableData() {
    this.tableService.getTable().subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.allTableData = res.data;
        if (res.data && res.data.length) {
          res.data.forEach(e => {
            if (e.columns && e.columns.length) {
              let list = e.columns.filter(f => f.lookupTableId == this.tableId);
              if (list && list.length) {
                this.parentFormsForRollup[e.tableName] = e;
              }
            }

          })
        }

      }
    });
  }

  setTitles() {
    this.title = this.tableId ? "Edit Table" : "Create Table";
  }

  addColumnGroup(): FormGroup {
    return this.fb.group({
      _id: new FormControl(""),
      label: new FormControl("", Validators.required),
      type: ["", Validators.required],
      isRequired: new FormControl(false),
      displayPriority: new FormControl(""),
      isSearchable: new FormControl(false),
      name: new FormControl("", Validators.required),
      section: new FormControl("default"),
      displayInList: new FormControl(false),
      options: new FormControl(null),
      relatedDate: new FormControl(null),
      gadget: new FormControl(null),
      statusOptions: new FormControl(null),
      isPhone: new FormControl(null),
      fraction: new FormControl(null),
      textAreaLines: new FormControl(1),
      icon: new FormControl(null),
      isCurrency: new FormControl(null),
      dateTimeOptions: new FormControl(null),
      fieldSize: new FormControl("small"),
      lookupTableId: new FormControl(null),
      lookupTableFields: new FormControl(null),
      lookupTableName: new FormControl(null),
      displayInTreeTable: new FormControl(false),
      allowMultipleValues: new FormControl(false),
      idField: new FormControl(false),
      isWorkFlowField: new FormControl(false),
      lookupTableFieldNames: new FormControl(null),
      isLookupRepPrimaryObject: new FormControl(false),
      tableName: new FormControl(""),
      subFormTableName: new FormControl(null),
      isProfileImage: new FormControl(false),
      displayInRelatedPageView: new FormControl(true),
      isASubFormField: new FormControl(false),
      isReadOnly: new FormControl(false),
      isVisibilityOn: new FormControl(false),
      loadAsDropDown: new FormControl(false),
      recordHistory: new FormControl(false),
      visibilityData: new FormControl(""),
      fieldValuesData: new FormArray([]),
      defaultOptionValue: new FormControl(null),
      mappedFields: new FormControl(null),
      filters: new FormControl(null),
      typeOfFormula: new FormControl(null),
      isLookUpList: new FormControl(null),
      isReference: new FormControl(null),
    });
  }

  getTableDetails() {
    this.tableService.getTableDetails(this.tableId).subscribe((res: any) => {
      this.tempEditData = res.data[0];
      this.recordGadgets = this.tempEditData.recordGadgets;
      this.subFormTableNames = this.tempEditData.subFormLookups;
      this.editTable(res.data[0]);
    });
  }

  editTable(data) {
    this.tableNameField = data.tableName;
    this.getTableValues();
    this.dataVisibleField = data.columns;
    this.visibleFieldData = this.dataVisibleField.filter((e: any) => {
      return (
        e.type == "dropdown" ||
        e.type == "status" ||
        e.type == "recordType" ||
        e.type == "checkbox" ||
        e.type == "radio" ||
        e.type == "dropdownWithImage"
      );
    });
    this.relatedDateFields = this.dataVisibleField.filter(
      (e: any) => e.type === "date"
    );
    for (const c of data.columns) {
      if (c.type === "autoNumber") {
        this.autoNumberRead = true;
      }
    }
    this.myform.patchValue({
      _id: data._id,
      tableName: data.tableName,
    });
    setTimeout(() => {
      this.myform.setControl("columns", this.setColumnsData(data.columns));
      this.setFilters(data.columns);
      this.setOptions(data.columns);
      this.setLookUpFieldNames(data.columns);
      this.setLookUpFields(data.columns);
      this.setStatusOptions(data.columns);
      this.setDateTimeOptions(data.columns);
    }, 2000);
  }

  setFilters(col) {
    col.forEach((element, i) => {
      (this.myform.controls.columns as FormArray).controls[i]
        .get("filters")
        .setValue(element.filters ? element.filters : []);
    });
  }

  setOptions(columns) {
    let i = 0;
    columns.forEach((c) => {
      (this.myform.controls.columns as FormArray).controls[i]
        .get("options")
        .setValue(c.options);
      this.options[i] = c.options;
      i++;
    });
  }

  setStatusOptions(columns) {
    columns.forEach((c, i) => {
      (this.myform.controls.columns as FormArray).controls[i]
        .get("statusOptions")
        .setValue(c.statusOptions);
    });
  }

  setDateTimeOptions(columns) {
    columns.forEach((c, i) => {
      (this.myform.controls.columns as FormArray).controls[i]
        .get("dateTimeOptions")
        .setValue(c.dateTimeOptions);
    });
  }

  setLookUpFieldNames(columns) {
    columns.forEach((c, i) => {
      const lookupFields = c.lookupTableFieldNames;
      (this.myform.controls.columns as FormArray).controls[i]
        .get("lookupTableFieldNames")
        .setValue(lookupFields);
    });
  }

  setLookUpFields(columns) {
    columns.forEach((c, i) => {
      (this.myform.controls.columns as FormArray).controls[i]
        .get("lookupTableFields")
        .setValue(c.lookupTableFields);
      this.lookupTableFields[i] = c.lookupTableFields;
      this.lookupTableId[i] = c.lookupTableId;
      this.mappedFields = c.mappedFields;
      this.filters = c.filters
      i++;
    });
  }

  setColumnsData(columns): FormArray {
    let imageObj;
    const formArray = new FormArray([]);
    columns.forEach((c, i) => {

      if (c.icon) {
        this.imageURL[i] = c.icon;
      }
      else {
        this.imageURL[i] = "";
      }

      formArray.push(
        this.fb.group({
          _id: c._id,
          isSearchable: c.isSearchable,
          displayInList: c.displayInList,
          displayPriority: c.displayPriority,
          label: c.label,
          name: c.name,
          type: c.type,
          section: c.section,
          isRequired: c.isRequired,
          fieldSize: c.fieldSize,
          options: null,
          statusOptions: null,
          dateTimeOptions: null,
          lookupTableId: c.lookupTableId,
          lookupTableName: c.lookupTableName,
          lookupTableFields: null,
          displayInTreeTable: c.displayInTreeTable,
          allowMultipleValues: c.allowMultipleValues,
          idField: c.idField,
          isWorkFlowField: c.isWorkFlowField,
          lookupTableFieldNames: null,
          isLookupRepPrimaryObject: c.isLookupRepPrimaryObject,
          isProfileImage: c.isProfileImage,
          displayInRelatedPageView: c.hasOwnProperty("displayInRelatedPageView")
            ? c.displayInRelatedPageView
            : true,
          isASubFormField: c.hasOwnProperty("isASubFormField")
            ? c.isASubFormField
            : false,
          isReadOnly: c.isReadOnly,
          isVisibilityOn: c.isVisibilityOn,
          isReference: c.isReference,
          loadAsDropDown: c.loadAsDropDown,
          recordHistory: c.recordHistory,
          startValue: c.startValue,
          fraction: c.fraction,
          textAreaLines: c.textAreaLines,
          icon: c.icon ? this.imageURL[i] : "",
          subFormTableName: c.subFormTableName,
          visibilityData: c.visibilityData,
          fieldValuesData: [c.fieldValuesData],
          defaultOptionValue: c.defaultOptionValue,
          mappedFields: c.mappedFields,
          filters: c.filters,
          relatedDate: c.relatedDate,
          gadget: c.gadget,
          isPhone: c.isPhone,
          isCurrency: c.isCurrency,
          typeOfFormula: c.typeOfFormula ? c.typeOfFormula : "",
          isLookUpList: c.isLookUpList,
        })
      );
      if (!isNullOrUndefined(c.visibilityData)) {
        this.onDependentDropdownChanged(c.visibilityData, i);
      }
    });
    return formArray;
  }

  onChanges(i, event) {
    (this.myform.controls.columns as FormArray).controls[i]
      .get("isPhone")
      .setValue(event);
  }

  onCurrencyChecked(i, event) {
    (this.myform.controls.columns as FormArray).controls[i]
      .get("isCurrency")
      .setValue(event);
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  uploadIcon(i) {
    const formData = new FormData();
    formData.append("file", (this.myform.controls.columns as FormArray).controls[i].get("icon").value);
    this.service.uploadMedia(formData).subscribe((res: any) => {
      if (res.statusCode === 201) {
        this.iconData = res.data[0];
        this.imageURL[i] = this.iconData;
        (this.myform.controls.columns as FormArray).controls[i].get("icon").setValue(this.iconData);
      }
    });
  }

  onSubmit() {


    this.loading = true;
    const optionsType = ["dropdown", "checkbox", "radio", "recordType", "formula", "rollUp", "dropdownWithImage"];

    this.myform.controls.deletedColumns.setValue(this.removeId);
    const columns = this.myform.value.columns;
    const tableName = this.myform.value.tableName;

    columns.forEach((c, i) => {
      c.displayPriority = i + 1;
      c.tableName = tableName;
      if (c.type != "file") {
        c.isProfileImage = false;
      }
      if (c.type != "lookup") {
        c.lookupTableFields = [];
        c.lookupTableId = null;
        c.lookupTableFieldNames = [];
        c.lookupTableName = null;
        c.mappedFields = {};
        c.filters = [];
      }
      if (!optionsType.includes(c.type)) {
        c.options = [];
      }
      if (c.type == 'gadget') {
        c.options = this.recordGadgets;
      }
    });
    this.tableId ? this.updateTable() : this.saveTable();
  }

  saveTable() {
    try {


      this.myform.value.columns.forEach((e) => {
        e.visibilityData = null;
      });
      this.tableService.saveData(this.myform.value).subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.toastrService.success(res.message, "Action was successful");
          this.loading = false;
          this.messageCommonService.sendMessage("table");
          this.router.navigate(["pages/tables/list"]);
        } else {
          this.loading = false;
          this.toastrService.danger(res.message, "Action was unsuccessful!");
        }
      });
    } catch (error) { }
  }

  updateTable() {
    try {
      this.tableService.updateTable(this.myform.value).subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.toastrService.success(res.message, "Action was successful");
          this.loading = false;
          this.messageCommonService.sendMessage("table");
          this.router.navigate(["pages/tables/list"]);
        } else {
          this.loading = false;
          this.toastrService.danger(res.message, "Action was unsuccessful!");
        }
      });
    } catch (error) { }
  }

  get f() {
    return this.myform.controls;
  }

  showAddButton(i) {
    const value = [
      "dropdown",
      "checkbox",
      "radio",
      "lookup",
      "recordType",
      "status",
      "dropdownWithImage"
    ];
    const type = this.myform.value["columns"][i]["type"];
    return value.includes(type);
  }

  showLineBox(i) {
    const value = ["area"];
    const type = this.myform.value["columns"][i]["type"];
    return value.includes(type);
  }

  showAddDateButton(i) {
    const value = ["dateTime", "date"];
    const type = this.myform.value["columns"][i]["type"];
    return value.includes(type);
  }

  showTextBox(i) {
    const value = ["autoNumber"];
    const type = this.myform.value["columns"][i]["type"];
    return value.includes(type);
  }

  showDatePicker(i) {
    const value = ["time"];
    const type = this.myform.value["columns"][i]["type"];
    return value.includes(type);
  }

  showGadget(i) {
    const value = ["gadget"];
    const type = this.myform.value["columns"][i]["type"];
    return value.includes(type);
  }

  showSubFormTable(i) {
    const value = ["injectSubForm"];
    const type = this.myform.value["columns"][i]["type"];
    return value.includes(type);
  }

  showIsPhone(i, group) {
    const value = ["text"];
    const type = this.myform.value["columns"][i]["type"];
    return value.includes(type);
  }

  showIsNumber(i, group) {
    const value = ["number"];
    const type = this.myform.value["columns"][i]["type"];
    return value.includes(type);
  }

  showVisibility(i) {
    const isVisibilityOn = this.myform.value["columns"][i]["isVisibilityOn"];
    this.myform.value.columns.forEach((e) => {
      if (e.isVisibilityOn == false) {
        e.visibilityData = null;
        e.fieldValuesData = null;
      }
    });
    return isVisibilityOn;
  }

  onDependentDropdownChanged(event, i, data?) {
    if (data == 0) {
      this.setControl(i);
    }
    let visibleFieldDataFilter = this.visibleFieldData.filter(
      (f) => f._id === event
    );
    if (visibleFieldDataFilter && visibleFieldDataFilter[0]) {
      visibleFieldDataFilter = visibleFieldDataFilter[0];
      if (visibleFieldDataFilter["type"] === "status") {
        this.fieldValues[i] = visibleFieldDataFilter["statusOptions"].map(
          (s) => s.status
        );
      } else {
        this.fieldValues[i] = visibleFieldDataFilter["options"];
      }
    }
    // this.setFieldValues(i, this.filterValue);
  }

  setControl(i) {
    (this.myform.controls.columns as FormArray).controls[i]
      .get("fieldValuesData")
      .setValue([]);
  }

  getTableValues() {
    this.tableService
      .getDynamicTreeData(this.tableNameField, 0, 0, 0, 0, true)
      .subscribe((res: any) => {
        if (res && res.data && res.data.pageOfItems) {
          this.tableData = res.data.pageOfItems;
        }
      });
  }

  setFieldValues(i, valueFilter) {
    if (this.tableData && this.tableData.length > 0) {
      let tempData = this.tableData.map((value) => ({
        id: value["_id"],
        value: value[valueFilter],
      }));
      tempData = tempData.filter(
        (x) => !isNullOrUndefined(x.value) && !isEmpty(x.value)
      );
      this.fieldValues[i] = [
        ...new Map(tempData.map((item) => [item["value"], item])).values(),
      ];
    }
  }

  isTypeFile(i) {
    const type = this.myform.value["columns"][i]["type"];
    return type == "file";
  }

  addColumn() {
    this.columnsArr.push(this.addColumnGroup());
    this.scrollToElement();
  }

  removeColumn(index) {
    const id = (this.myform.controls.columns as FormArray).controls[index].get(
      "_id"
    ).value;
    if (id) {
      this.removeId.push(id);
    }
    this.columnsArr.removeAt(index);
    this.options.splice(index, 1);
    this.lookupTableFields.splice(index, 1);
    this.lookupTableId.splice(index, 1);
    this.imageURL.splice(index, 1);
  }

  onFieldLabelChange(value: string, i: number) {
    const columns = this.myform.controls.columns as FormArray;

    if (columns.controls[i].get("label").value.toLowerCase() == "subform") {
      columns.controls[i].get("label").setValue("");
      columns.controls[i].get("name").setValue("");
      this.toastrService.warning("SubForm as a label is not allowed.", "Error")
      return;
    }
    if (!columns.controls[i].get("_id").value) {

      const uniqueName = _.camelCase(value);
      if (this.checkDuplicateName(i, uniqueName)) {
        columns.controls[i].get("name").setValue(uniqueName);
      }
    }
  }

  checkDuplicateName(i, value) {
    const columsArr = this.myform.controls.columns as FormArray;
    let valid = true;
    columsArr.controls.forEach((con, index) => {
      const name = con.get("name").value;
      if (valid && name.length) {
        if (value == name && index != i) {
          valid = false;
          columsArr.controls[i].get("label").setErrors({ duplicate: true });
          this.columnsArr.controls[i].get("name").setValue("");
        } else {
        }
      }
    });
    return valid;
  }

  get columnsArr() {
    return <FormArray>this.myform.get("columns");
  }

  getFieldValue(type) {
    if (type === 'text') {
      return 'Text Box';
    } else if (type === 'area') {
      return 'Text Area';
    } else if (type === 'richTextArea') {
      return 'Rich Text Area';
    } else if (type === 'checkbox') {
      return 'Check Box';
    } else if (type === 'radio') {
      return 'Radio';
    } else if (type === 'dropdown') {
      return 'Dropdown';
    } else if (type === 'dropdownWithImage') {
      return 'Dropdown With Image';
    } else if (type === 'recordType') {
      return 'Record Type';
    } else if (type === 'date') {
      return 'Date';
    } else if (type === 'dateTime') {
      return 'Date Time';
    } else if (type === 'lookup') {
      return 'LookUp';
    } else if (type === 'number') {
      return 'Number';
    } else if (type === 'file') {
      return 'File';
    } else if (type === 'status') {
      return 'Status';
    } else if (type === 'autoNumber') {
      return 'Auto Number';
    } else if (type === 'time') {
      return 'Time';
    } else if (type === 'section') {
      return 'Section';
    } else if (type === 'injectSubForm') {
      return 'Inject Sub-form';
    } else if (type === 'formula') {
      return 'Formula';
    } else if (type === 'rollUp') {
      return 'Roll Up';
    } else if (type === 'refButton') {
      return 'Reference Button';
    } else if (type === 'gadget') {
      return 'Gadget';
    } else {
      return 'None';
    }

  }

  addOptions(i) {
    const type = this.myform.value["columns"][i]["type"];
    const tableValue = this.myform.value["columns"];
    if (type == "lookup") {
      this.openLookUpModal(i);
    } else if (type == "status") {
      this.openAddStatusModal(i);
    } else if (type == "dateTime" || type == "date") {
      this.openAddDateTimeModal(i);
    } else if (type == "rollUp") {
      this.openRollUpModal(i, tableValue);
    } else if (type == "dropdownWithImage") {
      this.openAddDropdownImageModal(i);
    }
    else {
      this.openAddOptionsModal(i, type);
    }
  }


  openRollUpModal(i, tableValue) {

    let subFormTableArray = [];

    this.rollUpFormTableData = this.tempEditData.subFormLookups;

    if (this.rollUpFormTableData) {
      this.rollUpFormTableData.forEach(ele => {
        subFormTableArray.push(ele.tableName)
      })
    }
    const items = this.options[i];
    this.dialogService
      .open(ColumnRollUpDialogComponent, {
        context: { mainTable: tableValue, items: items, tableVlaues: subFormTableArray, parentForms: JSON.parse(JSON.stringify(this.parentFormsForRollup)) },
      })
      .onClose.subscribe((res) => {
        if (res) {
          (this.myform.controls.columns as FormArray).controls[i]
            .get("options")
            .setValue(res);
          this.options[i] = res;
        }
        const ele = document.getElementById('add-plus-icon' + i);
        ele.scrollIntoView();
        window.scrollBy(0,-350);
      });

  }

  openAddStatusModal(i) {
    const items = (this.myform.controls.columns as FormArray).controls[i].get(
      "statusOptions"
    ).value;
    this.dialogService
      .open(ColumnStatusComponent, { context: { items: items } })
      .onClose.subscribe((options) => {
        if (options) {
          (this.myform.controls.columns as FormArray).controls[i]
            .get("statusOptions")
            .setValue(options.statusList);
          if (options.defaultVal) {
            (this.myform.controls.columns as FormArray).controls[i]
              .get("defaultOptionValue")
              .setValue(options.defaultVal);

          }
          this.options[i] = options;
        }
        const ele = document.getElementById('add-plus-icon' + i);
        ele.scrollIntoView();
        window.scrollBy(0,-350);
      });
  }

  openAddDropdownImageModal(i) {
    const items = (this.myform.controls.columns as FormArray).controls[i].get(
      "options"
    ).value;
    this.dialogService
      .open(ColumnDropdownImageComponent, { context: { items: items } })
      .onClose.subscribe((res) => {
        if (res) {
          (this.myform.controls.columns as FormArray).controls[i]
            .get("options")
            .setValue(res);
          this.options[i] = res;
        }
        const ele = document.getElementById('add-plus-icon' + i);
        ele.scrollIntoView();
        window.scrollBy(0,-350);
      });
  }

  openAddOptionsModal(i, type?) {
    const items = this.options[i];
    const value = (this.myform.controls.columns as FormArray).controls[i].value
      .defaultOptionValue;
    this.dialogService
      .open(ColumnOptionDialogComponent, {
        context: { items: items, isSelected: value, columnType: type ? type : '' },
      })
      .onClose.subscribe((res) => {
        if (res) {
          (this.myform.controls.columns as FormArray).controls[i]
            .get("options")
            .setValue(res.options);
          (this.myform.controls.columns as FormArray).controls[i]
            .get("defaultOptionValue")
            .setValue(res.defaultVal);
          this.options[i] = res.options;
        }
        const ele = document.getElementById('add-plus-icon' + i);
        ele.scrollIntoView();
        window.scrollBy(0,-350);
      });
  }

  openAddDateTimeModal(i) {
    const dateTimeOptions = (this.myform.controls
      .columns as FormArray).controls[i].get("dateTimeOptions").value;
    let recordType;
    if (this.tempEditData) {
      this.tempEditData.columns.forEach((element) => {
        if (element.type == "recordType") {
          recordType = element.options;
        }
      });
    }

    this.dialogService
      .open(ColumnDateTimeDialogComponent, {
        context: { recordType: recordType, dateTimeOptions: dateTimeOptions },
      })
      .onClose.subscribe((options) => {
        if (options) {
          (this.myform.controls.columns as FormArray).controls[i]
            .get("dateTimeOptions")
            .setValue(options);
          this.options[i] = options;
        }
        const ele = document.getElementById('add-plus-icon' + i);
        ele.scrollIntoView();
        window.scrollBy(0,-300);
      });
  }

  openLookUpModal(i) {
    const columArray = (this.myform.controls.columns as FormArray).controls[i];
    const lookUpData = {
      tableData: this.allTableData,
      tableId: columArray.get("lookupTableId").value,
      fields: columArray.get("lookupTableFields").value,
      fieldNames: columArray.get("lookupTableFieldNames").value,
      isLookupRepPrimaryObject: columArray.get("isLookupRepPrimaryObject")
        .value,
      mappedFields: columArray.get("mappedFields")
        ? columArray.get("mappedFields").value
        : {},
      filters: columArray.get("filters")
        ? columArray.get("filters").value
        : [],
      currentTableData: this.tempEditData.columns,
    };
    this.dialogService
      .open(LookUpDialogComponent, {
        context: lookUpData,
      })
      .onClose.subscribe((data) => {
        if (data) {
          const arrControls = (this.myform.controls.columns as FormArray)
            .controls[i];
          arrControls.get("lookupTableId").setValue(data.tableId);
          arrControls.get("lookupTableFields").setValue(data.columnId);
          arrControls.get("lookupTableFieldNames").setValue(data.columnName);
          arrControls.get("lookupTableName").setValue(data.tableName);
          arrControls.get("isLookupRepPrimaryObject").setValue(data.isPrimary);
          arrControls.get("mappedFields").setValue(data.mappedFields);
          arrControls.get("filters").setValue(data.filters);
          this.lookupTableId[i] = data.tableId;
          this.lookupTableFields[i] = data.columnId;
        }

        const ele = document.getElementById('add-plus-icon' + i);
        ele.scrollIntoView();
        window.scrollBy(0,-350);
      });
  }

  openForm(i: number) {
    const formValue = (this.myform.controls.columns as FormArray).controls[i];
    this.dialogService
      .open(AdditionalFormDialogComponent, {
        context: { tableform: formValue },
      })
      .onClose.subscribe((data) => {
        if (data) {
          formValue.get("isSearchable").setValue(data.isSearchable);
          formValue.get("displayInList").setValue(data.displayInList);
          formValue.get("displayInTreeTable").setValue(data.displayInTreeTable);
          formValue
            .get("allowMultipleValues")
            .setValue(data.allowMultipleValues);
          formValue.get("idField").setValue(data.idField);
          formValue.get("isWorkFlowField").setValue(data.isWorkFlowField);
          formValue.get("isReadOnly").setValue(data.isReadOnly);
          formValue.get("isVisibilityOn").setValue(data.isVisibilityOn);
          formValue.get("loadAsDropDown").setValue(data.loadAsDropDown);
          formValue.get("recordHistory").setValue(data.recordHistory);
          formValue.get("isReference").setValue(data.isReference);
        }
      });
  }

  loadTutorial(fieldName) {
    const query = `tutorialFor=Feidl&tableName=${this.tableNameField}&fieldName=${fieldName}`;
    this.tableService.getTutorials(query).subscribe((res: any) => {
      if (res.data) {
        this.tutorialText = res.data.text;
      }
    });
  }

  onFileChange(event, i) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      (this.myform.controls.columns as FormArray).controls[i].get("icon").setValue(file);
      this.uploadIcon(i);
    }
  }

  checkColumnValidation(index) {
    this.columnArray = (this.myform.controls.columns as FormArray).controls[index];
    if (this.columnArray.controls?.type.value == 'lookup') {
      this.columnArray.controls['lookupTableId'].setValidators(Validators.required);
      this.columnArray.controls['lookupTableFields'].setValidators(Validators.required);
      this.columnArray.controls['lookupTableName'].setValidators(Validators.required);
      this.columnArray.controls['lookupTableFieldNames'].setValidators(Validators.required);
      this.columnArray.controls['lookupTableId'].updateValueAndValidity();
      this.columnArray.controls['lookupTableFields'].updateValueAndValidity();
      this.columnArray.controls['lookupTableName'].updateValueAndValidity();
      this.columnArray.controls['lookupTableFieldNames'].updateValueAndValidity();
    }
    if (this.columnArray.controls?.type.value != 'lookup') {
      this.columnArray.controls['lookupTableId'].clearValidators();
      this.columnArray.controls['lookupTableFields'].clearValidators();
      this.columnArray.controls['lookupTableName'].clearValidators();
      this.columnArray.controls['lookupTableFieldNames'].clearValidators();
      this.columnArray.controls['lookupTableId'].updateValueAndValidity();
      this.columnArray.controls['lookupTableFields'].updateValueAndValidity();
      this.columnArray.controls['lookupTableName'].updateValueAndValidity();
      this.columnArray.controls['lookupTableFieldNames'].updateValueAndValidity();
    }
  }
}
