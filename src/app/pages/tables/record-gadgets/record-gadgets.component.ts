import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableService } from '@app/shared/services/table.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { AddEditRecordGadgetComponent } from '../add-edit-record-gadget/add-edit-record-gadget.component';

@Component({
  selector: 'ngx-record-gadgets',
  templateUrl: './record-gadgets.component.html',
  styleUrls: ['./record-gadgets.component.scss']
})
export class RecordGadgetsComponent implements OnInit {

  @Input() tableDetails;
  public recordGadgets = [];
  public loading: boolean = false;
  constructor(
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private tableService: TableService,
    private router:Router,
  ) {}

  ngOnInit(): void {
    if(this.tableDetails && this.tableDetails.recordGadgets){
      this.recordGadgets = this.tableDetails.recordGadgets;
    }else{
      this.recordGadgets = [];
    }
  }

  addRecord() {
    this.dialogService
      .open(AddEditRecordGadgetComponent, {
        context: {
          tableData: this.tableDetails,
          addFlag: true,
          editFlag: false,
          recordData: null,
        },
      })
      .onClose.subscribe((res) => {
        if(res){
          this.loading = true;
          let tempData = [...this.recordGadgets];
          if(!this.recordGadgets || !this.recordGadgets.length){
            this.recordGadgets = [];
          }
          this.recordGadgets.push(res);

          // Call api to save actions
          this.tableDetails['recordGadgets'] = this.recordGadgets;
          this.tableService.updateMainTable(this.tableDetails).subscribe(
            (res: any) => {
              if (res.statusCode === 200) {
                this.toastrService.success(res.message);
                this.loading = false;
              } else {
                // Undo list if error saving data
                this.recordGadgets = [...tempData];
                this.loading = false;
                this.toastrService.danger(res.message);
              }
            },
            (error) => {
              // Undo list if error saving data
              this.recordGadgets = [...tempData];
              this.loading = false;
            }
          );
        }
      });
  }

  editRecord(i){
    this.dialogService
      .open(AddEditRecordGadgetComponent, {
        context: {
          tableData: this.tableDetails,
          addFlag: false,
          editFlag: true,
          recordData: this.recordGadgets[i]?this.recordGadgets[i]:{},
        },
      })
      .onClose.subscribe((res) => {
        if(res){
          this.loading = true;
          let tempData = [...this.recordGadgets];
          if(this.recordGadgets[i]){
            this.recordGadgets[i] = res;
          }else{
            this.recordGadgets.push(res);
          }
          // Call api to save actions
          this.tableDetails['recordGadgets'] = this.recordGadgets;
          this.tableService.updateMainTable(this.tableDetails).subscribe(
            (res: any) => {
              if (res.statusCode === 200) {
                this.toastrService.success(res.message);
                this.loading = false;
              } else {
                // Undo list if error saving data
                this.recordGadgets = [...tempData];
                this.loading = false;
                this.toastrService.danger(res.message);
              }
            },
            (error) => {
              // Undo list if error saving data
              this.recordGadgets = [...tempData];
              this.loading = false;
            }
          );
        }
      });
  }

  deleteRecord(i){
    let tempData = [...this.recordGadgets];
    this.recordGadgets.splice(i, 1);
    // Call api to save actions
    this.tableDetails['recordGadgets'] = this.recordGadgets;
    this.tableService.updateMainTable(this.tableDetails).subscribe(
      (res: any) => {
        if (res.statusCode === 200) {
          this.toastrService.success(res.message);
          this.loading = false;
        } else {
          // Undo list if error saving data
          this.recordGadgets = [...tempData];
          this.loading = false;
          this.toastrService.danger(res.message);
        }
      },
      (error) => {
        // Undo list if error saving data
        this.recordGadgets = [...tempData];
        this.loading = false;
      }
    );
  }

  onEdit(){
    this.router.navigate(['pages/tables/edit/' + this.tableDetails._id])
  }
}
