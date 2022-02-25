/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DynamicFormDialogNewDesignComponent } from '@app/shared/components/dynamic-form-dialog-new-design/dynamic-form-dialog-new-design.component';
import { DynamicFormDialogComponent } from '@app/shared/components/dynamic-form-dialog/dynamic-form-dialog.component';
import { FilePreviewDialogComponent } from '@app/shared/components/file-preview-dialog/file-preview-dialog.component';
import { TableService } from '@app/shared/services/table.service';
import { NbDialogService } from '@nebular/theme';

/**
 * Chat message component.
 */
@Component({
  selector: 'nb-chat-message-text',
  template: `
    <p *ngIf="callLog && messageObj.type != 'user'" class="call-log-date">{{datePipe.transform(date, "M/d/yy")}}
    <span></span></p>

    <p *ngIf="callLog && messageObj.type == 'user'" class="call-log-date">{{datePipe.transform(messageObj.date, "M/d/yy")}}
    <span></span></p>

    <p [ngClass]="{'sender-call' : callLog, 'sender': !callLog}" *ngIf="messageObj && messageObj.type == 'user'">
    {{ messageObj.firstName }}  {{messageObj.lastName}} <span class="sender-call-nor-txt">{{messageObj.text}}</span>  #{{messageObj.recordId}}
      <time *ngIf="!callLog && messageObj.type == 'user'">{{ messageObj.date  | date: dateFormat }}</time>
      <time *ngIf="callLog && messageObj.type == 'user'">{{ datePipe.transform(messageObj.date, "h:mm a") }}</time>
    </p>

    <p [ngClass]="{'sender-call' : callLog, 'sender': !callLog}" *ngIf="(sender || date) && (messageObj && messageObj.type != 'user')">{{ sender }}
      <time *ngIf="!callLog">{{ date  | date: dateFormat }}</time>
      <time *ngIf="callLog">{{ datePipe.transform(date, "h:mm a") }}</time>
    </p>
    <div class="message_div"
         [ngClass]="{'call-logs' : callLog}"
         *ngIf="messageObj && messageObj.type != 'user' && !messageObj.replyTo">
      <p class="text" [ngStyle]="{color:uiColor}" *ngIf="message && !isUrl" [innerHTML]='message'></p>
      <p class="text" [ngStyle]="{color:uiColor}" *ngIf="message && isUrl" ><a [href]="message" target="_blank">{{message}}</a></p>

      <i *ngIf="sender && display" style="color: #959FAB" (click)="onDeleteMessage.emit(message)"
         class="delete_message cursor fas fa-trash"></i>
      <img (click)="replyParticularMessage.emit(messageObj)"
           class="delete_message cursor sizeLess" aria-hidden="true" style="filter: none;"
           src="../../../../../assets/images/ic_reply_24px.png">
    </div>
    <div class="message_div" *ngIf="messageObj && messageObj.type != 'user' && messageObj.replyTo" [ngClass]="{'call-logs-1' : callLog}">
      <p class="text" (click)="onScrollElement.emit(messageObj)" [ngStyle]="{color:uiColor}"
         *ngIf="messageObj && (messageObj.replyTo.type == 'text' || messageObj.replyTo.type == 1)"
         [innerHTML]="replytoHtml"
         ></p>
      <p class="text" (click)="onScrollElement.emit(messageObj)" [ngStyle]="{color:uiColor}"
         *ngIf="messageObj && messageObj.replyTo.type == 'image'" [innerHTML]="imageHtml"></p>
      <i *ngIf="sender && display" (click)="onDeleteMessage.emit(message)"
         class="delete_message cursor fas fa-trash" style="color: #959FAB"></i>
      <img (click)="replyFunction(messageObj,$event)" style="filter: none;"
           class="delete_message cursor sizeLess" aria-hidden="true"
           src="../../../../../assets/images/ic_reply_24px.png">
    </div>

  `,
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NbChatMessageTextComponent implements OnInit {
  @Input() callLog;
  imageHtml = ``;
  fileIcon;
  replytoHtml;
  isUrl = false;
  constructor(
    protected cd: ChangeDetectorRef,
    protected domSanitizer: DomSanitizer,
    private tableService: TableService,
    private dialogService: NbDialogService,
    public datePipe: DatePipe,
  ) {
  }

  ngOnInit() {

    this.isUrl = false;
    if (this.messageObj && this.messageObj.replyTo && this.messageObj.replyTo.type) {
      this.fileIcon = "assets/images/file-img.png"
      let ext = this.messageObj.replyTo.text.split('.').pop();

      if (ext == "jpg" || ext == "jpeg" || ext == "png") {
        this.datetrans = this.datePipe.transform(this.messageObj.replyTo.createdAt, "M/d/yy, h:mm a");
        this.imageHtml = `<img style="height:100px;width:100px" alt="FILE reply" class="img-fluid" src=${this.messageObj.replyTo.text}> ,  ${this.messageObj.replyTo.sender.firstName} ${this.messageObj.replyTo.sender.lastName} , ${this.datetrans}<hr> ${this.message}`

      } else {
        this.datetrans = this.datePipe.transform(this.messageObj.replyTo.createdAt, "M/d/yy, h:mm a");
        this.imageHtml = `<img style="height:100px;width:100px" alt="FILE reply" class="img-fluid" src=${this.fileIcon}> ,  ${this.messageObj.replyTo.sender.firstName} ${this.messageObj.replyTo.sender.lastName} , ${this.datetrans}<hr> ${this.message}`
      }

      this.replytoHtml = '<blockquote><sup><i class="fa fa-quote-left" aria-hidden="true"></i></sup>' + this.messageObj.replyTo.text + '</blockquote><br>' + this.messageObj.replyTo.sender.firstName + ' ' + this.messageObj.replyTo.sender.lastName + ', ' + this.datePipe.transform(this.messageObj.replyTo.createdAt, 'M/d/yy, h:mm a') + '<hr>' + this.message

    }

    if (this.isValidHttpUrl(this.message)) {

      this.isUrl = true;
    }


  }

  isValidHttpUrl(string) {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  }

  @Input() display = true
  @Input() uiColor = '#598bff';
  /**
   * Message sender
   * @type {string}
   */
  @Input() sender: string;

  /**
   * Message sender
   * @type {string}
   */
  @Input() message: string;


  @Input() messageObj;


  /**
   * Message send date
   * @type {Date}
   */
  @Input() date: Date;

  /**
   * Message send date format, default 'shortTime'
   * @type {string}
   */
  @Input() dateFormat: string = 'shortTime';
  @Output() onDeleteMessage = new EventEmitter();
  @Output() replyParticularMessage = new EventEmitter();
  @Output() onScrollElement = new EventEmitter();

  datetrans;

  onFilePreview(filename, event) {
    event.stopPropagation();

    const fileDialog = this.dialogService.open(FilePreviewDialogComponent, {
      context: {
        Data: filename,
        Ext: filename.split('.').pop(),
      },
    });

    fileDialog.componentRef.instance.saveTo.subscribe((data: any) => {
      this.tableService.getTableByName('Files').subscribe((tableres: any) => {

        const tempParentTableHeader = Object.assign([], tableres.data[0].columns);
        const fileType = tableres.data[0].columns.find(({ type }) => type === "file");
        let type = 'file';
        if (fileType && fileType.name) {
          type = fileType.name
        }
        const res = {
          data: {
            relatedTo: data,
            lookup: [],
            [type]: []
          }
        };
        res.data[type].push(filename)
        const ref = this.dialogService.open(DynamicFormDialogNewDesignComponent, {
          closeOnEsc: false,
          context: {
            title: 'Add New File',
            //headerDetail: this.headerObj,
            isForceSave: true,
            subFormLookupIds: "",
            form: tempParentTableHeader,
            button: { text: 'Save' },
            tableName: 'Files',
            Data: res.data,
            recordType: null,
            recordTypeFieldName: null,
            action: 'Add',
            // mainTableData: [],
            tableRecordTypes: []
          },
        })
          .onClose.subscribe(name => {
          });
      });
    })
  }

  replyFunction(message, event) {
    event.stopPropagation();
    this.replyParticularMessage.emit(message)

  }

}
