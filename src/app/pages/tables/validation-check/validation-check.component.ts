import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableService } from '@app/shared/services/table.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { AddEditValidationCheckComponent } from '../add-edit-validation-check/add-edit-validation-check.component';

@Component({
  selector: 'ngx-validation-check',
  templateUrl: './validation-check.component.html',
  styleUrls: ['./validation-check.component.scss']
})
export class ValidationCheckComponent implements OnInit {

  @Input() tableDetails;
  public validations = [];
  public loading: boolean = false;
  constructor(
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private tableService: TableService,
    private router:Router
  ) {}

  ngOnInit(): void {
    if(this.tableDetails && this.tableDetails.customValidations){
      this.validations = this.tableDetails.customValidations;
    }else{
      this.validations = [];
    }
  }

  addRecord() {
    this.dialogService
      .open(AddEditValidationCheckComponent, {
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
          let tempData = [...this.validations];
          if(!this.validations || !this.validations.length){
            this.validations = [];
          }
          this.validations.push(res);

          // Call api to save actions
          this.tableDetails['customValidations'] = this.validations;
          this.tableService.updateMainTable(this.tableDetails).subscribe(
            (res: any) => {
              if (res.statusCode === 200) {
                this.toastrService.success(res.message);
                this.loading = false;
              } else {
                // Undo list if error saving data
                this.validations = [...tempData];
                this.loading = false;
                this.toastrService.danger(res.message);
              }
            },
            (error) => {
              // Undo list if error saving data
              this.validations = [...tempData];
              this.loading = false;
            }
          );
        }
      });
  }

  editRecord(i){
    this.dialogService
      .open(AddEditValidationCheckComponent, {
        context: {
          tableData: this.tableDetails,
          addFlag: false,
          editFlag: true,
          recordData: this.validations[i]?this.validations[i]:{},
        },
      })
      .onClose.subscribe((res) => {
        if(res){
          this.loading = true;
          let tempData = [...this.validations];
          if(this.validations[i]){
            this.validations[i] = res;
          }else{
            this.validations.push(res);
          }
          // Call api to save actions
          this.tableDetails['customValidations'] = this.validations;
          this.tableService.updateMainTable(this.tableDetails).subscribe(
            (res: any) => {
              if (res.statusCode === 200) {
                this.toastrService.success(res.message);
                this.loading = false;
              } else {
                // Undo list if error saving data
                this.validations = [...tempData];
                this.loading = false;
                this.toastrService.danger(res.message);
              }
            },
            (error) => {
              // Undo list if error saving data
              this.validations = [...tempData];
              this.loading = false;
            }
          );
        }
      });
  }

  deleteRecord(i){
    let tempData = [...this.validations];
    this.validations.splice(i, 1);
    // Call api to save actions
    this.tableDetails['customValidations'] = this.validations;
    this.tableService.updateMainTable(this.tableDetails).subscribe(
      (res: any) => {
        if (res.statusCode === 200) {
          this.toastrService.success(res.message);
          this.loading = false;
        } else {
          // Undo list if error saving data
          this.validations = [...tempData];
          this.loading = false;
          this.toastrService.danger(res.message);
        }
      },
      (error) => {
        // Undo list if error saving data
        this.validations = [...tempData];
        this.loading = false;
      }
    );
  }

  onEdit(){
    this.router.navigate(['pages/tables/edit/' + this.tableDetails._id])
  }
}
