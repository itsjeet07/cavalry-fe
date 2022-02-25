import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-add-edit-validation-check',
  templateUrl: './add-edit-validation-check.component.html',
  styleUrls: ['./add-edit-validation-check.component.scss']
})
export class AddEditValidationCheckComponent implements OnInit {

  @Input() tableData;
  @Input() addFlag;
  @Input() editFlag;
  @Input() recordData;
  public title: string;
  public validate = [];
  codeMirrorConfig = {
    lineNumbers: true,
    mode: "javascript",
    lineWrapping: true,
    theme: 'erlang-dark'
  };
  @ViewChild('myForm', { read: NgForm }) myForm: any;
  constructor(
    private toastrService: NbToastrService,
    public dialogRef?: NbDialogRef<AddEditValidationCheckComponent>,
  ) { }

  ngOnInit(): void {
    if (this.addFlag) {
      this.title = 'Add Validations'
      this.validate.push(new ValidationCheck());
    } else {
      this.title = 'Edit Validations'
      if (this.recordData) {
        this.validate = JSON.parse(JSON.stringify(this.recordData));
      } else {
        this.validate.push(new ValidationCheck());
      }
    }
  }

  addNewValidation() {
    this.validate.push(new ValidationCheck());
  }

  removeValidation(i) {
    if (this.validate.length == 1) {
      this.validate = [];
      this.validate.push(new ValidationCheck());
    } else {
      this.validate.splice(i, 1);
    }
  }

  closeModal() {
    this.dialogRef.close(false);
  }

  saveRecord() {

    if(this.myForm.valid){
      this.dialogRef.close(this.validate);
    }else{
      this.toastrService.danger("Fill all required fields")
    }

  }

}

export class ValidationCheck {

  name: string;
  jstextArea: any;
  errorMessage: any;

  constructor() {

  }
}

