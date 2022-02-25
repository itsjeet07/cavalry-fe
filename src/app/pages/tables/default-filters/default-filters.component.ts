import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddEditDefaultFiltersComponent } from "@app/pages/tables/add-edit-default-filters/add-edit-default-filters.component";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { TableService } from '@shared/services/table.service';

@Component({
  selector: 'ngx-default-filters',
  templateUrl: './default-filters.component.html',
  styleUrls: ['./default-filters.component.scss']
})
export class DefaultFiltersComponent implements OnInit {

  @Input() tableDetails;
  public actions = [];
  public loading: boolean = false;
  data = [];

  constructor(
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private tableService: TableService,
    private router:Router,
  ) {
  }

  ngOnInit(): void {
    if (this.tableDetails && this.tableDetails.actions) {
      this.getList(this.tableDetails._id);
      this.actions = this.tableDetails.actions;
    } else {
      this.actions = [];
    }
  }

  getList(id) {
    this.tableService.defaultFilterList(id).subscribe((re: any) => {
      if (re.statusCode == 200) {
        console.log(re);
        this.data = re.data;
      } else {
        this.toastrService.danger(re.message);
      }
    })
  }

  addActions(edit?, id?, item?) {
    this.dialogService
      .open(AddEditDefaultFiltersComponent, {
        context: {
          tableData: this.tableDetails,
          addFlag: !edit,
          editFlag: edit ? id : false,
          itemData: item,
          actionData: null,
        },
      })
      .onClose.subscribe((res) => {
        this.getList(this.tableDetails._id);
        if (res) {
          this.loading = true;
          let tempData = [...this.actions];
          if (!this.actions || !this.actions.length) {
            this.actions = [];
          }
          this.actions.push(res);

          // Call api to save actions
          this.tableDetails['actions'] = this.actions;
          this.tableService.updateMainTable(this.tableDetails).subscribe(
            (res: any) => {
              if (res.statusCode === 200) {
                this.toastrService.success(res.message);
                this.loading = false;
              } else {
                // Undo list if error saving data
                this.actions = [...tempData];
                this.loading = false;
                this.toastrService.danger(res.message);
              }
            },
            (error) => {
              // Undo list if error saving data
              this.actions = [...tempData];
              this.loading = false;
            }
          );
        }
      });
  }

  editAction(i) {
    this.dialogService
      .open(AddEditDefaultFiltersComponent, {
        context: {
          tableData: this.tableDetails,
          addFlag: false,
          editFlag: true,
          actionData: this.actions[i] ? this.actions[i] : {},
        },
      })
      .onClose.subscribe((res) => {
        if (res) {
          this.loading = true;
          let tempData = [...this.actions];
          if (this.actions[i]) {
            this.actions[i] = res;
          } else {
            this.actions.push(res);
          }
          // Call api to save actions
          this.tableDetails['actions'] = this.actions;
          this.tableService.updateMainTable(this.tableDetails).subscribe(
            (res: any) => {
              if (res.statusCode === 200) {
                this.toastrService.success(res.message);
                this.loading = false;
              } else {
                // Undo list if error saving data
                this.actions = [...tempData];
                this.loading = false;
                this.toastrService.danger(res.message);
              }
            },
            (error) => {
              // Undo list if error saving data
              this.actions = [...tempData];
              this.loading = false;
            }
          );
        }
      });
  }

  deleteFilter(id) {
    this.tableService.deleteFilter(id).subscribe(
      (res: any) => {
        if (res.statusCode === 200) {
          this.toastrService.success(res.message);
          this.getList(this.tableDetails._id);
          this.loading = false;
        } else {
          this.loading = false;
          this.toastrService.danger(res.message);
        }
      },
      (error) => {
        // Undo list if error saving data
        this.loading = false;
      }
    );
  }

  onEdit(){
    this.router.navigate(['pages/tables/edit/' + this.tableDetails._id])
  }
}
