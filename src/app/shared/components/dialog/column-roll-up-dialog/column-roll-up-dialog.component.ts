import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { TableService } from "@app/shared/services/table.service";
import { NbDialogRef, NbToastrService } from "@nebular/theme";

@Component({
  selector: "ngx-column-roll-up-dialog",
  templateUrl: "./column-roll-up-dialog.component.html",
  styleUrls: ["./column-roll-up-dialog.component.scss"],
})
export class ColumnRollUpDialogComponent implements OnInit {
  loading = false;
  rollUpValue = [];
  numberFieldArray = [];
  mainTableNumberFieldArray = [];
  aggreArray = ["Sum", "Count"];

  @Input() items;
  @Input() tableVlaues;
  @Input() mainTable;
  @Input() parentForms = {};
  parentFormsNumberFields = [];
  options = [];
  values = [];
  codeMirrorConfig = {
    lineNumbers: true,
    mode: "htmlmixed",
    lineWrapping: false,
    theme: "monokai",
  };
  @ViewChild("myForm", { read: NgForm }) myForm: any;
  constructor(
    protected ref: NbDialogRef<ColumnRollUpDialogComponent>,
    private cdr: ChangeDetectorRef,
    private nbToastrService: NbToastrService,
    private tableService: TableService
  ) {}

  ngOnInit(): void {
    this.mainTableNumberFieldArray = this.mainTable.filter((ele) => {
      if (ele.type == "number") {
        return true;
      } else {
        return false;
      }
    });
    if (!this.items || (this.items && !this.items.length)) {
      this.items = [
        {
          rollUptable: null,
          numberField: null,
          //tableNumberField: [],
          // rollUpTable: null,
          // rollUpField: null,
          aggregation: null,
          filter: null,
        },
      ];
    } else {
      // if (this.items && this.items[0].numberField) {
      //   this.onSelectRollUpTableChange(this.items[0].rollUptable);
      // }
    }

    //Set parent forms array and filter out number fields only
    if (this.parentForms) {
      for (let [key, val] of Object.entries(this.parentForms)) {
        let form = val as any;
        if (form.columns && form.columns.length) {
          let cols = form.columns.filter((f) => f.type == "number" || f.type == "formula");
          if (cols && cols.length) {
            this.parentForms[key] = cols;
          } else {
            delete this.parentForms[key];
          }
        } else {
          delete this.parentForms[key];
        }
      }
    }
  }

  cancel() {
    this.ref.close();
  }

  // onSelectRollUpTableChange(value) {
  //   this.loading = true;
  //   let arr = [];
  //   this.tableService.getTableByName(value).subscribe((tableres: any) => {
  //     arr = tableres.data[0].columns;
  //     this.numberFieldArray = arr.filter((ele) => {
  //       if (ele.type == "number" || ele.type == "formula") {
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     });
  //     this.loading = false;
  //   });
  // }

  parentFormSelected(){
    this.items[0].numberField = null;
  }

  // numberFieldSelected(value) {
  //   this.items[0].numberField = value;
  // }

  submit() {
    if (this.myForm.valid) {
      this.ref.close(this.items);
    } else {
      this.nbToastrService.danger("Fill all required fields", "Roll up");
    }
  }
}
