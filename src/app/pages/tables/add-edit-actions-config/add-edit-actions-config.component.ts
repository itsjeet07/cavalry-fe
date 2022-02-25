import { Component, Input, OnInit, Optional, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { TableService } from "@app/shared/services/table.service";
import { NbDialogRef, NbToastrService } from "@nebular/theme";
import 'codemirror/mode/htmlmixed/htmlmixed';
import { color } from "d3-color";

@Component({
  selector: "ngx-add-edit-actions-config",
  templateUrl: "./add-edit-actions-config.component.html",
  styleUrls: ["./add-edit-actions-config.component.scss"],
})
export class AddEditActionsConfigComponent implements OnInit {
  @Input() tableData;
  @Input() addFlag;
  @Input() editFlag;
  @Input() actionData;
  public title: string;
  public action: ActionsClass;
  codeMirrorConfig = {
    lineNumbers: true,
    mode: "javascript",
    lineWrapping: true,
    theme: 'erlang-dark'
  };

  colorArray1 = [
    { status: "basic", label: "Basic" },
    { status: "primary", label: "Primary" },
    { status: "success", label: "Success" },
    { status: "info", label: "Info" },
  ]

  colorArray2 = [
    { status: "warning", label: "Warning" },
    { status: "danger", label: "Danger" },
    { status: "control", label: "Control" }
  ];

  radioOption = [
    { label: "On Save", value: "onSave" }
  ]

  @ViewChild('myForm', { read: NgForm }) myForm: any;
  constructor(
    private tableService: TableService,
    private toastrService: NbToastrService,
    @Optional() public dialogRef?: NbDialogRef<AddEditActionsConfigComponent>,
  ) { }

  ngOnInit(): void {
    if (this.addFlag) {
      this.title = 'Add Actions'
      this.action = new ActionsClass();
    } else {
      this.title = 'Edit Actions'
      if (this.actionData) {
        this.action = JSON.parse(JSON.stringify(this.actionData));
      } else {
        this.action = new ActionsClass();
      }
    }
  }

  addNewMessage() {
    this.action.messageList.push(new MessageListClass());
  }

  addNewMessageForNotAvailable() {
    if (!this.action.actionNotAvailable) {
      this.action.actionNotAvailable = [];
    }
    this.action.actionNotAvailable.push(new ActionNotAvailableClass());
  }

  removeMessage(i) {
    if (this.action.messageList.length == 1) {
      this.action.messageList = [];
      this.action.messageList.push(new MessageListClass());
    } else {
      let removedMessage = this.action.messageList.splice(i, 1);
    }
  }

  emptyMessageList() {
    this.action.messageList = [];
    this.action.messageList.push(new MessageListClass());
  }

  emptyMessageListForNotAvailable() {
    this.action.actionNotAvailable = [];
    this.action.actionNotAvailable.push(new ActionNotAvailableClass());
  }

  closeModal() {
    this.dialogRef.close(false);
  }

  saveActions() {
    if (this.action.actionName && this.action.actionUrl && this.action.displayCondition && this.action.onSave
       && this.action.waitTime) {
      let invalidActionNotAvaiable = false;
      this.action.actionNotAvailable.forEach(ele => {
        if (ele.color && ele.condition && ele.message) {

        }
        else {
          // invalidActionNotAvaiable = true;
          // this.toastrService.danger("Fill all required fields");
          // return;
        }
      });
      if (!invalidActionNotAvaiable) {

        let invalidMessageList = false;
        // this.action.messageList.forEach(ele => {
        //   if (ele.color && ele.condition) {

        //   }
        //   else {
        //     let invalidMessageList = true;
        //     this.toastrService.danger("Fill all required fields");
        //     return;
        //   }
        // });

        if(!invalidMessageList){
          this.dialogRef.close(this.action);
        }
      }
    } else {
      this.toastrService.danger("Fill all required fields");
    }
  }

  // cleaForm(){
  //   this.myForm.reset();
  //   this.action = new ActionsClass();
  // }


  setWarningMessageColor(value) {
    this.action.warningMessageColor = value.target.innerHTML;
  }


  setColor(value, index) {

    this.action.messageList[index].color = value.target.innerHTML;
  }

  setColorForNotAvailable(value, index) {
    this.action.actionNotAvailable[index].color = value.target.innerHTML;
  }
}

export class ActionsClass {
  actionName: string;
  warningMessage: string;
  warningMessageColor: string;
  actionUrl: string;
  waitTime: number;
  messageList: MessageListClass[];
  displayCondition: string;
  onSave: any;
  actionNotAvailable: ActionNotAvailableClass[];

  constructor() {
    this.actionName = '';
    this.warningMessage = '';
    this.actionUrl = '';
    this.waitTime = 0.0;
    this.messageList = [{ ...new MessageListClass() }];
    this.displayCondition = '';
    this.actionNotAvailable = [{ ...new ActionNotAvailableClass() }];
  }
}

export class MessageListClass {
  message: string;
  condition: string;
  color: string;

  constructor() {
    this.message = '';
    this.condition = '';
    this.color = "";
  }
}

export class ActionNotAvailableClass {
  message: string;
  condition: string;
  color: string;

  constructor() {
    this.message = '';
    this.condition = '';
    this.color = "";
  }
}

