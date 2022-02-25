import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef, NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-add-edit-record-gadget',
  templateUrl: './add-edit-record-gadget.component.html',
  styleUrls: ['./add-edit-record-gadget.component.scss']
})
export class AddEditRecordGadgetComponent implements OnInit {

  @Input() tableData;
  @Input() addFlag;
  @Input() editFlag;
  @Input() recordData;
  public title: string;
  public record: RecordGadget;
  codeMirrorConfig = {
    lineNumbers: true,
    mode: "javascript",
    lineWrapping: true,
    theme: 'erlang-dark'
  };
  constructor(
    private toastrService: NbToastrService,
    public dialogRef?: NbDialogRef<AddEditRecordGadgetComponent>,
  ) { }

  ngOnInit(): void {
    if(this.addFlag){
      this.title = 'Add Record Gadgets'
      this.record = new RecordGadget();
    }else{
      this.title = 'Edit Record Gadgets'
      if(this.recordData){
        this.record = JSON.parse(JSON.stringify(this.recordData));
      }else{
        this.record = new RecordGadget();
      }
    }
  }

  closeModal() {
    this.dialogRef.close(false);
  }

  saveRecord(){
    if(this.record.name && this.record.logic){
      this.dialogRef.close(this.record);
    }else{
      this.toastrService.danger("Fill all required fields")
    }
  }

}

export class RecordGadget{

  name:string;
  logic:any;
  active:any;

  constructor(){
    this.active = false;
  }
}
