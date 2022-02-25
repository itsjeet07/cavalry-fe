import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TableService } from '@app/shared/services/table.service';
import { NbToastrService } from '@nebular/theme';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngx-reminder-modal',
  templateUrl: './reminder-modal.component.html',
  styleUrls: ['./reminder-modal.component.scss']
})


export class ReminderModalComponent implements OnInit {

  @Input("resourceId") resourceId: any;
  @Input("tableName") tableName: any;
  @Input("tableId") tableId: any;
  constructor(    private _NgbActiveModal: NgbActiveModal,
    private tableService: TableService,
    private toastrService: NbToastrService,) { }

    createNoteObj:CreateNote = new CreateNote();

  ngOnInit(): void {

  }

  get activeModal() {
    return this._NgbActiveModal;
  }

 close(){
  this.activeModal.close(true);
 }

 saveNotes(){

  if (this.createNoteObj.dueDate == null || this.createNoteObj.notes == null){
    this.toastrService.warning("Enter fields")
  }
  else{
    this.createNoteObj.resourceId = this.resourceId;
    this.createNoteObj.tableId = this.tableId;
    this.createNoteObj.tableName = this.tableName;
    console.log(this.createNoteObj)
    this.tableService.createNotes(this.createNoteObj).subscribe(
      (res: any) => {
        if (res.statusCode === 201) {
          this.toastrService.success(res.message, "Success");
          this.activeModal.close(true);
        } else {
          this.toastrService.danger(res.message, "Error");
        }
      },
      (error) => {
      }
    );

  }
 }

}

export class CreateNote{
  resourceId:number;
  tableName:string
  notes:string;
  tableId:number;
  dueDate:any;
  details:string;

  constructor(){
    this.resourceId = null;
    this.tableName = "";
    this.notes = "";
    this.tableId = null;
    this.dueDate = null;
  }
}
