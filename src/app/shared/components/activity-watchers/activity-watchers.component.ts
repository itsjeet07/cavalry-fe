import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { DynamicFormCommonService } from '@app/shared/dynamic-form-common.service';
import { ChatSubscriptionService } from '@app/shared/services/chat-subscription.service';
import { NbToastrService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngx-activity-watchers',
  templateUrl: './activity-watchers.component.html',
  styleUrls: ['./activity-watchers.component.scss']
})
export class ActivityWatchersComponent implements OnInit {

  @Input() showChats;
  @Input() tableInfo;
  @Input() subscriptionText;
  @Input() subscribers;
  @Input() isSelfSubscribed;
  @Input() Data;
  @Input() tableName;
  @Input() dynamicData;
  @Input() recordData
  private destroy$ = new Subject();
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  isWatcherOpened = false;
  currentUser;
  constructor(private changeDetector: ChangeDetectorRef,
    private chatSubscriptionService: ChatSubscriptionService,
    private dynamicFormService: DynamicFormCommonService,
    private toastrService: NbToastrService,) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem("userData"));
  }

  getSubscribers(val) {
    this.subscribers = val;
    if (val.length > 0) {
      val.map((data) => {
        if (data._id == this.currentUser._id) {
          this.subscriptionText = "Stop watching";
          this.isSelfSubscribed = true;
        }
      });
    }
    this.changeDetector.detectChanges();
  }

  selfSubsription() {
    this.isSelfSubscribed = !this.isSelfSubscribed;
    if (this.isSelfSubscribed) {
      this.subscribers.push({
        _id: this.currentUser._id,
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
      });
      this.subscriptionText = "Stop watching";
      this.isSelfSubscribed = true;
      this.activateSubscription();
    } else {
      this.cancelSubscription(this.currentUser._id);
      this.subscriptionText = "Start watching";
      this.isSelfSubscribed = false;

    }
  }

  cancelSubscription(id) {
    const sub = this.subscribers.findIndex((s) => s._id == id);
    this.subscribers.splice(sub, 1);
    this.chatSubscriptionService.cancelSubscription(
      {
        resourceId: this.Data?._id,
        userId: id,
      }).pipe(takeUntil(this.destroy$)).subscribe(
        (data: any) => {
          if (data.statusCode == 200) {
            if (id == this.currentUser._id) {
              this.subscriptionText = "Start watching";
              this.isSelfSubscribed = false;
            }
            this.toastrService.success(data.message, 'Action was  completed!');
          }
        });
  }

  activateSubscription(idForCreate?, resourceId?, showToaster = true) {
    const data = {
      resourceId: resourceId ? resourceId : this.Data?._id,
      userId: idForCreate ? idForCreate : this.currentUser._id,
      tableName: this.tableName,
      invitedBy: this.currentUser._id
    };

    let res: any = this.dynamicFormService.activateSubscription(data);

  }

  updateSubscribers(subscriber) {
    const checkAlreadyAdded = this.subscribers.findIndex(
      (s) => s._id == subscriber._id
    );
    if (checkAlreadyAdded == -1) {
      this.subscribers.push(subscriber);
      this.activateSubscription(subscriber._id);
    }
    this.subscribers.forEach((data) => {
      if (data._id == this.currentUser._id) {
        this.subscriptionText = "Stop watching";
        this.isSelfSubscribed = true;
      }
    });

  }

  watcherMenuOpened() {
    this.isWatcherOpened = true;
  }

  watcherMenuClosed() {
    this.isWatcherOpened = false;
  }
}
