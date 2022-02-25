import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TableService } from "@app/shared/services/table.service";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { AddEditActionsConfigComponent } from "../add-edit-actions-config/add-edit-actions-config.component";

@Component({
  selector: "ngx-actions-template-config",
  templateUrl: "./actions-template-config.component.html",
  styleUrls: ["./actions-template-config.component.scss"],
})
export class ActionsTemplateConfigComponent implements OnInit {
  @Input() tableDetails;
  public actions = [];
  public loading: boolean = false;
  constructor(
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private tableService: TableService,
    private router:Router,
  ) {}

  ngOnInit(): void {
    if(this.tableDetails && this.tableDetails.actions){
      this.actions = this.tableDetails.actions;
    }else{
      this.actions = [];
    }
  }

  addActions() {
    this.dialogService
      .open(AddEditActionsConfigComponent, {
        context: {
          tableData: this.tableDetails,
          addFlag: true,
          editFlag: false,
          actionData: null,
        },
      })
      .onClose.subscribe((res) => {
        if(res){
          this.loading = true;
          let tempData = [...this.actions];
          if(!this.actions || !this.actions.length){
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

  editAction(i){
    this.dialogService
      .open(AddEditActionsConfigComponent, {
        context: {
          tableData: this.tableDetails,
          addFlag: false,
          editFlag: true,
          actionData: this.actions[i]?this.actions[i]:{},
        },
      })
      .onClose.subscribe((res) => {
        if(res){
          this.loading = true;
          let tempData = [...this.actions];
          if(this.actions[i]){
            this.actions[i] = res;
          }else{
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

  deleteAction(i){
    let tempData = [...this.actions];
    this.actions.splice(i, 1);
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

  onEdit(){
    this.router.navigate(['pages/tables/edit/' + this.tableDetails._id])
  }

}
