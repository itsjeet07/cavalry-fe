import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TableService } from "@app/shared/services/table.service";
import { FormGroup, FormBuilder, FormControl, FormArray, RequiredValidator, Validators } from '@angular/forms';
import { NbToastrService, NbDialogService, NbMenuService } from "@nebular/theme";
import { isNullOrUndefined } from "util";
import { ChartFilterDialogComponent } from "@shared/components/chart-filter-dialog/chart-filter-dialog.component";
import { DependenciesComponent } from "../dependencies/dependencies.component";
import { formatDate } from "@angular/common";
import { filter, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { PublishDialogComponent } from '../../../shared/components/dialog/publish-dialog/publish-dialog.component';

@Component({
  selector: "ngx-table-config",
  templateUrl: "./table-config.component.html",
  styleUrls: ["./table-config.component.scss"],
})
export class TableConfigComponent implements OnInit {
  public dependenciesList: any = [];
  myform: FormGroup;
  iconData: any;
  id: string;
  tableDetails: any = {};
  isTableData = false;
  loading = false;
  displayChart = false;
  displayOverviewCheck = false;
  showUndependentOptions = false;
  isLookup = {};
  groupByValues: any[] = [];
  groupByFields;
  charts;
  lookupTable = [];
  parentLookupFields = [];
  lookupFieldTable = [];
  public masterDetailTableFields = [];
  displayTable = false;
  showLookupTable = false;
  lookupData = [];
  isMasterDetail = false;
  masterDetail = {};
  tableName;
  label: any;
  lookupName: any;
  selectedSubFormLookups = [];
  subFormData = [];
  subFormObj = {
    tableName: '',
    lookupName: ''
  }
  userDetailData;
  items = [];
  selectedItem = 'TableConfiguration';
  pipeRefreshCount = 0;
  showTableDetails: boolean = false;

  overview;
  private destroy$ = new Subject<void>();
  constructor(
    private service: TableService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastrService: NbToastrService,
    private cdr: ChangeDetectorRef,
    private dialogService: NbDialogService,
    private menuService: NbMenuService,
  ) {
    this.subFormData.push({ ...this.subFormObj });
  }

  ngOnInit(): void {
    this.userDetail();
    this.myform = this.fb.group({
      allowSubtree: [null],
      displayInMenu: [null],
      showChats: [true],
      includeTasks: [null],
      viewInModal: [null],
      tabOrder: [null],
      iconLocation: [""],
      file: [null],
      _id: [""],
      displayChart: [null],
      displayOverviewCheck: [null],
      masterDetail: [null],
      addRecordFromMainListing: [true],
      addRecordFromRelatedListing: [true],
      quickAction: [false],
      customLabelForAddForm: [null],
      customLabelForEditForm: [null],
      formHeight: [null],
      formWidth: [null],
      fieldAlignment: [null],
      charts: this.fb.array([this.addChart()]),
      overview: this.fb.array([this.addOverview()])
    });
    this.route.params.subscribe((res) => {
      this.id = res["tableId"];
      this.selectedItem = res["selectedMenu"] ? res["selectedMenu"] : this.selectedItem;
      this.service.getTableDetails(this.id).subscribe((res: any) => {
        console.log("res ", res);
        if (res && res?.data[0]) {
          this.tableDetails = res.data[0];
          this.getRelatedTable();

          this.showTableDetails = true;
          this.subFormData = this.tableDetails.subFormLookups

          //call api for getting lookups for subForm relation
          this.service.getLookupsSubFormRelation(this.tableDetails.tableName).subscribe((res: any) => {
            if (res && res?.data[0]) {
              this.lookupTable = res.data;

            }
          });
        }
        this.isTableData = true;
        this.showUndependentOptions = this.tableDetails.columns[0].showUndependentOptions;
        this.getDependenciesData();
        this.displayChart = this.tableDetails.displayChart;
        this.cdr.detectChanges();
        this.charts = this.tableDetails.charts;
        this.overview = this.tableDetails.overview;
        if (this.charts && this.charts.length > 0) {
          this.myform.setControl("charts", this.setChartData(this.charts));
        }
        if (this.overview && this.overview.length > 0) {
          this.myform.setControl("overview", this.setOverviewData(this.overview));
        }
        this.groupByFields = this.tableDetails.columns.filter((e: any) => {
          return (
            e.type == "dropdown" ||
            e.type == "status" ||
            e.type == "recordType" ||
            e.type == "lookup" ||
            e.type == "dropdownWithImage"
          );
        });
        _id: new FormControl(""),
          this.myform.patchValue({
            allowSubtree: res.data[0].allowSubtree,
            displayInMenu: res.data[0].displayInMenu,
            showChats: res.data[0].hasOwnProperty('showChats') ? res.data[0].showChats : true,
            includeTasks: res.data[0].includeTasks,
            viewInModal: res.data[0].viewInModal,
            displayChart: res.data[0].displayChart,
            tabOrder: res.data[0].tabOrder,
            iconLocation: res.data[0].iconLocation,
            masterDetail: res.data[0].isMasterDetail,
            customLabelForAddForm: res.data[0].customLabelForAddForm,
            customLabelForEditForm: res.data[0].customLabelForEditForm,
            formHeight: res.data[0].formHeight,
            formWidth: res.data[0].formWidth,
            fieldAlignment: res.data[0].fieldAlignment,
            addRecordFromMainListing: res.data[0].hasOwnProperty('addRecordFromMainListing') ? res.data[0].addRecordFromMainListing : true,
            addRecordFromRelatedListing: res.data[0].hasOwnProperty('addRecordFromRelatedListing') ? res.data[0].addRecordFromRelatedListing : true,
            quickAction: res.data[0].hasOwnProperty('quickAction') ? res.data[0].quickAction : false,
            _id: res.data[0]._id,
          });
        if (res && res.data[0].isMasterDetail) {
          this.getTableDetail();
          this.tableName = res.data[0].masterDetail.lookupId;
          this.displayTable = true;
          this.showLookupTable = true;
        }
        this.setMenuItem();

        console.log(this.groupByFields)
      });
    });

  }

  publishButtonFlag = false;
  userDetail() {
    this.service.userDetail().subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.userDetailData = res;
        if (this.userDetailData.isMasterApp) {
          this.publishButtonFlag = true;
        } else {
          this.publishButtonFlag = false;
        }

      }
    });
  }

  relatedTableList = [];
  getRelatedTable() {
    this.service.getRelatedLookupDataByTableName(this.tableDetails.tableName).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.relatedTableList = res.data;
        console.log("related data", this.relatedTableList)
      }
    });
  }

  setMenuItem() {
    this.items = [
      {
        title: 'Table Configuration',
        link: `/pages/tables/tableConfig/${this.id}/TableConfiguration`,

      },
      {
        title: 'Dependencies',
        link: `/pages/tables/tableConfig/${this.id}/Dependencies`,
      },
      {
        title: 'Charts',
        link: `/pages/tables/tableConfig/${this.id}/Charts`,
      },
      {
        title: 'Overview Setup',
        link: `/pages/tables/tableConfig/${this.id}/OverviewSetup`,
      },
      {
        title: 'Filters',
        link: `/pages/tables/tableConfig/${this.id}/default-filters`,
      }
    ]
    if (this.isTableData) {
      this.items.push({
        title: 'Email Template',
        link: `/pages/tables/tableConfig/${this.id}/EmailTemplate`,
      })
      this.items.push(
        {
          title: 'Actions',
          link: `/pages/tables/tableConfig/${this.id}/Actions`,
        });
      this.items.push(
        {
          title: 'Documents',
          link: `/pages/tables/tableConfig/${this.id}/Documents`,
        });
      this.items.push({
        title: 'Record gadgets',
        link: `/pages/tables/tableConfig/${this.id}/record-gadgets`,
      });
      this.items.push({
        title: 'Validations',
        link: `/pages/tables/tableConfig/${this.id}/validations`,
      });
    }
    const itemIndex = this.items.findIndex(({ link }) => link.includes(this.selectedItem));
    if (itemIndex > -1) {
      this.items[itemIndex].selected = true;
    }
  }

  addSubFormData() {
    this.pipeRefreshCount += 1;
    this.subFormData.push({ ...this.subFormObj });
  }

  deleteSubFormLookup(idx) {
    if (this.subFormData.length == 1) {
      this.subFormData = [];
      this.subFormData.push({ ...this.subFormObj });
    } else {
      this.subFormData.splice(idx, 1);
    }

  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.myform.get("iconLocation").setValue(file);
    }
  }

  onSubmit() {
    try {
      if (this.myform.get("iconLocation").value && this.myform.get("iconLocation").value instanceof File) {
        this.uploadIcon();
      } else {
        this.updateMainTable();
      }
    } catch (error) {
      console.log('error ', error);
    }
  }

  uploadIcon() {
    const formData = new FormData();
    formData.append("file", this.myform.get("iconLocation").value);
    this.service.uploadMedia(formData).subscribe((res: any) => {
      if (res.statusCode === 201) {
        this.iconData = res.data[0];
        this.myform.get("iconLocation").setValue(this.iconData);
        this.updateMainTable();
      }
    });
  }

  updateMainTable() {

    const obj = {
      allowSubtree: this.myform.value.allowSubtree,
      displayInMenu: this.myform.value.displayInMenu,
      showChats: this.myform.value.showChats,
      includeTasks: this.myform.value.includeTasks,
      viewInModal: this.myform.value.viewInModal,
      displayChart: this.myform.value.displayChart,
      tabOrder: this.myform.value.tabOrder,
      iconLocation: this.myform.value.iconLocation,
      isMasterDetail: this.myform.value.masterDetail,
      customLabelForAddForm: this.myform.value.customLabelForAddForm,
      customLabelForEditForm: this.myform.value.customLabelForEditForm,
      formHeight: this.myform.value.formHeight,
      formWidth: this.myform.value.formWidth,
      fieldAlignment: this.myform.value.fieldAlignment,
      addRecordFromMainListing: this.myform.value.addRecordFromMainListing,
      addRecordFromRelatedListing: this.myform.value.addRecordFromRelatedListing,
      quickAction: this.myform.value.quickAction,
      masterDetail: {
        ...this.masterDetail,
      },
      subFormLookups: this.showLookupTable ? this.subFormData : [],
      _id: this.myform.value._id,
    };
    this.service.updateMainTable(obj).subscribe((data: any) => {
      if (data.statusCode === 200) {
        this.toastrService.success(data.message, "Action was successful");
        this.loading = false;
        this.service.refreshHeaderComponent();
      } else {
        this.loading = false;
        this.toastrService.danger(data.message, "Action was unsuccessful!");
      }
    });
  }

  showChatCard(event) {
    this.displayChart = event.target.checked;
    // if (!this.displayChart){
    //   this.chartList.clear();
    // } else{
    //   this.chartList.push(this.addChart());
    // }
    this.cdr.detectChanges();
  }

  showOverviewDropdown(event) {
    this.displayOverviewCheck = event.target.checked;
    // if (!this.displayOverviewCheck){
    //   this.overviewList.clear();
    // } else{
    //   this.overviewList.push(this.addOverview());
    // }

    this.cdr.detectChanges();

  }
  showMasterDetail(event) {
    this.displayTable = event.target.checked;
    if (event.target.checked && this.tableName) {
      this.showLookupTable = true;
    }
    if (!event.target.checked) {
      this.showLookupTable = false;
    }
    this.getTableDetail();
  }
  getTableDetail() {
    this.lookupFieldTable = [];
    this.service
      .getTableByName(this.tableDetails?.tableName)
      .subscribe((res: any) => {
        //set subFormLookups dropdown.
        this.selectedSubFormLookups = res.data[0].subFormLookups

        let data = res.data[0].columns;
        let data2;
        data = data.filter((item) => item.type == "lookup");
        data2 = data;
        if (this.tableName) {
          const table = data.filter((item) => item._id == this.tableName);
          this.label = table[0]?.lookupTableName;
          let lookuptable = data2.filter(
            (item) => item.lookupTableName == this.label
          );
          this.lookupFieldTable = lookuptable;
          lookuptable = lookuptable.filter(
            (item) => item._id == this.tableName
          );
          this.lookupName = lookuptable[0].name;
        } else {
          this.lookupFieldTable = data;
        }
        this.lookupData = data;
        const lookupArray = [];
        const lookupObject = {};
        for (var i in data) {
          lookupObject[data[i]["lookupTableName"]] = data[i];
        }
        for (i in lookupObject) {
          lookupArray.push(lookupObject[i]);
        }
        this.lookupTable = lookupArray;
      });
  }
  compareSearchByOption(obj1, obj2) {
    return obj1 == obj2;
  }
  getLookupName(obj1, obj2) {
    return obj1 == obj2;
  }

  onTableSelect(event) {
    this.pipeRefreshCount += 1;

    //this.masterDetail["masterTableId"] = event.value._id;
    this.lookupFieldTable = this.lookupData;
    const lookupName = event.value;
    this.lookupFieldTable = this.lookupFieldTable.filter(
      (item) => item.lookupTableName == lookupName
    );
    this.showLookupTable = true;

    // getTable by name for selected table fields..
    // this.service
    //   .getTableByName(event.value)
    //   .subscribe((res: any) => {
    //     if (res) {
    //       let columns = res.data[0]['columns']
    //       this.masterDetailTableFields = columns.filter(f=>f.type != 'lookup')
    //     }
    //   });
  }

  // onLookupFieldChange(event) {
  //   this.masterDetail["lookupId"] = event.value._id;
  // }

  onGroupByChanged(event, i, data?) {
    this.isLookup[i] = false;

    let groupByField = this.tableDetails.columns.filter((f) => f._id === event);
    if (groupByField && groupByField[0]) {
      groupByField = groupByField[0];
      if (groupByField["type"] === "status") {
        this.groupByValues[i] = groupByField["statusOptions"].map(
          (s) => s.status
        );
      } else if (groupByField["type"] === "lookup") {
        this.isLookup[i] = true;
        this.groupByValues[i] = [];
        groupByField["options"].forEach((el) => {
          const temp: [] = Object.assign([], el);
          temp.shift();
          this.groupByValues[i].push({
            id: el[0],
            value: temp.toString().replace(/,/g, " "),
          });
        });
      } else {
        this.groupByValues[i] = groupByField["options"];
      }
    }
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  onChartSave() {
    this.service
      .updateMainTable({
        _id: this.myform.value._id,
        charts: this.myform.value.charts,
      })
      .subscribe((data: any) => {
        if (data.statusCode === 200) {
          this.toastrService.success(data.message, "Action was successful");
          this.loading = false;
          // this.router.navigate(['pages/tables/list']);
        } else {
          this.loading = false;
          this.toastrService.danger(data.message, "Action was unsuccessful!");
        }
      });
  }

  onOverviewSave() {
    this.service
      .updateMainTable({
        _id: this.myform.value._id,
        overview: this.myform.value.overview,
      })
      .subscribe((data: any) => {
        if (data.statusCode === 200) {
          this.toastrService.success(data.message, "Action was successful");
          this.loading = false;
          // this.router.navigate(['pages/tables/list']);
        } else {
          this.loading = false;
          this.toastrService.danger(data.message, "Action was unsuccessful!");
        }
      });
  }

  addChart(): FormGroup {
    return this.fb.group({
      name: new FormControl(""),
      groupByField: new FormControl(null),
      groupByValue: new FormControl([]),
    });
  }

  addOverview(): FormGroup {
    return this.fb.group({
      tableName: new FormControl('',Validators.required),
    });
  }

  addNewChart() {
    this.chartList.push(this.addChart());
    this.cdr.detectChanges();
  }

  addNewOverviewSetup() {
    this.overviewList.push(this.addOverview());
    this.cdr.detectChanges();
  }

  setChartData(charts): FormArray {
    const formArray = new FormArray([]);
    charts.forEach((c, i) => {
      formArray.push(
        this.fb.group({
          name: c.name,
          groupByField: c.groupByField,
          groupByValue: [c.groupByValue],
        })
      );
      if (!isNullOrUndefined(c.groupByField)) {
        this.onGroupByChanged(c.groupByField, i);
      }
    });
    return formArray;
  }

  setOverviewData(overview): FormArray {
    const formArray = new FormArray([]);
    overview.forEach((c, i) => {
      formArray.push(
        this.fb.group({
          tableName: c.tableName,
        })
      );
    });
    return formArray;
  }

  get chartList() {
    return <FormArray>this.myform.get("charts");
  }

  get overviewList() {
    return <FormArray>this.myform.get("overview");
  }

  removeChart(index) {
    return this.chartList.removeAt(index);
  }

  removeOverview(index) {
    return this.overviewList.removeAt(index);
  }

  getTableDetails() {
    this.ngOnInit();
  }

  onChartFilter(index) {
    this.dialogService
      .open(ChartFilterDialogComponent, {
        context: {
          data: this.charts,
          index: index,
        },
      })
      .onClose.subscribe((data) => {
        if (data) {
          this.myform.value.charts[index].filter = data;
        }
      });
  }

  setIsUndependentOptionFlag(event) {
    //this.showUndependentOptions = event;
    this.tableDetails.columns.forEach((element) => {
      element.showUndependentOptions = event;
    });
    this.service.updateTable(this.tableDetails).subscribe(
      (res: any) => {
        if (res.statusCode === 200) {
          this.toastrService.success("Success", res.message);
        } else {
          this.toastrService.danger("Request failed", res.message);
        }
      },
      (error) => {
        this.toastrService.danger("Failed to delete, please try again");
      }
    );
  }

  addNewDependency() {
    this.dialogService
      .open(DependenciesComponent, {
        context: {
          tableData: this.tableDetails,
          addFlag: true,
          editFlag: false,
          columnId: null,
        },
      })
      .onClose.subscribe((res) => {
        if (res) {
          this.ngOnInit();
        }
      });
  }

  editDependency(id, i) {
    this.dialogService
      .open(DependenciesComponent, {
        context: {
          tableData: this.tableDetails,
          editFlag: true,
          addFlag: false,
          columnId: id,
          dependencyIndex: i,
        },
      })
      .onClose.subscribe((res) => {
        if (res) {
          this.ngOnInit();
        }
      });
  }

  getDependenciesData() {
    this.dependenciesList = this.tableDetails.columns.filter(
      (f) => f.dependencies != undefined
    );
  }

  deleteDependency(id, i) {
    const index = this.tableDetails.columns.findIndex(
      (column) => column._id == id
    );

    if (index < 0) return;

    this.tableDetails.columns[index].dependencies.splice(i, 1);

    this.service.updateTable(this.tableDetails).subscribe(
      (res: any) => {
        if (res.statusCode === 200) {
          this.toastrService.success("Success", res.message);
        } else {
          this.toastrService.danger("Request failed", res.message);
        }
      },
      (error) => {
        this.toastrService.danger("Failed to delete, please try again");
      }
    );
  }

  formatDate(value) {
    if (!value) {
      return "";
    }

    return formatDate(value, "M/d/yy, h:mm a", "en");
  }

  onEdit() {
    this.router.navigate(['pages/tables/edit/' + this.tableDetails._id])
  }

  openPublishModal() {
    this.dialogService
      .open(PublishDialogComponent)
      .onClose.subscribe((data) => {
        if (data) {

        }
      });
  }

  overviewDisableCheck(){
    let flag = false;
    if(this.myform.get("overview").value && this.myform.get("overview").value.length){
      this.myform.get("overview").value.forEach(element => {
        if(!element.tableName){
          flag = true;
        }
      });
    }
    return flag;
  }
}

export class OverViewSetupArray {
  tableName;
  constructor() {
    this.tableName = '';
  }
}
