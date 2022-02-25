import { ChatSubscriptionService } from "./../../../shared/services/chat-subscription.service";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { ViewChild } from "@angular/core";
import { MatMenuTrigger } from "@angular/material/menu";

@Component({
  selector: "ngx-watch-user",
  templateUrl: "./watch-user.component.html",
  styleUrls: ["./watch-user.component.scss"],
})
export class WatchUserComponent {
  inviteOther = false;
  loading = false;
  @Input() tableInfo;
  currentUserId;
  value: string;
  @ViewChild("autoInput") input;
  options = [];
  usersList = [];
  watchUserId = "";
  userValue = "";
  timeout: any;
  @Input() matMenu: MatMenuTrigger;
  @Input() parentForm = 'Chat-tab';
  @Output() valueChanged = new EventEmitter<string>();

  constructor(
    private toastrService: NbToastrService,
    private chatSubscription: ChatSubscriptionService
  ) {}

  searchUser(query) {
    this.currentUserId = JSON.parse(localStorage.getItem("userData"))._id;
    this.chatSubscription.getUsers(query).subscribe((res: any) => {
      if (res && res.data) {
        this.options = res.data;
      }
    });
  }

  onSelectionChange(event) {
    if (event._id) {
      this.watchUserId = event._id;
      this.userValue = event.firstName + " " + event.lastName;

      if(this.parentForm == 'dynamicForm'){
        this.valueChanged.emit(event);
        this.inviteOther = false;
        this.userValue = "";
      }else{
        this.onInviteUser();
      }
    }
  }

  onInviteUser() {
    this.matMenu.closeMenu();

    this.options = [];
    this.loading = true;
    const data = {
      resourceId: this.tableInfo.resourceId,
      userId: this.watchUserId,
      tableName: this.tableInfo.tableName,
      invitedBy: this.currentUserId,
    };

    this.chatSubscription.watch(data).subscribe(
      (res: any) => {
        if (res.statusCode === 201) {
          this.toastrService.success(res.message, "Success");
          this.valueChanged.emit();
          this.loading = false;
        } else {
          this.loading = false;
          this.toastrService.danger(res.message, "Error");
        }
      },
      (error) => {
        this.toastrService.danger(
          `${error.error && error.error.message}`,
          "Error"
        );
        this.loading = false;
      },
      () => {}
    );
    this.userValue = "";
  }

  onChange(event) {
    this.watchUserId = "";
    const queryString = event.target.value.split(/\s(.+)/)[0];
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.searchUser(queryString);
    }, 200);
  }
}
