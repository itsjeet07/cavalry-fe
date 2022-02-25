import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ChatSubscriptionService } from '@app/shared/services/chat-subscription.service';
import { MessageService } from '@app/shared/services/message.service';
import { NbToastrService, NbDialogRef } from '@nebular/theme';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'ngx-add-people',
  templateUrl: './add-people.component.html',
  styleUrls: ['./add-people.component.scss']
})
export class AddPeopleComponent implements OnInit {

  @Input('selectedUsers') selectedUsers: any[];
  @Input('selectedUsers') edittextFlag: boolean = true;
  @Input('selectedUsers') saveButtonFlage: boolean = true;
  @Input('groupName') groupName;
  @Input() tableInfo;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  public isWatcherOpened:boolean = false;
  currentUser

  subscribers: any[] = [];

  constructor(protected ref: NbDialogRef<AddPeopleComponent>,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private toasterService: NbToastrService,
    private chatSubscriptionService: ChatSubscriptionService) { }

  ngOnInit(): void {

    this.currentUser = JSON.parse(localStorage.getItem('userData'));
    if(this.edittextFlag && this.selectedUsers && this.selectedUsers.length) {
      this.groupName = '';
      this.selectedUsers.forEach((ele,index) => {
        if(ele.displayName){
          if(!index){
            this.groupName = ele.displayName;
          } else {
            this.groupName = this.groupName+',' + ele.displayName;
          }
        }
      })
    }
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  onCancel() {
    this.ref.close(true);
  }

  onCreateClick() {
    this.selectedUsers.forEach(element => {
      this.subscribers.push(element.id);
    });
    let group = {
      name: this.groupName,
      subscribers: this.subscribers
    }
    // this.toasterService.success("group created", 'Success');
    this.messageService.createGroup(group).subscribe(
      (res: any) => {
        if (res) {
          this.toasterService.success(res.message, 'Success');
          this.ref.close(true);
          //this.loading = false;
        }
        else {
          //this.loading = false;
          this.toasterService.danger(res.message, 'Error');
          this.ref.close(true);
        }
      }
    )
  }

  cancelSubscription(user: string): void {

    this.chatSubscriptionService.cancelSubscription(
      {
        resourceId: this.tableInfo.resourceId,
        userId: user,
      }).subscribe(
        (data: any) => {
          if (data.statusCode == 200) {
            //this.loadSubscribers();
            this.toasterService.success(data.message, 'Action was  completed!');
          }
        });

    const itemToRemoveIndex = this.selectedUsers.findIndex(function (item) {
      return item._id === user;
    });

    if (itemToRemoveIndex !== -1) {
      this.selectedUsers.splice(itemToRemoveIndex, 1);
    }
  }

  watcherMenuOpened() {
    this.isWatcherOpened = true;
  }

  watcherMenuClosed() {
    this.isWatcherOpened = false;
  }

  loadSubscribers(event) {
    //2 apis
    if (this.tableInfo.tableName == "") {
      this.messageService.getSubscribers(this.tableInfo.resourceId).subscribe(res => {
        this.selectedUsers = res["data"].subscribers;
      });
    } else {

      this.chatSubscriptionService.getSubscribers(this.tableInfo.resourceId).subscribe(res => {
        this.selectedUsers = res["data"];
      });
    }

    /*if(event.isProjectGroup){
      this.chatSubscriptionService.getSubscribers(this.tableInfo.resourceId).subscribe((res: any) => {
        if (res.data) {
          this.subscribers = res.data;
          if (res.data.length > 0) {
            res.data.map((data) => {
              // if (data._id == this.currentUser._id) {
              //   this.subscriptionText = 'Stop watching';
              //   this.isSelfSubscribed = true;
              // }
            });
          }
        }
      });
    }else{
      this.selectedUsers.push({_id:event._id, firstName: event.firstName, lastName:event.lastName})
    }*/


  }
}


// @Input('list') list: any[];
// @Input('headers') headers: any[];
// @Input('moduleName') moduleName: any;
//   fileName = "export";
//   startRow: number;
//   endRow: number;
//   exportType = "";
//   toEmail = "";
//   subjectEmail = "";
//   email=false;
//   list1 = [];
//   constructor(
//     private _NgbActiveModal: NgbActiveModal,
//     private exportService: ExportService,
//     ) { }
//   ngOnInit(): void {
//   }

//   emailClick() {
//     this.email=true;
//   }
//   emailSendClick(){
//     let modalData={
//       exportType:"",
//       fromRow:null,
//       moduleName:"",
//       sendText:"",
//       subjectEmail:"",
//       toEmail:"",
//       toRow:null
//     }
//       modalData.exportType = this.exportType;
//       modalData.fromRow = this.startRow,
//       modalData.moduleName = this.moduleName,
//       //modalData.sendText =
//       modalData.subjectEmail = this.subjectEmail;
//       modalData.toEmail = this.toEmail;
//       modalData.toRow = this.endRow;
//       console.log(modalData);
//       this.exportService.sendMail(modalData);
//     }
//   onDownloadClick(){
//     for( let i = this.startRow ; i <= this.endRow; i++){
//       this.list1.push(this.list[i-1]);
//     }
//     if(this.exportType=='excel')
//     {
//       this.exportService.exportExcel(this.list1, this.fileName, this.headers);
//     }
//     else if(this.exportType=='text')
//     {
//       this.exportService.exportText(this.list1, this.fileName, this.headers);
//     }
//     else if(this.exportType=='pdf'){
//       this.exportService.exportPdf(this.list1, this.fileName, this.headers);
//     }
//     else{
//       return;
//     }
//   }
  // }

