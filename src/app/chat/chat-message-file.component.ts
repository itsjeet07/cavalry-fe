/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, Output, EventEmitter, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FilePreviewDialogComponent } from '@shared/components/file-preview-dialog/file-preview-dialog.component';
import { NbDialogService } from '@nebular/theme';
import { iconList } from '@shared/iconData/iconList';
import { DynamicFormDialogComponent } from '@app/shared/components/dynamic-form-dialog/dynamic-form-dialog.component';
import { TableService } from '@app/shared/services/table.service';
import { DynamicFormDialogNewDesignComponent } from '@app/shared/components/dynamic-form-dialog-new-design/dynamic-form-dialog-new-design.component';

export interface NbChatMessageFileIconPreview {
  url: string;
  icon: string;
}
export interface NbChatMessageFileImagePreview {
  url: string;
  type: string;
}
export type NbChatMessageFile = NbChatMessageFileIconPreview | NbChatMessageFileImagePreview;

/**
 * Chat message component.
 */
@Component({
  selector: 'nb-chat-message-file',
  template: `
    <nb-chat-message-text [display]="false" [sender]="sender" [date]="date" [dateFormat]="dateFormat" [message]="message"  (onDeleteMessage)="onDeleteMessage.emit($event)">
      {{ message }}
    </nb-chat-message-text>
    <div class="message_div">
    <img style="height:20px;width:20px" (click)="replyParticularMessage.emit(messageObj)"
    class="delete_message cursor sizeLess" aria-hidden="true"
    src="../../../../../assets/images/ic_reply_24px.png">
    <i (click)="onDeleteMessage.emit(message)" class="delete_message cursor fas fa-trash"></i>
    </div>
    <a *ngFor="let file of readyFiles" (click)="onFilePreview(file.url, file)" style="cursor:pointer;">
      <span class="{{getFileExtension(file.url)}}" *ngIf="!file.urlStyle && file.icon" ></span>
      <!-- <div *ngIf="file.urlStyle" [style.background-image]="file.urlStyle"></div> -->

      <img style="max-width: 100%" [src]="file.url" alt="FILE reply" *ngIf="file.urlStyle">
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NbChatMessageFileComponent {

  readyFiles: any[];

  /**
   * Message sender
   * @type {string}
   */
  @Input() message: string;
  @Input() messageObj;


  /**
   * Message sender
   * @type {string}
   */
  @Input() sender: string;

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
  @Output() replyParticularMessage = new EventEmitter();

  /**
   * Message file path
   * @type {Date}
   */
  @Input()
  set files(files: NbChatMessageFile[]) {
    this.readyFiles = (files || []).map((file: any) => {
      const isImage = this.isImage(file);
      return {
        ...file,
        urlStyle: isImage && this.domSanitizer.bypassSecurityTrustStyle(`url(${file.url})`),
        isImage: isImage,
      };
    });
    this.cd.detectChanges();
  }

  @Output() onDeleteMessage = new EventEmitter();

  constructor(
    protected cd: ChangeDetectorRef,
    protected domSanitizer: DomSanitizer,
    private tableService: TableService,
    private dialogService: NbDialogService) {
  }


  isImage(file: NbChatMessageFile): boolean {
    const type = (file as NbChatMessageFileImagePreview).type;
    if (type) {
      return [ 'image/png', 'image/jpeg', 'image/gif' ].includes(type);
    }
    return false;
  }

  onFilePreview(filename, item) {
    const fileDialog = this.dialogService.open(FilePreviewDialogComponent, {
      context: {
        Data: filename,
        Ext: filename.split('.').pop(),
      },
    });

    fileDialog.componentRef.instance.saveTo.subscribe((data: any) => {
      this.tableService.getTableByName('Files').subscribe((tableres: any) => {

        const tempParentTableHeader = Object.assign([], tableres.data[0].columns);
        const fileType = tableres.data[0].columns.find(({type}) => type === "file");
        let type = 'file';
        if (fileType && fileType.name) {
          type = fileType.name
        }
          const res = {data: {
            relatedTo: data,
            lookup: [],
            [type]: []
          }};
          res.data[type].push(item.url)


          const ref = this.dialogService.open(DynamicFormDialogNewDesignComponent, {
            closeOnEsc:false,
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

  getFileExtension(filename) {
    const ext = filename.split(".").pop();
    const obj = iconList.filter(row => {
      if (row.type === ext) {
        return true;
      }
    });
    if (obj.length > 0) {
      return obj[0].icon;
    } else {
      return 'fiv-cla fiv-icon-blank fiv-size-md';
    }
  }
}
